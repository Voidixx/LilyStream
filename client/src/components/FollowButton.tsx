import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserPlus, UserMinus, Bell, BellOff } from "lucide-react";

interface FollowButtonProps {
  channelId: string;
  subscriberCount?: number;
  className?: string;
  size?: "sm" | "default" | "lg";
  showCount?: boolean;
}

export default function FollowButton({ 
  channelId, 
  subscriberCount = 0, 
  className = "", 
  size = "default",
  showCount = true 
}: FollowButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [optimisticCount, setOptimisticCount] = useState(subscriberCount);

  // Check subscription status
  const { data: subscriptionStatus } = useQuery({
    queryKey: ['/api/users', channelId, 'subscription-status'],
    enabled: !!user && user.id !== channelId,
  });

  const isSubscribed = subscriptionStatus?.isSubscribed || false;

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/users/${channelId}/subscribe`);
    },
    onMutate: () => {
      // Optimistic update
      setOptimisticCount(prev => prev + 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', channelId, 'subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Subscribed!",
        description: "You'll get notified about new videos from this channel.",
      });
    },
    onError: (error: any) => {
      // Revert optimistic update
      setOptimisticCount(prev => prev - 1);
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe to channel",
        variant: "destructive",
      });
    },
  });

  // Unsubscribe mutation
  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/users/${channelId}/unsubscribe`);
    },
    onMutate: () => {
      // Optimistic update
      setOptimisticCount(prev => Math.max(0, prev - 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', channelId, 'subscription-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Unsubscribed",
        description: "You won't receive notifications from this channel anymore.",
      });
    },
    onError: (error: any) => {
      // Revert optimistic update
      setOptimisticCount(prev => prev + 1);
      toast({
        title: "Unsubscribe failed",
        description: error.message || "Failed to unsubscribe from channel",
        variant: "destructive",
      });
    },
  });

  const handleToggleSubscription = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to follow channels",
        variant: "destructive",
      });
      return;
    }

    if (isSubscribed) {
      unsubscribeMutation.mutate();
    } else {
      subscribeMutation.mutate();
    }
  };

  // Don't show button for own channel
  if (user?.id === channelId) {
    return null;
  }

  const isLoading = subscribeMutation.isPending || unsubscribeMutation.isPending;

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleToggleSubscription}
        disabled={isLoading}
        size={size}
        variant={isSubscribed ? "outline" : "default"}
        className={`${
          isSubscribed 
            ? "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950" 
            : "bg-red-600 hover:bg-red-700 text-white"
        } ${className}`}
        data-testid={`follow-button-${channelId}`}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : isSubscribed ? (
          <UserMinus className="w-4 h-4 mr-2" />
        ) : (
          <UserPlus className="w-4 h-4 mr-2" />
        )}
        {isSubscribed ? "Unfollow" : "Follow"}
      </Button>
      
      {showCount && (
        <span className="text-sm text-muted-foreground font-medium">
          {optimisticCount.toLocaleString()} {optimisticCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  );
}