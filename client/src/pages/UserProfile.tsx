import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/VideoCard";
import { 
  Users, 
  Play, 
  Eye, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Settings, 
  Bell,
  BellOff,
  CheckCircle,
  MoreVertical,
  Share,
  Flag
} from "lucide-react";
import { format } from "date-fns";
import { User, Video } from "@shared/schema";

export default function UserProfile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("videos");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const { data: profileUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/users", username],
    enabled: !!username,
  });

  const { data: userVideos, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ["/api/users", username, "videos"],
    enabled: !!username,
  });

  const { data: userPlaylists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["/api/users", username, "playlists"],
    enabled: !!username,
  });

  const isOwnProfile = currentUser?.username === username;

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  const handleSubscribe = () => {
    // TODO: Implement subscription logic
    setIsSubscribed(!isSubscribed);
  };

  const handleNotificationToggle = () => {
    // TODO: Implement notification toggle
    setNotificationsEnabled(!notificationsEnabled);
  };

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  };

  const formatJoinDate = (date: Date) => {
    return format(new Date(date), "MMMM yyyy");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Section */}
      <div className="relative">
        {profileUser.bannerImageUrl ? (
          <img
            src={profileUser.bannerImageUrl}
            alt="Profile banner"
            className="w-full h-48 md:h-64 object-cover"
            data-testid="profile-banner"
          />
        ) : (
          <div 
            className="w-full h-48 md:h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
            data-testid="default-banner"
          />
        )}
        
        {/* Profile Header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-16 md:-mt-20">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background" data-testid="profile-avatar">
                <AvatarImage src={profileUser.profileImageUrl || undefined} />
                <AvatarFallback className="text-2xl font-bold">
                  {getInitials(profileUser)}
                </AvatarFallback>
              </Avatar>

              {/* User Info */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl md:text-3xl font-bold" data-testid="profile-display-name">
                      {profileUser.displayName || profileUser.username}
                    </h1>
                    {profileUser.isVerified && (
                      <CheckCircle className="w-6 h-6 text-blue-500" data-testid="verified-badge" />
                    )}
                  </div>
                  <p className="text-muted-foreground" data-testid="profile-username">
                    @{profileUser.username}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1" data-testid="subscriber-count">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{formatNumber(profileUser.subscriberCount)}</span>
                      <span className="text-muted-foreground">subscribers</span>
                    </div>
                    <div className="flex items-center space-x-1" data-testid="video-count">
                      <Play className="w-4 h-4" />
                      <span className="font-medium">{formatNumber(profileUser.videoCount)}</span>
                      <span className="text-muted-foreground">videos</span>
                    </div>
                    <div className="flex items-center space-x-1" data-testid="total-views">
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{formatNumber(profileUser.totalViews)}</span>
                      <span className="text-muted-foreground">views</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  {!isOwnProfile ? (
                    <>
                      <Button
                        onClick={handleSubscribe}
                        variant={isSubscribed ? "outline" : "default"}
                        className={isSubscribed ? "" : "bg-red-600 hover:bg-red-700"}
                        data-testid="button-subscribe"
                      >
                        {isSubscribed ? "Subscribed" : "Subscribe"}
                      </Button>
                      {isSubscribed && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleNotificationToggle}
                          data-testid="button-notifications"
                        >
                          {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                        </Button>
                      )}
                      <Button variant="outline" size="icon" data-testid="button-share">
                        <Share className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" data-testid="button-more">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" data-testid="button-edit-profile">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileUser.bio && (
                  <p className="text-sm" data-testid="profile-bio">
                    {profileUser.bio}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  {profileUser.location && (
                    <div className="flex items-center space-x-2" data-testid="profile-location">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profileUser.location}</span>
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center space-x-2" data-testid="profile-website">
                      <LinkIcon className="w-4 h-4 text-muted-foreground" />
                      <a 
                        href={profileUser.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {profileUser.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-2" data-testid="profile-join-date">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Joined {formatJoinDate(profileUser.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Channel Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total views</span>
                  <span className="font-medium" data-testid="stats-total-views">
                    {formatNumber(profileUser.totalViews)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Videos uploaded</span>
                  <span className="font-medium" data-testid="stats-video-count">
                    {profileUser.videoCount}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Subscribers</span>
                  <span className="font-medium" data-testid="stats-subscribers">
                    {formatNumber(profileUser.subscriberCount)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="videos" data-testid="tab-videos">Videos</TabsTrigger>
                <TabsTrigger value="playlists" data-testid="tab-playlists">Playlists</TabsTrigger>
                <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="mt-6">
                {videosLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="bg-muted animate-pulse rounded-lg h-48" />
                    ))}
                  </div>
                ) : userVideos && userVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="videos-grid">
                    {userVideos.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-videos">
                    <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No videos yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "Upload your first video to get started!" 
                        : "This channel hasn't uploaded any videos yet."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="playlists" className="mt-6">
                {playlistsLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-muted animate-pulse rounded-lg h-24" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12" data-testid="no-playlists">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? "Create your first playlist to organize your videos!" 
                        : "This channel hasn't created any public playlists yet."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {profileUser.bio && (
                        <div>
                          <h3 className="font-medium mb-2">Description</h3>
                          <p className="text-muted-foreground whitespace-pre-wrap" data-testid="about-description">
                            {profileUser.bio}
                          </p>
                        </div>
                      )}

                      <div>
                        <h3 className="font-medium mb-2">Details</h3>
                        <div className="space-y-2 text-sm">
                          {profileUser.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>Location: {profileUser.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>Joined: {formatJoinDate(profileUser.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span>Total views: {formatNumber(profileUser.totalViews)}</span>
                          </div>
                        </div>
                      </div>

                      {profileUser.website && (
                        <div>
                          <h3 className="font-medium mb-2">Links</h3>
                          <a 
                            href={profileUser.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center space-x-2"
                          >
                            <LinkIcon className="w-4 h-4" />
                            <span>{profileUser.website}</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}