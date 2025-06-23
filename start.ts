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

// Backup endpoints redirecting to backup server on port 3001
app.get('/backup/:type', (req, res) => {
  const adminKey = req.query.key;
  const type = req.params.type;
  
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Redirect to backup server
  res.redirect(`http://localhost:3001/backup/${type}?key=${adminKey}`);
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
                            <a href="/consultation" onclick="navigateTo('/consultation')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Start Your Free Consultation
                            </a>
                            <p class="text-sm text-gray-600">
                                Contact: O. Francisca • +31 628073996
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <footer class="bg-gray-900 text-white py-12">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div class="md:col-span-2">
                            <h3 class="text-xl font-bold mb-4">ContentScale Platform</h3>
                            <p class="text-gray-300 mb-4">AI-powered content generation and professional business consulting in one platform.</p>
                            <div class="flex items-center space-x-2">
                                <a href="https://wa.me/31628073996" target="_blank" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785"/>
                                    </svg>
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                            <p class="text-gray-400 text-sm mt-2">+31 628073996</p>
                        </div>
                        
                        <div>
                            <h4 class="text-lg font-semibold mb-4">Services</h4>
                            <ul class="space-y-2 text-gray-300">
                                <li><a href="/content-writer" onclick="navigateTo('/content-writer')" class="hover:text-white">Content Writer</a></li>
                                <li><a href="/consultation" onclick="navigateTo('/consultation')" class="hover:text-white">Business Consulting</a></li>
                                <li><a href="/admin/download" onclick="navigateTo('/admin/download')" class="hover:text-white">Admin Portal</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 class="text-lg font-semibold mb-4">Legal</h4>
                            <ul class="space-y-2 text-gray-300">
                                <li><a href="/privacy" onclick="navigateTo('/privacy')" class="hover:text-white">Privacy Policy</a></li>
                                <li><a href="/terms" onclick="navigateTo('/terms')" class="hover:text-white">Terms of Service</a></li>
                                <li><a href="/cookies" onclick="navigateTo('/cookies')" class="hover:text-white">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 ContentScale Platform. All rights reserved. | Contact: O. Francisca | +31 628073996</p>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    
    <!-- Cookie Consent Banner -->
    <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50" style="display: none;">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
            <div class="mb-4 sm:mb-0">
                <p class="text-sm">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            </div>
            <div class="flex space-x-4">
                <button onclick="acceptCookies()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">Accept</button>
                <button onclick="showCookieSettings()" class="border border-gray-500 hover:border-white text-white px-4 py-2 rounded text-sm">Settings</button>
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
            } else if (path === '/content-writer') {
                showContentWriter();
            } else if (path === '/consultation') {
                showConsultation();
            } else if (path === '/privacy') {
                showPrivacyPolicy();
            } else if (path === '/terms') {
                showTermsOfService();
            } else if (path === '/cookies') {
                showCookiePolicy();
            } else {
                showHomePage();
            }
        }
        
        function showContentWriter() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h1 class="text-3xl font-bold mb-6">AI Content Writer</h1>
                            <p class="text-gray-600 mb-8">Create SEO-optimized content with our advanced CRAFT framework.</p>
                            
                            <div class="space-y-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Content Topic</label>
                                    <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your content topic">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Target Keywords</label>
                                    <input type="text" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter target keywords (comma separated)">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                                    <select class="w-full p-3 border border-gray-300 rounded-lg">
                                        <option>Blog Post</option>
                                        <option>Product Description</option>
                                        <option>Landing Page</option>
                                        <option>Social Media</option>
                                    </select>
                                </div>
                                
                                <button onclick="generateContent()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Generate Content
                                </button>
                            </div>
                            
                            <div class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                                <div class="text-center">
                                    <h4 class="text-lg font-bold text-blue-900 mb-2">🎯 CRAFT Framework + Google AI Mode</h4>
                                    <p class="text-blue-800 font-semibold mb-2">✅ 100/100 RankMath SEO Scores Guaranteed</p>
                                    <p class="text-blue-700 mb-2">✅ Government Source Citations (.gov, .edu, .org)</p>
                                    <p class="text-blue-700 mb-2">✅ Google AI Overview + Featured Snippets</p>
                                    <p class="text-blue-700 mb-3">✅ Short Sentences + Fact-Checked Statistics</p>
                                    <div class="border-t border-blue-200 pt-3">
                                        <p class="text-blue-800 font-semibold">First article free • $1 with your API key</p>
                                        <p class="text-blue-600 text-sm">Contact O. Francisca: +31 628073996 for enterprise pricing</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function showConsultation() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-6xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h1 class="text-3xl font-bold mb-6">Business Consultation</h1>
                            <p class="text-gray-600 mb-8">Get expert advice across 12 specialized business areas.</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('seo')">
                                    <h3 class="font-semibold mb-2">SEO Consulting</h3>
                                    <p class="text-gray-600 text-sm">Technical SEO audits and strategy</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('business_strategy')">
                                    <h3 class="font-semibold mb-2">Business Strategy</h3>
                                    <p class="text-gray-600 text-sm">Market analysis and growth planning</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('financial')">
                                    <h3 class="font-semibold mb-2">Financial Consulting</h3>
                                    <p class="text-gray-600 text-sm">Financial planning and investment</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('marketing')">
                                    <h3 class="font-semibold mb-2">Marketing Strategy</h3>
                                    <p class="text-gray-600 text-sm">Digital marketing and branding</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('operations')">
                                    <h3 class="font-semibold mb-2">Operations</h3>
                                    <p class="text-gray-600 text-sm">Process optimization</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('cybersecurity')">
                                    <h3 class="font-semibold mb-2">Cybersecurity</h3>
                                    <p class="text-gray-600 text-sm">Security assessment and protection</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('hr')">
                                    <h3 class="font-semibold mb-2">HR Consulting</h3>
                                    <p class="text-gray-600 text-sm">Human resources and talent management</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('it')">
                                    <h3 class="font-semibold mb-2">IT Consulting</h3>
                                    <p class="text-gray-600 text-sm">Technology infrastructure and solutions</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('legal')">
                                    <h3 class="font-semibold mb-2">Legal Consulting</h3>
                                    <p class="text-gray-600 text-sm">Legal compliance and risk management</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('sales')">
                                    <h3 class="font-semibold mb-2">Sales Consulting</h3>
                                    <p class="text-gray-600 text-sm">Sales strategy and performance optimization</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('customer_experience')">
                                    <h3 class="font-semibold mb-2">Customer Experience</h3>
                                    <p class="text-gray-600 text-sm">Customer journey and satisfaction</p>
                                </div>
                                <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all" onclick="selectConsultingArea('sustainability')">
                                    <h3 class="font-semibold mb-2">Sustainability</h3>
                                    <p class="text-gray-600 text-sm">Environmental and social responsibility</p>
                                </div>
                            </div>
                            
                            <div class="mt-8 text-center">
                                <button onclick="startGeneralConsultation()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                    Start Free Consultation
                                </button>
                                <p class="text-gray-600 text-sm mt-2">Contact O. Francisca: +31 628073996</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
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
            // Store admin key for API calls
            sessionStorage.setItem('adminKey', 'dev-admin-2025');
            
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 p-8">
                    <div class="max-w-6xl mx-auto">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <div class="flex justify-between items-center mb-6">
                                <h1 class="text-3xl font-bold">ContentScale Admin Panel</h1>
                                <a href="/" onclick="showHomePage()" class="text-blue-600 hover:underline">← Back to Home</a>
                            </div>
                            
                            <div id="admin-panel">
                                <h2 class="text-2xl font-bold mb-6">Admin Panel - ContentScale Platform</h2>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold mb-4">📦 Backup Downloads (Starting with "01")</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div class="border border-gray-200 rounded-lg p-4 bg-blue-50">
                                            <h4 class="font-semibold mb-2">01 - Complete Backup</h4>
                                            <p class="text-gray-600 text-sm mb-4">Full project backup with all files, documentation, and configurations</p>
                                            <button onclick="downloadBackup('complete')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full">Download Complete</button>
                                        </div>
                                        
                                        <div class="border border-gray-200 rounded-lg p-4 bg-green-50">
                                            <h4 class="font-semibold mb-2">01 - GitHub Ready</h4>
                                            <p class="text-gray-600 text-sm mb-4">GitHub-optimized backup with .gitignore and Actions workflow</p>
                                            <button onclick="downloadBackup('github')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full">Download GitHub</button>
                                        </div>
                                        
                                        <div class="border border-gray-200 rounded-lg p-4 bg-purple-50">
                                            <h4 class="font-semibold mb-2">01 - Replit Backup</h4>
                                            <p class="text-gray-600 text-sm mb-4">Replit-specific backup with .replit and nix configurations</p>
                                            <button onclick="downloadBackup('replit')" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors w-full">Download Replit</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-8">
                                    <h3 class="text-lg font-semibold mb-4">📊 System Information</h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div class="border border-gray-200 rounded-lg p-4">
                                            <h4 class="font-semibold mb-2">Project Status</h4>
                                            <p class="text-gray-600 text-sm mb-4">View system status and backup information</p>
                                            <button onclick="showBackupStatus()" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">View Status</button>
                                        </div>
                                        
                                        <div class="border border-gray-200 rounded-lg p-4">
                                            <h4 class="font-semibold mb-2">Legacy Download</h4>
                                            <p class="text-gray-600 text-sm mb-4">Previous public site package</p>
                                            <a href="/public-download.zip" download class="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors inline-block">Legacy ZIP</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div id="backup-status" class="mt-6 p-4 bg-gray-50 rounded-lg" style="display: none;">
                                    <h4 class="font-semibold mb-2">Backup Status</h4>
                                    <div id="status-content">Loading...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function showPrivacyPolicy() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 mb-4">Last updated: June 23, 2025</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
                                <p class="mb-4">We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
                                <p class="mb-4">We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">3. Information Sharing</h2>
                                <p class="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information in certain limited circumstances as outlined in this policy.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
                                <p class="mb-4">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
                                <p class="mb-4">Under GDPR, you have the right to access, rectify, erase, restrict processing, and port your personal data. You also have the right to object to processing and withdraw consent.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">6. Contact Information</h2>
                                <p class="mb-4">For any privacy-related questions or requests, please contact:</p>
                                <p class="mb-2"><strong>O. Francisca</strong></p>
                                <p class="mb-2">Phone/WhatsApp: +31 628073996</p>
                                <p class="mb-4">Email: consultant@contentscale.site</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function showTermsOfService() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 mb-4">Last updated: June 23, 2025</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
                                <p class="mb-4">By accessing and using ContentScale Platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">2. Use License</h2>
                                <p class="mb-4">Permission is granted to use our services for personal and commercial purposes under the terms specified in your service agreement.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">3. Service Description</h2>
                                <p class="mb-4">ContentScale Platform provides AI-powered content generation and business consulting services. Services are provided "as is" without warranty of any kind.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">4. Payment Terms</h2>
                                <p class="mb-4">Pricing is as displayed on our platform. First article is free, subsequent content generation requires payment or API key integration.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">5. Limitation of Liability</h2>
                                <p class="mb-4">In no event shall ContentScale Platform or its suppliers be liable for any damages arising out of the use or inability to use our services.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">6. Contact Information</h2>
                                <p class="mb-4">For questions about these Terms of Service, please contact:</p>
                                <p class="mb-2"><strong>O. Francisca</strong></p>
                                <p class="mb-2">Phone/WhatsApp: +31 628073996</p>
                                <p class="mb-4">Email: consultant@contentscale.site</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function showCookiePolicy() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <h1 class="text-3xl font-bold mb-6">Cookie Policy</h1>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 mb-4">Last updated: June 23, 2025</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">1. What Are Cookies</h2>
                                <p class="mb-4">Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">2. Types of Cookies We Use</h2>
                                <ul class="list-disc pl-6 mb-4">
                                    <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                                    <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                                </ul>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">3. Managing Cookies</h2>
                                <p class="mb-4">You can control and manage cookies in various ways. Most browsers allow you to refuse cookies or delete existing cookies.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">4. Third-Party Cookies</h2>
                                <p class="mb-4">Some cookies are placed by third-party services that appear on our pages, such as analytics providers.</p>
                                
                                <h2 class="text-xl font-semibold mt-6 mb-3">5. Contact Information</h2>
                                <p class="mb-4">For questions about our use of cookies, please contact:</p>
                                <p class="mb-2"><strong>O. Francisca</strong></p>
                                <p class="mb-2">Phone/WhatsApp: +31 628073996</p>
                                <p class="mb-4">Email: consultant@contentscale.site</p>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function navigateTo(path) {
            history.pushState(null, '', path);
            handleRoute();
        }
        
        function showHomePage() {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = getHomePageContent();
        }
        
        function getHomePageContent() {
            return \`
                <!-- Landing Page Content -->
                <div class="gradient-bg text-white py-20">
                    <div class="max-w-7xl mx-auto px-4 text-center">
                        <h1 class="text-4xl md:text-6xl font-bold mb-4">ContentScale Platform</h1>
                        <p class="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
                            AI-powered content generation and professional business consulting in one platform. 
                            Create SEO-optimized content and get expert business insights.
                        </p>
                        
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/content-writer" onclick="navigateTo('/content-writer')" class="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Start Writing Content
                            </a>
                            <a href="/consultation" onclick="navigateTo('/consultation')" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
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
                            <a href="/admin/download" onclick="navigateTo('/admin/download')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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
                            <a href="/consultation" onclick="navigateTo('/consultation')" class="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Start Your Free Consultation
                            </a>
                            <p class="text-sm text-gray-600">
                                Contact: O. Francisca • +31 628073996
                            </p>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function selectConsultingArea(area) {
            const mainContent = document.getElementById('main-content');
            const areaNames = {
                'seo': 'SEO Consulting',
                'business_strategy': 'Business Strategy',
                'financial': 'Financial Consulting',
                'marketing': 'Marketing Strategy',
                'operations': 'Operations Consulting',
                'cybersecurity': 'Cybersecurity Consulting',
                'hr': 'HR Consulting',
                'it': 'IT Consulting',
                'legal': 'Legal Consulting',
                'sales': 'Sales Consulting',
                'customer_experience': 'Customer Experience',
                'sustainability': 'Sustainability Consulting'
            };
            
            mainContent.innerHTML = \`
                <div class="min-h-screen bg-gray-50 py-12">
                    <div class="max-w-4xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg p-8">
                            <div class="mb-6">
                                <button onclick="showConsultation()" class="text-blue-600 hover:underline mb-4">← Back to All Categories</button>
                                <h1 class="text-3xl font-bold mb-2">\${areaNames[area]}</h1>
                                <p class="text-gray-600">Request expert consultation in this specialized area</p>
                            </div>
                            
                            <form class="space-y-6" onsubmit="submitConsultationRequest(event, '\${area}')">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                    <input type="text" name="businessName" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Enter your business name" required>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                    <select name="industry" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                        <option value="">Select your industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="finance">Finance</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="education">Education</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                                    <textarea name="description" rows="4" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Describe your business and current situation" required></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Specific Challenges</label>
                                    <textarea name="challenges" rows="3" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="What specific challenges are you facing?" required></textarea>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Your Goals</label>
                                    <textarea name="goals" rows="3" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="What do you hope to achieve?" required></textarea>
                                </div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                                        <select name="timeline" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                            <option value="">Select timeline</option>
                                            <option value="immediate">Immediate (1-2 weeks)</option>
                                            <option value="short">Short-term (1-3 months)</option>
                                            <option value="medium">Medium-term (3-6 months)</option>
                                            <option value="long">Long-term (6+ months)</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                                        <select name="budget" class="w-full p-3 border border-gray-300 rounded-lg" required>
                                            <option value="">Select budget</option>
                                            <option value="small">€500 - €2,000</option>
                                            <option value="medium">€2,000 - €5,000</option>
                                            <option value="large">€5,000 - €10,000</option>
                                            <option value="enterprise">€10,000+</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="email" name="email" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Your email address" required>
                                        <input type="tel" name="phone" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Your phone number" required>
                                    </div>
                                </div>
                                
                                <div class="text-center">
                                    <button type="submit" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                                        Submit Consultation Request
                                    </button>
                                    <p class="text-gray-600 text-sm mt-2">O. Francisca will contact you within 24 hours</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            \`;
        }
        
        function startGeneralConsultation() {
            selectConsultingArea('business_strategy');
        }
        
        function submitConsultationRequest(event, category) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());
            
            // Show success message
            alert('Consultation request submitted successfully! O. Francisca will contact you within 24 hours at: +31 628073996');
            
            // Reset form
            event.target.reset();
        }
        
        function acceptCookies() {
            localStorage.setItem('cookies-accepted', 'true');
            document.getElementById('cookie-banner').style.display = 'none';
        }
        
        function showCookieSettings() {
            navigateTo('/cookies');
            acceptCookies();
        }
        
        function downloadBackup(type) {
            const adminKey = sessionStorage.getItem('adminKey');
            if (!adminKey) {
                alert('Admin authentication required');
                return;
            }
            
            const urls = {
                'complete': '/backup/complete',
                'github': '/backup/github', 
                'replit': '/backup/replit'
            };
            
            if (urls[type]) {
                window.location.href = urls[type] + '?key=' + adminKey;
            } else {
                alert('Invalid backup type');
            }
        }
        
        async function showBackupStatus() {
            const adminKey = sessionStorage.getItem('adminKey');
            const statusDiv = document.getElementById('backup-status');
            const contentDiv = document.getElementById('status-content');
            
            try {
                const response = await fetch('/backup/status?key=' + adminKey);
                const data = await response.json();
                
                contentDiv.innerHTML = \`
                    <div style="margin-top: 1rem;">
                        <p><strong>Timestamp:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
                        <p><strong>Project Size:</strong> \${data.projectSize}</p>
                        <p><strong>Available Backups:</strong> \${data.availableBackups.join(', ')}</p>
                        <div style="margin-top: 1rem;">
                            <p><strong>Backup Contents:</strong></p>
                            <ul style="margin-left: 2rem; list-style: disc;">
                                <li><strong>Complete:</strong> \${data.includedPaths.complete.join(', ')}</li>
                                <li><strong>GitHub:</strong> \${data.includedPaths.github.join(', ')}</li>
                                <li><strong>Replit:</strong> \${data.includedPaths.replit.join(', ')}</li>
                            </ul>
                        </div>
                    </div>
                \`;
                
                statusDiv.style.display = 'block';
            } catch (error) {
                contentDiv.innerHTML = '<p class="text-red-600">Error loading backup status</p>';
                statusDiv.style.display = 'block';
            }
        }
        
        function generateContent() {
            alert('Content generation feature requires API integration. Contact O. Francisca at +31 628073996 for setup and pricing information.');
        }
        
        // Handle navigation
        window.addEventListener('popstate', handleRoute);
        document.addEventListener('DOMContentLoaded', function() {
            handleRoute();
            
            // Show cookie banner if not accepted
            if (!localStorage.getItem('cookies-accepted')) {
                document.getElementById('cookie-banner').style.display = 'block';
            }
        });
        
        // Handle navigation clicks
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('onclick')) {
                e.preventDefault();
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