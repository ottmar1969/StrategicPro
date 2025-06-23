import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Input validation middleware
export function validateInput(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
}

// API key validation middleware
export function validateApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    });
  }

  // In production, validate against a database or environment variable
  const validApiKeys = process.env.API_KEYS?.split(',') || ['demo-key'];
  
  if (!validApiKeys.includes(apiKey as string)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
}

// Input sanitization
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      // Basic XSS protection
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  }

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
}

// Authentication middleware (basic implementation)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const token = authHeader.substring(7);
  
  // In production, validate JWT token
  if (token !== process.env.ADMIN_TOKEN && token !== 'demo-admin-token') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token'
    });
  }

  next();
}

// Agent authentication for automated requests
export function authenticateAgent(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'];
  const agentKey = req.headers['x-agent-key'];
  
  if (!userAgent || !agentKey) {
    return res.status(401).json({
      success: false,
      error: 'Agent authentication required'
    });
  }

  // Validate agent credentials
  const validAgentKeys = process.env.AGENT_KEYS?.split(',') || ['demo-agent-key'];
  
  if (!validAgentKeys.includes(agentKey as string)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid agent credentials'
    });
  }

  next();
}

// Request logging middleware
export function logRequests(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
}

// Error handling for security middleware
export function securityErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Security error:', err);
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload'
    });
  }
  
  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      error: 'Payload too large'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Security validation failed'
  });
}