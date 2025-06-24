import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Link, Globe, Target, TrendingUp, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface InternalLink {
  url: string;
  title: string;
  relevanceScore: number;
  anchorText: string[];
  contentType: 'page' | 'post' | 'category' | 'product';
}

interface ExternalLink {
  domain: string;
  url: string;
  domainRating: number;
  relevanceScore: number;
  trustScore: number;
  isCompetitor: boolean;
  linkType: 'authority' | 'citation' | 'resource';
}

interface LinkAnalysisResult {
  internalLinks: InternalLink[];
  externalLinks: ExternalLink[];
  linkingStrategy: string[];
  seoRecommendations: string[];
}

interface LinkAnalysisPanelProps {
  keyword: string;
  selectedWebsite: string;
}

export default function LinkAnalysisPanel({ keyword, selectedWebsite }: LinkAnalysisPanelProps) {
  const [analysisResult, setAnalysisResult] = useState<LinkAnalysisResult | null>(null);
  const { toast } = useToast();

  const linkAnalysisMutation = useMutation({
    mutationFn: () => apiRequest("/api/links/analyze-links", {
      method: "POST",
      body: JSON.stringify({
        keyword,
        domain: selectedWebsite,
        industry: "general"
      })
    }),
    onSuccess: (data) => {
      setAnalysisResult(data);
      toast({
        title: "Link Analysis Complete",
        description: `Found ${data.internalLinks.length} internal and ${data.externalLinks.length} external link opportunities`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze linking opportunities",
        variant: "destructive"
      });
    }
  });

  const handleAnalyzeLinks = () => {
    if (!keyword || !selectedWebsite) {
      toast({
        title: "Missing Information",
        description: "Please provide a keyword and select a website first",
        variant: "destructive"
      });
      return;
    }

    linkAnalysisMutation.mutate();
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'page': return 'bg-green-100 text-green-800';
      case 'category': return 'bg-purple-100 text-purple-800';
      case 'product': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  if (!keyword || !selectedWebsite) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter a keyword and select a website to analyze linking opportunities
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Link Analysis for "{keyword}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleAnalyzeLinks}
              disabled={linkAnalysisMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {linkAnalysisMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              Analyze Links
            </Button>
            <div className="text-sm text-muted-foreground">
              Website: <span className="font-medium">{selectedWebsite}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <>
          {/* Internal Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Internal Linking Opportunities ({analysisResult.internalLinks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.internalLinks.map((link, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{link.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{link.url}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className={getContentTypeColor(link.contentType)}>
                            {link.contentType}
                          </Badge>
                          <Badge variant="outline">
                            <span className={getRelevanceColor(link.relevanceScore)}>
                              {link.relevanceScore}% relevance
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium mb-1">Suggested Anchor Texts:</p>
                      <div className="flex gap-1 flex-wrap">
                        {link.anchorText.map((anchor, anchorIndex) => (
                          <Badge key={anchorIndex} variant="secondary" className="text-xs">
                            {anchor}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                External Authority Links ({analysisResult.externalLinks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.externalLinks.map((link, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{link.domain}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{link.url}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            DR: {link.domainRating}
                          </Badge>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Trust: {link.trustScore}
                          </Badge>
                          <Badge variant="outline">
                            <span className={getRelevanceColor(link.relevanceScore)}>
                              {link.relevanceScore}% relevance
                            </span>
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {link.linkType}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategy & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Linking Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.linkingStrategy.map((strategy, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 shrink-0" />
                      <span className="text-sm">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  SEO Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.seoRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}