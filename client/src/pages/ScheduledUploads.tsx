
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Edit, Trash2, Play } from "lucide-react";
import { format, isAfter } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScheduledVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  scheduledAt: string;
  status: 'scheduled' | 'published' | 'failed';
  createdAt: string;
}

export default function ScheduledUploads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: scheduledVideos = [], isLoading } = useQuery({
    queryKey: ['/api/videos/scheduled'],
    queryFn: () => apiRequest('/api/videos/scheduled'),
  });

  const publishNowMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return apiRequest(`/api/videos/${videoId}/publish-now`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      toast({
        title: "Video published",
        description: "Your video has been published successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/scheduled'] });
    },
    onError: () => {
      toast({
        title: "Failed to publish",
        description: "There was an error publishing your video",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      return apiRequest(`/api/videos/${videoId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Video deleted",
        description: "Scheduled video has been deleted"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos/scheduled'] });
    },
    onError: () => {
      toast({
        title: "Failed to delete",
        description: "There was an error deleting the video",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (video: ScheduledVideo) => {
    const scheduledDate = new Date(video.scheduledAt);
    const now = new Date();

    if (video.status === 'published') {
      return <Badge variant="default">Published</Badge>;
    }
    if (video.status === 'failed') {
      return <Badge variant="destructive">Failed</Badge>;
    }
    if (isAfter(now, scheduledDate)) {
      return <Badge variant="secondary">Pending</Badge>;
    }
    return <Badge variant="outline">Scheduled</Badge>;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Scheduled Uploads</h1>
              <p className="text-muted-foreground mt-2">
                Manage your scheduled video uploads and publish queue
              </p>
            </div>
            <Button onClick={() => window.location.href = '/upload'}>
              <Video className="w-4 h-4 mr-2" />
              New Upload
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-32 h-20 bg-muted rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scheduledVideos.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No Scheduled Videos</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  You don't have any videos scheduled for upload. Create your first scheduled upload to get started.
                </p>
                <Button onClick={() => window.location.href = '/upload'}>
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Upload
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {scheduledVideos.map((video: ScheduledVideo) => (
                <Card key={video.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Thumbnail */}
                      <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {video.thumbnailUrl ? (
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-8 h-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground truncate">
                            {video.title}
                          </h3>
                          {getStatusBadge(video)}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {video.description || "No description"}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Scheduled: {format(new Date(video.scheduledAt), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{format(new Date(video.scheduledAt), 'hh:mm a')}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          {video.status === 'scheduled' && (
                            <Button
                              size="sm"
                              onClick={() => publishNowMutation.mutate(video.id)}
                              disabled={publishNowMutation.isPending}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Publish Now
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => deleteMutation.mutate(video.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
