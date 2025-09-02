
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, BarChart3, Settings, Calendar, Upload, Users } from "lucide-react";

export default function Studio() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Creator Studio</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to create, manage, and grow your channel. Built by creators, for creators.
            </p>
            <Button size="lg" className="mt-6">
              <Upload className="w-4 h-4 mr-2" />
              Start Creating
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload & Edit</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced upload tools with built-in editing capabilities.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Drag & drop uploads</li>
                  <li>• Batch processing</li>
                  <li>• Auto-thumbnails</li>
                  <li>• Video trimming</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Deep insights into your audience and performance.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Real-time views</li>
                  <li>• Audience demographics</li>
                  <li>• Revenue tracking</li>
                  <li>• Growth metrics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Scheduling</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Plan and schedule your content for optimal reach.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Smart scheduling</li>
                  <li>• Content calendar</li>
                  <li>• Auto-publishing</li>
                  <li>• Best time insights</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Tools to engage and grow your community.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Comment management</li>
                  <li>• Live chat moderation</li>
                  <li>• Subscriber insights</li>
                  <li>• Community posts</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Channel Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Customize your channel and monetization options.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Brand customization</li>
                  <li>• Monetization setup</li>
                  <li>• Privacy controls</li>
                  <li>• API access</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="w-5 h-5" />
                  <span>Live Streaming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Professional live streaming with advanced features.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• HD/4K streaming</li>
                  <li>• Multi-camera support</li>
                  <li>• Stream scheduling</li>
                  <li>• Real-time chat</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = '/live'}
                >
                  Start Streaming
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Scheduled Uploads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your scheduled video uploads and publishing queue.
                </p>
                <ul className="text-sm space-y-1 mb-4">
                  <li>• Schedule videos for optimal timing</li>
                  <li>• Batch upload management</li>
                  <li>• Auto-publish at set times</li>
                  <li>• Edit scheduled content</li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = '/scheduled-uploads'}
                >
                  Manage Scheduled
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Ready to Start Creating?</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of creators who've chosen LilyTube as their platform. Get started today with our comprehensive Creator Studio.
              </p>
              <Button size="lg" variant="secondary">
                Launch Studio
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
