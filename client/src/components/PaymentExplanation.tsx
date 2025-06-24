import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, CreditCard, Key, Coins, Sparkles, DollarSign, HelpCircle } from "lucide-react";

interface PaymentExplanationProps {
  onClose?: () => void;
}

export default function PaymentExplanation({ onClose }: PaymentExplanationProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            Understanding ContentScale Pricing
          </CardTitle>
          <p className="text-muted-foreground">
            Choose the best pricing option for your content generation needs
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Credit System Explanation */}
          <div className="bg-purple-50 p-4 rounded-lg border">
            <h3 className="font-semibold flex items-center gap-2 mb-3">
              <Coins className="h-5 w-5 text-purple-600" />
              How Credits Work
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Credit Value</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  1 Credit = $1.00 USD
                </p>
                <p className="text-sm">
                  Credits provide a convenient way to pay for articles without entering payment details each time.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Credit Usage</h4>
                <ul className="text-sm space-y-1">
                  <li>• Credits never expire</li>
                  <li>• Automatically used when available</li>
                  <li>• Same price as direct payment</li>
                  <li>• No hidden fees or markups</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div>
            <h3 className="font-semibold mb-4">Pricing Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* API Key Option */}
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold">With API Key</h4>
                    <Badge variant="outline" className="text-xs">Best Rate</Badge>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">$1.00</div>
                  <p className="text-sm text-muted-foreground mb-3">per article</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>4 free articles first</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>$1/article or 1 credit</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Use your own OpenAI/Gemini keys</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Package */}
              <Card className="border-purple-200 relative">
                <Badge className="absolute -top-2 left-4 bg-purple-600">Best Value</Badge>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Coins className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold">Credits Package</h4>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-2">3-5 Credits</div>
                  <p className="text-sm text-muted-foreground mb-3">per article type</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Bulk articles: 3 credits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Premium articles: 5 credits</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>No payment per article</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Direct Payment */}
              <Card className="border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold">Direct Payment</h4>
                  </div>
                  <div className="text-2xl font-bold text-orange-600 mb-2">$3-$10</div>
                  <p className="text-sm text-muted-foreground mb-3">per article</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Bulk articles: $3</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Premium articles: $10</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>No setup required</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Article Types */}
          <div>
            <h3 className="font-semibold mb-4">Article Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bulk Articles */}
              <Card className="border-blue-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Bulk Articles
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pricing:</strong> $1 (API key) | 3 credits | $3 direct</p>
                    <p><strong>Features:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Standard content generation</li>
                      <li>• SEO optimization</li>
                      <li>• Multiple languages</li>
                      <li>• CRAFT framework</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Articles */}
              <Card className="border-orange-100">
                <CardContent className="p-4">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-orange-600" />
                    Premium Articles
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Pricing:</strong> 5 credits | $10 direct</p>
                    <p><strong>Enhanced Features:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Premium AI models (GPT-4, Claude)</li>
                      <li>• Advanced CRAFT framework</li>
                      <li>• Government source citations</li>
                      <li>• Google AI Overview optimization</li>
                      <li>• Priority processing</li>
                      <li>• Enhanced research depth</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Getting Started */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold mb-3 text-green-800">Getting Started</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">1. Try Free</h4>
                <p className="text-muted-foreground">
                  Start with your first free article to test the platform
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">2. Add API Key</h4>
                <p className="text-muted-foreground">
                  Get 4 free articles + $1 rate by adding your OpenAI/Gemini key
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">3. Buy Credits</h4>
                <p className="text-muted-foreground">
                  Purchase credits for convenient article generation
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h3 className="font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-200 pl-4">
                <h4 className="font-medium">Why add my API key?</h4>
                <p className="text-sm text-muted-foreground">
                  Your API key gives you the lowest rates ($1/article) and 4 free articles. 
                  We use your key to generate content, so you control costs and usage.
                </p>
              </div>
              <div className="border-l-4 border-purple-200 pl-4">
                <h4 className="font-medium">How do credits work?</h4>
                <p className="text-sm text-muted-foreground">
                  Credits are prepaid tokens (1 credit = $1). They're automatically used when available 
                  and provide the same pricing as direct payment but with more convenience.
                </p>
              </div>
              <div className="border-l-4 border-orange-200 pl-4">
                <h4 className="font-medium">What's the difference between bulk and premium?</h4>
                <p className="text-sm text-muted-foreground">
                  Premium articles use advanced AI models (GPT-4, Claude) with enhanced features like 
                  government citations and Google AI optimization. Bulk articles use standard AI with core features.
                </p>
              </div>
            </div>
          </div>

          {onClose && (
            <div className="flex justify-end">
              <Button onClick={onClose} variant="outline">
                Got it, thanks!
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}