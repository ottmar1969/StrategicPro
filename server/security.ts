import { Request, Response, NextFunction } from 'express';

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number) => {
  const requests = new Map();
  
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }
    
    const userRequests = requests.get(key).filter((time: number) => time > windowStart);
    
    if (userRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    userRequests.push(now);
    requests.set(key, userRequests);
    
    next();
  };
};

// API key validation middleware
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (req.path.startsWith('/api/') && req.method !== 'GET') {
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required for write operations' });
    }
    
    // Add your API key validation logic here
    // For now, we'll accept any non-empty key for demo purposes
    if (typeof apiKey !== 'string' || apiKey.length < 10) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
  }
  
  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Remove potentially dangerous characters
    const sanitize = (obj: any): any => {
      if (typeof obj === 'string') {
        return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                 .replace(/javascript:/gi, '')
                 .replace(/on\w+\s*=/gi, '');
      } else if (Array.isArray(obj)) {
        return obj.map(sanitize);
      } else if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const key in obj) {
          sanitized[key] = sanitize(obj[key]);
        }
        return sanitized;
      }
      return obj;
    };
    
    req.body = sanitize(req.body);
  }
  
  next();
};

// CORS configuration for agent integration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins for agent integration
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://*.replit.app',
      'https://*.repl.co',
      /\.contentscale\.site$/
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      } else {
        return allowedOrigin.test(origin);
      }
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  
  next();
};

// Agent authentication middleware
export const agentAuth = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.headers['user-agent'] || '';
  const isAgent = userAgent.includes('agent') || userAgent.includes('bot') || req.headers['x-agent-type'];
  
  if (isAgent) {
    // Enhanced logging for agent requests
    console.log(`🤖 Agent Request: ${req.method} ${req.path} from ${req.ip}`);
    req.body.isAgentRequest = true;
  }
  
  next();
};