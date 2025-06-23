import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import fs from "fs";
import { fileURLToPath } from 'url';
import routes from "./routes.js";
import agentRoutes from "./agent-api.js";
import contentRoutes from "./content-routes.js";
import adminBackup from "./admin-backup.js";
import phpConverter from "./php-converter.js";
import { corsOptions, securityHeaders, sanitizeInput, agentAuth, createRateLimit } from "./security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startProductionServer() {
  const app = express();
  
  // Security middleware
  app.use(cors(corsOptions));
  app.use(securityHeaders);
  app.use(sanitizeInput);
  app.use(agentAuth);
  
  // Rate limiting
  app.use('/api/', createRateLimit(15 * 60 * 1000, 100));
  app.use('/api/agent/', createRateLimit(5 * 60 * 1000, 50));
  
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
  
  app.use(express.json());
  
  // Health check endpoint for deployment
  app.get('/', (req, res) => {
    res.status(200).json({ 
      status: 'healthy', 
      service: 'ContentScale Platform',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  });
  
  // API routes
  app.use(routes);
  app.use(agentRoutes);
  app.use(contentRoutes);
  app.use(adminBackup);
  app.use(phpConverter);
  
  // Serve static files - prioritize public directory for deployment
  const staticPaths = [
    path.join(process.cwd(), 'public'),
    path.join(__dirname, '../public'),
    path.join(__dirname, '../dist'),
    path.join(__dirname, '../client'),
    path.join(process.cwd(), 'client')
  ];
  
  for (const staticPath of staticPaths) {
    if (fs.existsSync(staticPath)) {
      app.use(express.static(staticPath));
      console.log(`Serving static files from: ${staticPath}`);
      break;
    }
  }
  
  // Fallback for SPA routing - serve index.html for non-API routes
  app.get('/*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/') || req.path.startsWith('/admin/download/')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    
    // Always serve the public index.html for any route
    const publicIndexPath = path.join(process.cwd(), 'public/index.html');
    
    if (fs.existsSync(publicIndexPath)) {
      res.sendFile(publicIndexPath);
    } else {
      // Create a basic HTML page if index.html doesn't exist
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ContentScale - AI Business Consulting</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #2563eb; margin-bottom: 20px; }
            .status { padding: 20px; background: #e7f3ff; border-radius: 4px; margin: 20px 0; }
            .api-list { background: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
            code { background: #e9ecef; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>ContentScale - AI Business Consulting Platform</h1>
            <div class="status">
              <strong>Status:</strong> Server is running successfully!<br>
              <strong>Service:</strong> Professional Business Consulting with AI<br>
              <strong>Version:</strong> 1.0.0<br>
              <strong>Contact:</strong> consultant@contentscale.site
            </div>
            
            <h2>API Endpoints Available:</h2>
            <div class="api-list">
              <h3>Health Check:</h3>
              <p><code>GET /</code> - Service health status</p>
              
              <h3>Consulting APIs:</h3>
              <p><code>POST /api/consultations</code> - Create consultation request</p>
              <p><code>GET /api/consultations</code> - List all consultations</p>
              <p><code>GET /api/analysis/{id}</code> - Get analysis results</p>
              <p><code>POST /api/business-profiles</code> - Create business profile</p>
              
              <h3>Agent APIs:</h3>
              <p><code>GET /api/agent/status</code> - Service capabilities</p>
              <p><code>GET /api/agent/health</code> - Health monitoring</p>
              <p><code>POST /api/agent/batch-consultations</code> - Batch processing</p>
              <p><code>POST /api/agent/quick-analysis</code> - Quick analysis</p>
              
              <h3>Content APIs:</h3>
              <p><code>POST /api/content/generate</code> - Generate content</p>
              <p><code>POST /api/content/check-eligibility</code> - Check user eligibility</p>
            </div>
            
            <h2>Features:</h2>
            <ul>
              <li>12 Consulting Categories: SEO, Business Strategy, Financial, Marketing, Operations, HR, IT, Legal, Sales, Customer Experience, Sustainability, Cybersecurity</li>
              <li>AI-Powered Analysis using Google Gemini</li>
              <li>Comprehensive Business Reports</li>
              <li>Content Generation with Fraud Protection</li>
              <li>Agent API for Automation</li>
              <li>Security: Rate limiting, Input sanitization, CORS</li>
            </ul>
            
            <p><strong>Note:</strong> This is the API server view. The React frontend will be available when properly built and deployed.</p>
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
}

startProductionServer().catch(console.error);