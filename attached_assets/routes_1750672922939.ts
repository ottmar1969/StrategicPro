import { Router } from 'express';
import { z } from 'zod';
import { aiConsultant } from './ai-consultant.js';
import { storage } from './storage.js';
import { validateInput, requireAuth } from './security.js';
import { ConsultationRequestSchema, BusinessProfileSchema } from '../shared/schema.js';

const router = Router();

// Consultation endpoints
router.post('/consultations', validateInput(ConsultationRequestSchema), async (req, res) => {
  try {
    const consultationData = req.body;
    const consultation = await storage.createConsultation(consultationData);
    
    res.status(201).json({
      success: true,
      data: consultation,
      message: 'Consultation request created successfully'
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create consultation request'
    });
  }
});

router.get('/consultations', async (req, res) => {
  try {
    const consultations = await storage.getConsultations();
    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultations'
    });
  }
});

router.get('/consultations/:id', async (req, res) => {
  try {
    const consultation = await storage.getConsultation(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultation'
    });
  }
});

// AI Analysis endpoint
router.post('/analysis/:consultationId', async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultation = await storage.getConsultation(consultationId);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }

    const analysis = await aiConsultant.generateAnalysis(consultation);
    await storage.saveAnalysis(consultationId, analysis);
    
    res.json({
      success: true,
      data: analysis,
      message: 'Analysis completed successfully'
    });
  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate analysis'
    });
  }
});

router.get('/analysis/:consultationId', async (req, res) => {
  try {
    const analysis = await storage.getAnalysis(req.params.consultationId);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis'
    });
  }
});

// Business Profile endpoints
router.post('/business-profiles', validateInput(BusinessProfileSchema), async (req, res) => {
  try {
    const profileData = req.body;
    const profile = await storage.createBusinessProfile(profileData);
    
    res.status(201).json({
      success: true,
      data: profile,
      message: 'Business profile created successfully'
    });
  } catch (error) {
    console.error('Error creating business profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create business profile'
    });
  }
});

router.get('/business-profiles', async (req, res) => {
  try {
    const profiles = await storage.getBusinessProfiles();
    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    console.error('Error fetching business profiles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch business profiles'
    });
  }
});

// Business Overview endpoint
router.post('/business-overview', async (req, res) => {
  try {
    const { businessId } = req.body;
    const profile = await storage.getBusinessProfile(businessId);
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Business profile not found'
      });
    }

    const overview = await aiConsultant.generateBusinessOverview(profile);
    
    res.json({
      success: true,
      data: overview,
      message: 'Business overview generated successfully'
    });
  } catch (error) {
    console.error('Error generating business overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate business overview'
    });
  }
});

// Admin endpoints
router.get('/admin/download-package', requireAuth, async (req, res) => {
  try {
    // Generate download package
    const packageData = {
      consultations: await storage.getConsultations(),
      analyses: await storage.getAllAnalyses(),
      profiles: await storage.getBusinessProfiles(),
      timestamp: new Date().toISOString()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="contentscale-data.json"');
    res.json(packageData);
  } catch (error) {
    console.error('Error generating download package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate download package'
    });
  }
});

// Content generation endpoint
router.post('/content/generate', async (req, res) => {
  try {
    const { prompt, category, businessContext } = req.body;
    
    if (!prompt || !category) {
      return res.status(400).json({
        success: false,
        error: 'Prompt and category are required'
      });
    }

    const content = await aiConsultant.generateContent(prompt, category, businessContext);
    
    res.json({
      success: true,
      data: content,
      message: 'Content generated successfully'
    });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

// System status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  });
});

export { router as routes };

