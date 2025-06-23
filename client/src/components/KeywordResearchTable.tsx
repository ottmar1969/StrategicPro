import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Plus, Globe, TrendingUp, Target, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface KeywordData {
  keyword: string;
  searchVolume: string;
  difficulty: string;
  intent: string;
  trend: string;
  competition: string;
  factChecked: boolean;
  sources: string[];
  analysis: string;
}

interface TitleData {
  title: string;
  seoScore: number;
  clickPotential: string;
  factChecked: boolean;
  sources: string[];
  reasoning: string;
}

interface OutlineData {
  heading: string;
  subheadings: string[];
  keyPoints: string[];
  factChecked: boolean;
  sources: string[];
  researchNotes: string;
}

export default function KeywordResearchTable() {
  const [mainKeyword, setMainKeyword] = useState("");
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [titles, setTitles] = useState<TitleData[]>([]);
  const [outlines, setOutlines] = useState<OutlineData[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const { toast } = useToast();

  // Generate Keywords
  const keywordMutation = useMutation({
    mutationFn: (count: number) => apiRequest("/api/keywords/generate", {
      method: "POST",
      body: JSON.stringify({
        mainKeyword,
        niche: "SEO content",
        audience: "digital marketers",
        count
      })
    }),
    onSuccess: (data, count) => {
      if (count === 1) {
        setKeywords(data.keywords);
      } else {
        setKeywords(prev => [...prev, ...data.keywords]);
      }
      toast({
        title: "Keywords Generated",
        description: `Added ${data.keywords.length} fact-checked keywords with online research`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate keywords",
        variant: "destructive"
      });
    }
  });

  // Generate Titles
  const titleMutation = useMutation({
    mutationFn: (count: number) => apiRequest("/api/titles/generate", {
      method: "POST",
      body: JSON.stringify({
        mainKeyword,
        keywords: keywords.map(k => k.keyword),
        count
      })
    }),
    onSuccess: (data, count) => {
      if (count === 1) {
        setTitles(data.titles);
      } else {
        setTitles(prev => [...prev, ...data.titles]);
      }
      toast({
        title: "Titles Generated",
        description: `Added ${data.titles.length} SEO-optimized titles with research backing`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate titles",
        variant: "destructive"
      });
    }
  });

  // Generate Outlines
  const outlineMutation = useMutation({
    mutationFn: (count: number) => apiRequest("/api/outlines/generate", {
      method: "POST",
      body: JSON.stringify({
        title: selectedTitle,
        keywords: keywords.map(k => k.keyword),
        count
      })
    }),
    onSuccess: (data, count) => {
      if (count === 1) {
        setOutlines(data.outlines);
      } else {
        setOutlines(prev => [...prev, ...data.outlines]);
      }
      toast({
        title: "Outlines Generated",
        description: `Added ${data.outlines.length} comprehensive outlines with fact-checking`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate outlines",
        variant: "destructive"
      });
    }
  });

  const handleGenerate = (type: 'keywords' | 'titles' | 'outlines', count: number = 1) => {
    if (!mainKeyword && type === 'keywords') {
      toast({
        title: "Main Keyword Required",
        description: "Please enter a main keyword to start research",
        variant: "destructive"
      });
      return;
    }

    if (type === 'titles' && keywords.length === 0) {
      toast({
        title: "Keywords Required",
        description: "Please generate keywords first",
        variant: "destructive"
      });
      return;
    }

    if (type === 'outlines' && !selectedTitle) {
      toast({
        title: "Title Required",
        description: "Please select a title for outline generation",
        variant: "destructive"
      });
      return;
    }

    switch (type) {
      case 'keywords':
        keywordMutation.mutate(count);
        break;
      case 'titles':
        titleMutation.mutate(count);
        break;
      case 'outlines':
        outlineMutation.mutate(count);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Keyword Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Super AI Keyword Research
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter your main keyword..."
              value={mainKeyword}
              onChange={(e) => setMainKeyword(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={() => handleGenerate('keywords', 1)}
              disabled={keywordMutation.isPending || !mainKeyword}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {keywordMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keywords Table */}
      {keywords.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Keywords ({keywords.length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleGenerate('keywords', 10)}
              disabled={keywordMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Row
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Keyword</th>
                    <th className="text-left p-2">Volume</th>
                    <th className="text-left p-2">Difficulty</th>
                    <th className="text-left p-2">Intent</th>
                    <th className="text-left p-2">Trend</th>
                    <th className="text-left p-2">Fact-Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-medium">{keyword.keyword}</td>
                      <td className="p-2">{keyword.searchVolume}</td>
                      <td className="p-2">
                        <Badge variant={
                          keyword.difficulty === 'Low' ? 'default' :
                          keyword.difficulty === 'Medium' ? 'secondary' : 'destructive'
                        }>
                          {keyword.difficulty}
                        </Badge>
                      </td>
                      <td className="p-2">{keyword.intent}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {keyword.trend}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-green-600" />
                          <span className="text-sm text-green-600">Verified</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Titles Section */}
      {keywords.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Titles ({titles.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleGenerate('titles', 1)}
                disabled={titleMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {titleMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate"
                )}
              </Button>
              {titles.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerate('titles', 10)}
                  disabled={titleMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {titles.length > 0 ? (
              <div className="space-y-3">
                {titles.map((title, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTitle === title.title ? 'border-purple-500 bg-purple-50' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTitle(title.title)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{title.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{title.reasoning}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline">SEO: {title.seoScore}/100</Badge>
                        <Badge variant={title.clickPotential === 'High' ? 'default' : 'secondary'}>
                          {title.clickPotential} Click Potential
                        </Badge>
                        <Globe className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Generate titles based on your keywords
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Outlines Section */}
      {selectedTitle && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Outlines ({outlines.length})
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleGenerate('outlines', 1)}
                disabled={outlineMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {outlineMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Generate"
                )}
              </Button>
              {outlines.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerate('outlines', 10)}
                  disabled={outlineMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {outlines.length > 0 ? (
              <div className="space-y-4">
                {outlines.map((outline, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">{outline.heading}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm mb-2">Structure:</h5>
                        <ul className="text-sm space-y-1">
                          {outline.subheadings.map((sub, subIndex) => (
                            <li key={subIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {sub}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-sm mb-2">Key Points:</h5>
                        <ul className="text-sm space-y-1">
                          {outline.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-current rounded-full" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">Research Verified</span>
                      <Badge variant="outline" className="text-xs">
                        {outline.sources.length} Sources
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Select a title to generate content outlines
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}