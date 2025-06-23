import express from 'express';
import { storage } from './storage.js';
import { generateConsultingAnalysis } from './ai-consultant.js';

const router = express.Router();

// Agent-specific endpoints for automation
router.get('/api/agent/status', (req, res) => {
  res.json({
    status: 'active',
    name: 'ContentScale Consulting AI App',
    version: '1.0.0',
    capabilities: [
      'business-consulting',
      'ai-analysis',
      'report-generation',
      'multi-category-expertise'
    ],
    categories: [
      'seo', 'business-strategy', 'financial', 'marketing',
      'operations', 'human-resources', 'it-consulting', 'legal',
      'sales', 'customer-experience', 'sustainability', 'cybersecurity'
    ],
    contact: 'consultant@contentscale.site'
  });
});

// Batch consultation processing for agents
router.post('/api/agent/batch-consultations', async (req, res) => {
  try {
    const { consultations } = req.body;
    
    if (!Array.isArray(consultations)) {
      return res.status(400).json({ error: 'Consultations must be an array' });
    }
    
    const results = [];
    
    for (const consultationData of consultations) {
      try {
        // Create consultation
        const consultation = await storage.createConsultationRequest(consultationData);
        
        // Update status to analyzing
        await storage.updateConsultationRequestStatus(consultation.id, 'analyzing');
        
        // Generate analysis
        const analysis = await generateConsultingAnalysis(consultation);
        await storage.createAnalysisResult(analysis);
        
        // Update status to completed
        await storage.updateConsultationRequestStatus(consultation.id, 'completed');
        
        results.push({
          consultationId: consultation.id,
          status: 'completed',
          analysis: analysis
        });
      } catch (error) {
        results.push({
          consultationData,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    res.json({
      processed: results.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Batch processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export consultation data for agents
router.get('/api/agent/export-data', async (req, res) => {
  try {
    const consultations = await storage.getAllConsultationRequests();
    const analyses = await storage.getAllAnalysisResults();
    const profiles = await storage.getAllBusinessProfiles();
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: {
        totalConsultations: consultations.length,
        completedAnalyses: analyses.length,
        businessProfiles: profiles.length
      },
      data: {
        consultations,
        analyses,
        profiles
      }
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Export failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Quick analysis endpoint for agents
router.post('/api/agent/quick-analysis', async (req, res) => {
  try {
    const { category, title, description, businessContext, urgency = 'medium' } = req.body;
    
    if (!category || !title || !description || !businessContext) {
      return res.status(400).json({ 
        error: 'Missing required fields: category, title, description, businessContext' 
      });
    }
    
    // Create and process consultation in one step
    const consultation = await storage.createConsultationRequest({
      category,
      title,
      description,
      businessContext,
      urgency,
      budget: req.body.budget,
      timeline: req.body.timeline
    });
    
    await storage.updateConsultationRequestStatus(consultation.id, 'analyzing');
    const analysis = await generateConsultingAnalysis(consultation);
    await storage.createAnalysisResult(analysis);
    await storage.updateConsultationRequestStatus(consultation.id, 'completed');
    
    res.json({
      consultationId: consultation.id,
      analysis: analysis,
      status: 'completed'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Quick analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check for agent monitoring
router.get('/api/agent/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;