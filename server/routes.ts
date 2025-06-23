import express from "express";
import { z } from "zod";
import { storage } from "./storage";
import { generateConsultingAnalysis, generateBusinessOverview } from "./ai-consultant";
import { ConsultationFormSchema, BusinessProfileFormSchema } from "../shared/schema.js";

const router = express.Router();

// Consultation Routes
router.post("/api/consultations", async (req, res) => {
  try {
    const validatedData = ConsultationFormSchema.parse(req.body);
    const consultation = await storage.createConsultationRequest(validatedData);
    
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

// Download Package Route
router.get("/api/download-package", async (req, res) => {
  try {
    res.json({
      status: "available",
      filename: "ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip",
      size: 47682,
      downloadUrl: "/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip",
      description: "Complete ContentScale Consulting AI App 1 package"
    });
  } catch (error) {
    res.status(500).json({ error: "Package information not available" });
  }
});

export default router;