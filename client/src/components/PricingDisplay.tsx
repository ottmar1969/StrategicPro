import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Key, Coins, Sparkles } from "lucide-react";

interface PricingDisplayProps {
  user: {
    credits: number;
    freeArticlesUsed: number;
    hasOwnApiKey: boolean;
  };
  onBuyCredits: () => void;
}

export default function PricingDisplay({ user, onBuyCredits }: PricingDisplayProps) {
  const canGenerateFree = () => {
    if (user.freeArticlesUsed === 0) return true;
    if (user.hasOwnApiKey && user.freeArticlesUsed < 4) return true;
    return false;
  };

  const getPricingInfo = () => {
    if (canGenerateFree()) {
      return {
        price: "Free",
        method: "Free Generation",
        description: user.freeArticlesUsed === 0 ? "First article free!" : "API key bonus",
        color: "text-green-600"
      };
    }
    
    if (user.hasOwnApiKey) {
      return {
        price: "$1.00",
        method: "With API Key",
        description: "Best rate with your API key",
        color: "text-blue-600"
      };
    }
    
    if (user.credits >= 3) {
      return {
        price: "3 Credits",
        method: "Bulk with Credits",
        description: "$3.00 value - Same as direct payment",
        color: "text-purple-600"
      };
    }
    
    return {
      price: "$3.00",
      method: "Bulk Direct Payment",
      description: "Standard bulk article rate",
      color: "text-orange-600"
    };
  };

  const pricing = getPricingInfo();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-center justify-center">
          <CreditCard className="h-5 w-5" />
          Choose Your Pricing Plan
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Select the best option for your content generation needs
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Selection */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{pricing.method}</h4>
                <p className="text-sm text-muted-foreground">{pricing.description}</p>
              </div>
              <div className={`text-xl font-bold ${pricing.color}`}>
                {pricing.price}
              </div>
            </div>
          </div>

          {/* All Pricing Options - 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* API Key Option */}
            <div className={`p-4 border-2 rounded-lg transition-all ${user.hasOwnApiKey ? 'border-blue-500 bg-blue-50 shadow-lg' : 'border-gray-200 hover:border-blue-300'}`}>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Key className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">With API Key</span>
                  {user.hasOwnApiKey && <Badge variant="default" className="text-xs">Active</Badge>}
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">$1.00</div>
                <p className="text-sm text-muted-foreground mb-3">per article</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>4 free articles</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Lowest rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Package - Middle Position - MOST PROMINENT */}
            <div className={`p-4 border-2 rounded-lg relative transform hover:scale-105 transition-all shadow-lg ${user.credits > 0 ? 'border-purple-500 bg-purple-50' : 'border-purple-400 bg-purple-50'}`}>
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-sm bg-purple-600 text-white px-3 py-1">Best Value</Badge>
              <div className="text-center pt-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Coins className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Credits Package</span>
                  {user.credits > 0 && <Badge variant="outline" className="text-xs">{user.credits} available</Badge>}
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">3-5 Credits</div>
                <p className="text-sm text-muted-foreground mb-3">($3-$5 value)</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Bulk: 3 credits</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Premium: 5 credits</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>No per-article payment</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Payment */}
            <div className="p-4 border-2 rounded-lg border-orange-200 hover:border-orange-300 transition-all">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">Direct Payment</span>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">$3-$10</div>
                <p className="text-sm text-muted-foreground mb-3">per article</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Bulk: $3</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>Premium: $10</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span>No setup required</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Option */}
          <div className="mt-4 p-4 border rounded-lg border-orange-200 bg-orange-50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Premium Articles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-center p-2 border rounded bg-white">
                <div className="text-sm text-muted-foreground">With Credits</div>
                <div className="text-lg font-bold text-purple-600">5 Credits</div>
                <div className="text-xs text-muted-foreground">($5.00 value)</div>
              </div>
              <div className="text-center p-2 border rounded bg-white">
                <div className="text-sm text-muted-foreground">Direct Payment</div>
                <div className="text-lg font-bold text-orange-600">$10.00</div>
                <div className="text-xs text-muted-foreground">Premium rate</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {user.credits === 0 && !user.hasOwnApiKey && (
              <Button 
                onClick={onBuyCredits}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                <Coins className="h-4 w-4 mr-2" />
                Buy Credits
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => {
                // Navigate to pricing guide tab
                const pricingTab = document.querySelector('[data-state="inactive"][value="pricing"]') as HTMLElement;
                if (pricingTab) pricingTab.click();
              }}
              className="flex-1"
            >
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}