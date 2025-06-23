import { spawn } from 'child_process';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Health check for deployment
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ContentScale AI Consulting Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Basic API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'ContentScale API is running',
    categories: [
      'seo', 'business_strategy', 'financial', 'marketing',
      'operations', 'hr', 'it', 'legal', 'sales',
      'customer_experience', 'sustainability', 'cybersecurity'
    ]
  });
});

// Admin download endpoint with password protection
app.get('/api/admin/download-package', (req, res) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== 'dev-admin-2025') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  res.json({
    status: 'available',
    filename: 'ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip',
    size: 47682,
    downloadUrl: '/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip',
    description: 'Complete ContentScale Consulting AI App 1 package - Admin Only'
  });
});

// Start Vite dev server
const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5173'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit'
});

// Proxy all non-API requests to Vite dev server
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/health')) {
    return;
  }
  
  // Redirect to Vite dev server
  const viteUrl = `http://localhost:5173${req.originalUrl}`;
  res.redirect(302, viteUrl);
});

// Start backend server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Frontend dev server: http://localhost:5173`);
  console.log(`Main app access: http://localhost:${PORT}`);
});

// Handle process cleanup
process.on('SIGTERM', () => {
  viteProcess.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  viteProcess.kill();
  process.exit(0);
});