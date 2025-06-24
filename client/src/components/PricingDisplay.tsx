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
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pricing Options
        </CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* API Key Option */}
            <div className={`p-3 border rounded-lg ${user.hasOwnApiKey ? 'border-blue-500 bg-blue-50' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4" />
                <span className="font-medium">With API Key</span>
                {user.hasOwnApiKey && <Badge variant="default" className="text-xs">Active</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">4 free articles + $1/article</p>
              <div className="text-lg font-bold text-blue-600">$1.00</div>
            </div>

            {/* Credit Package - Middle Position */}
            <div className={`p-3 border rounded-lg relative ${user.credits > 0 ? 'border-purple-500 bg-purple-50' : ''}`}>
              <Badge className="absolute -top-2 left-2 text-xs bg-purple-600">Best Value</Badge>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4" />
                <span className="font-medium">Credits Package</span>
                {user.credits > 0 && <Badge variant="outline" className="text-xs">{user.credits} available</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">Bulk: 3 credits • Premium: 5 credits</p>
              <div className="text-lg font-bold text-purple-600">
                $3.00 <span className="text-sm font-normal">/ $5.00</span>
              </div>
            </div>

            {/* Premium Direct Payment */}
            <div className="p-3 border rounded-lg border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Direct Payment</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Bulk: $3 • Premium: $10</p>
              <div className="text-lg font-bold text-orange-600">$3.00 / $10.00</div>
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