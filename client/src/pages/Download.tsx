import { useState, useEffect } from "react";
import { Download, Package, CheckCircle, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function DownloadPage() {
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    // Create a blob URL for the download
    const createDownloadUrl = async () => {
      try {
        const response = await fetch('/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip');
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
        }
      } catch (error) {
        console.log('Direct download not available, using fallback method');
      }
    };
    
    createDownloadUrl();
  }, []);

  const handleDirectDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'ContentScale-Consulting-AI-App-1.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "ContentScale Consulting AI App 1 is downloading to your computer."
      });
    }
  };

  const handleFallbackDownload = async () => {
    try {
      // Fetch the file as base64 and create download
      const response = await fetch('/api/download-package');
      if (response.ok) {
        const data = await response.json();
        
        // Create downloadable content with instructions
        const content = `ContentScale Consulting AI App 1 - Complete Package

PACKAGE INFORMATION:
- Name: ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip
- Size: 47,682 bytes
- Type: Complete business consulting application
- Contact: consultant@contentscale.site

INSTALLATION:
1. Extract the zip file to your desired directory
2. Run: npm install
3. Set environment: GEMINI_API_KEY=your_key_here
4. Start: tsx dev-server.ts
5. Access: http://localhost:5173

FEATURES:
- 12 professional consulting categories
- Google Gemini AI integration
- Agent automation APIs
- Security and rate limiting
- Professional dashboard
- Downloadable reports
- Business profile management

AGENT ENDPOINTS:
- GET /api/agent/status
- POST /api/agent/batch-consultations
- GET /api/agent/export-data
- POST /api/agent/quick-analysis
- GET /api/agent/health

The complete source code package is ready for deployment.
Visit the application to access all features.

Package Location: ${window.location.origin}/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ContentScale-Package-Info.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Package Info Downloaded",
          description: "Download instructions and package location saved to your computer."
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please contact consultant@contentscale.site for assistance.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Package className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">ContentScale Consulting AI App 1</h1>
          <p className="text-lg text-muted-foreground">
            Complete professional business consulting platform ready for download
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download Package
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">File Name:</span>
                <p className="text-muted-foreground break-all">ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip</p>
              </div>
              <div>
                <span className="font-medium">Size:</span>
                <p className="text-muted-foreground">47,682 bytes</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p className="text-muted-foreground">Complete Application</p>
              </div>
              <div>
                <span className="font-medium">Contact:</span>
                <p className="text-muted-foreground">consultant@contentscale.site</p>
              </div>
            </div>

            <div className="space-y-3">
              {downloadUrl && (
                <Button onClick={handleDirectDownload} className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download Complete Package
                </Button>
              )}
              
              <Button onClick={handleFallbackDownload} variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Download Package Information
              </Button>

              <div className="text-center">
                <a 
                  href="/downloads/ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Direct Download Link
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Contents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>12 Consulting Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Google Gemini AI Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Agent Automation APIs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Security & Rate Limiting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Professional Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Complete Documentation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}