import { contentStorage } from "../content-storage.js";

interface FraudResult {
  allowed: boolean;
  reason: string;
  riskScore: number;
  requiresVerification: boolean;
}

const SUSPICIOUS_PROVIDERS = [
  "amazonaws", "googlecloud", "azure", "digitalocean", "vultr", "linode",
  "ovh", "hetzner", "nordvpn", "expressvpn", "surfshark", "protonvpn"
];

const RISK_THRESHOLDS = {
  allow: 74,
  verify: 50,
  block: 75
};

export async function checkFraudProtection(
  ipAddress: string,
  userAgent: string = "",
  browserFingerprint: string = ""
): Promise<FraudResult> {
  let riskScore = 0;
  const reasons: string[] = [];

  try {
    // Check for private/local IPs
    if (isPrivateIP(ipAddress)) {
      riskScore += 90;
      reasons.push("Private IP detected");
    }

    // Check existing abuse record
    const abuseRecord = await contentStorage.getAbuseRecord(ipAddress);
    if (abuseRecord) {
      if (abuseRecord.isBanned) {
        riskScore += 100;
        reasons.push("IP is banned");
      }
      if (abuseRecord.isVpn) {
        riskScore += 80;
        reasons.push("VPN detected");
      }
      if (abuseRecord.isProxy) {
        riskScore += 75;
        reasons.push("Proxy detected");
      }
      if (abuseRecord.isDataCenter) {
        riskScore += 70;
        reasons.push("Data center IP");
      }
      
      // Update last activity
      await contentStorage.updateAbuseRecord(abuseRecord.id, {
        lastActivity: new Date()
      });
    } else {
      // Create new abuse record
      const detection = await analyzeIP(ipAddress);
      await contentStorage.recordAbuse({
        ipAddress,
        browserFingerprint,
        userAgent,
        freeArticlesUsed: 0,
        usersCreated: 1,
        isBanned: false,
        isVpn: detection.isVpn,
        isProxy: detection.isProxy,
        isDataCenter: detection.isDataCenter,
        ipCountry: detection.country,
        ipRiskScore: detection.riskScore,
        lastActivity: new Date()
      });
      
      riskScore += detection.riskScore;
      if (detection.reasons.length > 0) {
        reasons.push(...detection.reasons);
      }
    }

    // Check user agent for automation
    const suspiciousUA = ["bot", "crawler", "spider", "headless", "phantom", "selenium", "automation"];
    for (const pattern of suspiciousUA) {
      if (userAgent.toLowerCase().includes(pattern)) {
        riskScore += 60;
        reasons.push("Suspicious user agent detected");
        break;
      }
    }

    // Check for missing user agent
    if (!userAgent || userAgent.length < 10) {
      riskScore += 30;
      reasons.push("Missing or suspicious user agent");
    }

    // Check for missing browser fingerprint (if expected)
    if (!browserFingerprint && userAgent.includes("Mozilla")) {
      riskScore += 20;
      reasons.push("Missing browser fingerprint");
    }

  } catch (error) {
    console.error("Error in fraud detection:", error);
    // In case of error, allow with caution
    riskScore = 40;
    reasons.push("Fraud detection error - proceed with caution");
  }

  const finalRiskScore = Math.min(riskScore, 100);
  
  return {
    allowed: finalRiskScore < RISK_THRESHOLDS.allow,
    reason: reasons.join(", ") || "Low risk",
    riskScore: finalRiskScore,
    requiresVerification: finalRiskScore >= RISK_THRESHOLDS.verify && finalRiskScore < RISK_THRESHOLDS.block
  };
}

async function analyzeIP(ipAddress: string): Promise<{
  isVpn: boolean;
  isProxy: boolean;
  isDataCenter: boolean;
  country?: string;
  riskScore: number;
  reasons: string[];
}> {
  const reasons: string[] = [];
  let riskScore = 0;
  let isVpn = false;
  let isProxy = false;
  let isDataCenter = false;

  try {
    // Reverse DNS lookup
    const reverseDns = await getReverseDNS(ipAddress);
    if (reverseDns) {
      for (const provider of SUSPICIOUS_PROVIDERS) {
        if (reverseDns.toLowerCase().includes(provider)) {
          if (provider.includes("vpn")) {
            isVpn = true;
            riskScore += 80;
            reasons.push("VPN provider detected");
          } else if (["amazonaws", "googlecloud", "azure", "digitalocean"].includes(provider)) {
            isDataCenter = true;
            riskScore += 70;
            reasons.push("Data center IP detected");
          } else {
            isProxy = true;
            riskScore += 60;
            reasons.push("Suspicious hosting provider");
          }
          break;
        }
      }
    }

    // Check for common VPN/proxy patterns in IP
    if (isCommonVpnRange(ipAddress)) {
      isVpn = true;
      riskScore += 75;
      reasons.push("Common VPN IP range");
    }

  } catch (error) {
    console.error("Error analyzing IP:", error);
  }

  return {
    isVpn,
    isProxy,
    isDataCenter,
    riskScore,
    reasons
  };
}

function isPrivateIP(ip: string): boolean {
  // Check for private IP ranges
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4) return false;
  
  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  
  // Localhost
  if (parts[0] === 127) return true;
  
  return false;
}

async function getReverseDNS(ip: string): Promise<string | null> {
  try {
    // Simple reverse DNS - in production, use proper DNS library
    const dns = await import('dns').then(m => m.promises);
    const hostnames = await dns.reverse(ip);
    return hostnames[0] || null;
  } catch {
    return null;
  }
}

function isCommonVpnRange(ip: string): boolean {
  // Common VPN IP ranges (simplified)
  const vpnRanges = [
    "185.220.", // Tor exit nodes
    "104.244.", // Common VPN range
    "192.42.",  // Common VPN range
    "198.98.",  // Common VPN range
  ];
  
  return vpnRanges.some(range => ip.startsWith(range));
}

export async function trackAbuseAttempt(ipAddress: string, type: "free_article" | "api_abuse" = "free_article") {
  try {
    let record = await contentStorage.getAbuseRecord(ipAddress);
    
    if (record) {
      await contentStorage.updateAbuseRecord(record.id, {
        freeArticlesUsed: type === "free_article" ? record.freeArticlesUsed + 1 : record.freeArticlesUsed,
        lastActivity: new Date()
      });
    } else {
      await contentStorage.recordAbuse({
        ipAddress,
        userAgent: "",
        browserFingerprint: "",
        freeArticlesUsed: type === "free_article" ? 1 : 0,
        usersCreated: 1,
        isBanned: false,
        isVpn: false,
        isProxy: false,
        isDataCenter: false,
        ipRiskScore: 0,
        lastActivity: new Date()
      });
    }
  } catch (error) {
    console.error("Error tracking abuse attempt:", error);
  }
}