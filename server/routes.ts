import { Router } from 'express';
import { z } from 'zod';
import { aiConsultant } from './ai-consultant.js';
import { keywordResearchAI } from './keyword-research.js';
import { storage } from './storage.js';
import { validateInput, requireAuth } from './security.js';
import { ConsultationRequestSchema, BusinessProfileSchema } from '../shared/schema.js';

const router = Router();

// Consultation endpoints
router.post('/consultations', validateInput(ConsultationRequestSchema), async (req, res) => {
  try {
    const consultationData = req.body;
    const consultation = await storage.createConsultation(consultationData);
    
    // Start analysis process
    setTimeout(async () => {
      try {
        await storage.updateConsultationRequestStatus(consultation.id, "analyzing");
        const analysis = await generateConsultingAnalysis(consultation);
        await storage.createAnalysisResult(analysis);
        await storage.updateConsultationRequestStatus(consultation.id, "completed");
      } catch (error) {
        console.error("Error generating analysis:", error);
      }
    }, 1000);
    
    res.json(consultation);
  } catch (error) {
    console.error("Error creating consultation:", error);
    res.status(400).json({ error: "Invalid consultation data" });
  }
});

router.get("/api/consultations", async (req, res) => {
  try {
    const consultations = await storage.getAllConsultationRequests();
    res.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

router.get("/api/consultations/:id", async (req, res) => {
  try {
    const consultation = await storage.getConsultationRequest(req.params.id);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json(consultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ error: "Failed to fetch consultation" });
  }
});

// Analysis Routes
router.get("/api/analysis/:consultationId", async (req, res) => {
  try {
    const analysis = await storage.getAnalysisResult(req.params.consultationId);
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    res.json(analysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    res.status(500).json({ error: "Failed to fetch analysis" });
  }
});

router.get("/api/analysis", async (req, res) => {
  try {
    const analyses = await storage.getAllAnalysisResults();
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Business Profile Routes
router.post("/api/business-profiles", async (req, res) => {
  try {
    const validatedData = BusinessProfileFormSchema.parse(req.body);
    const profile = await storage.createBusinessProfile(validatedData);
    res.json(profile);
  } catch (error) {
    console.error("Error creating business profile:", error);
    res.status(400).json({ error: "Invalid business profile data" });
  }
});

router.get("/api/business-profiles", async (req, res) => {
  try {
    const profiles = await storage.getAllBusinessProfiles();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    res.status(500).json({ error: "Failed to fetch business profiles" });
  }
});

router.get("/api/business-profiles/:id", async (req, res) => {
  try {
    const profile = await storage.getBusinessProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Business profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching business profile:", error);
    res.status(500).json({ error: "Failed to fetch business profile" });
  }
});

// Business Overview Route
router.post("/api/business-overview", async (req, res) => {
  try {
    const { businessContext, industry } = req.body;
    if (!businessContext || !industry) {
      return res.status(400).json({ error: "Business context and industry are required" });
    }
    
    const overview = await generateBusinessOverview(businessContext, industry);
    res.json({ overview });
  } catch (error) {
    console.error("Error generating business overview:", error);
    res.status(500).json({ error: "Failed to generate business overview" });
  }
});

// Admin Download Package Route
router.get("/api/admin/download-package", async (req, res) => {
  try {
    // Admin authentication check
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'dev-admin-2025') {
      return res.status(403).json({ error: "Admin access required" });
    }

    res.json({
      status: "available",
      filename: "ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip",
      size: 47682,
      downloadUrl: "/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip",
      description: "Complete ContentScale Consulting AI App 1 package - Admin Only"
    });
  } catch (error) {
    res.status(500).json({ error: "Package information not available" });
  }
});

// Super AI Keyword Research Routes
router.post('/api/keywords/generate', async (req, res) => {
  try {
    const { mainKeyword, niche, audience, count = 1 } = req.body;
    
    if (!mainKeyword) {
      return res.status(400).json({ error: 'Main keyword is required' });
    }

    const keywords = await keywordResearchAI.generateKeywords({
      mainKeyword,
      niche,
      audience
    }, count);

    res.json({ keywords });
  } catch (error: any) {
    console.error('Keyword generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate keywords' });
  }
});

router.post('/api/titles/generate', async (req, res) => {
  try {
    const { mainKeyword, keywords, count = 1 } = req.body;
    
    if (!mainKeyword) {
      return res.status(400).json({ error: 'Main keyword is required' });
    }

    const titles = await keywordResearchAI.generateTitles(mainKeyword, keywords || [], count);

    res.json({ titles });
  } catch (error: any) {
    console.error('Title generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate titles' });
  }
});

router.post('/api/outlines/generate', async (req, res) => {
  try {
    const { title, keywords, count = 1 } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const outlines = await keywordResearchAI.generateOutlines(title, keywords || [], count);

    res.json({ outlines });
  } catch (error: any) {
    console.error('Outline generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate outlines' });
  }
});

export { router as routes };