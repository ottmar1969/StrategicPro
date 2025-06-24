import crypto from "crypto";
import type { Request } from "express";

interface FingerprintData {
  fingerprint: string;
  ipAddress: string;
  userAgent: string;
  acceptLanguage: string;
  acceptEncoding: string;
  connection: string;
}

export function generateFingerprint(req: Request): FingerprintData {
  const components = [
    req.ip || req.connection.remoteAddress || "unknown",
    req.get('User-Agent') || "unknown",
    req.get('Accept-Language') || "unknown",
    req.get('Accept-Encoding') || "unknown",
    req.get('Accept') || "unknown",
    req.get('DNT') || "unknown", // Do Not Track
  ];

  // Create fingerprint hash
  const fingerprint = crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex')
    .substring(0, 32);

  return {
    fingerprint,
    ipAddress: req.ip || req.connection.remoteAddress || "unknown",
    userAgent: req.get('User-Agent') || "unknown",
    acceptLanguage: req.get('Accept-Language') || "unknown",
    acceptEncoding: req.get('Accept-Encoding') || "unknown",
    connection: req.get('Connection') || "unknown"
  };
}

export function detectVPN(ipAddress: string): boolean {
  // Basic VPN detection - check for common VPN IP ranges
  const vpnRanges = [
    /^10\./, // Private network
    /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private network
    /^192\.168\./, // Private network
    /^127\./, // Localhost
    /^169\.254\./, // Link-local
  ];

  return vpnRanges.some(range => range.test(ipAddress));
}

export function detectProxy(userAgent: string, headers: any): boolean {
  // Basic proxy detection
  const proxyIndicators = [
    'proxy',
    'spider',
    'crawler',
    'bot',
    'curl',
    'wget',
    'python',
    'postman'
  ];

  const userAgentLower = userAgent.toLowerCase();
  const hasProxyHeaders = headers['x-forwarded-for'] || 
                         headers['x-real-ip'] || 
                         headers['x-proxy-id'];

  return proxyIndicators.some(indicator => userAgentLower.includes(indicator)) || 
         !!hasProxyHeaders;
}

export function calculateRiskScore(data: {
  requestCount: number;
  contentGenerated: number;
  creditsUsed: number;
  vpnDetected: boolean;
  proxyDetected: boolean;
  recentActivity: number; // minutes since last activity
}): number {
  let score = 0;

  // High request volume
  if (data.requestCount > 100) score += 30;
  else if (data.requestCount > 50) score += 15;
  else if (data.requestCount > 20) score += 5;

  // High content generation
  if (data.contentGenerated > 50) score += 25;
  else if (data.contentGenerated > 20) score += 10;
  else if (data.contentGenerated > 10) score += 5;

  // VPN/Proxy usage
  if (data.vpnDetected) score += 20;
  if (data.proxyDetected) score += 15;

  // Rapid activity (less than 1 minute between requests)
  if (data.recentActivity < 1) score += 20;
  else if (data.recentActivity < 5) score += 10;

  // High credit usage without payment
  if (data.creditsUsed > 100) score += 15;

  return Math.min(score, 100); // Cap at 100
}

export function isSuspiciousActivity(riskScore: number): boolean {
  return riskScore >= 50; // Threshold for suspicious activity
}