import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import archiver from "archiver";

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

// Download endpoints
app.get('/download/complete-system.tar.gz', (req, res) => {
  console.log('📦 Creating complete system backup...');
  const archive = archiver('tar', { gzip: true });
  
  res.setHeader('Content-Type', 'application/gzip');
  res.setHeader('Content-Disposition', 'attachment; filename="contentscale-complete-system.tar.gz"');
  
  archive.pipe(res);
  
  // Add all project files
  if (fs.existsSync('client/')) archive.directory('client/', 'client/');
  if (fs.existsSync('server/')) archive.directory('server/', 'server/');
  if (fs.existsSync('shared/')) archive.directory('shared/', 'shared/');
  if (fs.existsSync('public/')) archive.directory('public/', 'public/');
  
  // Add configuration files
  if (fs.existsSync('package.json')) archive.file('package.json', { name: 'package.json' });
  if (fs.existsSync('package-lock.json')) archive.file('package-lock.json', { name: 'package-lock.json' });
  if (fs.existsSync('tsconfig.json')) archive.file('tsconfig.json', { name: 'tsconfig.json' });
  if (fs.existsSync('tailwind.config.ts')) archive.file('tailwind.config.ts', { name: 'tailwind.config.ts' });
  if (fs.existsSync('postcss.config.js')) archive.file('postcss.config.js', { name: 'postcss.config.js' });
  if (fs.existsSync('start')) archive.file('start', { name: 'start' });
  if (fs.existsSync('dev-server.ts')) archive.file('dev-server.ts', { name: 'dev-server.ts' });
  
  // Add documentation
  if (fs.existsSync('README.md')) archive.file('README.md', { name: 'README.md' });
  if (fs.existsSync('DEPLOYMENT.md')) archive.file('DEPLOYMENT.md', { name: 'DEPLOYMENT.md' });
  if (fs.existsSync('TECHNICAL_SPECIFICATIONS.md')) archive.file('TECHNICAL_SPECIFICATIONS.md', { name: 'TECHNICAL_SPECIFICATIONS.md' });
  
  archive.finalize();
});

app.get('/download/security-backup.tar.gz', (req, res) => {
  console.log('🔒 Creating security backup...');
  const archive = archiver('tar', { gzip: true });
  
  res.setHeader('Content-Type', 'application/gzip');
  res.setHeader('Content-Disposition', 'attachment; filename="contentscale-security-backup.tar.gz"');
  
  archive.pipe(res);
  
  // Add security-related files
  if (fs.existsSync('server/')) archive.directory('server/', 'server/');
  if (fs.existsSync('package.json')) archive.file('package.json', { name: 'package.json' });
  if (fs.existsSync('package-lock.json')) archive.file('package-lock.json', { name: 'package-lock.json' });
  if (fs.existsSync('start')) archive.file('start', { name: 'start' });
  
  // Add configuration and documentation
  if (fs.existsSync('DEPLOYMENT.md')) archive.file('DEPLOYMENT.md', { name: 'DEPLOYMENT.md' });
  if (fs.existsSync('TECHNICAL_SPECIFICATIONS.md')) archive.file('TECHNICAL_SPECIFICATIONS.md', { name: 'TECHNICAL_SPECIFICATIONS.md' });
  
  archive.finalize();
});

app.get('/download/github-package.tar.gz', (req, res) => {
  console.log('🐙 Creating GitHub-ready package...');
  const archive = archiver('tar', { gzip: true });
  
  res.setHeader('Content-Type', 'application/gzip');
  res.setHeader('Content-Disposition', 'attachment; filename="contentscale-github-ready.tar.gz"');
  
  archive.pipe(res);
  
  // Add all source files
  if (fs.existsSync('client/')) archive.directory('client/', 'client/');
  if (fs.existsSync('server/')) archive.directory('server/', 'server/');
  if (fs.existsSync('shared/')) archive.directory('shared/', 'shared/');
  if (fs.existsSync('public/')) archive.directory('public/', 'public/');
  
  // Add essential configuration files
  if (fs.existsSync('package.json')) archive.file('package.json', { name: 'package.json' });
  if (fs.existsSync('package-lock.json')) archive.file('package-lock.json', { name: 'package-lock.json' });
  if (fs.existsSync('tsconfig.json')) archive.file('tsconfig.json', { name: 'tsconfig.json' });
  if (fs.existsSync('tailwind.config.ts')) archive.file('tailwind.config.ts', { name: 'tailwind.config.ts' });
  if (fs.existsSync('postcss.config.js')) archive.file('postcss.config.js', { name: 'postcss.config.js' });
  if (fs.existsSync('start')) archive.file('start', { name: 'start' });
  if (fs.existsSync('dev-server.ts')) archive.file('dev-server.ts', { name: 'dev-server.ts' });
  
  // Add GitHub-specific files
  const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
`;
  
  const readme = `# ContentScale - AI Business Consulting Platform

Professional AI-powered business consulting platform offering comprehensive analysis across 12 categories.

## Features

- 12 Consulting Categories: SEO, Business Strategy, Financial, Marketing, Operations, HR, IT, Legal, Sales, Customer Experience, Sustainability, Cybersecurity
- AI-Powered Analysis using Google Gemini
- Comprehensive Business Reports
- Content Generation with Fraud Protection
- Agent API for Automation
- Enterprise Security Features

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Set environment variables
export GEMINI_API_KEY="your_gemini_api_key"
export SESSION_SECRET="your_session_secret"

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

## API Endpoints

- \`GET /\` - Health check
- \`POST /api/consultations\` - Create consultation request
- \`GET /api/consultations\` - List all consultations
- \`POST /api/business-profiles\` - Create business profile
- \`POST /api/content/generate\` - Generate content
- \`GET /api/agent/status\` - Service capabilities

## Contact

Professional Business Consulting: consultant@contentscale.site
`;

  archive.append(gitignore, { name: '.gitignore' });
  archive.append(readme, { name: 'README.md' });
  
  // Add documentation
  if (fs.existsSync('DEPLOYMENT.md')) archive.file('DEPLOYMENT.md', { name: 'DEPLOYMENT.md' });
  if (fs.existsSync('TECHNICAL_SPECIFICATIONS.md')) archive.file('TECHNICAL_SPECIFICATIONS.md', { name: 'TECHNICAL_SPECIFICATIONS.md' });
  
  archive.finalize();
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

// Additional API routes for the React app
app.post('/api/consultations', (req, res) => {
  res.json({ 
    id: 'demo-consultation',
    status: 'received',
    message: 'Consultation request received successfully',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/business-profiles', (req, res) => {
  res.json({ 
    id: 'demo-profile',
    status: 'created',
    message: 'Business profile created successfully',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/content/generate', (req, res) => {
  res.json({ 
    id: 'demo-content',
    status: 'generated',
    message: 'Content generation completed',
    timestamp: new Date().toISOString()
  });
});

// Catch-all handler for non-API routes
app.use((req, res) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Serve index.html for everything else
  const indexPath = path.join(process.cwd(), 'public/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not found');
  }
});

const port = parseInt(process.env.PORT || '5173', 10);
const host = '0.0.0.0';

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

const server = app.listen(port, host, () => {
  console.log(`🚀 ContentScale Platform deployed successfully`);
  console.log(`📍 Server running on http://${host}:${port}`);
  console.log(`✅ Health check: http://${host}:${port}/`);
  console.log(`🔌 API status: http://${host}:${port}/api/agent/status`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`📦 Ready for deployment health checks`);
}).on('error', (err) => {
  console.error('❌ Server startup failed:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
  process.exit(1);
});

// Export for external imports
export default server;