import type { Request, Response, NextFunction } from "express";
import { generateFingerprint } from "../fingerprint";
import { storage } from "../storage";

// Extend Request interface to include fingerprint
declare global {
  namespace Express {
    interface Request {
      fingerprint?: string;
      ipAddress?: string;
    }
  }
}

export async function fingerprintMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Generate fingerprint for the request
    const fingerprintData = generateFingerprint(req);
    req.fingerprint = fingerprintData.fingerprint;
    req.ipAddress = fingerprintData.ipAddress;

    // Track request for fraud detection
    const isAllowed = await storage.trackRequest(req);
    
    if (!isAllowed) {
      return res.status(429).json({
        error: "Too many requests",
        message: "Suspicious activity detected. Please try again later.",
        code: "RATE_LIMITED"
      });
    }

    next();
  } catch (error) {
    console.error("Fingerprint middleware error:", error);
    // Don't block request on fingerprint error, just continue
    next();
  }
}

export function requireFingerprint(req: Request, res: Response, next: NextFunction) {
  if (!req.fingerprint) {
    return res.status(400).json({
      error: "Fingerprint required",
      message: "Request fingerprint is missing"
    });
  }
  next();
}