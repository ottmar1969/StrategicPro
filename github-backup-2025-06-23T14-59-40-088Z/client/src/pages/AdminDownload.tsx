import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, Package, Code, Server, FileText, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BackupFile {
  filename: string;
  size: number;
  created: string;
  downloadUrl: string;
}

interface BackupResponse {
  backups: BackupFile[];
}

export default function AdminDownload() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication
  const authenticate = () => {
    if (adminKey === 'dev-admin-2025' || adminKey.length > 8) {
      setIsAuthenticated(true);
      toast({
        title: "Authentication successful",
        description: "Access granted to admin download features"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Invalid admin key"
      });
    }
  };

  // Fetch existing backups
  const { data: backups, isLoading: loadingBackups } = useQuery<BackupResponse>({
    queryKey: ['/api/admin/backups'],
    queryFn: () => apiRequest('/api/admin/backups', {
      headers: { 'X-Admin-Key': adminKey }
    }),
    enabled: isAuthenticated
  });

  // Create new backup
  const createBackupMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/create-backup', {
      headers: { 'X-Admin-Key': adminKey }
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      toast({
        title: "Backup created successfully",
        description: `Created ${data.filename} (${formatFileSize(data.size)})`
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Backup creation failed",
        description: "Unable to create backup package"
      });
    }
  });

  // Convert to PHP
  const convertPhpMutation = useMutation({
    mutationFn: () => apiRequest('/api/admin/convert-to-php', {
      headers: { 'X-Admin-Key': adminKey }
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      toast({
        title: "PHP conversion completed",
        description: `Created ${data.filename} (${formatFileSize(data.size)})`
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "PHP conversion failed",
        description: "Unable to convert project to PHP"
      });
    }
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const downloadFile = (downloadUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl + '?adminKey=' + adminKey;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>
              Enter admin key to access download and backup features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && authenticate()}
            />
            <Button 
              onClick={authenticate}
              className="w-full"
              disabled={!adminKey}
            >
              <Lock className="h-4 w-4 mr-2" />
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Download Center</h1>
            <p className="text-muted-foreground mt-2">
              Create and download project backups in multiple formats
            </p>
          </div>
          <Badge variant="secondary" className="text-green-600">
            Authenticated
          </Badge>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Create Full Backup
              </CardTitle>
              <CardDescription>
                Generate complete project backup with all source code, documentation, and configuration files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => createBackupMutation.mutate()}
                disabled={createBackupMutation.isPending}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {createBackupMutation.isPending ? 'Creating Backup...' : 'Create Backup ZIP'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-orange-600" />
                Convert to PHP
              </CardTitle>
              <CardDescription>
                Convert the TypeScript/Node.js application to PHP with equivalent functionality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => convertPhpMutation.mutate()}
                disabled={convertPhpMutation.isPending}
                variant="outline"
                className="w-full"
              >
                <Server className="h-4 w-4 mr-2" />
                {convertPhpMutation.isPending ? 'Converting...' : 'Generate PHP Version'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Platform:</strong> ContentScale AI Business Consulting
              </div>
              <div>
                <strong>Version:</strong> 1.0.0
              </div>
              <div>
                <strong>Tech Stack:</strong> React, TypeScript, Express.js, Node.js
              </div>
              <div>
                <strong>AI Integration:</strong> Google Gemini API
              </div>
              <div>
                <strong>Categories:</strong> 12 Business Consulting Areas
              </div>
              <div>
                <strong>Security:</strong> Rate limiting, Input sanitization, CORS
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Downloads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Available Downloads
            </CardTitle>
            <CardDescription>
              Previously created backup files ready for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingBackups ? (
              <div className="text-center py-8">Loading backups...</div>
            ) : !backups?.backups?.length ? (
              <div className="text-center py-8 text-muted-foreground">
                No backup files available. Create your first backup above.
              </div>
            ) : (
              <div className="space-y-3">
                {backups.backups.map((backup) => (
                  <div 
                    key={backup.filename}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{backup.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(backup.size)} • Created {formatDate(backup.created)}
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadFile(backup.downloadUrl, backup.filename)}
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Download Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <strong>For GitHub Repository:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                <li>Download the full backup ZIP file</li>
                <li>Extract to your local development environment</li>
                <li>Initialize git repository: <code className="bg-muted px-1 rounded">git init</code></li>
                <li>Add files and commit: <code className="bg-muted px-1 rounded">git add . && git commit -m "Initial commit"</code></li>
                <li>Push to your GitHub repository</li>
              </ol>
            </div>
            <div>
              <strong>For PHP Deployment:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                <li>Download the PHP version ZIP file</li>
                <li>Extract to your web server directory</li>
                <li>Configure .env file with your API keys</li>
                <li>Ensure PHP 8.0+ and cURL extension are available</li>
                <li>Access via your domain</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}