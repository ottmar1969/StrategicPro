import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Key, Coins } from "lucide-react";

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
        description: "Discounted rate with your API key",
        color: "text-blue-600"
      };
    }
    
    if (user.credits > 0) {
      return {
        price: "1 Credit",
        method: "Credit Payment",
        description: "$5.00 value - 50% savings!",
        color: "text-purple-600"
      };
    }
    
    return {
      price: "$10.00",
      method: "Premium Per Article",
      description: "Pay-per-use premium generation",
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

          {/* All Pricing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            {/* Credit Option */}
            <div className={`p-3 border rounded-lg ${user.credits > 0 && !user.hasOwnApiKey ? 'border-purple-500 bg-purple-50' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <Coins className="h-4 w-4" />
                <span className="font-medium">With Credits</span>
                {user.credits > 0 && <Badge variant="outline" className="text-xs">{user.credits} available</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mb-2">50% savings per article</p>
              <div className="text-lg font-bold text-purple-600">
                1 Credit <span className="text-sm font-normal">($5 value)</span>
              </div>
            </div>
          </div>

          {/* Premium Direct Payment */}
          <div className="p-3 border rounded-lg border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Premium Per Article</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">No credits or API key required</p>
            <div className="text-lg font-bold text-orange-600">$10.00</div>
          </div>

          {/* Buy Credits Button */}
          {user.credits === 0 && !user.hasOwnApiKey && (
            <Button 
              onClick={onBuyCredits}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Coins className="h-4 w-4 mr-2" />
              Buy Credits for 50% Savings
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}