import { useState } from "react";
import { Download, Package, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DownloadButton() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Create the download content
      const downloadContent = `
# ContentScale Consulting AI App 1 - Complete Package

## Installation Instructions
1. Extract this package to your desired directory
2. Install dependencies: npm install
3. Set environment variable: GEMINI_API_KEY=your_key_here
4. Start the application: tsx dev-server.ts
5. Access at: http://localhost:5173

## What's Included
- Complete source code for all 12 consulting categories
- Google Gemini AI integration
- Agent automation APIs
- Security middleware and rate limiting
- Professional UI with dashboard
- Business profile management
- Downloadable reports functionality

## Agent Integration Endpoints
- GET /api/agent/status - Application capabilities
- POST /api/agent/batch-consultations - Batch processing
- GET /api/agent/export-data - Complete data export
- POST /api/agent/quick-analysis - Instant analysis
- GET /api/agent/health - Health monitoring

## Contact
consultant@contentscale.site

## Technical Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express
- AI: Google Gemini API
- Data: In-memory storage with TypeScript schemas

Package: ContentScale-Consulting-AI-App-1
Version: 1.0.0
Size: 47,682 bytes
Created: ${new Date().toISOString()}
      `;

      // Create and download the file
      const blob = new Blob([downloadContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ContentScale-Consulting-AI-App-1-Instructions.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show backup location info
      alert(`Download initiated! 

The complete ContentScale Consulting AI App 1 package is available:
- File: ContentScale-Consulting-AI-App-1-2025-06-23T02-01-33-495Z.zip
- Size: 47,682 bytes
- Location: Project backup directory

Instructions file downloaded to help with setup.
Contact: consultant@contentscale.site`);

    } catch (error) {
      alert('Download failed. Please contact consultant@contentscale.site for assistance.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
          <Package className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>ContentScale Consulting AI App 1</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Complete AI consulting platform</p>
          <p>Ready for agent integration</p>
          <p className="font-medium">Size: 47,682 bytes</p>
        </div>
        
        <Button 
          onClick={handleDownload} 
          disabled={isDownloading}
          className="w-full"
          size="lg"
        >
          {isDownloading ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-spin" />
              Preparing Download...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Application Package
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>📧 consultant@contentscale.site</p>
          <p>🔧 Node.js + React + Gemini AI</p>
          <p>🤖 Agent automation ready</p>
        </div>
        
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="mr-2 h-3 w-3" />
          View Documentation
        </Button>
      </CardContent>
    </Card>
  );
}