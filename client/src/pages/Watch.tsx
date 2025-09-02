import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import VideoPlayer from "@/components/VideoPlayer";
import CommentSection from "@/components/CommentSection";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ThumbsUp, ThumbsDown, Share, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Watch() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userLikeStatus, setUserLikeStatus] = useState<'like' | 'dislike' | null>(null);

  const { data: video, isLoading } = useQuery({
    queryKey: ['/api/videos', id],
    enabled: !!id,
  });

  const { data: relatedVideos } = useQuery({
    queryKey: ['/api/videos'],
    enabled: true,
  });

  const { data: likeStatus } = useQuery({
    queryKey: ['/api/videos', id, 'like-status'],
    enabled: !!id && !!user,
  });

  useEffect(() => {
    if (likeStatus) {
      setUserLikeStatus(likeStatus.type);
    }
  }, [likeStatus]);

  // WebSocket connection for real-time comments
  useEffect(() => {
    if (!id) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: 'join-room',
        roomId: `video-${id}`
      }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new-comment') {
        // Invalidate comments query to refresh the list
        queryClient.invalidateQueries({ queryKey: ['/api/videos', id, 'comments'] });
      }
    };

    return () => {
      socket.close();
    };
  }, [id, queryClient]);

  const likeMutation = useMutation({
    mutationFn: async (type: 'like' | 'dislike') => {
      const response = await apiRequest('POST', `/api/videos/${id}/like`, { type });
      return response.json();
    },
    onSuccess: (data) => {
      setUserLikeStatus(userLikeStatus === data.type ? null : data.type);
      queryClient.invalidateQueries({ queryKey: ['/api/videos', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/videos', id, 'like-status'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    },
  });

  const handleLike = (type: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like videos",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate(type);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Video link has been copied to your clipboard",
    });
  };

  if (!id) return <div>Invalid video ID</div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex space-x-3">
                  <Skeleton className="w-32 h-18 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  const filteredRelatedVideos = relatedVideos?.filter((v: any) => 
    v.id !== id && v.privacy === 'public'
  ).slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Video Section */}
            <div className="lg:col-span-2">
              {/* Video Player */}
              <VideoPlayer video={video} />

              {/* Video Info */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-card-foreground mb-4" data-testid="video-title">
                    {video.title}
                  </h1>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={video.user?.profileImageUrl} />
                        <AvatarFallback>
                          {video.user?.firstName?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-card-foreground" data-testid="channel-name">
                          {video.user?.firstName && video.user?.lastName 
                            ? `${video.user.firstName} ${video.user.lastName}`
                            : 'Unknown User'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {video.user?.subscriberCount?.toLocaleString() || 0} subscribers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center bg-muted rounded-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike('like')}
                          className={`px-4 py-2 rounded-l-full ${
                            userLikeStatus === 'like' ? 'text-primary' : ''
                          }`}
                          data-testid="like-button"
                          disabled={likeMutation.isPending}
                        >
                          <ThumbsUp className={`w-4 h-4 mr-2 ${
                            userLikeStatus === 'like' ? 'fill-current' : ''
                          }`} />
                          {video.likes || 0}
                        </Button>
                        <div className="w-px h-6 bg-border" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike('dislike')}
                          className={`px-4 py-2 rounded-r-full ${
                            userLikeStatus === 'dislike' ? 'text-primary' : ''
                          }`}
                          data-testid="dislike-button"
                          disabled={likeMutation.isPending}
                        >
                          <ThumbsDown className={`w-4 h-4 mr-2 ${
                            userLikeStatus === 'dislike' ? 'fill-current' : ''
                          }`} />
                          {video.dislikes || 0}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="px-4 py-2"
                        data-testid="share-button"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="text-muted-foreground text-sm mb-4" data-testid="video-stats">
                    {video.views?.toLocaleString() || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                  </div>
                  
                  {video.description && (
                    <div className="border-t border-border pt-4">
                      <p className="text-card-foreground whitespace-pre-wrap" data-testid="video-description">
                        {video.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments Section */}
              <CommentSection videoId={video.id} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-foreground mb-4">Related Videos</h3>
              <div className="space-y-4">
                {filteredRelatedVideos.map((relatedVideo: any) => (
                  <div key={relatedVideo.id} className="flex space-x-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={relatedVideo.thumbnailUrl || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=180&fit=crop"}
                        alt={relatedVideo.title}
                        className="w-32 h-18 object-cover rounded"
                      />
                      {relatedVideo.duration && (
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 text-xs rounded">
                          {Math.floor(relatedVideo.duration / 60)}:{(relatedVideo.duration % 60).toString().padStart(2, '0')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
                        {relatedVideo.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {relatedVideo.user?.firstName && relatedVideo.user?.lastName
                          ? `${relatedVideo.user.firstName} ${relatedVideo.user.lastName}`
                          : 'Unknown User'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {relatedVideo.views?.toLocaleString() || 0} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
