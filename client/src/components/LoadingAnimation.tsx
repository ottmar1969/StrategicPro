import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Search, Zap } from "lucide-react";

interface LoadingAnimationProps {
  isVisible: boolean;
  stage?: string;
}

export default function LoadingAnimation({ isVisible, stage = "generating" }: LoadingAnimationProps) {
  const [dots, setDots] = useState("");
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { icon: Search, text: "Analyzing your request", color: "text-blue-500" },
    { icon: Brain, text: "AI processing content", color: "text-purple-500" },
    { icon: Sparkles, text: "Optimizing for SEO", color: "text-green-500" },
    { icon: Zap, text: "Finalizing content", color: "text-orange-500" }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);

    const stageInterval = setInterval(() => {
      setCurrentStage(prev => (prev + 1) % stages.length);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(stageInterval);
    };
  }, [isVisible, stages.length]);

  const CurrentIcon = stages[currentStage].icon;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-96 border-0 shadow-2xl">
        <CardContent className="p-8 text-center">
          {/* Main Loading Animation */}
          <div className="mb-6">
            <div className="relative">
              {/* Pulsing background circle */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse opacity-20"></div>
                <div className="absolute inset-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-spin opacity-30"></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <CurrentIcon className={`h-6 w-6 ${stages[currentStage].color} animate-bounce`} />
                </div>
              </div>
            </div>
          </div>

          {/* Thinking Text */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Thinking{dots}
              </h3>
            </div>
            <p className={`text-sm transition-all duration-500 ${stages[currentStage].color} font-medium`}>
              {stages[currentStage].text}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              {stages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStage 
                      ? 'bg-purple-500 w-6' 
                      : index < currentStage 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {/* Stage List */}
            <div className="text-left space-y-2 max-w-xs mx-auto">
              {stages.map((stageItem, index) => {
                const StageIcon = stageItem.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                      index === currentStage
                        ? 'font-medium text-purple-600'
                        : index < currentStage
                          ? 'text-green-600'
                          : 'text-gray-400'
                    }`}
                  >
                    <StageIcon className="h-4 w-4 flex-shrink-0" />
                    <span>{stageItem.text}</span>
                    {index === currentStage && (
                      <div className="ml-auto">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    )}
                    {index < currentStage && (
                      <div className="ml-auto">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom message */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Creating high-quality, SEO-optimized content with AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}