import { Router } from "express";
import type { Request, Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { generatedContent, fraudDetection, keywordSessions, consultations } from "@shared/schema";
import { desc, eq, gte, sql } from "drizzle-orm";

const router = Router();

// Simple admin authentication middleware
function requireAdminAuth(req: Request, res: Response, next: any) {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  
  // In production, use a proper admin authentication system
  if (adminKey !== 'contentscale-admin-2025') {
    return res.status(401).json({ error: "Admin authentication required" });
  }
  
  next();
}

// Admin dashboard stats
router.get("/stats", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const stats = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM generated_content) as total_content,
        (SELECT COUNT(*) FROM fraud_detection) as total_users,
        (SELECT COUNT(*) FROM fraud_detection WHERE suspicious_activity = true) as suspicious_users,
        (SELECT COUNT(*) FROM fraud_detection WHERE vpn_detected = true) as vpn_users,
        (SELECT COUNT(*) FROM generated_content WHERE created_at >= NOW() - INTERVAL '24 hours') as content_today,
        (SELECT COUNT(*) FROM fraud_detection WHERE last_activity >= NOW() - INTERVAL '24 hours') as active_users_today
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// Get all content with user info
router.get("/content", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const content = await db
      .select({
        id: generatedContent.id,
        fingerprint: generatedContent.fingerprint,
        ipAddress: generatedContent.ipAddress,
        title: generatedContent.title,
        contentType: generatedContent.contentType,
        paymentMethod: generatedContent.paymentMethod,
        creditsUsed: generatedContent.creditsUsed,
        createdAt: generatedContent.createdAt,
        // User fraud info
        requestCount: fraudDetection.requestCount,
        vpnDetected: fraudDetection.vpnDetected,
        proxyDetected: fraudDetection.proxyDetected,
        suspiciousActivity: fraudDetection.suspiciousActivity,
        countryCode: fraudDetection.countryCode
      })
      .from(generatedContent)
      .leftJoin(fraudDetection, eq(generatedContent.fingerprint, fraudDetection.fingerprint))
      .orderBy(desc(generatedContent.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({ content, page, limit });
  } catch (error) {
    console.error("Error fetching admin content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// Get specific content with full details
router.get("/content/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const [content] = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.id, req.params.id));

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    // Get user fraud info
    const [userInfo] = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.fingerprint, content.fingerprint));

    res.json({ content, userInfo });
  } catch (error) {
    console.error("Error fetching content details:", error);
    res.status(500).json({ error: "Failed to fetch content details" });
  }
});

// Get fraud detection overview
router.get("/fraud-detection", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const fraudUsers = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.suspiciousActivity, true))
      .orderBy(desc(fraudDetection.lastActivity));

    const vpnUsers = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.vpnDetected, true))
      .orderBy(desc(fraudDetection.lastActivity));

    res.json({ fraudUsers, vpnUsers });
  } catch (error) {
    console.error("Error fetching fraud detection data:", error);
    res.status(500).json({ error: "Failed to fetch fraud detection data" });
  }
});

// Get user content by fingerprint (for recovery)
router.get("/user/:fingerprint/content", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const userContent = await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.fingerprint, req.params.fingerprint))
      .orderBy(desc(generatedContent.createdAt));

    const [userInfo] = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.fingerprint, req.params.fingerprint));

    res.json({ content: userContent, userInfo });
  } catch (error) {
    console.error("Error fetching user content:", error);
    res.status(500).json({ error: "Failed to fetch user content" });
  }
});

// Update user fraud status (for manual intervention)
router.patch("/user/:fingerprint/fraud-status", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { suspiciousActivity, notes } = req.body;

    await db
      .update(fraudDetection)
      .set({
        suspiciousActivity,
        // You could add a notes field to track admin interventions
      })
      .where(eq(fraudDetection.fingerprint, req.params.fingerprint));

    res.json({ success: true, message: "Fraud status updated" });
  } catch (error) {
    console.error("Error updating fraud status:", error);
    res.status(500).json({ error: "Failed to update fraud status" });
  }
});

// Export user data (for recovery or GDPR)
router.get("/export/:fingerprint", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const fingerprint = req.params.fingerprint;

    const [userContent, userInfo, keywordData, consultationData] = await Promise.all([
      db.select().from(generatedContent).where(eq(generatedContent.fingerprint, fingerprint)),
      db.select().from(fraudDetection).where(eq(fraudDetection.fingerprint, fingerprint)),
      db.select().from(keywordSessions).where(eq(keywordSessions.fingerprint, fingerprint)),
      db.select().from(consultations).where(eq(consultations.fingerprint, fingerprint))
    ]);

    const exportData = {
      fingerprint,
      exportDate: new Date().toISOString(),
      userInfo: userInfo[0] || null,
      generatedContent: userContent,
      keywordSessions: keywordData,
      consultations: consultationData,
      totalContent: userContent.length,
      totalSessions: keywordData.length,
      totalConsultations: consultationData.length
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="user-data-${fingerprint}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error("Error exporting user data:", error);
    res.status(500).json({ error: "Failed to export user data" });
  }
});

export default router;