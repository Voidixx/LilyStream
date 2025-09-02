import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Users, 
  Video, 
  Target,
  Lightbulb,
  BarChart3,
  PieChart,
  Calendar,
  Trophy,
  Zap,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export default function AnalyticsDashboard() {
  const { user } = useAuth();

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/advanced', user?.id],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to view your analytics dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Analytics Unavailable</CardTitle>
            <CardDescription>Failed to load your analytics data. Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { overview, topVideos, categoryStats, recentPerformance, recommendations } = analytics;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Creator Analytics</h1>
              <p className="text-purple-100 mt-2">Advanced insights beyond YouTube Studio</p>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Zap className="w-4 h-4 mr-1" />
              LilyTube Pro Analytics
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Across {overview.totalVideos} videos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.engagementRate}%</div>
              <p className="text-xs text-muted-foreground">
                {overview.engagementRate > 5 ? "Excellent!" : overview.engagementRate > 2 ? "Good" : "Needs improvement"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.subscriberCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Growing community
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalLikes.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {overview.totalComments.toLocaleString()} comments
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="growth">Growth Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            {/* Recent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Last 30 Days</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Videos Uploaded</span>
                      <Badge variant={recentPerformance.videosLast30Days > 4 ? "default" : "secondary"}>
                        {recentPerformance.videosLast30Days}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Views Generated</span>
                      <span className="font-semibold">{recentPerformance.viewsLast30Days.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Views per Video</span>
                      <span className="font-semibold">
                        {recentPerformance.videosLast30Days > 0 
                          ? Math.round(recentPerformance.viewsLast30Days / recentPerformance.videosLast30Days).toLocaleString()
                          : "0"
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Upload Consistency</span>
                      <Badge variant={recentPerformance.videosLast30Days >= 4 ? "default" : "secondary"}>
                        {recentPerformance.videosLast30Days >= 4 ? "Consistent" : "Inconsistent"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Top Performing Videos</span>
                </CardTitle>
                <CardDescription>Your most successful content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVideos.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No videos uploaded yet. Create your first video to see analytics!
                    </p>
                  ) : (
                    topVideos.map((video, index) => (
                      <div key={video.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <Badge variant={index === 0 ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{video.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {video.views.toLocaleString()} views • {video.engagementRate.toFixed(1)}% engagement
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{video.likes.toLocaleString()} likes</p>
                          <p className="text-xs text-muted-foreground">{video.comments.toLocaleString()} comments</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Content Categories</span>
                </CardTitle>
                <CardDescription>Performance by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(categoryStats).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Upload videos in different categories to see category performance
                    </p>
                  ) : (
                    Object.entries(categoryStats).map(([category, stats]) => (
                      <div key={category} className="flex items-center justify-between p-4 rounded-lg border">
                        <div>
                          <h4 className="font-medium">{category}</h4>
                          <p className="text-sm text-muted-foreground">
                            {stats.videos} video{stats.videos !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{stats.views.toLocaleString()} views</p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(stats.views / stats.videos).toLocaleString()} avg per video
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Audience Insights</span>
                </CardTitle>
                <CardDescription>Understanding your viewers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2">Total Reach</h3>
                    <p className="text-2xl font-bold text-blue-600">{overview.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">People reached</p>
                  </div>
                  <div className="text-center p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2">Community Size</h3>
                    <p className="text-2xl font-bold text-green-600">{overview.subscriberCount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2">Engagement</h3>
                    <p className="text-2xl font-bold text-purple-600">{overview.engagementRate}%</p>
                    <p className="text-sm text-muted-foreground">Average rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="growth" className="space-y-6">
            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5" />
                  <span>Growth Recommendations</span>
                </CardTitle>
                <CardDescription>Personalized tips to improve your channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                  
                  {recommendations.length === 0 && (
                    <div className="text-center py-8">
                      <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Keep creating content to get personalized recommendations!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Metrics</CardTitle>
                <CardDescription>Insights beyond basic analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Content Quality Score</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, overview.engagementRate * 10)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{Math.round(overview.engagementRate * 10)}/100</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Audience Retention</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (overview.subscriberCount / Math.max(1, overview.totalViews)) * 100 * 50)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((overview.subscriberCount / Math.max(1, overview.totalViews)) * 100 * 50)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Upload Consistency</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (recentPerformance.videosLast30Days / 4) * 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((recentPerformance.videosLast30Days / 4) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}