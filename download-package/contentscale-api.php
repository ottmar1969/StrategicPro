<?php
/**
 * ContentScale Platform - PHP API Implementation
 * 
 * This file provides PHP equivalents of the core platform functionality
 * for integration with PHP-based systems or as a reference implementation.
 */

class ContentScalePlatform {
    
    private $config;
    private $stripeSecretKey;
    
    public function __construct($stripeSecretKey = null) {
        $this->stripeSecretKey = $stripeSecretKey ?: $_ENV['STRIPE_SECRET_KEY'];
        $this->config = $this->loadConfig();
    }
    
    /**
     * Load platform configuration
     */
    private function loadConfig() {
        return [
            'pricing' => [
                'free_tier' => [
                    'first_article' => true,
                    'with_api_key' => 10
                ],
                'paid_tiers' => [
                    'with_api_key' => ['price' => 1.00],
                    'without_api_key' => ['price' => 10.00]
                ],
                'credit_packages' => [
                    ['id' => 'starter', 'credits' => 5, 'price' => 25.00],
                    ['id' => 'popular', 'credits' => 10, 'price' => 40.00],
                    ['id' => 'professional', 'credits' => 25, 'price' => 75.00]
                ]
            ],
            'fraud_protection' => [
                'risk_thresholds' => ['allow' => 74, 'verify' => 50, 'block' => 75],
                'suspicious_providers' => [
                    'amazonaws', 'googlecloud', 'azure', 'digitalocean',
                    'vultr', 'linode', 'ovh', 'hetzner', 'nordvpn'
                ]
            ]
        ];
    }
    
    /**
     * Check if user can generate content
     */
    public function canUserGenerateContent($userId) {
        $user = $this->getUser($userId);
        
        if (!$user) {
            return ['allowed' => false, 'method' => 'payment_required', 'message' => 'User not found'];
        }
        
        $freeArticlesUsed = $user['freeArticlesUsed'] ?? 0;
        $credits = $user['credits'] ?? 0;
        $hasApiKey = $user['hasOwnApiKey'] ?? false;
        
        // First article is always free
        if ($freeArticlesUsed === 0) {
            return [
                'allowed' => true,
                'method' => 'free',
                'remaining' => 1,
                'message' => 'First article free for all users'
            ];
        }
        
        // Second article requires payment unless they have API key
        if ($freeArticlesUsed === 1 && !$hasApiKey) {
            return [
                'allowed' => false,
                'method' => 'payment_required',
                'message' => 'Second article requires payment ($10) or credits. Add your API key for 10 free articles!'
            ];
        }
        
        // Users with API key get 10 free articles
        if ($hasApiKey && $freeArticlesUsed < 10) {
            return [
                'allowed' => true,
                'method' => 'free',
                'remaining' => 10 - $freeArticlesUsed
            ];
        }
        
        // After 10 free articles with API key, charge $1
        if ($hasApiKey && $freeArticlesUsed >= 10) {
            return [
                'allowed' => false,
                'method' => 'payment_required',
                'message' => 'With your API key: $1 per article after 10 free articles'
            ];
        }
        
        // Check if user has credits
        if ($credits > 0) {
            return [
                'allowed' => true,
                'method' => 'credits',
                'remaining' => $credits
            ];
        }
        
        return [
            'allowed' => false,
            'method' => 'payment_required',
            'message' => 'No credits remaining. Buy credits or pay per article.'
        ];
    }
    
    /**
     * Fraud detection for IP address
     */
    public function checkFraudProtection($ipAddress, $userAgent = '', $browserFingerprint = '') {
        $riskScore = 0;
        $reasons = [];
        
        // Check for private/local IPs
        if ($this->isPrivateIP($ipAddress)) {
            $riskScore += 90;
            $reasons[] = 'Private IP detected';
        }
        
        // Check for suspicious providers in reverse DNS
        $reverseDns = $this->getReverseDNS($ipAddress);
        if ($reverseDns) {
            foreach ($this->config['fraud_protection']['suspicious_providers'] as $provider) {
                if (stripos($reverseDns, $provider) !== false) {
                    if (strpos($provider, 'vpn') !== false) {
                        $riskScore += 80;
                        $reasons[] = 'VPN detected';
                    } elseif (in_array($provider, ['amazonaws', 'googlecloud', 'azure'])) {
                        $riskScore += 70;
                        $reasons[] = 'Data center IP detected';
                    }
                }
            }
        }
        
        // Check user agent for automation
        $suspiciousUA = ['bot', 'crawler', 'spider', 'headless', 'phantom', 'selenium'];
        foreach ($suspiciousUA as $pattern) {
            if (stripos($userAgent, $pattern) !== false) {
                $riskScore += 60;
                $reasons[] = 'Suspicious user agent detected';
                break;
            }
        }
        
        $finalRiskScore = min($riskScore, 100);
        
        return [
            'allowed' => $finalRiskScore < $this->config['fraud_protection']['risk_thresholds']['allow'],
            'reason' => implode(', ', $reasons),
            'riskScore' => $finalRiskScore,
            'requiresVerification' => $finalRiskScore > $this->config['fraud_protection']['risk_thresholds']['verify'] && 
                                    $finalRiskScore < $this->config['fraud_protection']['risk_thresholds']['block']
        ];
    }
    
