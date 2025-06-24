import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, Plus, Globe, TrendingUp, Target, FileText, ExternalLink, Trash2 } from "lucide-react";
import LinkAnalysisPanel from "@/components/LinkAnalysisPanel";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface KeywordData {
  keyword: string;
  searchVolume: string;
  difficulty: string;
  intent: string;
  trend: string;
  competition: string;
  aiOverviewPotential: string;
  factChecked: boolean;
  sources: string[];
  analysis: string;
}

interface TitleData {
  title: string;
  seoScore: number;
  clickPotential: string;
  aiOverviewPotential: string;
  aiModeScore: number;
  factChecked: boolean;
  sources: string[];
  reasoning: string;
}

interface OutlineData {
  heading: string;
  subheadings: string[];
  keyPoints: string[];
  aiOptimizationNotes: string;
  featuredSnippetSections: string[];
  faqSections: string[];
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
  const [selectedWebsite, setSelectedWebsite] = useState("");
  const [websites, setWebsites] = useState([
    "contentscale.site"
  ]);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [showAddWebsite, setShowAddWebsite] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<number[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<number[]>([]);
  const [selectedOutlines, setSelectedOutlines] = useState<number[]>([]);
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

  const handleAddWebsite = () => {
    if (!newWebsiteUrl.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    let cleanUrl = newWebsiteUrl.trim();
    // Remove protocol if present
    cleanUrl = cleanUrl.replace(/^https?:\/\//, '');
    // Remove www if present
    cleanUrl = cleanUrl.replace(/^www\./, '');
    // Remove trailing slash
    cleanUrl = cleanUrl.replace(/\/$/, '');

    if (websites.includes(cleanUrl)) {
      toast({
        title: "Website Already Added",
        description: `${cleanUrl} is already in your website list`,
        variant: "destructive"
      });
      return;
    }

    setWebsites(prev => [...prev, cleanUrl]);
    setSelectedWebsite(cleanUrl);
    setNewWebsiteUrl("");
    setShowAddWebsite(false);
    toast({
      title: "Website Added Successfully",
      description: `${cleanUrl} has been added to your website list`
    });
  };

  const handleWebsiteSelect = (value: string) => {
    if (value === "add_new") {
      setShowAddWebsite(true);
    } else {
      setSelectedWebsite(value);
      toast({
        title: "Website Selected",
        description: `Now analyzing content for ${value}`
      });
    }
  };

  // Row selection handlers
  const handleKeywordSelect = (index: number, selected: boolean) => {
    if (selected) {
      setSelectedKeywords(prev => [...prev, index]);
    } else {
      setSelectedKeywords(prev => prev.filter(i => i !== index));
    }
  };

  const handleTitleSelect = (index: number, selected: boolean) => {
    if (selected) {
      setSelectedTitles(prev => [...prev, index]);
    } else {
      setSelectedTitles(prev => prev.filter(i => i !== index));
    }
  };

  const handleOutlineSelect = (index: number, selected: boolean) => {
    if (selected) {
      setSelectedOutlines(prev => [...prev, index]);
    } else {
      setSelectedOutlines(prev => prev.filter(i => i !== index));
    }
  };

  // Delete handlers
  const handleDeleteKeywords = () => {
    if (selectedKeywords.length === 0) return;
    
    const newKeywords = keywords.filter((_, index) => !selectedKeywords.includes(index));
    setKeywords(newKeywords);
    setSelectedKeywords([]);
    
    toast({
      title: "Keywords Deleted",
      description: `Removed ${selectedKeywords.length} keyword${selectedKeywords.length > 1 ? 's' : ''}`
    });
  };

  const handleDeleteTitles = () => {
    if (selectedTitles.length === 0) return;
    
    const newTitles = titles.filter((_, index) => !selectedTitles.includes(index));
    setTitles(newTitles);
    setSelectedTitles([]);
    
    toast({
      title: "Titles Deleted",
      description: `Removed ${selectedTitles.length} title${selectedTitles.length > 1 ? 's' : ''}`
    });
  };

  const handleDeleteOutlines = () => {
    if (selectedOutlines.length === 0) return;
    
    const newOutlines = outlines.filter((_, index) => !selectedOutlines.includes(index));
    setOutlines(newOutlines);
    setSelectedOutlines([]);
    
    toast({
      title: "Outlines Deleted",
      description: `Removed ${selectedOutlines.length} outline${selectedOutlines.length > 1 ? 's' : ''}`
    });
  };

  // Select all handlers
  const handleSelectAllKeywords = (selected: boolean) => {
    if (selected) {
      setSelectedKeywords(keywords.map((_, index) => index));
    } else {
      setSelectedKeywords([]);
    }
  };

  const handleSelectAllTitles = (selected: boolean) => {
    if (selected) {
      setSelectedTitles(titles.map((_, index) => index));
    } else {
      setSelectedTitles([]);
    }
  };

  const handleSelectAllOutlines = (selected: boolean) => {
    if (selected) {
      setSelectedOutlines(outlines.map((_, index) => index));
    } else {
      setSelectedOutlines([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Website Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Select a Website
            <Badge variant="outline" className="ml-2">Unlimited internal URLs crawlable</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedWebsite} onValueChange={handleWebsiteSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a website or add new..." />
            </SelectTrigger>
            <SelectContent>
              {websites.map((website) => (
                <SelectItem key={website} value={website}>
                  {website}
                </SelectItem>
              ))}
              <SelectItem value="add_new" className="text-blue-600 font-medium">
                + Add new website...
              </SelectItem>
            </SelectContent>
          </Select>
          
          {selectedWebsite && selectedWebsite !== "add_new" && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-3 w-3" />
              <span>Selected: {selectedWebsite}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Website Dialog */}
      <Dialog open={showAddWebsite} onOpenChange={(open) => {
        setShowAddWebsite(open);
        if (!open) setNewWebsiteUrl("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Website</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="website-url">Website URL</Label>
              <Input
                id="website-url"
                placeholder="e.g., mywebsite.com or example.org"
                value={newWebsiteUrl}
                onChange={(e) => setNewWebsiteUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddWebsite();
                  }
                }}
                className="mt-1"
                autoFocus
              />
              <p className="text-sm text-muted-foreground mt-1">
                Enter domain without http:// or www. (e.g., contentscale.site)
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setShowAddWebsite(false);
                setNewWebsiteUrl("");
              }}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddWebsite} 
                disabled={!newWebsiteUrl.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Website
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
              {selectedKeywords.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedKeywords.length} selected
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {selectedKeywords.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteKeywords}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedKeywords.length})
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleGenerate('keywords', 10)}
                disabled={keywordMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="w-10 p-2">
                      <Checkbox
                        checked={selectedKeywords.length === keywords.length && keywords.length > 0}
                        onCheckedChange={handleSelectAllKeywords}
                      />
                    </th>
                    <th className="text-left p-2">Keyword</th>
                    <th className="text-left p-2">Volume</th>
                    <th className="text-left p-2">Difficulty</th>
                    <th className="text-left p-2">Intent</th>
                    <th className="text-left p-2">AI Overview</th>
                    <th className="text-left p-2">Fact-Checked</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((keyword, index) => (
                    <tr key={index} className={`border-b hover:bg-muted/50 ${selectedKeywords.includes(index) ? 'bg-blue-50' : ''}`}>
                      <td className="p-2">
                        <Checkbox
                          checked={selectedKeywords.includes(index)}
                          onCheckedChange={(checked) => handleKeywordSelect(index, checked as boolean)}
                        />
                      </td>
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
                        <Badge variant={
                          keyword.aiOverviewPotential === 'High' ? 'default' :
                          keyword.aiOverviewPotential === 'Medium' ? 'secondary' : 'outline'
                        } className="text-xs">
                          {keyword.aiOverviewPotential}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-green-600" />
                          <span className="text-sm text-green-600">AI Optimized</span>
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
              {selectedTitles.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedTitles.length} selected
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {selectedTitles.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteTitles}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedTitles.length})
                </Button>
              )}
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
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedTitles.length === titles.length && titles.length > 0}
                    onCheckedChange={handleSelectAllTitles}
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>
                {titles.map((title, index) => (
                  <div 
                    key={index} 
                    className={`p-3 border rounded-lg transition-colors ${
                      selectedTitles.includes(index) ? 'border-blue-500 bg-blue-50' : 
                      selectedTitle === title.title ? 'border-purple-500 bg-purple-50' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTitles.includes(index)}
                        onCheckedChange={(checked) => handleTitleSelect(index, checked as boolean)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedTitle(title.title)}
                      >
                        <h4 className="font-medium">{title.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{title.reasoning}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 flex-wrap">
                        <Badge variant="outline">SEO: {title.seoScore}/100</Badge>
                        <Badge variant={title.clickPotential === 'High' ? 'default' : 'secondary'}>
                          {title.clickPotential} CTR
                        </Badge>
                        <Badge variant={title.aiOverviewPotential === 'High' ? 'default' : 'outline'} className="bg-blue-100 text-blue-800">
                          AI Overview: {title.aiOverviewPotential}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          AI Mode: {title.aiModeScore}/10
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
              {selectedOutlines.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedOutlines.length} selected
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              {selectedOutlines.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteOutlines}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedOutlines.length})
                </Button>
              )}
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
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded">
                  <Checkbox
                    checked={selectedOutlines.length === outlines.length && outlines.length > 0}
                    onCheckedChange={handleSelectAllOutlines}
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>
                {outlines.map((outline, index) => (
                  <div key={index} className={`p-4 border rounded-lg transition-colors ${
                    selectedOutlines.includes(index) ? 'border-blue-500 bg-blue-50' : 'hover:bg-muted/50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedOutlines.includes(index)}
                        onCheckedChange={(checked) => handleOutlineSelect(index, checked as boolean)}
                      />
                      <div className="flex-1">
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
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Globe className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">AI Overview Optimized</span>
                            <Badge variant="outline" className="text-xs">
                              {outline.sources.length} Sources
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                              {outline.featuredSnippetSections.length} Snippet Sections
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800">
                              {outline.faqSections.length} FAQ Items
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{outline.aiOptimizationNotes}</p>
                        </div>
                      </div>
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

      {/* Link Analysis Section */}
      {selectedWebsite && mainKeyword && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Link Analysis & Strategy
              <Badge variant="outline" className="ml-2">AI-Powered</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LinkAnalysisPanel 
              keyword={mainKeyword}
              selectedWebsite={selectedWebsite}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}