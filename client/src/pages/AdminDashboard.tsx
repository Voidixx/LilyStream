import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Shield, 
  Users, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  BarChart3,
  Settings,
  Flag,
  Lock,
  Unlock,
  Trash2,
  Edit,
  UserCheck,
  Crown,
  Zap
} from "lucide-react";
import { useLocation } from "wouter";

interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalComments: number;
  pendingReports: number;
  blockedContent: number;
  totalViews: number;
  newUsersToday: number;
  newVideosToday: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if not admin
  useEffect(() => {
    if (user && !user.isAdmin) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const { data: adminStats } = useQuery<AdminStats>({
    queryKey: ['/api/admin/analytics'],
    enabled: !!user?.isAdmin,
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users', searchTerm, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus === 'all' ? '' : filterStatus
      });
      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.users || [];
    },
    enabled: !!user?.isAdmin,
  });

  const { data: videos } = useQuery({
    queryKey: ['/api/admin/videos', searchTerm, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus === 'all' ? '' : filterStatus
      });
      const response = await fetch(`/api/admin/videos?${params}`);
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      return data.videos || [];
    },
    enabled: !!user?.isAdmin,
  });

  const { data: comments } = useQuery({
    queryKey: ['/api/admin/comments', searchTerm, filterStatus],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: searchTerm
      });
      const response = await fetch(`/api/admin/comments?${params}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      return data.comments || [];
    },
    enabled: !!user?.isAdmin,
  });

  const { data: reports } = useQuery({
    queryKey: ['/api/admin/reports', filterStatus],
    queryFn: async () => {
      // Mock data for now as reports endpoint needs to be implemented
      return [];
    },
    enabled: !!user?.isAdmin,
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => setLocation('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUserAction = async (userId: string, action: string, reason?: string) => {
    try {
      if (action === 'ban') {
        const banReason = reason || prompt('Enter ban reason:');
        if (!banReason) return;
        
        const response = await fetch(`/api/admin/users/${userId}/ban`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: banReason })
        });
        
        if (response.ok) {
          toast({ title: 'User banned successfully' });
          // Refresh the users data
          queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        }
      } else if (action === 'unban') {
        const response = await fetch(`/api/admin/users/${userId}/unban`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          toast({ title: 'User unbanned successfully' });
          queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
        }
      }
    } catch (error) {
      toast({ title: 'Action failed', description: 'Please try again', variant: 'destructive' });
    }
  };

  const handleVideoAction = async (videoId: string, action: string, reason?: string) => {
    try {
      if (action === 'block') {
        const blockReason = reason || prompt('Enter reason for blocking:');
        if (!blockReason) return;
        
        const response = await fetch(`/api/admin/videos/${videoId}/moderate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'blocked', reason: blockReason })
        });
        
        if (response.ok) {
          toast({ title: 'Video blocked successfully' });
          queryClient.invalidateQueries({ queryKey: ['/api/admin/videos'] });
        }
      } else if (action === 'unblock') {
        const response = await fetch(`/api/admin/videos/${videoId}/moderate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved', reason: 'Unblocked by admin' })
        });
        
        if (response.ok) {
          toast({ title: 'Video unblocked successfully' });
          queryClient.invalidateQueries({ queryKey: ['/api/admin/videos'] });
        }
      }
    } catch (error) {
      toast({ title: 'Action failed', description: 'Please try again', variant: 'destructive' });
    }
  };

  const handleCommentAction = async (commentId: string, action: string, reason?: string) => {
    try {
      if (action === 'block') {
        const blockReason = reason || prompt('Enter reason for blocking:');
        if (!blockReason) return;
        
        const response = await fetch(`/api/admin/comments/${commentId}/moderate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'blocked', reason: blockReason })
        });
        
        if (response.ok) {
          toast({ title: 'Comment blocked successfully' });
          queryClient.invalidateQueries({ queryKey: ['/api/admin/comments'] });
        }
      } else if (action === 'unblock') {
        const response = await fetch(`/api/admin/comments/${commentId}/moderate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved', reason: 'Unblocked by admin' })
        });
        
        if (response.ok) {
          toast({ title: 'Comment unblocked successfully' });
          queryClient.invalidateQueries({ queryKey: ['/api/admin/comments'] });
        }
      }
    } catch (error) {
      toast({ title: 'Action failed', description: 'Please try again', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-red-100">LilyTube Content Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/20">
                <Crown className="w-4 h-4 mr-1" />
                Super Admin
              </Badge>
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setLocation('/')}
              >
                Back to Site
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" data-testid="tab-overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="videos" data-testid="tab-videos">
              <Video className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="comments" data-testid="tab-comments">
              <MessageSquare className="w-4 h-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">
              <Flag className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.totalUsers || 0}</div>
                  <p className="text-xs text-green-600">
                    +{adminStats?.newUsersToday || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                  <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{adminStats?.totalVideos || 0}</div>
                  <p className="text-xs text-green-600">
                    +{adminStats?.newVideosToday || 0} today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {adminStats?.totalViews?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-blue-600">Platform engagement</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {adminStats?.pendingReports || 0}
                  </div>
                  <p className="text-xs text-red-600">Needs attention</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation Status</CardTitle>
                  <CardDescription>Real-time moderation overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Approved Content
                    </span>
                    <Badge variant="secondary">98.5%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                      Under Review
                    </span>
                    <Badge variant="secondary">1.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                      Blocked Content
                    </span>
                    <Badge variant="destructive">0.3%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>System performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Zap className="w-4 h-4 text-green-500 mr-2" />
                      Fair Algorithm Active
                    </span>
                    <Badge className="bg-green-100 text-green-800">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="w-4 h-4 text-blue-500 mr-2" />
                      Content Filters
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                      User Engagement
                    </span>
                    <Badge className="bg-purple-100 text-purple-800">High</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-muted-foreground">Manage users, moderators, and permissions</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                    data-testid="search-users"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Subscribers</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.isAdmin && <Badge className="bg-red-100 text-red-800">Admin</Badge>}
                          {user.isModerator && <Badge className="bg-blue-100 text-blue-800">Mod</Badge>}
                          {user.isVerified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                          {user.isBanned && <Badge variant="destructive">Banned</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{user.videoCount || 0}</TableCell>
                      <TableCell>{user.subscriberCount || 0}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, user.isBanned ? 'unban' : 'ban')}
                            data-testid={`${user.isBanned ? 'unban' : 'ban'}-user-${user.id}`}
                          >
                            {user.isBanned ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user.id, user.isVerified ? 'unverify' : 'verify')}
                            data-testid={`verify-user-${user.id}`}
                          >
                            <UserCheck className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Video Management</h2>
                <p className="text-muted-foreground">Moderate videos and manage content</p>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                  data-testid="search-videos"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Videos</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="nsfw">NSFW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos?.map((video: any) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-12 bg-muted rounded flex items-center justify-center">
                            <Video className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{video.title}</div>
                            <div className="text-sm text-muted-foreground">{video.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{video.user?.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {video.isApproved && <Badge className="bg-green-100 text-green-800">Approved</Badge>}
                          {video.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                          {video.isNSFW && <Badge className="bg-orange-100 text-orange-800">NSFW</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>{video.views?.toLocaleString() || 0}</TableCell>
                      <TableCell>{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVideoAction(video.id, video.isBlocked ? 'unblock' : 'block')}
                            data-testid={`${video.isBlocked ? 'unblock' : 'block'}-video-${video.id}`}
                          >
                            {video.isBlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVideoAction(video.id, 'delete')}
                            data-testid={`delete-video-${video.id}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Content Reports</h2>
                <p className="text-muted-foreground">Review and moderate reported content</p>
              </div>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {adminStats?.pendingReports || 0} reports pending review
                </AlertDescription>
              </Alert>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Reported Content</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.map((report: any) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {report.reportedVideoId && "Video: " + report.video?.title}
                          {report.reportedCommentId && "Comment"}
                          {report.reportedUserId && "User: " + report.user?.username}
                        </div>
                      </TableCell>
                      <TableCell>{report.reporter?.username}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{report.reason}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" data-testid={`approve-report-${report.id}`}>
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm" data-testid={`reject-report-${report.id}`}>
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Platform Settings</h2>
              <p className="text-muted-foreground">Configure content filters and moderation rules</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation</CardTitle>
                  <CardDescription>Automatic content filtering settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="nsfw-filter">NSFW Content Filter</Label>
                    <Switch id="nsfw-filter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="spam-filter">Spam Detection</Label>
                    <Switch id="spam-filter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hate-speech-filter">Hate Speech Detection</Label>
                    <Switch id="hate-speech-filter" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="violence-filter">Violence Detection</Label>
                    <Switch id="violence-filter" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Algorithm Settings</CardTitle>
                  <CardDescription>Fair distribution and recommendation settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fair-algorithm">Fair Algorithm Active</Label>
                    <Switch id="fair-algorithm" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="diversity-boost">Content Diversity Boost</Label>
                    <Switch id="diversity-boost" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-creator-boost">New Creator Boost</Label>
                    <Switch id="new-creator-boost" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="algorithm-transparency">Algorithm Transparency Level</Label>
                    <Select defaultValue="high">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Default user permissions and settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-approve-users">Auto-approve new users</Label>
                    <Switch id="auto-approve-users" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-email-verification">Require email verification</Label>
                    <Switch id="require-email-verification" defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-upload-limit">Default upload limit (GB)</Label>
                    <Input id="default-upload-limit" type="number" defaultValue="10" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Guidelines</CardTitle>
                  <CardDescription>Platform content policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="banned-keywords">Banned Keywords (comma-separated)</Label>
                    <Textarea 
                      id="banned-keywords" 
                      placeholder="spam, hate, violence..."
                      className="h-20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restricted-domains">Restricted Domains</Label>
                    <Textarea 
                      id="restricted-domains" 
                      placeholder="example.com, spam-site.net..."
                      className="h-20"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}