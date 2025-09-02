import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Eye, Users, Calendar, Edit, BarChart3 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: userVideos, isLoading: videosLoading } = useQuery({
    queryKey: ['/api/videos'],
    enabled: !!user,
    select: (videos: any[]) => videos?.filter(video => video.userId === user?.id) || [],
  });

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ['/api/playlists'],
    enabled: !!user,
  });

  if (isLoading || !isAuthenticated) {
    return null;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const totalViews = userVideos?.reduce((sum: number, video: any) => sum + (video.views || 0), 0) || 0;
  const totalVideos = userVideos?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {/* Cover Image */}
              <div 
                className="relative h-48 mb-8 rounded-lg overflow-hidden"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=300&fit=crop')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/80" />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={user.profileImageUrl} />
                  <AvatarFallback className="text-4xl font-bold">
                    {user.firstName?.[0] || user.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-card-foreground mb-2" data-testid="user-name">
                    {user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.email || 'Unknown User'
                    }
                  </h1>
                  {user.bio && (
                    <p className="text-muted-foreground mb-4" data-testid="user-bio">
                      {user.bio}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="video-count">{totalVideos} videos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="total-views">{totalViews.toLocaleString()} total views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="subscriber-count">
                        {(user.subscriberCount || 0).toLocaleString()} subscribers
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span data-testid="join-date">
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    className="px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    data-testid="edit-profile-button"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-6 py-3 font-semibold"
                    data-testid="analytics-button"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="videos" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos" data-testid="videos-tab">Videos</TabsTrigger>
              <TabsTrigger value="playlists" data-testid="playlists-tab">Playlists</TabsTrigger>
              <TabsTrigger value="about" data-testid="about-tab">About</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-6">
              {videosLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="w-full h-48 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : totalVideos === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">No videos yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Start sharing your content with the world! Upload your first video to get started.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/upload'}
                    className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-all duration-300"
                    data-testid="upload-first-video-button"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Upload Video
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {userVideos?.map((video: any) => (
                    <VideoCard key={video.id} video={video} showOptions />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="playlists" className="space-y-6">
              {playlistsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="w-full h-32 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !playlists || playlists.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">No playlists yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Organize your videos into playlists to make them easier to find and share.
                  </p>
                  <Button 
                    className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-all duration-300"
                    data-testid="create-playlist-button"
                  >
                    Create Playlist
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist: any) => (
                    <Card key={playlist.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="w-full h-32 bg-muted rounded-lg mb-4 flex items-center justify-center">
                          <Video className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-card-foreground mb-1">
                          {playlist.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {playlist.description || 'No description'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">About</h3>
                  <div className="space-y-4">
                    {user.bio ? (
                      <div>
                        <h4 className="font-medium text-card-foreground mb-2">Description</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{user.bio}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic">No description available.</p>
                    )}
                    
                    <div>
                      <h4 className="font-medium text-card-foreground mb-2">Channel Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total videos:</span>
                          <span className="text-card-foreground">{totalVideos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total views:</span>
                          <span className="text-card-foreground">{totalViews.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Joined:</span>
                          <span className="text-card-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
