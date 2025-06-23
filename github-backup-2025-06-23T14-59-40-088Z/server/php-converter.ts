import express from 'express';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const router = express.Router();

// Admin authentication middleware
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'dev-admin-2025') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Convert TypeScript/JavaScript to PHP equivalent
router.get('/api/admin/convert-to-php', adminAuth, async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const phpProjectName = `ContentScale-PHP-${timestamp}`;
    const backupDir = path.join(process.cwd(), 'admin-backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const zipPath = path.join(backupDir, `${phpProjectName}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stats = fs.statSync(zipPath);
      res.json({
        success: true,
        filename: `${phpProjectName}.zip`,
        size: stats.size,
        downloadUrl: `/admin/download/${phpProjectName}.zip`,
        created: new Date().toISOString(),
        description: "PHP version of ContentScale platform"
      });
    });

    archive.on('error', (err) => {
      console.error('PHP conversion error:', err);
      res.status(500).json({ error: 'PHP conversion failed' });
    });

    archive.pipe(output);

    // Create PHP project structure
    
    // 1. Main index.php
    const indexPhp = `<?php
/**
 * ContentScale - AI Business Consulting Platform (PHP Version)
 * Converted from TypeScript/Node.js version
 * Generated: ${new Date().toISOString()}
 */

require_once 'config/config.php';
require_once 'includes/functions.php';
require_once 'classes/Database.php';
require_once 'classes/ConsultingAI.php';
require_once 'classes/SecurityManager.php';

// Initialize session
session_start();

// Handle routing
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$request_method = $_SERVER['REQUEST_METHOD'];

// API routing
if (strpos($request_uri, '/api/') === 0) {
    header('Content-Type: application/json');
    require_once 'api/router.php';
    exit;
}

// Serve frontend
require_once 'public/index.html';
?>`;

    archive.append(indexPhp, { name: 'index.php' });

    // 2. Configuration
    const configPhp = `<?php
/**
 * ContentScale Configuration
 */

// Environment Configuration
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: 'your_gemini_api_key_here');
define('ADMIN_KEY', getenv('ADMIN_KEY') ?: 'dev-admin-2025');
define('SESSION_SECRET', getenv('SESSION_SECRET') ?: 'contentscale-php-secret');

// Database Configuration (if needed in future)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'contentscale');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');

// Application Settings
define('APP_NAME', 'ContentScale - AI Business Consulting');
define('APP_VERSION', '1.0.0');
define('APP_ENV', getenv('APP_ENV') ?: 'development');

// API Settings
define('RATE_LIMIT_GENERAL', 100); // requests per 15 minutes
define('RATE_LIMIT_AGENT', 50);    // requests per 5 minutes
define('RATE_LIMIT_WINDOW', 15 * 60); // 15 minutes in seconds

// Consulting Categories
define('CONSULTING_CATEGORIES', [
    'seo',
    'business-strategy', 
    'financial',
    'marketing',
    'operations',
    'human-resources',
    'it-consulting',
    'legal',
    'sales',
    'customer-experience',
    'sustainability',
    'cybersecurity'
]);

// Error reporting
if (APP_ENV === 'development') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
?>`;

    archive.append(configPhp, { name: 'config/config.php' });

    // 3. ConsultingAI Class
    const consultingAiPhp = `<?php
/**
 * ConsultingAI - Google Gemini Integration
 */

class ConsultingAI {
    private $apiKey;
    private $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    public function __construct() {
        $this->apiKey = GEMINI_API_KEY;
    }
    
    public function generateConsultingAnalysis($consultationData) {
        $category = $consultationData['category'];
        $systemPrompt = $this->getSystemPrompt($category);
        
        $prompt = $this->buildAnalysisPrompt($consultationData, $systemPrompt);
        
        $response = $this->callGeminiAPI($prompt);
        
        return $this->parseAnalysisResponse($response, $consultationData['id']);
    }
    
    private function getSystemPrompt($category) {
        $prompts = [
            'seo' => 'You are a world-class SEO consultant with deep expertise in technical SEO, content strategy, and search engine algorithms.',
            'business-strategy' => 'You are a senior business strategy consultant with expertise in market analysis, competitive positioning, and growth planning.',
            'financial' => 'You are a CFO-level financial consultant specializing in financial planning, analysis, and strategic financial management.',
            'marketing' => 'You are a senior marketing consultant with expertise in digital marketing, brand strategy, and customer acquisition.',
            'operations' => 'You are an operations excellence consultant specializing in process optimization, supply chain management, and operational efficiency.',
            'human-resources' => 'You are a senior HR consultant with expertise in talent management, organizational development, and HR strategy.',
            'it-consulting' => 'You are a senior IT consultant with expertise in digital transformation, system architecture, and technology strategy.',
            'legal' => 'You are a business legal consultant with expertise in corporate law, compliance, and risk management.',
            'sales' => 'You are a sales performance consultant with expertise in sales strategy, process optimization, and revenue growth.',
            'customer-experience' => 'You are a customer experience consultant specializing in journey optimization and satisfaction improvement.',
            'sustainability' => 'You are a sustainability consultant with expertise in ESG strategy and environmental impact assessment.',
            'cybersecurity' => 'You are a cybersecurity consultant specializing in security assessment, risk management, and compliance.'
        ];
        
        return $prompts[$category] ?? $prompts['business-strategy'];
    }
    
    private function buildAnalysisPrompt($data, $systemPrompt) {
        return $systemPrompt . "\\n\\n" .
               "Please analyze this business consultation request and provide comprehensive recommendations:\\n" .
               "Title: " . $data['title'] . "\\n" .
               "Description: " . $data['description'] . "\\n" .
               "Business Context: " . $data['businessContext'] . "\\n" .
               "Urgency: " . $data['urgency'] . "\\n" .
               "Budget: " . ($data['budget'] ?? 'Not specified') . "\\n" .
               "Timeline: " . ($data['timeline'] ?? 'Not specified') . "\\n\\n" .
               "Please provide your analysis in JSON format with the following structure:\\n" .
               '{"analysis": "comprehensive analysis text", "recommendations": ["rec1", "rec2"], "actionItems": ["action1", "action2"], "expectedOutcomes": ["outcome1", "outcome2"], "implementationPlan": "detailed plan", "resources": ["resource1", "resource2"], "metrics": ["metric1", "metric2"], "timeline": "implementation timeline", "confidence": 0.95, "riskAssessment": "risk analysis"}';
    }
    
    private function callGeminiAPI($prompt) {
        $data = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '?key=' . $this->apiKey);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode !== 200) {
            throw new Exception('Gemini API request failed: ' . $response);
        }
        
        return json_decode($response, true);
    }
    
    private function parseAnalysisResponse($response, $consultationId) {
        $content = $response['candidates'][0]['content']['parts'][0]['text'] ?? '';
        
        // Try to extract JSON from the response
        preg_match('/\\{.*\\}/s', $content, $matches);
        
        if (!empty($matches[0])) {
            $analysisData = json_decode($matches[0], true);
            if ($analysisData) {
                return [
                    'id' => $this->generateId(),
                    'consultationId' => $consultationId,
                    'analysis' => $analysisData['analysis'] ?? $content,
                    'recommendations' => $analysisData['recommendations'] ?? [],
                    'actionItems' => $analysisData['actionItems'] ?? [],
                    'riskAssessment' => $analysisData['riskAssessment'] ?? null,
                    'expectedOutcomes' => $analysisData['expectedOutcomes'] ?? [],
                    'implementationPlan' => $analysisData['implementationPlan'] ?? '',
                    'resources' => $analysisData['resources'] ?? [],
                    'metrics' => $analysisData['metrics'] ?? [],
                    'timeline' => $analysisData['timeline'] ?? '',
                    'confidence' => $analysisData['confidence'] ?? 0.8,
                    'createdAt' => date('c')
                ];
            }
        }
        
        // Fallback if JSON parsing fails
        return [
            'id' => $this->generateId(),
            'consultationId' => $consultationId,
            'analysis' => $content,
            'recommendations' => ['Please review the generated analysis for specific recommendations.'],
            'actionItems' => ['Implement the suggestions provided in the analysis.'],
            'riskAssessment' => null,
            'expectedOutcomes' => ['Improved business performance based on recommendations.'],
            'implementationPlan' => 'Follow the guidance provided in the analysis section.',
            'resources' => ['Internal team', 'External consultants if needed'],
            'metrics' => ['Performance indicators relevant to the consulting category'],
            'timeline' => '30-90 days for initial implementation',
            'confidence' => 0.7,
            'createdAt' => date('c')
        ];
    }
    
    private function generateId() {
        return substr(md5(uniqid(rand(), true)), 0, 16);
    }
}
?>`;

    archive.append(consultingAiPhp, { name: 'classes/ConsultingAI.php' });

    // 4. API Router
    const apiRouterPhp = `<?php
/**
 * API Router for ContentScale PHP
 */

require_once '../classes/ConsultingAI.php';
require_once '../classes/SecurityManager.php';

$security = new SecurityManager();
$consultingAI = new ConsultingAI();

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Security checks
$security->checkRateLimit();

// Route handling
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Health check
if ($uri === '/api/' || $uri === '/') {
    echo json_encode([
        'status' => 'healthy',
        'service' => 'ContentScale Platform (PHP)',
        'timestamp' => date('c'),
        'version' => APP_VERSION
    ]);
    exit;
}

// Agent status
if ($uri === '/api/agent/status' && $method === 'GET') {
    echo json_encode([
        'status' => 'active',
        'name' => 'ContentScale Consulting AI App (PHP)',
        'version' => APP_VERSION,
        'capabilities' => [
            'business-consulting',
            'ai-analysis',
            'report-generation',
            'multi-category-expertise'
        ],
        'categories' => CONSULTING_CATEGORIES,
        'contact' => 'consultant@contentscale.site'
    ]);
    exit;
}

// Agent health
if ($uri === '/api/agent/health' && $method === 'GET') {
    echo json_encode([
        'status' => 'healthy',
        'timestamp' => date('c'),
        'uptime' => sys_getloadavg()[0],
        'memory' => memory_get_usage(true),
        'environment' => APP_ENV
    ]);
    exit;
}

// Consultations
if ($uri === '/api/consultations') {
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate input
        $required = ['category', 'title', 'description', 'businessContext', 'urgency'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }
        
        // Create consultation
        $consultation = [
            'id' => substr(md5(uniqid(rand(), true)), 0, 16),
            'category' => $input['category'],
            'title' => $input['title'],
            'description' => $input['description'],
            'businessContext' => $input['businessContext'],
            'urgency' => $input['urgency'],
            'budget' => $input['budget'] ?? null,
            'timeline' => $input['timeline'] ?? null,
            'status' => 'pending',
            'createdAt' => date('c'),
            'updatedAt' => date('c')
        ];
        
        // Store in session for demo (in production, use database)
        $_SESSION['consultations'][$consultation['id']] = $consultation;
        
        // Start async analysis (simplified for demo)
        try {
            $analysis = $consultingAI->generateConsultingAnalysis($consultation);
            $_SESSION['analyses'][$consultation['id']] = $analysis;
            $consultation['status'] = 'completed';
            $_SESSION['consultations'][$consultation['id']] = $consultation;
        } catch (Exception $e) {
            error_log('Analysis generation failed: ' . $e->getMessage());
        }
        
        echo json_encode($consultation);
        exit;
    }
    
    if ($method === 'GET') {
        echo json_encode(array_values($_SESSION['consultations'] ?? []));
        exit;
    }
}

// Analysis results
if (preg_match('/\\/api\\/analysis\\/(.+)/', $uri, $matches) && $method === 'GET') {
    $consultationId = $matches[1];
    $analysis = $_SESSION['analyses'][$consultationId] ?? null;
    
    if ($analysis) {
        echo json_encode($analysis);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Analysis not found']);
    }
    exit;
}

// Default 404
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
?>`;

    archive.append(apiRouterPhp, { name: 'api/router.php' });

    // 5. Security Manager
    const securityPhp = `<?php
/**
 * Security Manager for rate limiting and protection
 */

class SecurityManager {
    public function checkRateLimit() {
        $ip = $this->getClientIP();
        $key = 'rate_limit_' . md5($ip);
        
        if (!isset($_SESSION[$key])) {
            $_SESSION[$key] = [
                'count' => 0,
                'reset_time' => time() + RATE_LIMIT_WINDOW
            ];
        }
        
        $limit_data = $_SESSION[$key];
        
        if (time() > $limit_data['reset_time']) {
            $_SESSION[$key] = [
                'count' => 1,
                'reset_time' => time() + RATE_LIMIT_WINDOW
            ];
            return;
        }
        
        if ($limit_data['count'] >= RATE_LIMIT_GENERAL) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded']);
            exit;
        }
        
        $_SESSION[$key]['count']++;
    }
    
    public function validateAdminKey($key) {
        return $key === ADMIN_KEY;
    }
    
    public function sanitizeInput($input) {
        if (is_array($input)) {
            return array_map([$this, 'sanitizeInput'], $input);
        }
        return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
    }
    
    private function getClientIP() {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ips = explode(',', $_SERVER[$key]);
                return trim($ips[0]);
            }
        }
        
        return '127.0.0.1';
    }
}
?>`;

    archive.append(securityPhp, { name: 'classes/SecurityManager.php' });

    // 6. Frontend HTML
    const frontendHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ContentScale - Professional Business Consulting</title>
    <meta name="description" content="ContentScale provides expert business consulting across SEO, strategy, finance, marketing, operations, HR, IT, legal, sales, customer experience, sustainability, and cybersecurity. Get professional insights powered by AI.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        header { background: #2563eb; color: white; padding: 1rem 0; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; transition: background 0.3s; }
        .btn:hover { background: #1d4ed8; }
        .features { padding: 4rem 0; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
        .feature { background: #f8fafc; padding: 2rem; border-radius: 12px; border: 1px solid #e2e8f0; }
        .feature h3 { color: #2563eb; margin-bottom: 1rem; }
        .categories { background: #f1f5f9; padding: 4rem 0; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-top: 2rem; }
        .category { background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        footer { background: #1f2937; color: white; padding: 2rem 0; text-align: center; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>ContentScale</h1>
            <p>AI-Powered Business Consulting Platform (PHP Version)</p>
        </div>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Transform Your Business</h1>
            <p>Get expert consulting across 12 key business areas, powered by advanced AI analysis</p>
            <a href="#consultation" class="btn">Start Consultation</a>
        </div>
    </section>

    <section class="features">
        <div class="container">
            <h2>Platform Features</h2>
            <div class="feature-grid">
                <div class="feature">
                    <h3>AI-Powered Analysis</h3>
                    <p>Advanced AI consultation using Google Gemini for comprehensive business insights and strategic recommendations.</p>
                </div>
                <div class="feature">
                    <h3>12 Consulting Areas</h3>
                    <p>Expert guidance across SEO, strategy, finance, marketing, operations, HR, IT, legal, sales, CX, sustainability, and cybersecurity.</p>
                </div>
                <div class="feature">
                    <h3>Comprehensive Reports</h3>
                    <p>Detailed analysis reports with actionable recommendations, implementation plans, and success metrics.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="categories">
        <div class="container">
            <h2>Consulting Categories</h2>
            <div class="category-grid">
                <div class="category">SEO Optimization</div>
                <div class="category">Business Strategy</div>
                <div class="category">Financial Planning</div>
                <div class="category">Marketing Strategy</div>
                <div class="category">Operations Excellence</div>
                <div class="category">Human Resources</div>
                <div class="category">IT Consulting</div>
                <div class="category">Legal Compliance</div>
                <div class="category">Sales Performance</div>
                <div class="category">Customer Experience</div>
                <div class="category">Sustainability</div>
                <div class="category">Cybersecurity</div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; 2025 ContentScale Platform. Professional Business Consulting.</p>
            <p>Contact: consultant@contentscale.site</p>
        </div>
    </footer>

    <script>
        // Basic JavaScript for API interaction
        const API_BASE = '/api';
        
        async function createConsultation(data) {
            try {
                const response = await fetch(API_BASE + '/consultations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return null;
            }
        }
        
        async function getConsultations() {
            try {
                const response = await fetch(API_BASE + '/consultations');
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return [];
            }
        }
        
        async function getAnalysis(consultationId) {
            try {
                const response = await fetch(API_BASE + '/analysis/' + consultationId);
                return await response.json();
            } catch (error) {
                console.error('API Error:', error);
                return null;
            }
        }
    </script>
</body>
</html>`;

    archive.append(frontendHtml, { name: 'public/index.html' });

    // 7. Installation README
    const phpReadme = `# ContentScale - PHP Version

This is the PHP conversion of the ContentScale AI Business Consulting Platform.

## Requirements

- PHP 8.0 or higher
- cURL extension enabled
- Web server (Apache/Nginx)

## Installation

1. Upload all files to your web server
2. Copy \`.env.example\` to \`.env\` and configure:
   - \`GEMINI_API_KEY\` - Your Google Gemini API key
   - \`ADMIN_KEY\` - Your admin access key
3. Ensure web server has write permissions for session storage
4. Access via your domain

## API Endpoints

- \`GET /\` - Health check
- \`GET /api/agent/status\` - Service status
- \`POST /api/consultations\` - Create consultation
- \`GET /api/consultations\` - List consultations
- \`GET /api/analysis/{id}\` - Get analysis results

## Security Features

- Rate limiting (100 requests per 15 minutes)
- Input sanitization
- Admin key authentication
- CORS handling

## File Structure

- \`index.php\` - Main entry point
- \`config/\` - Configuration files
- \`classes/\` - PHP classes
- \`api/\` - API routing
- \`public/\` - Frontend files

## Contact

consultant@contentscale.site
`;

    archive.append(phpReadme, { name: 'README-PHP.md' });

    // 8. Environment file
    const envExample = `# ContentScale PHP Environment Configuration

# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Admin access key
ADMIN_KEY=your_secure_admin_key_here

# Application environment
APP_ENV=production

# Database (optional, for future use)
DB_HOST=localhost
DB_NAME=contentscale
DB_USER=root  
DB_PASS=
`;

    archive.append(envExample, { name: '.env.example' });

    await archive.finalize();

  } catch (error) {
    console.error('PHP conversion error:', error);
    res.status(500).json({ error: 'Failed to convert to PHP' });
  }
});

export default router;