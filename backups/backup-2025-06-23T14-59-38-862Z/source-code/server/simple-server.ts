import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import session from "express-session";
import { storage } from "./storage.js";
import { generateConsultingAnalysis } from "./ai-consultant.js";
import { ConsultationFormSchema, BusinessProfileFormSchema } from "../shared/schema.js";
import { corsOptions, securityHeaders, sanitizeInput, createRateLimit } from "./security.js";

const app = express();

// Basic middleware
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(sanitizeInput);
app.use(express.json());

// Rate limiting
app.use(createRateLimit(15 * 60 * 1000, 100));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'contentscale-production-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'ContentScale Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Agent endpoints
app.get('/api/agent/status', (req, res) => {
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

app.get('/api/agent/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Consultation endpoints
app.post('/api/consultations', async (req, res) => {
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

app.get('/api/consultations', async (req, res) => {
  try {
    const consultations = await storage.getAllConsultationRequests();
    res.json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

// Business profile endpoints
app.post('/api/business-profiles', async (req, res) => {
  try {
    const validatedData = BusinessProfileFormSchema.parse(req.body);
    const profile = await storage.createBusinessProfile(validatedData);
    res.json(profile);
  } catch (error) {
    console.error("Error creating business profile:", error);
    res.status(400).json({ error: "Invalid business profile data" });
  }
});

app.get('/api/business-profiles', async (req, res) => {
  try {
    const profiles = await storage.getAllBusinessProfiles();
    res.json(profiles);
  } catch (error) {
    console.error("Error fetching business profiles:", error);
    res.status(500).json({ error: "Failed to fetch business profiles" });
  }
});

// Analysis endpoints
app.get('/api/analysis/:consultationId', async (req, res) => {
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

app.get('/api/analysis', async (req, res) => {
  try {
    const analyses = await storage.getAllAnalysisResults();
    res.json(analyses);
  } catch (error) {
    console.error("Error fetching analyses:", error);
    res.status(500).json({ error: "Failed to fetch analyses" });
  }
});

// Serve static files
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log(`Serving static files from: ${publicPath}`);
}

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(process.cwd(), 'public/index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ContentScale - AI Business Consulting</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #2563eb; }
          .status { color: #10b981; font-weight: bold; }
          .api-link { color: #2563eb; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ContentScale Platform</h1>
          <p class="status">Server Running Successfully</p>
          <p>AI Business Consulting Platform</p>
          <p><a href="/api/agent/status" class="api-link">View API Status</a></p>
          <p>Contact: consultant@contentscale.site</p>
        </div>
      </body>
      </html>
    `);
  }
});

const port = process.env.PORT || 5173;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 ContentScale Platform running on port ${port}`);
  console.log(`📧 Contact: consultant@contentscale.site`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});