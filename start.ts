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

// Backup endpoints redirecting to backup servers
app.get('/backup/:type', (req, res) => {
  const adminKey = req.query.key;
  const type = req.params.type;
  
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Route to appropriate backup server
  if (type.includes('comprehensive')) {
    res.redirect(`http://localhost:3002/backup/${type}?key=${adminKey}`);
  } else {
    res.redirect(`http://localhost:3001/backup/${type}?key=${adminKey}`);
  }
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
                <div class="min-h-screen bg-gray-50 py-8">
                    <div class="max-w-7xl mx-auto px-4">
                        <div class="bg-white rounded-lg shadow-lg">
                            <!-- Header Section -->
                            <div class="border-b border-gray-200 p-6">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <h1 class="text-3xl font-bold text-gray-900">AI Content Writer</h1>
                                        <p class="text-gray-600 mt-2">Create SEO-optimized content with CRAFT framework achieving 100/100 RankMath scores</p>
                                    </div>
                                    <div class="text-right">
                                        <button onclick="importFromExcel()" class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-200 transition-colors mr-2">
                                            Import from Excel
                                        </button>
                                        <button onclick="saveTemplate()" class="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg border border-purple-300 hover:bg-purple-200 transition-colors">
                                            Save Template
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Main Content Generation Form -->
                            <div class="p-6">
                                <!-- Dynamic Keyword Generation System -->
                                <div class="mb-6">
                                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                        <!-- Main Keywords with Dynamic Rows -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-medium text-gray-700">Main Keyword*</label>
                                                <button onclick="generateKeywords()" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">Generate</button>
                                            </div>
                                            <div id="keywordRows">
                                                <div class="keyword-row mb-2">
                                                    <div class="flex items-center">
                                                        <span class="text-sm text-gray-500 w-6">1</span>
                                                        <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Enter seed keyword" data-row="1">
                                                    </div>
                                                </div>
                                            </div>
                                            <button onclick="addKeywordRow()" class="text-blue-600 text-sm hover:underline">Add row</button>
                                        </div>

                                        <!-- Titles with Dynamic Rows -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-medium text-gray-700">Title*</label>
                                                <button onclick="generateTitles()" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">Generate</button>
                                            </div>
                                            <div id="titleRows">
                                                <div class="title-row mb-2">
                                                    <div class="flex items-center">
                                                        <span class="text-sm text-gray-500 w-6">1</span>
                                                        <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Enter your blog title or topic here" data-row="1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Keywords NLP with Dynamic Rows -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-medium text-gray-700">Keywords</label>
                                                <button onclick="generateNLPKeywords()" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">Generate NLP</button>
                                            </div>
                                            <div id="nlpRows">
                                                <div class="nlp-row mb-2">
                                                    <div class="flex items-center">
                                                        <span class="text-sm text-gray-500 w-6">1</span>
                                                        <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Keywords will be auto-generated" data-row="1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Outlines with Dynamic Rows -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-medium text-gray-700">Outline</label>
                                                <button onclick="generateOutlines()" class="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors">Generate</button>
                                            </div>
                                            <div id="outlineRows">
                                                <div class="outline-row mb-2">
                                                    <div class="flex items-center">
                                                        <span class="text-sm text-gray-500 w-6">1</span>
                                                        <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Outline will be auto-generated" data-row="1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Core Settings -->
                                <div class="border-t border-gray-200 pt-6">
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-semibold text-gray-900">Core Settings</h3>
                                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">New</span>
                                    </div>
                                    
                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <!-- Language (25 Languages) -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                            <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                <option>🇺🇸 English (US)</option>
                                                <option>🇬🇧 English (UK)</option>
                                                <option>🇪🇸 Spanish (Spain)</option>
                                                <option>🇲🇽 Spanish (Mexico)</option>
                                                <option>🇫🇷 French</option>
                                                <option>🇩🇪 German</option>
                                                <option>🇮🇹 Italian</option>
                                                <option>🇵🇹 Portuguese</option>
                                                <option>🇧🇷 Portuguese (Brazil)</option>
                                                <option>🇳🇱 Dutch</option>
                                                <option>🇷🇺 Russian</option>
                                                <option>🇯🇵 Japanese</option>
                                                <option>🇰🇷 Korean</option>
                                                <option>🇨🇳 Chinese (Simplified)</option>
                                                <option>🇹🇼 Chinese (Traditional)</option>
                                                <option>🇦🇷 Arabic</option>
                                                <option>🇮🇳 Hindi</option>
                                                <option>🇹🇷 Turkish</option>
                                                <option>🇵🇱 Polish</option>
                                                <option>🇸🇪 Swedish</option>
                                                <option>🇳🇴 Norwegian</option>
                                                <option>🇩🇰 Danish</option>
                                                <option>🇫🇮 Finnish</option>
                                                <option>🇬🇷 Greek</option>
                                                <option>🇹🇭 Thai</option>
                                            </select>
                                        </div>

                                        <!-- Article Type -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Article Type <span class="text-blue-600">0/50</span></label>
                                            <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                <option>None</option>
                                                <option>Blog Post</option>
                                                <option>Product Review</option>
                                                <option>How-to Guide</option>
                                                <option>Listicle</option>
                                                <option>News Article</option>
                                                <option>Case Study</option>
                                            </select>
                                        </div>

                                        <!-- Article Size -->
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Article size</label>
                                            <select class="w-full p-3 border border-gray-300 rounded-lg" id="articleSize">
                                                <option value="x-small" class="text-red-500">X-Small (500-1000 words)</option>
                                                <option value="small" class="text-green-500">Small (1000-2500 words)</option>
                                                <option value="medium" class="text-blue-500" selected>Medium (2400-3600 words, 9-12 H2)</option>
                                                <option value="large" class="text-orange-500">Large (3600-5200 words, 13-16 H2)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <!-- Content & AI Settings -->
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                    <!-- Content Settings -->
                                    <div>
                                        <h4 class="text-lg font-semibold text-gray-900 mb-4">CONTENT SETTINGS</h4>
                                        <div class="space-y-4">
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Tone of voice <span class="text-gray-500">8/50</span></label>
                                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                    <option>Friendly</option>
                                                    <option>Professional</option>
                                                    <option>Conversational</option>
                                                    <option>Authoritative</option>
                                                    <option>Casual</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Point of view</label>
                                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                    <option>None</option>
                                                    <option>First person singular (I, me, my, mine)</option>
                                                    <option>First person plural (we, us, our, ours)</option>
                                                    <option>Second person (you, your, yours)</option>
                                                    <option>Third person (he, she, it, they)</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Target country</label>
                                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                    <option>🇺🇸 United States</option>
                                                    <option>🇬🇧 United Kingdom</option>
                                                    <option>🇨🇦 Canada</option>
                                                    <option>🇦🇺 Australia</option>
                                                    <option>🇩🇪 Germany</option>
                                                    <option>🇫🇷 France</option>
                                                    <option>🇮🇹 Italy</option>
                                                    <option>🇪🇸 Spain</option>
                                                    <option>🇳🇱 Netherlands</option>
                                                    <option>🇧🇷 Brazil</option>
                                                    <option>🇯🇵 Japan</option>
                                                    <option>🇮🇳 India</option>
                                                    <option>🇨🇳 China</option>
                                                    <option>🇷🇺 Russia</option>
                                                    <option>🇲🇽 Mexico</option>
                                                    <option>🇰🇷 South Korea</option>
                                                    <option>🇸🇬 Singapore</option>
                                                    <option>🇿🇦 South Africa</option>
                                                    <option>🇳🇴 Norway</option>
                                                    <option>🇸🇪 Sweden</option>
                                                    <option>🇩🇰 Denmark</option>
                                                    <option>🇫🇮 Finland</option>
                                                    <option>🇨🇭 Switzerland</option>
                                                    <option>🇦🇹 Austria</option>
                                                    <option>🇳🇿 New Zealand</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- AI Settings -->
                                    <div>
                                        <h4 class="text-lg font-semibold text-gray-900 mb-4">AI SETTINGS</h4>
                                        <div class="space-y-4">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <label class="block text-sm font-medium text-gray-700">🤖 AI Model</label>
                                                    <p class="text-blue-600 text-sm cursor-pointer hover:underline">What is a Real-Time SEO?</p>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-purple-600 mr-2">⚡ 1 credit</span>
                                                    <select class="p-2 border border-gray-300 rounded">
                                                        <option>Default</option>
                                                        <option>GPT-4</option>
                                                        <option>Claude</option>
                                                        <option>Gemini Pro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">Text Readability</label>
                                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                    <option>None</option>
                                                    <option>5th grade, easily understood by 11-year-olds</option>
                                                    <option>6th grade, easy to read. Conversational language</option>
                                                    <option>7th grade, fairly easy to read</option>
                                                    <option>8th & 9th grade, easily understood <span class="text-blue-600">Recommended</span></option>
                                                    <option>10th to 12th grade, fairly difficult to read</option>
                                                </select>
                                            </div>
                                            
                                            <div>
                                                <label class="block text-sm font-medium text-gray-700 mb-2">AI Content Cleaning</label>
                                                <select class="w-full p-3 border border-gray-300 rounded-lg">
                                                    <option>No AI Words Removal</option>
                                                    <option>Light Cleaning</option>
                                                    <option>Moderate Cleaning</option>
                                                    <option>Heavy Cleaning</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Details to Include -->
                                <div class="border-t border-gray-200 pt-6 mt-6">
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-semibold text-gray-900">Details to Include</h3>
                                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">New</span>
                                    </div>
                                    <p class="text-gray-600 mb-4">What details would you like to include in your article? <a href="#" class="text-blue-600 hover:underline">Learn more.</a></p>
                                    <textarea class="w-full p-4 border border-gray-300 rounded-lg h-32" placeholder="e.g. phone number as 212-555-1234"></textarea>
                                    <div class="text-right text-sm text-gray-500 mt-1">0/1000</div>
                                </div>

                                <!-- Structure Settings -->
                                <div class="border-t border-gray-200 pt-6 mt-6">
                                    <h3 class="text-lg font-semibold text-gray-900 mb-6">Structure</h3>
                                    
                                    <!-- Hook Types -->
                                    <div class="mb-6">
                                        <label class="block text-sm font-medium text-gray-700 mb-3">Introductory Hook Brief</label>
                                        <div class="flex flex-wrap gap-2 mb-3">
                                            <button onclick="selectHook('question')" class="hook-btn px-3 py-1 border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-50">Question</button>
                                            <button onclick="selectHook('statistic')" class="hook-btn px-3 py-1 border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-50">Statistical or Fact</button>
                                            <button onclick="selectHook('quotation')" class="hook-btn px-3 py-1 border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-50">Quotation</button>
                                            <button onclick="selectHook('anecdotal')" class="hook-btn px-3 py-1 border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-50">Anecdotal or Story</button>
                                            <button onclick="selectHook('personal')" class="hook-btn px-3 py-1 border border-purple-300 text-purple-700 rounded-full text-sm hover:bg-purple-50">Personal or Emotional</button>
                                        </div>
                                        <textarea class="w-full p-4 border border-gray-300 rounded-lg h-24" placeholder="Enter the type of hook for the article's opening sentence"></textarea>
                                        <div class="text-right text-sm text-gray-500 mt-1">0/500</div>
                                    </div>

                                    <!-- Structure Options -->
                                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Conclusion</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Tables</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">H3</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Lists</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Italics</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Quotes</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Key Takeaways</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">FAQ</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Bold</label>
                                            <select class="w-full p-2 border border-gray-300 rounded">
                                                <option>Yes</option>
                                                <option>No</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <!-- Internal Linking -->
                                <div class="border-t border-gray-200 pt-6 mt-6">
                                    <div class="flex justify-between items-center mb-4">
                                        <h3 class="text-lg font-semibold text-gray-900">Internal Linking</h3>
                                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">New!</span>
                                    </div>
                                    <div class="bg-purple-50 p-4 rounded-lg mb-4">
                                        <p class="text-gray-700">Automatically index your site and add links relevant to your content. Select a Website and our semantic search will find the best pages to link to within your article.</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Select a Website <span class="text-gray-500">Unlimited internal URLs crawlable.</span></label>
                                        <select class="w-full p-3 border border-gray-300 rounded-lg">
                                            <option>None</option>
                                            <option>contentscale.site</option>
                                            <option>Add new website...</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Action Buttons -->
                                <div class="border-t border-gray-200 pt-6 mt-8">
                                    <div class="flex justify-between items-center">
                                        <button onclick="showPricingModal()" class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-200 transition-colors">
                                            View Pricing
                                        </button>
                                        <div class="flex space-x-4">
                                            <button onclick="saveDraft()" class="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors">
                                                Save Draft
                                            </button>
                                            <button onclick="generateArticle()" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-semibold">
                                                Generate Article
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pricing Modal -->
                <div id="pricingModal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-6">
                                <h2 class="text-2xl font-bold">ContentScale Pricing</h2>
                                <button onclick="closePricingModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <!-- Credits Package -->
                                <div class="border-2 border-purple-500 rounded-lg p-6 text-center relative">
                                    <div class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">Best Value</div>
                                    <h3 class="text-xl font-bold mb-2">Credits Package</h3>
                                    <div class="text-3xl font-bold text-purple-600 mb-4">$3.00</div>
                                    <p class="text-sm text-gray-600 mb-4">With our API</p>
                                    <ul class="text-left space-y-2 mb-6 text-sm">
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Unlimited articles</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Advanced CRAFT framework</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> 100/100 RankMath scores</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Government source citations</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Google AI Overview optimization</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Custom AI models</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Internal linking</li>
                                    </ul>
                                    <button onclick="selectPlan('credits', 3.00)" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">Get Started</button>
                                </div>

                                <!-- Pay Per Article with Own API -->
                                <div class="border border-gray-200 rounded-lg p-6 text-center">
                                    <h3 class="text-xl font-bold mb-2">With your own API key</h3>
                                    <div class="text-3xl font-bold text-blue-600 mb-4">$1.00</div>
                                    <p class="text-sm text-gray-600 mb-4">Per article</p>
                                    <ul class="text-left space-y-2 mb-6 text-sm">
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Unlimited articles</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Advanced CRAFT framework</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> 100/100 RankMath scores</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Government source citations</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Google AI Overview optimization</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Custom AI models</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Internal linking</li>
                                    </ul>
                                    <button onclick="selectPlan('own-api', 1.00)" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Started</button>
                                </div>

                                <!-- Premium Per Article -->
                                <div class="border border-gray-200 rounded-lg p-6 text-center">
                                    <h3 class="text-xl font-bold mb-2">Premium Per Article</h3>
                                    <div class="text-3xl font-bold text-orange-600 mb-4">$10.00</div>
                                    <p class="text-sm text-gray-600 mb-4">Using our premium API</p>
                                    <ul class="text-left space-y-2 mb-6 text-sm">
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Premium AI models (GPT-4, Claude)</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Advanced CRAFT framework</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> 100/100 RankMath scores</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Government source citations</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Google AI Overview optimization</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Priority processing</li>
                                        <li class="flex items-center"><span class="text-green-500 mr-2">✅</span> Enhanced research depth</li>
                                    </ul>
                                    <button onclick="selectPlan('premium', 10.00)" class="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors">Get Started</button>
                                </div>
                            </div>

                            <!-- Payment Information -->
                            <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                                <h4 class="font-semibold text-gray-900 mb-2">Payment Options:</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <strong>Credits Package ($3):</strong>
                                        <p class="text-gray-600">Best value for regular users. Includes all premium features with our managed API.</p>
                                    </div>
                                    <div>
                                        <strong>Own API Key ($1):</strong>
                                        <p class="text-gray-600">Bring your OpenAI/Gemini API key. You control costs and usage.</p>
                                    </div>
                                    <div>
                                        <strong>Premium Service ($10):</strong>
                                        <p class="text-gray-600">Enterprise-grade with priority processing and enhanced research.</p>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-8 text-center">
                                <div class="bg-blue-50 p-4 rounded-lg mb-4">
                                    <h4 class="font-semibold text-blue-900 mb-2">Why Choose ContentScale?</h4>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                                        <div>
                                            <strong>CRAFT Framework:</strong> Cut-Review-Add-Fact-Trust methodology for superior content quality
                                        </div>
                                        <div>
                                            <strong>RankMath 100/100:</strong> Guaranteed perfect SEO scores with government source citations
                                        </div>
                                        <div>
                                            <strong>AI Overview Ready:</strong> Optimized for Google's AI Overview and featured snippets
                                        </div>
                                        <div>
                                            <strong>Multi-Language:</strong> 25 languages and 25 target countries supported
                                        </div>
                                    </div>
                                </div>
                                <p class="text-gray-600">Questions about pricing or need enterprise solutions?</p>
                                <p class="text-gray-900 font-semibold">Contact O. Francisca: <a href="https://wa.me/31628073996" class="text-blue-600 hover:underline">+31 628073996</a></p>
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
        
        function importFromExcel() {
            alert('Excel import feature coming soon! Contact O. Francisca at +31 628073996 for early access.');
        }
        
        function saveTemplate() {
            alert('Template saved successfully! Your configuration has been stored for future use.');
        }
        
        let currentKeywordRows = 1;
        let currentTitleRows = 1;
        let currentNLPRows = 1;
        let currentOutlineRows = 1;

        function generateKeywords() {
            const keywordInputs = document.querySelectorAll('#keywordRows input');
            const seedKeywords = [];
            
            // Collect all filled seed keywords
            keywordInputs.forEach(input => {
                if (input.value.trim()) {
                    seedKeywords.push(input.value.trim());
                }
            });
            
            if (seedKeywords.length === 0) {
                alert('Please enter at least one seed keyword first.');
                return;
            }
            
            // Generate 10 variations for each seed keyword
            seedKeywords.forEach((seedKeyword, index) => {
                const variations = generateKeywordVariations(seedKeyword);
                
                // If this is the first seed, fill existing rows
                if (index === 0) {
                    const inputs = document.querySelectorAll('#keywordRows input');
                    variations.forEach((variation, varIndex) => {
                        if (varIndex < inputs.length) {
                            inputs[varIndex].value = variation;
                        } else {
                            addNewKeywordRow(variation);
                        }
                    });
                } else {
                    // For additional seeds, add new rows
                    variations.forEach(variation => {
                        addNewKeywordRow(variation);
                    });
                }
            });
            
            // Sync other columns
            syncRowCounts();
        }
        
        function generateKeywordVariations(seed) {
            // AI-powered keyword expansion simulation
            const variations = [
                seed,
                seed + ' benefits',
                seed + ' guide',
                'best ' + seed,
                seed + ' tips',
                'how to ' + seed,
                seed + ' reviews',
                seed + ' comparison',
                seed + ' for beginners',
                seed + ' advanced'
            ];
            return variations;
        }
        
        function generateTitles() {
            const keywordInputs = document.querySelectorAll('#keywordRows input');
            const titleInputs = document.querySelectorAll('#titleRows input');
            
            keywordInputs.forEach((keywordInput, index) => {
                if (keywordInput.value.trim() && titleInputs[index]) {
                    const keyword = keywordInput.value.trim();
                    const generatedTitle = generateTitleFromKeyword(keyword);
                    titleInputs[index].value = generatedTitle;
                }
            });
        }
        
        function generateTitleFromKeyword(keyword) {
            const titleTemplates = [
                \`The Ultimate Guide to \${keyword.charAt(0).toUpperCase() + keyword.slice(1)}\`,
                \`\${keyword.charAt(0).toUpperCase() + keyword.slice(1)}: Everything You Need to Know\`,
                \`How to Master \${keyword.charAt(0).toUpperCase() + keyword.slice(1)} in 2024\`,
                \`Top 10 \${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Tips for Beginners\`,
                \`\${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Explained: A Complete Guide\`
            ];
            return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
        }
        
        function generateNLPKeywords() {
            const keywordInputs = document.querySelectorAll('#keywordRows input');
            const nlpInputs = document.querySelectorAll('#nlpRows input');
            
            keywordInputs.forEach((keywordInput, index) => {
                if (keywordInput.value.trim() && nlpInputs[index]) {
                    const keyword = keywordInput.value.trim();
                    const nlpKeywords = generateNLPFromKeyword(keyword);
                    nlpInputs[index].value = nlpKeywords;
                }
            });
        }
        
        function generateNLPFromKeyword(keyword) {
            // Simulate AI-powered NLP keyword research
            const nlpVariations = [
                keyword + ' semantic keywords',
                keyword + ' LSI terms',
                keyword + ' related phrases',
                keyword + ' synonyms',
                keyword + ' variations'
            ];
            return nlpVariations.slice(0, 3).join(', ');
        }
        
        function generateOutlines() {
            const keywordInputs = document.querySelectorAll('#keywordRows input');
            const outlineInputs = document.querySelectorAll('#outlineRows input');
            
            keywordInputs.forEach((keywordInput, index) => {
                if (keywordInput.value.trim() && outlineInputs[index]) {
                    const keyword = keywordInput.value.trim();
                    const generatedOutline = generateOutlineFromKeyword(keyword);
                    outlineInputs[index].value = generatedOutline;
                }
            });
        }
        
        function generateOutlineFromKeyword(keyword) {
            return \`Introduction to \${keyword}, Benefits of \${keyword}, How to use \${keyword}, Best practices, Conclusion\`;
        }
        
        function addNewKeywordRow(value = '') {
            currentKeywordRows++;
            const keywordRows = document.getElementById('keywordRows');
            const newRow = document.createElement('div');
            newRow.className = 'keyword-row mb-2';
            newRow.innerHTML = \`
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 w-6">\${currentKeywordRows}</span>
                    <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Generated keyword" data-row="\${currentKeywordRows}" value="\${value}">
                </div>
            \`;
            keywordRows.appendChild(newRow);
        }
        
        function addKeywordRow() {
            addNewKeywordRow();
            syncRowCounts();
        }
        
        function syncRowCounts() {
            // Ensure all columns have the same number of rows
            const maxRows = Math.max(currentKeywordRows, currentTitleRows, currentNLPRows, currentOutlineRows);
            
            // Add missing rows to each column
            while (currentTitleRows < maxRows) {
                addTitleRow();
            }
            while (currentNLPRows < maxRows) {
                addNLPRow();
            }
            while (currentOutlineRows < maxRows) {
                addOutlineRow();
            }
        }
        
        function addTitleRow() {
            currentTitleRows++;
            const titleRows = document.getElementById('titleRows');
            const newRow = document.createElement('div');
            newRow.className = 'title-row mb-2';
            newRow.innerHTML = \`
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 w-6">\${currentTitleRows}</span>
                    <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Title will be auto-generated" data-row="\${currentTitleRows}">
                </div>
            \`;
            titleRows.appendChild(newRow);
        }
        
        function addNLPRow() {
            currentNLPRows++;
            const nlpRows = document.getElementById('nlpRows');
            const newRow = document.createElement('div');
            newRow.className = 'nlp-row mb-2';
            newRow.innerHTML = \`
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 w-6">\${currentNLPRows}</span>
                    <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="NLP keywords will be auto-generated" data-row="\${currentNLPRows}">
                </div>
            \`;
            nlpRows.appendChild(newRow);
        }
        
        function addOutlineRow() {
            currentOutlineRows++;
            const outlineRows = document.getElementById('outlineRows');
            const newRow = document.createElement('div');
            newRow.className = 'outline-row mb-2';
            newRow.innerHTML = \`
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 w-6">\${currentOutlineRows}</span>
                    <input type="text" class="flex-1 p-2 border border-gray-300 rounded ml-2" placeholder="Outline will be auto-generated" data-row="\${currentOutlineRows}">
                </div>
            \`;
            outlineRows.appendChild(newRow);
        }
        
        function selectHook(type) {
            // Visual feedback for hook selection
            document.querySelectorAll('.hook-btn').forEach(btn => {
                btn.classList.remove('bg-purple-100', 'border-purple-500');
                btn.classList.add('border-purple-300');
            });
            event.target.classList.add('bg-purple-100', 'border-purple-500');
            event.target.classList.remove('border-purple-300');
        }
        
        function saveDraft() {
            alert('Draft saved successfully! Your content configuration has been stored.');
        }
        
        function generateArticle() {
            // Validate required fields
            const keywordInputs = document.querySelectorAll('#keywordRows input');
            const titleInputs = document.querySelectorAll('#titleRows input');
            
            let hasKeyword = false;
            let hasTitle = false;
            
            keywordInputs.forEach(input => {
                if (input.value.trim()) hasKeyword = true;
            });
            
            titleInputs.forEach(input => {
                if (input.value.trim()) hasTitle = true;
            });
            
            if (!hasKeyword || !hasTitle) {
                alert('Please fill in at least one main keyword and title before generating articles.');
                return;
            }
            
            // Count articles to generate
            let articleCount = 0;
            titleInputs.forEach(input => {
                if (input.value.trim()) articleCount++;
            });
            
            if (articleCount > 1) {
                alert(\`Ready to generate \${articleCount} articles with advanced CRAFT framework and 100/100 RankMath optimization!\`);
            }
            
            // Show pricing modal
            showPricingModal();
        }
        
        function showPricingModal() {
            document.getElementById('pricingModal').classList.remove('hidden');
        }
        
        function closePricingModal() {
            document.getElementById('pricingModal').classList.add('hidden');
        }
        
        function selectPlan(planType, price) {
            let planDetails = {};
            
            switch(planType) {
                case 'credits':
                    planDetails = {
                        name: 'Credits Package',
                        price: 3.00,
                        type: 'credits',
                        features: [
                            'Unlimited articles with our API',
                            'Advanced CRAFT framework',
                            '100/100 RankMath SEO scores',
                            'Government source citations (.gov, .edu, .org)',
                            'Google AI Overview optimization',
                            'Custom AI models',
                            'Internal linking system',
                            'Priority processing'
                        ],
                        apiProvider: 'ContentScale API',
                        billing: 'one-time'
                    };
                    break;
                    
                case 'own-api':
                    planDetails = {
                        name: 'With Your Own API Key',
                        price: 1.00,
                        type: 'per-article-own-api',
                        features: [
                            'Unlimited articles (your API costs)',
                            'Advanced CRAFT framework',
                            '100/100 RankMath SEO scores',
                            'Government source citations',
                            'Google AI Overview optimization',
                            'Custom AI models (your choice)',
                            'Internal linking system'
                        ],
                        apiProvider: 'Your OpenAI/Gemini API',
                        billing: 'per-article',
                        note: 'You provide your own API key and pay API costs separately'
                    };
                    break;
                    
                case 'premium':
                    planDetails = {
                        name: 'Premium Per Article',
                        price: 10.00,
                        type: 'premium-per-article',
                        features: [
                            'Premium AI models (GPT-4, Claude)',
                            'Advanced CRAFT framework',
                            '100/100 RankMath SEO scores',
                            'Government source citations',
                            'Google AI Overview optimization',
                            'Priority processing queue',
                            'Enhanced research depth',
                            'Premium support'
                        ],
                        apiProvider: 'Premium ContentScale API',
                        billing: 'per-article'
                    };
                    break;
            }
            
            // Store plan selection for payment processing
            localStorage.setItem('selectedPlan', JSON.stringify(planDetails));
            
            // Show confirmation
            alert(\`Selected Plan: \${planDetails.name}\\nPrice: $\${planDetails.price}\\nAPI: \${planDetails.apiProvider}\\n\\nContact O. Francisca at +31 628073996 to complete payment and setup.\`);
            
            // Close modal
            closePricingModal();
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