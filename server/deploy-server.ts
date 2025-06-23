import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

// Ensure proper startup
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

const app = express();

// Basic middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check - exact route
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'ContentScale Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Agent status - exact route
app.get('/api/agent/status', (req, res) => {
  res.json({
    status: 'active',
    name: 'ContentScale Consulting AI App',
    version: '1.0.0',
    capabilities: ['business-consulting', 'ai-analysis', 'report-generation'],
    categories: ['seo', 'business-strategy', 'financial', 'marketing', 'operations', 'human-resources'],
    contact: 'consultant@contentscale.site'
  });
});

// Agent health - exact route
app.get('/api/agent/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API endpoints - exact routes only
app.get('/api/consultations', (req, res) => {
  res.json([]);
});

app.get('/api/business-profiles', (req, res) => {
  res.json([]);
});

app.get('/api/analysis', (req, res) => {
  res.json([]);
});

// Serve static files
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Simple fallback without wildcards
app.use((req, res) => {
  // Check if it's an API request
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html for everything else
  const indexPath = path.join(process.cwd(), 'public/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`<!DOCTYPE html>
<html><head><title>ContentScale</title></head>
<body style="font-family:Arial;padding:40px;text-align:center;">
<h1>ContentScale Platform</h1>
<p>Server Status: Online</p>
<p>Visit <a href="/api/agent/status">/api/agent/status</a> for API info</p>
</body></html>`);
  }
});

const port = parseInt(process.env.PORT || '5173', 10);
const host = '0.0.0.0';

app.listen(port, host, () => {
  console.log(`ContentScale running on http://${host}:${port}`);
  console.log(`Health check: http://${host}:${port}/`);
  console.log(`API status: http://${host}:${port}/api/agent/status`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});