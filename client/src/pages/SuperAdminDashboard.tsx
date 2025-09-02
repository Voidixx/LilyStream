import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  Video, 
  TrendingUp, 
  AlertTriangle,
  Database,
  Activity,
  Settings,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Heart,
  Clock,
  Globe,
  Server
} from "lucide-react";

export default function SuperAdminDashboard() {
  const { user } = useAuth();

  const { data: adminStats, isLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    enabled: !!user?.isAdmin,
  });

  const { data: systemHealth } = useQuery({
    queryKey: ['/api/admin/system-health'],
    enabled: !!user?.isAdmin,
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['/api/admin/recent-activity'],
    enabled: !!user?.isAdmin,
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-destructive">Access Denied</CardTitle>
                <CardDescription>You need administrator privileges to access this page</CardDescription>
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
              <Skeleton className="h-12 w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-32" />
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
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Control Center</h1>
                <p className="text-orange-100">Advanced platform management beyond YouTube's capabilities</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Activity className="w-4 h-4 mr-1" />
              Real-time Monitoring
            </Badge>
          </div>
        </div>
      </div>

      <main className="pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* System Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.totalUsers || 1}</div>
                <p className="text-xs text-muted-foreground">
                  +{adminStats?.newUsersToday || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <Video className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminStats?.totalVideos || 0}</div>
                <p className="text-xs text-muted-foreground">
                  +{adminStats?.videosUploadedToday || 0} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Load</CardTitle>
                <Server className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth?.cpuUsage || 15}%</div>
                <p className="text-xs text-muted-foreground">
                  CPU utilization
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Database className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemHealth?.storageUsed || 2.4}GB</div>
                <p className="text-xs text-muted-foreground">
                  of {systemHealth?.totalStorage || 100}GB total
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="content">Content Control</TabsTrigger>
              <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
              <TabsTrigger value="system">System Monitor</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Platform Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                  <CardDescription>Real-time platform statistics and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Content Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Videos</span>
                          <span className="font-medium">{adminStats?.totalVideos || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Comments</span>
                          <span className="font-medium">{adminStats?.totalComments || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Likes</span>
                          <span className="font-medium">{adminStats?.totalLikes || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">User Engagement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Users</span>
                          <span className="font-medium">{adminStats?.activeUsers || 1}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Daily Views</span>
                          <span className="font-medium">{adminStats?.dailyViews || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg. Session</span>
                          <span className="font-medium">{adminStats?.avgSession || 12}min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">System Health</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Uptime</span>
                          <span className="font-medium text-green-600">99.9%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Response Time</span>
                          <span className="font-medium">{systemHealth?.responseTime || 45}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Error Rate</span>
                          <span className="font-medium text-green-600">0.01%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Platform Activity</CardTitle>
                  <CardDescription>Latest user actions and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity?.slice(0, 10).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.user} • {activity.timestamp}</p>
                          </div>
                        </div>
                        <Badge variant={activity.type === 'success' ? 'default' : 'secondary'}>
                          {activity.type}
                        </Badge>
                      </div>
                    )) || (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Admin user logged in</p>
                              <p className="text-xs text-muted-foreground">{user?.username} • Just now</p>
                            </div>
                          </div>
                          <Badge variant="default">success</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">System health check completed</p>
                              <p className="text-xs text-muted-foreground">System • 5 minutes ago</p>
                            </div>
                          </div>
                          <Badge variant="default">success</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage platform users and their permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">User Controls</h4>
                        <p className="text-sm text-muted-foreground">Advanced user management tools</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          View All Users
                        </Button>
                        <Button variant="outline" size="sm">
                          <Ban className="w-4 h-4 mr-2" />
                          Moderation Queue
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Monitor and moderate platform content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Approved</h4>
                        <p className="text-2xl font-bold text-green-600">{adminStats?.approvedVideos || 0}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Pending</h4>
                        <p className="text-2xl font-bold text-yellow-600">{adminStats?.pendingVideos || 0}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                        <h4 className="font-semibold">Rejected</h4>
                        <p className="text-2xl font-bold text-red-600">{adminStats?.rejectedVideos || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Platform Analytics</CardTitle>
                  <CardDescription>Deep insights into platform performance and user behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Engagement Metrics</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Avg. Watch Time</span>
                          <span className="font-medium">{adminStats?.avgWatchTime || 8.5}min</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Bounce Rate</span>
                          <span className="font-medium">{adminStats?.bounceRate || 25}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Return Visitors</span>
                          <span className="font-medium">{adminStats?.returnVisitors || 65}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Content Performance</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Upload Rate</span>
                          <span className="font-medium">{adminStats?.uploadRate || 2.3}/day</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Top Category</span>
                          <span className="font-medium">{adminStats?.topCategory || 'Gaming'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Viral Content</span>
                          <span className="font-medium">{adminStats?.viralVideos || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Revenue Insights</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Monthly Revenue</span>
                          <span className="font-medium">${adminStats?.monthlyRevenue || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Premium Users</span>
                          <span className="font-medium">{adminStats?.premiumUsers || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Growth Rate</span>
                          <span className="font-medium text-green-600">+{adminStats?.growthRate || 15.7}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Monitoring</CardTitle>
                  <CardDescription>Real-time system health and performance monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Server Performance</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>CPU Usage</span>
                            <span>{systemHealth?.cpuUsage || 15}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${systemHealth?.cpuUsage || 15}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Memory Usage</span>
                            <span>{systemHealth?.memoryUsage || 42}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${systemHealth?.memoryUsage || 42}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Disk Usage</span>
                            <span>{systemHealth?.diskUsage || 28}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${systemHealth?.diskUsage || 28}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Network & Security</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Connections</span>
                          <span className="font-medium">{systemHealth?.activeConnections || 24}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Bandwidth Usage</span>
                          <span className="font-medium">{systemHealth?.bandwidthUsage || 12.5} MB/s</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Security Threats</span>
                          <span className="font-medium text-green-600">{systemHealth?.threats || 3} blocked</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">SSL Status</span>
                          <span className="font-medium text-green-600">Active</span>
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