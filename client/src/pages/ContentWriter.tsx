import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Wand2, Download, CreditCard, Key, ShieldCheck, Sparkles, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const ContentGenerationSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters"),
  audience: z.string().min(3, "Audience must be at least 3 characters"),
  niche: z.string().min(3, "Niche must be at least 3 characters"),
  keywords: z.string().min(10, "Keywords must be at least 10 characters"),
  wordCount: z.number().min(100).max(5000),
  language: z.string().min(2, "Language is required"),
  tone: z.enum(["professional", "casual", "friendly", "authoritative", "conversational"]),
  contentType: z.enum(["blog", "article", "social", "email", "product", "landing"])
});

type ContentFormData = z.infer<typeof ContentGenerationSchema>;

const CREDIT_PACKAGES = [
  { id: "starter", name: "Starter Pack", credits: 5, price: 25, pricePerCredit: 5.00, popular: false },
  { id: "popular", name: "Popular Pack", credits: 10, price: 40, pricePerCredit: 4.00, popular: true, savings: 20 },
  { id: "professional", name: "Professional Pack", credits: 25, price: 75, pricePerCredit: 3.00, popular: false, savings: 40 }
];

export default function ContentWriter() {
  const [user, setUser] = useState({ credits: 0, freeArticlesUsed: 0, hasOwnApiKey: false });
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [apiKeys, setApiKeys] = useState({ openai: "", gemini: "" });
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
      contentType: "blog"
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
        description: "You now get 10 free articles and $1/article pricing!"
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
    if (user.hasOwnApiKey && user.freeArticlesUsed < 10) return true; // 10 free with API key
    return false;
  };

  const getPrice = () => {
    if (canGenerateFree()) return 0;
    return user.hasOwnApiKey ? 1 : 10;
  };

  const getFreeRemaining = () => {
    if (user.freeArticlesUsed === 0) return "First article free!";
    if (user.hasOwnApiKey) return `${10 - user.freeArticlesUsed} free articles remaining`;
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Generation Form */}
          <div className="lg:col-span-2">
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
                        <Input
                          placeholder="OpenAI API Key (optional)"
                          type="password"
                          value={apiKeys.openai}
                          onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
                        />
                        <Input
                          placeholder="Google Gemini API Key (optional)"
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
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ShieldCheck className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="font-medium text-green-600">API Keys Active</p>
                    <p className="text-sm text-muted-foreground">10 free articles, $1/article after</p>
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
      </div>
    </div>
  );
}