    /**
     * Create Stripe payment intent
     */
    public function createPaymentIntent($amount, $type, $credits = 0, $userId = 1) {
        if (!$this->stripeSecretKey) {
            throw new Exception('Stripe secret key not configured');
        }
        
        $stripe = new \Stripe\StripeClient($this->stripeSecretKey);
        
        try {
            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => round($amount * 100), // Convert to cents
                'currency' => 'usd',
                'metadata' => [
                    'userId' => (string)$userId,
                    'type' => $type,
                    'credits' => (string)$credits
                ]
            ]);
            
            return [
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id
            ];
        } catch (Exception $e) {
            throw new Exception('Error creating payment intent: ' . $e->getMessage());
        }
    }
    
    /**
     * Generate content using CRAFT framework
     */
    public function generateContent($request, $userId, $apiKey = null) {
        // This would integrate with actual AI APIs
        $content = $this->processWithCRAFT($request);
        
        // Save article to database
        $article = [
            'id' => time(), // Simple ID generation
            'userId' => $userId,
            'title' => $content['title'],
            'content' => $content['content'],
            'seoScore' => $content['seoScore'],
            'metadata' => $request,
            'isPaid' => $request['method'] !== 'free',
            'paymentMethod' => $request['method'],
            'createdAt' => date('Y-m-d H:i:s')
        ];
        
        return [
            'article' => $article,
            'content' => $content,
            'watermarked' => !$article['isPaid']
        ];
    }
    
    /**
     * CRAFT framework processing
     */
    private function processWithCRAFT($request) {
        // Simplified CRAFT implementation
        $title = ucfirst($request['topic']) . ': ' . ucfirst($request['audience']) . ' Guide';
        
        $content = "This is a {$request['wordCount']}-word article about {$request['topic']} " .
                  "targeted at {$request['audience']} in the {$request['niche']} niche.\n\n" .
                  "Keywords: {$request['keywords']}\n\n" .
                  "Language: {$request['language']}\n\n" .
                  "[Content would be generated here using the CRAFT framework]\n\n" .
                  "CRAFT Analysis:\n" .
                  "- Cut: Removed unnecessary content\n" .
                  "- Review: Checked for accuracy\n" .
                  "- Add: Enhanced with relevant information\n" .
                  "- Fact-check: Verified claims\n" .
                  "- Trust: Built credibility";
        
        return [
            'title' => $title,
            'content' => $content,
            'seoScore' => rand(75, 95)
        ];
    }
    
    /**
     * Helper methods
     */
    private function isPrivateIP($ip) {
        return !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    }
    
    private function getReverseDNS($ip) {
        return gethostbyaddr($ip);
    }
    
    private function getUser($userId) {
        // This would connect to your database
        // For demo, return sample user
        return [
            'id' => $userId,
            'credits' => 0,
            'freeArticlesUsed' => 0,
            'hasOwnApiKey' => false,
            'createdAt' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * API endpoint handlers
     */
    public function handleGenerateContent() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Extract client information
        $clientIP = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $browserFingerprint = $_SERVER['HTTP_X_BROWSER_FINGERPRINT'] ?? '';
        
        // Fraud detection
        $fraudCheck = $this->checkFraudProtection($clientIP, $userAgent, $browserFingerprint);
        
        if (!$fraudCheck['allowed']) {
            http_response_code(403);
            echo json_encode([
                'message' => 'Access denied: ' . $fraudCheck['reason'],
                'riskScore' => $fraudCheck['riskScore']
            ]);
            return;
        }
        
        if ($fraudCheck['requiresVerification']) {
            http_response_code(429);
            echo json_encode([
                'message' => 'Suspicious activity detected: ' . $fraudCheck['reason'],
                'riskScore' => $fraudCheck['riskScore']
            ]);
            return;
        }
        
        // Check user permissions
        $canGenerate = $this->canUserGenerateContent(1); // Default user ID
        
        if (!$canGenerate['allowed']) {
            http_response_code(402);
            echo json_encode([
                'message' => 'Insufficient credits or free articles',
                'details' => $canGenerate
            ]);
            return;
        }
        
        // Generate content
        $result = $this->generateContent($input, 1);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    }
    
    public function handleCreatePayment() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        try {
            $result = $this->createPaymentIntent(
                $input['amount'], 
                $input['type'], 
                $input['credits'] ?? 0
            );
            
            header('Content-Type: application/json');
            echo json_encode($result);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => $e->getMessage()]);
        }
    }
}

// Usage example:
/*
require_once 'vendor/autoload.php'; // For Stripe

$platform = new ContentScalePlatform($_ENV['STRIPE_SECRET_KEY']);

// Route handling
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'POST' && $requestUri === '/api/generate-content') {
    $platform->handleGenerateContent();
} elseif ($requestMethod === 'POST' && $requestUri === '/api/create-payment-intent') {
    $platform->handleCreatePayment();
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
*/

?>