import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCard from "@/components/VideoCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { History, Trash2, Clock } from "lucide-react";

export default function WatchHistory() {
  const { user } = useAuth();

  const { data: watchHistory, isLoading, error } = useQuery({
    queryKey: ['/api/watch-history'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Login Required</CardTitle>
                <CardDescription>Please log in to view your watch history</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-64" />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Watch History</h1>
                <p className="text-muted-foreground">
                  {watchHistory?.length || 0} videos watched
                </p>
              </div>
            </div>
            
            {watchHistory && watchHistory.length > 0 && (
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear History
              </Button>
            )}
          </div>

          {/* Content */}
          {!watchHistory || watchHistory.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Watch History</h3>
                <p className="text-muted-foreground mb-6">
                  Videos you watch will appear here so you can easily find them later.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Discover Videos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {watchHistory.map((item: any) => (
                <div key={`${item.video.id}-${item.watchedAt}`} className="space-y-2">
                  <VideoCard video={item.video} />
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>Watched {new Date(item.watchedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}