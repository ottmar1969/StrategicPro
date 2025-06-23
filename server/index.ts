import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import { fileURLToPath } from 'url';
import routes from "./routes.js";
import agentRoutes from "./agent-api.js";
import contentRoutes from "./content-routes.js";
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
  
  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
    
    // Handle SPA routing - but not for API routes or health check
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/') || req.path === '/') {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  
  const port = process.env.PORT || 5173;
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 ContentScale Platform running on port ${port}`);
    console.log(`📧 Contact: consultant@contentscale.site`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startProductionServer().catch(console.error);