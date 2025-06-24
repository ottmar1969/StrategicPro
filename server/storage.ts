import { 
  generatedContent, 
  keywordSessions, 
  consultations, 
  userWebsites, 
  fraudDetection,
  type GeneratedContent,
  type KeywordSession,
  type Consultation,
  type UserWebsite,
  type InsertGeneratedContent,
  type InsertKeywordSession,
  type InsertConsultation,
  type InsertUserWebsite
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { generateFingerprint, detectVPN, detectProxy, calculateRiskScore, isSuspiciousActivity } from "./fingerprint";
import type { Request } from "express";

export interface IStorage {
  // Content operations
  saveGeneratedContent(fingerprint: string, content: Omit<InsertGeneratedContent, 'fingerprint'>): Promise<GeneratedContent>;
  getUserContent(fingerprint: string): Promise<GeneratedContent[]>;
  getContentById(id: string, fingerprint: string): Promise<GeneratedContent | null>;
  
  // Keyword research operations
  saveKeywordSession(fingerprint: string, session: Omit<InsertKeywordSession, 'fingerprint'>): Promise<KeywordSession>;
  getUserKeywordSessions(fingerprint: string): Promise<KeywordSession[]>;
  
  // Consultation operations
  saveConsultation(fingerprint: string, consultation: Omit<InsertConsultation, 'fingerprint'>): Promise<Consultation>;
  getUserConsultations(fingerprint: string): Promise<Consultation[]>;
  
  // Website operations
  saveUserWebsite(fingerprint: string, website: Omit<InsertUserWebsite, 'fingerprint'>): Promise<UserWebsite>;
  getUserWebsites(fingerprint: string): Promise<UserWebsite[]>;
  
  // Fraud detection
  trackRequest(req: Request): Promise<boolean>; // Returns true if allowed, false if blocked
  getFraudStatus(fingerprint: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async saveGeneratedContent(fingerprint: string, content: Omit<InsertGeneratedContent, 'fingerprint'>): Promise<GeneratedContent> {
    const [result] = await db
      .insert(generatedContent)
      .values({ ...content, fingerprint })
      .returning();
    return result;
  }

  async getUserContent(fingerprint: string): Promise<GeneratedContent[]> {
    return await db
      .select()
      .from(generatedContent)
      .where(eq(generatedContent.fingerprint, fingerprint))
      .orderBy(desc(generatedContent.createdAt));
  }

  async getContentById(id: string, fingerprint: string): Promise<GeneratedContent | null> {
    const [result] = await db
      .select()
      .from(generatedContent)
      .where(and(
        eq(generatedContent.id, id),
        eq(generatedContent.fingerprint, fingerprint)
      ));
    return result || null;
  }

  async saveKeywordSession(fingerprint: string, session: Omit<InsertKeywordSession, 'fingerprint'>): Promise<KeywordSession> {
    const [result] = await db
      .insert(keywordSessions)
      .values({ ...session, fingerprint })
      .returning();
    return result;
  }

  async getUserKeywordSessions(fingerprint: string): Promise<KeywordSession[]> {
    return await db
      .select()
      .from(keywordSessions)
      .where(eq(keywordSessions.fingerprint, fingerprint))
      .orderBy(desc(keywordSessions.createdAt));
  }

  async saveConsultation(fingerprint: string, consultation: Omit<InsertConsultation, 'fingerprint'>): Promise<Consultation> {
    const [result] = await db
      .insert(consultations)
      .values({ ...consultation, fingerprint })
      .returning();
    return result;
  }

  async getUserConsultations(fingerprint: string): Promise<Consultation[]> {
    return await db
      .select()
      .from(consultations)
      .where(eq(consultations.fingerprint, fingerprint))
      .orderBy(desc(consultations.createdAt));
  }

  async saveUserWebsite(fingerprint: string, website: Omit<InsertUserWebsite, 'fingerprint'>): Promise<UserWebsite> {
    const [result] = await db
      .insert(userWebsites)
      .values({ ...website, fingerprint })
      .returning();
    return result;
  }

  async getUserWebsites(fingerprint: string): Promise<UserWebsite[]> {
    return await db
      .select()
      .from(userWebsites)
      .where(and(
        eq(userWebsites.fingerprint, fingerprint),
        eq(userWebsites.isActive, true)
      ));
  }

  async trackRequest(req: Request): Promise<boolean> {
    const fingerprintData = generateFingerprint(req);
    const { fingerprint, ipAddress, userAgent } = fingerprintData;

    // Check existing fraud record
    const [existing] = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.fingerprint, fingerprint));

    const vpnDetected = detectVPN(ipAddress);
    const proxyDetected = detectProxy(userAgent, req.headers);

    if (existing) {
      // Calculate time since last activity
      const timeDiff = Date.now() - (existing.lastActivity?.getTime() || Date.now());
      const minutesSinceLastActivity = timeDiff / (1000 * 60);

      // Calculate risk score
      const riskScore = calculateRiskScore({
        requestCount: (existing.requestCount || 0) + 1,
        contentGenerated: existing.contentGenerated || 0,
        creditsUsed: existing.creditsUsed || 0,
        vpnDetected,
        proxyDetected,
        recentActivity: minutesSinceLastActivity
      });

      const suspicious = isSuspiciousActivity(riskScore);

      // Update existing record
      await db
        .update(fraudDetection)
        .set({
          requestCount: (existing.requestCount || 0) + 1,
          suspiciousActivity: suspicious,
          vpnDetected,
          proxyDetected,
          lastActivity: new Date()
        })
        .where(eq(fraudDetection.fingerprint, fingerprint));

      // Block if suspicious
      return !suspicious;
    } else {
      // Create new fraud detection record
      await db
        .insert(fraudDetection)
        .values({
          id: `fraud_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
          fingerprint,
          ipAddress,
          userAgent,
          requestCount: 1,
          vpnDetected,
          proxyDetected,
          suspiciousActivity: false,
          lastActivity: new Date()
        });

      return true; // Allow first request
    }
  }

  async getFraudStatus(fingerprint: string): Promise<any> {
    const [result] = await db
      .select()
      .from(fraudDetection)
      .where(eq(fraudDetection.fingerprint, fingerprint));
    return result;
  }
}

export const storage = new DatabaseStorage();