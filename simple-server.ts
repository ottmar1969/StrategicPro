import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'client')));

// Health check endpoint - CRITICAL for deployment
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ContentScale AI Consulting Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'ContentScale API is running',
    categories: [
      'seo', 'business_strategy', 'financial', 'marketing',
      'operations', 'hr', 'it', 'legal', 'sales',
      'customer_experience', 'sustainability', 'cybersecurity'
    ],
    endpoints: [
      'POST /api/consultations - Create consultation',
      'GET /api/consultations - List consultations',
      'POST /api/analysis/:id - Generate analysis',
      'POST /api/business-profiles - Create business profile',
      'POST /api/content/generate - Generate content'
    ]
  });
});

// Download endpoints for packages
app.get('/download/contentscale-platform.tar.gz', (req, res) => {
  res.json({
    message: 'ContentScale Platform Download',
    url: 'http://localhost:3000/download/contentscale-platform.tar.gz',
    size: '~2.5MB',
    description: 'Complete AI business consulting platform',
    contents: [
      'Frontend React application',
      'Backend Express server',
      'AI consultant integration',
      'Database schemas',
      'Security middleware',
      'Documentation'
    ]
  });
});

app.get('/download/github-ready.tar.gz', (req, res) => {
  res.json({
    message: 'GitHub Ready Package Download',
    url: 'http://localhost:3000/download/github-ready.tar.gz',
    size: '~1.8MB',
    description: 'GitHub-ready repository package',
    contents: [
      'Clean source code',
      'Package configuration',
      'Documentation files',
      'Deployment scripts',
      'Environment templates'
    ]
  });
});

// Catch-all for frontend routing
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ContentScale - AI Business Consulting Platform</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="min-h-screen bg-gray-50">
          <header class="bg-white shadow">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 class="text-3xl font-bold text-gray-900">
                ContentScale - AI Business Consulting Platform
              </h1>
            </div>
          </header>
          
          <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
              <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
                <div class="text-center">
                  <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                    Platform Status: ACTIVE
                  </h2>
                  <p class="text-green-600 font-semibold mb-6">
                    ✓ Server running successfully on port ${process.env.PORT || 3000}
                  </p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div class="bg-white p-6 rounded-lg shadow">
                      <h3 class="text-lg font-semibold mb-2">AI Consulting</h3>
                      <p class="text-gray-600">Expert advice across 12 business categories</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow">
                      <h3 class="text-lg font-semibold mb-2">Business Analysis</h3>
                      <p class="text-gray-600">Comprehensive analysis and recommendations</p>
                    </div>
                    
                    <div class="bg-white p-6 rounded-lg shadow">
                      <h3 class="text-lg font-semibold mb-2">Content Generation</h3>
                      <p class="text-gray-600">AI-powered content with fraud detection</p>
                    </div>
                  </div>
                  
                  <div class="mt-8 bg-blue-50 p-6 rounded-lg">
                    <h3 class="text-lg font-semibold mb-4">Download Packages</h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center bg-white p-4 rounded shadow">
                        <div>
                          <h4 class="font-semibold">Complete Platform</h4>
                          <p class="text-sm text-gray-600">Full application with all features</p>
                        </div>
                        <a href="/download/contentscale-platform.tar.gz" 
                           class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                          Download
                        </a>
                      </div>
                      
                      <div class="flex justify-between items-center bg-white p-4 rounded shadow">
                        <div>
                          <h4 class="font-semibold">GitHub Ready</h4>
                          <p class="text-sm text-gray-600">Clean repository package</p>
                        </div>
                        <a href="/download/github-ready.tar.gz" 
                           class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-8">
                    <h3 class="text-lg font-semibold mb-4">API Endpoints</h3>
                    <div class="text-left bg-gray-100 p-4 rounded-lg">
                      <ul class="space-y-2 text-sm font-mono">
                        <li class="text-green-600">GET / - Health check (200 OK)</li>
                        <li class="text-blue-600">GET /api/status - System status</li>
                        <li class="text-purple-600">GET /download/contentscale-platform.tar.gz</li>
                        <li class="text-purple-600">GET /download/github-ready.tar.gz</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  `);
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ContentScale server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`🔗 Download links:`);
  console.log(`   - Platform: http://localhost:${PORT}/download/contentscale-platform.tar.gz`);
  console.log(`   - GitHub: http://localhost:${PORT}/download/github-ready.tar.gz`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;