import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, Download, CreditCard, Key, ShieldCheck, Sparkles, Target, Globe, Search, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import KeywordResearchTable from "@/components/KeywordResearchTable";
import PricingDisplay from "@/components/PricingDisplay";

const ContentGenerationSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  audience: z.string().min(3, "Audience must be at least 3 characters"),
  niche: z.string().min(3, "Niche must be at least 3 characters"),
  keywords: z.string().min(10, "Keywords must be at least 10 characters"),
  wordCount: z.number().min(100).max(5000),
  language: z.string().min(2, "Language is required"),
  tone: z.enum(["professional", "casual", "friendly", "authoritative", "conversational"]),
  contentType: z.enum(["blog", "article", "social", "email", "product", "landing"]),
  aiModel: z.enum(["default", "gpt-4", "claude", "gemini-pro"]).optional()
});

type ContentFormData = z.infer<typeof ContentGenerationSchema>;

const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter Pack", credits: 5, price: 25, pricePerCredit: 5.00, popular: false },
  { id: "popular", name: "Popular Pack", credits: 10, price: 40, pricePerCredit: 4.00, popular: true, savings: 20 },
  { id: "professional", name: "Professional Pack", credits: 25, price: 75, pricePerCredit: 3.00, popular: false, savings: 40 }
];

const AI_MODELS = [
  {
    id: "default",
    name: "Default",
    description: "Best overall performance for most content types",
    credits: 1,
    features: ["Fast generation", "SEO optimized", "Multi-language support"]
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Advanced reasoning and creative writing capabilities",
    credits: 2,
    features: ["Superior creativity", "Complex analysis", "Technical accuracy"]
  },
  {
    id: "claude",
    name: "Claude",
    description: "Excellent for analytical and research-heavy content",
    credits: 2,
    features: ["Research synthesis", "Detailed analysis", "Professional tone"]
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    description: "Google's most capable model for content generation",
    credits: 1,
    features: ["Real-time data", "Multimodal input", "Fast processing"]
  }
];

