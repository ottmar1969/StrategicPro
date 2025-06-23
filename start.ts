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

// Health check endpoint for deployment
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ContentScale AI Consulting Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoints
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

// Serve the complete application
app.get('*', (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContentScale - AI Business Consulting Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      .consulting-card { transition: transform 0.2s; }
      .consulting-card:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div id="root">
        <div class="min-h-screen bg-gray-50">
            <!-- Navigation -->
            <nav class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex justify-between items-center py-4">
                        <h1 class="text-2xl font-bold text-gray-900">ContentScale Platform</h1>
                        <div class="space-x-4">
                            <a href="/" class="text-gray-700 hover:text-blue-600">Home</a>
                            <a href="/content-writer" class="text-gray-700 hover:text-blue-600">Content Writer</a>
                            <a href="/consultation" class="text-gray-700 hover:text-blue-600">Consulting</a>
                            <a href="/admin/download" class="text-gray-700 hover:text-blue-600">Admin</a>
                        </div>
                    </div>
                </div>
            </nav>

            <div id="main-content">
                <!-- Landing Page Content -->
                <div class="gradient-bg text-white py-20">
                    <div class="max-w-7xl mx-auto px-4 text-center">
                        <h1 class="text-4xl md:text-6xl font-bold mb-4">ContentScale Platform</h1>
                        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
                            AI-powered content generation and professional business consulting in one platform. 
                            Create SEO-optimized content and get expert business insights.
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/content-writer" class="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Start Writing Content
                            </a>
                            <a href="/consultation" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
                                Get Business Consultation
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="py-16 bg-gray-100">
                    <div class="max-w-7xl mx-auto px-4">
                        <h2 class="text-3xl font-bold text-center mb-12">Dual-Powered Business Solutions</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">AI Content Generation</h3>
                                <p class="text-gray-600">Create SEO-optimized content with our advanced CRAFT framework. First article free, then $1 with your API key.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">Business Consulting</h3>
                                <p class="text-gray-600">Access 12 specialized consulting areas from SEO to cybersecurity, each with deep industry expertise.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">Fraud Protection</h3>
                                <p class="text-gray-600">Advanced security with VPN detection, browser fingerprinting, and abuse prevention to protect your business.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">Flexible Pricing</h3>
                                <p class="text-gray-600">Pay-per-use or credit packages. Bring your own API keys for significant savings and higher limits.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">Fast Results</h3>
                                <p class="text-gray-600">Generate content and receive business analysis within minutes, not hours or days.</p>
                            </div>
                            <div class="bg-white p-6 rounded-lg shadow text-center">
                                <h3 class="text-xl font-semibold mb-2">Complete Platform</h3>
                                <p class="text-gray-600">Everything you need for content creation and business growth in one integrated solution.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Admin Access Note -->
                <div class="py-16">
                    <div class="max-w-7xl mx-auto px-4 text-center">
                        <div class="bg-blue-50 p-8 rounded-lg">
                            <h2 class="text-3xl font-bold mb-4">Admin Download Access</h2>
                            <p class="text-lg text-gray-700 mb-6">
                                Administrative features including complete platform downloads are password protected.
                            </p>
                            <a href="/admin/download" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Access Admin Panel
                            </a>
                            <p class="text-sm text-gray-500 mt-4">
                                Password required for security
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="py-16 bg-gray-100">
                    <div class="max-w-7xl mx-auto px-4 text-center">
                        <h2 class="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
                        <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                            Join thousands of businesses that have already benefited from our AI-powered consulting platform.
                        </p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="/consultation" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Start Your Free Consultation
                            </a>
                            <p class="text-sm text-gray-600">
                                Contact: consultant@contentscale.site
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function handleRoute() {
            const path = window.location.pathname;
            const mainContent = document.getElementById('main-content');
            
            if (path === '/admin/download') {
                mainContent.innerHTML = \`
                    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                            <div class="text-center mb-6">
                                <h1 class="text-2xl font-bold mb-2">Admin Access Required</h1>
                                <p class="text-gray-600">Enter admin key to access download and backup features</p>
                            </div>
                            <form onsubmit="authenticate(event)" class="space-y-4">
                                <input type="password" id="adminKey" placeholder="Enter admin key" class="w-full p-3 border border-gray-300 rounded-lg" required />
                                <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">Authenticate</button>
                            </form>
                            <div class="mt-4 text-center">
                                <a href="/" onclick="showHomePage()" class="text-blue-600 hover:underline">← Back to Home</a>
                            </div>
                        </div>
                    </div>
                \`;
            }
        }
        
        function authenticate(event) {
            event.preventDefault();
            const key = document.getElementById('adminKey').value;
            if (key === 'dev-admin-2025') {
                alert('Authentication successful! Download features unlocked.');
                showDownloadInterface();
            } else {
                alert('Invalid admin key. Please try again.');
            }
        }
        
        function showDownloadInterface() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 p-8">
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <div class="text-center mb-8">
                                <h1 class="text-3xl font-bold mb-4">Admin Download Center</h1>
                                <p class="text-gray-600">Access authenticated - Download complete platform packages</p>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="bg-blue-50 p-6 rounded-lg">
                                    <h3 class="text-xl font-semibold mb-2">Complete Platform Package</h3>
                                    <p class="text-gray-600 mb-4">Full ContentScale application with all features (47.6KB)</p>
                                    <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        Download Platform
                                    </button>
                                </div>
                                
                                <div class="bg-green-50 p-6 rounded-lg">
                                    <h3 class="text-xl font-semibold mb-2">GitHub Ready Package</h3>
                                    <p class="text-gray-600 mb-4">Clean repository structure for deployment</p>
                                    <button class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                                        Download GitHub Package
                                    </button>
                                </div>
                            </div>
                            
                            <div class="mt-8 text-center">
                                <a href="/" onclick="showHomePage()" class="text-blue-600 hover:underline">← Back to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function showHomePage() {
            window.location.href = '/';
        }
        
        // Handle navigation
        window.addEventListener('popstate', handleRoute);
        document.addEventListener('DOMContentLoaded', handleRoute);
        
        // Handle navigation clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href') === '/admin/download') {
                e.preventDefault();
                history.pushState(null, '', '/admin/download');
                handleRoute();
            }
        });
    </script>
</body>
</html>
  `;
  
  res.send(htmlContent);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`ContentScale server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Landing page: http://localhost:${PORT}`);
  console.log(`Admin access: http://localhost:${PORT}/admin/download`);
});