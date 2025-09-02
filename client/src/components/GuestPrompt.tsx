import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Heart, Bell, Clock, User, Star, Zap } from "lucide-react";

interface GuestPromptProps {
  feature: "upload" | "like" | "comment" | "subscribe" | "save" | "history";
  onClose: () => void;
  className?: string;
}

const featureInfo = {
  upload: {
    title: "Share Your Content",
    description: "Upload and share your videos with the world",
    icon: Upload,
    benefits: ["Upload unlimited videos", "Schedule publishing", "Analytics dashboard", "Monetization tools"]
  },
  like: {
    title: "Show Your Support",
    description: "Like videos to help creators and improve recommendations",
    icon: Heart,
    benefits: ["Support creators", "Better recommendations", "Save liked videos", "Track your favorites"]
  },
  comment: {
    title: "Join the Conversation",
    description: "Share your thoughts and connect with other viewers",
    icon: User,
    benefits: ["Join discussions", "Get replies", "Build community", "Express yourself"]
  },
  subscribe: {
    title: "Never Miss Content",
    description: "Subscribe to your favorite creators and get notified",
    icon: Bell,
    benefits: ["Get notifications", "Custom feed", "Track new uploads", "Support creators"]
  },
  save: {
    title: "Save for Later",
    description: "Create playlists and save videos to watch later",
    icon: Star,
    benefits: ["Create playlists", "Save progress", "Quick access", "Organize content"]
  },
  history: {
    title: "Track Your Viewing",
    description: "Keep track of what you've watched and resume videos",
    icon: Clock,
    benefits: ["Resume watching", "View history", "Personalized feed", "Track progress"]
  }
};

export function GuestPrompt({ feature, onClose, className = "" }: GuestPromptProps) {
  const [, setLocation] = useLocation();
  const info = featureInfo[feature];
  const Icon = info.icon;

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`} data-testid="guest-prompt-overlay">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl animate-in zoom-in-95 duration-200">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={onClose}
            data-testid="close-guest-prompt"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full text-white">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{info.title}</CardTitle>
              <CardDescription className="text-sm">
                {info.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              What you'll get:
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {info.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm">LilyTube Benefits</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Badge variant="secondary" className="bg-white/50">
                <Star className="w-3 h-3 mr-1" />
                Fair Algorithm
              </Badge>
              <Badge variant="secondary" className="bg-white/50">
                <Zap className="w-3 h-3 mr-1" />
                Fast Platform
              </Badge>
              <Badge variant="secondary" className="bg-white/50">
                No Ads
              </Badge>
              <Badge variant="secondary" className="bg-white/50">
                Privacy First
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setLocation('/auth')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              data-testid="sign-up-button"
            >
              <User className="w-4 h-4 mr-2" />
              Join LilyTube - It's Free!
            </Button>
            
            <div className="text-center">
              <span className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <button
                  onClick={() => setLocation('/auth')}
                  className="text-purple-600 hover:underline"
                  data-testid="sign-in-link"
                >
                  Sign in
                </button>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook to manage guest prompts
export function useGuestPrompt() {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

  const showPrompt = (feature: GuestPromptProps["feature"]) => {
    setCurrentPrompt(feature);
  };

  const hidePrompt = () => {
    setCurrentPrompt(null);
  };

  return {
    currentPrompt: currentPrompt as GuestPromptProps["feature"] | null,
    showPrompt,
    hidePrompt,
  };
}