import express from "express";
import { z } from "zod";
import { generateContent } from "./services/content-generator.js";
import { checkFraudProtection } from "./services/fraud-detection.js";
import { processPayment } from "./services/payment-service.js";
import { contentStorage } from "./content-storage.js";

const router = express.Router();

const ContentGenerationSchema = z.object({
  topic: z.string().min(5),
  audience: z.string().min(3),
  niche: z.string().min(3),
  keywords: z.string().min(10),
  wordCount: z.number().min(100).max(5000),
  language: z.string().min(2),
  tone: z.enum(["professional", "casual", "friendly", "authoritative", "conversational"]),
  contentType: z.enum(["blog", "article", "social", "email", "product", "landing"])
});

// Check user eligibility for content generation
router.post("/api/content/check-eligibility", async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const userAgent = req.get("User-Agent") || "";
    const sessionId = req.session?.id || "default-session";

    // Get or create user
    let user = await contentStorage.getUserBySession(sessionId);
    if (!user) {
      user = await contentStorage.createUser({
        sessionId,
        ipAddress: clientIP,
        userAgent,
        credits: 0,
        freeArticlesUsed: 0,
        hasOwnApiKey: false
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Error checking eligibility:", error);
    res.status(500).json({ error: "Failed to check eligibility" });
  }
});

// Generate content
router.post("/api/content/generate", async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const userAgent = req.get("User-Agent") || "";
    const browserFingerprint = req.get("X-Browser-Fingerprint") || "";
    const sessionId = req.session?.id || "default-session";

    // Validate input
    const validatedData = ContentGenerationSchema.parse(req.body);

    // Fraud protection check
    const fraudCheck = await checkFraudProtection(clientIP, userAgent, browserFingerprint);
    
    if (!fraudCheck.allowed) {
      return res.status(403).json({
        error: "Access denied",
        reason: fraudCheck.reason,
        riskScore: fraudCheck.riskScore
      });
    }

    if (fraudCheck.requiresVerification) {
      return res.status(429).json({
        error: "Suspicious activity detected",
        reason: fraudCheck.reason,
        riskScore: fraudCheck.riskScore
      });
    }

    // Get user
    let user = await contentStorage.getUserBySession(sessionId);
    if (!user) {
      user = await contentStorage.createUser({
        sessionId,
        ipAddress: clientIP,
        userAgent,
        credits: 0,
        freeArticlesUsed: 0,
        hasOwnApiKey: false
      });
    }

    // Check eligibility
    const eligibility = await checkUserEligibility(user);
    
    if (!eligibility.allowed && eligibility.requiresPayment) {
      return res.status(402).json({
        error: "Payment required",
        message: eligibility.message,
        price: eligibility.price
      });
    }

    // Generate content
    const contentResult = await generateContent(validatedData, user.hasOwnApiKey);
    
    // Create article record
    const article = await contentStorage.createArticle({
      userId: user.id,
      title: contentResult.title,
      content: contentResult.content,
      seoScore: contentResult.seoScore,
      metadata: validatedData,
      isPaid: eligibility.method !== "free",
      paymentMethod: eligibility.method
    });

    // Update user usage
    if (eligibility.method === "free") {
      await contentStorage.updateUser(user.id, {
        freeArticlesUsed: user.freeArticlesUsed + 1
      });
    } else if (eligibility.method === "credits") {
      const creditCost = eligibility.creditCost || 1;
      await contentStorage.updateUser(user.id, {
        credits: user.credits - creditCost
      });
      // Only increment free articles for API key users
      if (user.hasOwnApiKey) {
        await contentStorage.updateUser(user.id, {
          freeArticlesUsed: user.freeArticlesUsed + 1
        });
      }
    }

    // Get updated user
    const updatedUser = await contentStorage.getUser(user.id);

    res.json({
      ...contentResult,
      article,
      user: updatedUser
    });

  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// Save API keys
router.post("/api/content/api-keys", async (req, res) => {
  try {
    const sessionId = req.session?.id || "default-session";
    const { openai, gemini } = req.body;

    if (!openai && !gemini) {
      return res.status(400).json({ error: "At least one API key is required" });
    }

    const user = await contentStorage.getUserBySession(sessionId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save encrypted API keys
    if (openai) {
      await contentStorage.saveApiKey({
        userId: user.id,
        provider: "openai",
        encryptedKey: Buffer.from(openai).toString('base64'), // Simple encoding
        isActive: true
      });
    }

    if (gemini) {
      await contentStorage.saveApiKey({
        userId: user.id,
        provider: "gemini",
        encryptedKey: Buffer.from(gemini).toString('base64'), // Simple encoding
        isActive: true
      });
    }

    // Update user
    await contentStorage.updateUser(user.id, { hasOwnApiKey: true });

    res.json({ message: "API keys saved successfully" });

  } catch (error) {
    console.error("Error saving API keys:", error);
    res.status(500).json({ error: "Failed to save API keys" });
  }
});

// Create payment intent
router.post("/api/content/create-payment", async (req, res) => {
  try {
    const { amount, type, credits = 0 } = req.body;
    const sessionId = req.session?.id || "default-session";

    const user = await contentStorage.getUserBySession(sessionId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const paymentIntent = await processPayment({
      amount,
      type,
      credits,
      userId: user.id
    });

    res.json(paymentIntent);

  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
});

// Helper function to check user eligibility
async function checkUserEligibility(user: any) {
  const freeArticlesUsed = user.freeArticlesUsed || 0;
  const credits = user.credits || 0;
  const hasApiKey = user.hasOwnApiKey || false;

  // First article is always free
  if (freeArticlesUsed === 0) {
    return {
      allowed: true,
      method: "free",
      message: "First article free for all users"
    };
  }

  // Second article requires payment unless they have API key
  if (freeArticlesUsed === 1 && !hasApiKey) {
    return {
      allowed: false,
      requiresPayment: true,
      method: "payment",
      price: 10,
      message: "Second article requires payment ($10) or add your API key for 10 free articles!"
    };
  }

  // Users with API key get 10 free articles
  if (hasApiKey && freeArticlesUsed < 10) {
    return {
      allowed: true,
      method: "free",
      remaining: 10 - freeArticlesUsed
    };
  }

  // After 10 free articles with API key, charge $1
  if (hasApiKey && freeArticlesUsed >= 10) {
    if (credits > 0) {
      return {
        allowed: true,
        method: "credits",
        remaining: credits
      };
    }
    return {
      allowed: false,
      requiresPayment: true,
      method: "payment",
      price: 1,
      message: "With your API key: $1 per article after 10 free articles"
    };
  }

  // Check if user has credits
  if (credits > 0) {
    return {
      allowed: true,
      method: "credits",
      remaining: credits
    };
  }

  return {
    allowed: false,
    requiresPayment: true,
    method: "payment",
    price: hasApiKey ? 1 : 10,
    message: "No credits remaining. Buy credits or pay per article."
  };
}

async function checkUserEligibility(user: any) {
  const { credits, freeArticlesUsed, hasApiKey } = user;

  // First article is always free
  if (freeArticlesUsed === 0) {
    return {
      allowed: true,
      method: "free",
      remaining: 1,
      price: 0
    };
  }

  // API key users get 4 free articles, then $1 per article
  if (hasApiKey && freeArticlesUsed < 4) {
    return {
      allowed: true,
      method: "free_api",
      remaining: 4 - freeArticlesUsed,
      price: 0
    };
  }

  // After free articles with API key, charge $1
  if (hasApiKey && freeArticlesUsed >= 4) {
    if (credits > 0) {
      return {
        allowed: true,
        method: "credits",
        remaining: credits,
        price: 1,
        creditCost: 1
      };
    }
    return {
      allowed: false,
      requiresPayment: true,
      method: "payment",
      price: 1,
      message: "With your API key: $1 per article after 4 free articles"
    };
  }

  // Bulk articles without API key: $3 with credits (3 credits), $3 without credits
  if (credits >= 3) {
    return {
      allowed: true,
      method: "credits",
      remaining: credits,
      price: 3,
      creditCost: 3
    };
  }

  return {
    allowed: false,
    requiresPayment: true,
    method: "payment",
    price: 3,
    message: "Bulk generation: 3 credits or $3 direct payment"
  };
}

export default router;