export default function ContentWriter() {
  const [user, setUser] = useState({ credits: 0, freeArticlesUsed: 0, hasOwnApiKey: false });
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
  const [apiKeys, setApiKeys] = useState({ openai: "", gemini: "" });
  const [selectedModel, setSelectedModel] = useState("default");
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(ContentGenerationSchema),
    defaultValues: {
      topic: "",
      audience: "",
      niche: "",
      keywords: "",
      wordCount: 1000,
      language: "English",
      tone: "professional",
      contentType: "blog",
      aiModel: "default"
    }
  });

  // Check user eligibility
  const eligibilityMutation = useMutation({
    mutationFn: () => apiRequest("/api/content/check-eligibility", { method: "POST" }),
    onSuccess: (data) => {
      setUser(data.user);
    }
  });

  // Generate content
  const generateMutation = useMutation({
    mutationFn: (data: ContentFormData) => apiRequest("/api/content/generate", {
      method: "POST",
      body: JSON.stringify(data)
    }),
    onSuccess: (data) => {
      setGeneratedContent(data);
      setUser(data.user);
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready with CRAFT optimization."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Save API keys
  const saveApiKeysMutation = useMutation({
    mutationFn: (keys: { openai?: string; gemini?: string }) => 
      apiRequest("/api/content/api-keys", {
        method: "POST",
        body: JSON.stringify(keys)
      }),
    onSuccess: () => {
      setUser(prev => ({ ...prev, hasOwnApiKey: true }));
      setShowApiKeyForm(false);
      toast({
        title: "API Keys Saved",
        description: "You now get 4 free articles and $1/article pricing!"
      });
    }
  });

  useEffect(() => {
    eligibilityMutation.mutate();
  }, []);

  const onSubmit = (data: ContentFormData) => {
    generateMutation.mutate(data);
  };

  const canGenerateFree = () => {
    if (user.freeArticlesUsed === 0) return true; // First article always free
    if (user.hasOwnApiKey && user.freeArticlesUsed < 4) return true; // 4 free with API key
    return false;
  };

  const getPrice = () => {
    if (canGenerateFree()) return 0;
    if (user.hasOwnApiKey) return 1;
    // Bulk articles without API key: $3, Premium articles: $10
    return 3; // Default to bulk pricing, premium will be separate
  };

  const getCreditCost = () => {
    if (canGenerateFree()) return 0;
    if (user.hasOwnApiKey) return 1; // 1 credit = $1 with API key
    return 3; // 3 credits = $3 for bulk without API key
  };

  const getPremiumPrice = () => {
    return user.credits >= 5 ? 5 : 10; // 5 credits or $10
  };

  const getPremiumCreditCost = () => {
    return 5; // 5 credits for premium articles
  };

  const getFreeRemaining = () => {
    if (user.freeArticlesUsed === 0) return "First article free!";
    if (user.hasOwnApiKey) return `${4 - user.freeArticlesUsed} free articles remaining`;
    return "No free articles remaining";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wand2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Content Writer</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-4">
            Generate SEO-optimized content with our advanced CRAFT framework
          </p>
          
          {/* User Status */}
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant={canGenerateFree() ? "default" : "secondary"}>
              {getFreeRemaining()}
            </Badge>
            <Badge variant="outline">
              Credits: {user.credits}
            </Badge>
            {user.hasOwnApiKey && (
              <Badge variant="default">
                <Key className="h-3 w-3 mr-1" />
                API Key Active
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="research" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="research" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Super AI Research
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Content Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="mt-6">
            <KeywordResearchTable />
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Content Generation Form */}
              <div className="lg:col-span-2">
                <PricingDisplay 
                  user={user} 
                  onBuyCredits={() => {
                    toast({
                      title: "Credit Purchase",
                      description: "Credit purchase feature coming soon!"
                    });
                  }}
                />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Content Generation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Digital Marketing Strategies" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="audience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Small business owners" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="niche"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Niche/Industry</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., E-commerce, SaaS, Healthcare" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                                <SelectItem value="Italian">Italian</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords (comma-separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="SEO, content marketing, digital strategy, ROI" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* AI Model Selection */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">AI SETTINGS</h4>
                      <FormField
                        control={form.control}
                        name="aiModel"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <FormLabel className="flex items-center gap-2">
                                  🤖 AI Model
                                </FormLabel>
                                <button
                                  type="button"
                                  onClick={() => setShowApiKeyInfo(!showApiKeyInfo)}
                                  className="text-blue-600 text-sm hover:underline"
                                >
                                  What is Real-Time SEO?
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-purple-600 font-medium">
                                  ⚡ {AI_MODELS.find(m => m.id === selectedModel)?.credits || 1} credit
                                </span>
                              </div>
                            </div>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedModel(value);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {AI_MODELS.map((model) => (
                                  <SelectItem key={model.id} value={model.id}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{model.name}</span>
                                      <span className="text-xs text-gray-500 ml-2">
                                        {model.credits} credit{model.credits > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                            
                            {/* Model Description */}
                            {selectedModel && (
                              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm font-medium text-blue-900 mb-1">
                                  {AI_MODELS.find(m => m.id === selectedModel)?.name}
                                </p>
                                <p className="text-sm text-blue-700 mb-2">
                                  {AI_MODELS.find(m => m.id === selectedModel)?.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {AI_MODELS.find(m => m.id === selectedModel)?.features.map((feature, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </FormItem>
                        )}
                      />

                      {/* AI Model Info Popup */}
                      {showApiKeyInfo && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="font-semibold text-yellow-800 mb-2">Real-Time SEO</h5>
                          <p className="text-sm text-yellow-700 mb-3">
                            Our AI models use real-time data and advanced algorithms to optimize your content for search engines. 
                            Each model has different strengths for various content types and industries.
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm text-yellow-700">
                              <strong>Default:</strong> Best for general content with balanced SEO optimization
                            </p>
                            <p className="text-sm text-yellow-700">
                              <strong>GPT-4:</strong> Superior for creative and technical content requiring complex reasoning
                            </p>
                            <p className="text-sm text-yellow-700">
                              <strong>Claude:</strong> Excellent for research-heavy and analytical content
                            </p>
                            <p className="text-sm text-yellow-700">
                              <strong>Gemini Pro:</strong> Google's model with real-time data access and multimodal capabilities
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowApiKeyInfo(false)}
                            className="mt-2 text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            Close
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="wordCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Count</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="100" 
                                max="5000"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                <SelectItem value="conversational">Conversational</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contentType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="blog">Blog Post</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="social">Social Media</SelectItem>
                                <SelectItem value="email">Email Copy</SelectItem>
                                <SelectItem value="product">Product Description</SelectItem>
                                <SelectItem value="landing">Landing Page</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium">
                            Price: {canGenerateFree() ? "FREE" : `$${getPrice()}`}
                          </p>
                          {!user.hasOwnApiKey && (
                            <p className="text-sm text-muted-foreground">
                              Add your API key to get 10 free articles and $1 pricing
                            </p>
                          )}
                        </div>
                        {!canGenerateFree() && user.credits === 0 && (
                          <Button variant="outline" size="sm">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Buy Credits
                          </Button>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={generateMutation.isPending}
                      >
                        {generateMutation.isPending ? (
                          <>
                            <Wand2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Content...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Content {!canGenerateFree() && `($${getPrice()})`}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Keys Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Keys
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user.hasOwnApiKey ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Add your own API keys to get 10 free articles and $1/article pricing instead of $10/article.
                    </p>
                    <Button 
                      onClick={() => setShowApiKeyForm(!showApiKeyForm)}
                      variant="outline" 
                      className="w-full"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Add API Keys
                    </Button>
                    
                    {showApiKeyForm && (
                      <div className="space-y-3 border-t pt-4">
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <h5 className="font-semibold text-blue-800 mb-2">Get Your API Keys</h5>
                          <div className="space-y-2 text-sm text-blue-700">
                            <p><strong>OpenAI API Key:</strong></p>
                            <p>1. Go to platform.openai.com/api-keys</p>
                            <p>2. Create new secret key</p>
                            <p>3. Copy key (starts with sk-)</p>
                            
                            <p className="mt-3"><strong>Google Gemini API Key:</strong></p>
                            <p>1. Go to makersuite.google.com/app/apikey</p>
                            <p>2. Create API key</p>
                            <p>3. Copy key</p>
                          </div>
                        </div>
                        
                        <Input
                          placeholder="OpenAI API Key (sk-...)"
                          type="password"
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                        />
                        <Input
                          placeholder="Google Gemini API Key"
                          type="password"
                          value={apiKeys.gemini}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, gemini: e.target.value }))}
                        />
                        <Button
                          onClick={() => saveApiKeysMutation.mutate(apiKeys)}
                          disabled={!apiKeys.openai && !apiKeys.gemini}
                          size="sm"
                          className="w-full"
                        >
                          Save Keys
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Your keys are encrypted and stored securely
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ShieldCheck className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="font-medium text-green-600">API Keys Active</p>
                    <p className="text-sm text-muted-foreground">4 free articles, $1/article after</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Packages */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Packages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CREDIT_PACKAGES.map((pkg) => (
                  <div key={pkg.id} className="border rounded-lg p-3 relative">
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-2 text-xs">Popular</Badge>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{pkg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.credits} credits • ${pkg.pricePerCredit}/credit
                        </p>
                        {pkg.savings && (
                          <p className="text-sm text-green-600">{pkg.savings}% savings</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${pkg.price}</p>
                        <Button size="sm" variant="outline">Buy</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CRAFT Framework */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  CRAFT Framework
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>C</strong>ut - Remove unnecessary content</div>
                  <div><strong>R</strong>eview - Check for accuracy</div>
                  <div><strong>A</strong>dd - Enhance with relevant info</div>
                  <div><strong>F</strong>act-check - Verify all claims</div>
                  <div><strong>T</strong>rust - Build credibility</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Generated Content Display */}
        {generatedContent && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generated Content
                </CardTitle>
                <div className="flex gap-2">
                  <Badge>SEO Score: {generatedContent.seoScore}/100</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Title:</h3>
                  <p className="text-lg">{generatedContent.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Content:</h3>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {generatedContent.content}
                    </pre>
                  </div>
                </div>
                {generatedContent.metadata && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">CRAFT Analysis:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Keywords Used:</strong> {generatedContent.metadata.keywords}
                      </div>
                      <div>
                        <strong>Target Audience:</strong> {generatedContent.metadata.audience}
                      </div>
                      <div>
                        <strong>Word Count:</strong> {generatedContent.metadata.wordCount}
                      </div>
                      <div>
                        <strong>Language:</strong> {generatedContent.metadata.language}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}