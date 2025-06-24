import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, AlertTriangle, CheckCircle, XCircle, Globe, Fingerprint } from "lucide-react";

interface SecurityNoticeProps {
  fraudStatus?: {
    requestCount: number;
    contentGenerated: number;
    vpnDetected: boolean;
    proxyDetected: boolean;
    suspiciousActivity: boolean;
    riskScore?: number;
  };
}

export default function SecurityNotice({ fraudStatus }: SecurityNoticeProps) {
  const getRiskLevel = () => {
    if (!fraudStatus) return "unknown";
    if (fraudStatus.suspiciousActivity) return "high";
    if (fraudStatus.vpnDetected || fraudStatus.proxyDetected) return "medium";
    return "low";
  };

  const getRiskColor = () => {
    const level = getRiskLevel();
    switch (level) {
      case "high": return "text-red-600 bg-red-50 border-red-200";
      case "medium": return "text-orange-600 bg-orange-50 border-orange-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={`border-l-4 ${getRiskColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          Fraud Protection Status
          <Badge variant={getRiskLevel() === "low" ? "default" : "destructive"} className="text-xs">
            {getRiskLevel().toUpperCase()} RISK
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-3 w-3" />
            <span>Device: Verified</span>
          </div>
          <div className="flex items-center gap-2">
            {fraudStatus?.vpnDetected ? (
              <XCircle className="h-3 w-3 text-red-500" />
            ) : (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            <span>VPN: {fraudStatus?.vpnDetected ? "Detected" : "Not Detected"}</span>
          </div>
          <div className="flex items-center gap-2">
            {fraudStatus?.proxyDetected ? (
              <XCircle className="h-3 w-3 text-red-500" />
            ) : (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            <span>Proxy: {fraudStatus?.proxyDetected ? "Detected" : "Not Detected"}</span>
          </div>
        </div>

        {/* Activity Stats */}
        {fraudStatus && (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Requests Today:</span> {fraudStatus.requestCount}
              </div>
              <div>
                <span className="font-medium">Content Generated:</span> {fraudStatus.contentGenerated}
              </div>
            </div>
          </div>
        )}

        {/* Security Alerts */}
        {fraudStatus?.vpnDetected && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>VPN Detected:</strong> Using VPN may limit content generation. For full access, disable VPN and refresh.
            </AlertDescription>
          </Alert>
        )}

        {fraudStatus?.proxyDetected && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Proxy Detected:</strong> Proxy connections may affect service availability. Use direct connection for best experience.
            </AlertDescription>
          </Alert>
        )}

        {fraudStatus?.suspiciousActivity && (
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Suspicious Activity:</strong> High usage detected. Content generation temporarily limited. Wait 1 hour or contact support.
            </AlertDescription>
          </Alert>
        )}

        {/* User Guidelines */}
        <div className="bg-blue-50 p-3 rounded text-sm">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Eye className="h-3 w-3" />
            How Your Content is Protected
          </h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Your content is linked to your device fingerprint and IP address</li>
            <li>• Only you can access content created from your device and location</li>
            <li>• VPN/Proxy users may have limited access for security</li>
            <li>• Admin can recover your content if needed (contact support)</li>
            <li>• Content remains yours - no sharing with other users</li>
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-green-50 p-3 rounded text-sm">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            To Avoid Issues
          </h4>
          <ul className="space-y-1 text-xs text-green-800">
            <li>• Use the same device and internet connection</li>
            <li>• Disable VPN and proxy servers</li>
            <li>• Don't generate excessive content rapidly</li>
            <li>• Contact support if you lose access to content</li>
            <li>• Keep browser cookies enabled</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}