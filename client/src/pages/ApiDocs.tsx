
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Book, Key, Zap } from "lucide-react";

export default function ApiDocs() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">API Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Build amazing applications with the LilyTube API. Access videos, user data, analytics, and more.
            </p>
            <Button size="lg" className="mt-6">
              <Key className="w-4 h-4 mr-2" />
              Get API Key
            </Button>
          </div>

          {/* Quick Start */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Get Your API Key</h4>
                  <p className="text-sm text-muted-foreground">Sign up for a developer account and generate your API key.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">2. Make Your First Request</h4>
                  <div className="bg-muted p-4 rounded-md font-mono text-sm">
                    curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;https://api.lilytube.com/v1/videos
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">3. Start Building</h4>
                  <p className="text-sm text-muted-foreground">Use our comprehensive endpoints to build your application.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Videos API</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li><code>/v1/videos</code> - List videos</li>
                  <li><code>/v1/videos/{id}</code> - Get video details</li>
                  <li><code>/v1/videos/search</code> - Search videos</li>
                  <li><code>/v1/videos/trending</code> - Trending videos</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users API</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li><code>/v1/users/{id}</code> - User profile</li>
                  <li><code>/v1/users/{id}/videos</code> - User videos</li>
                  <li><code>/v1/users/{id}/followers</code> - Followers</li>
                  <li><code>/v1/users/{id}/following</code> - Following</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analytics API</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li><code>/v1/analytics/views</code> - View analytics</li>
                  <li><code>/v1/analytics/engagement</code> - Engagement data</li>
                  <li><code>/v1/analytics/demographics</code> - Audience data</li>
                  <li><code>/v1/analytics/revenue</code> - Revenue data</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload API</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li><code>/v1/upload/video</code> - Upload video</li>
                  <li><code>/v1/upload/thumbnail</code> - Upload thumbnail</li>
                  <li><code>/v1/upload/status</code> - Upload status</li>
                  <li><code>/v1/upload/metadata</code> - Update metadata</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limits */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Rate Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1,000</div>
                  <div className="text-sm text-muted-foreground">Requests per hour</div>
                  <div className="text-xs text-muted-foreground mt-1">Free tier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10,000</div>
                  <div className="text-sm text-muted-foreground">Requests per hour</div>
                  <div className="text-xs text-muted-foreground mt-1">Pro tier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100,000</div>
                  <div className="text-sm text-muted-foreground">Requests per hour</div>
                  <div className="text-xs text-muted-foreground mt-1">Enterprise tier</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDKs */}
          <Card>
            <CardHeader>
              <CardTitle>Official SDKs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">JavaScript/Node.js</h4>
                  <div className="bg-muted p-2 rounded text-sm font-mono">
                    npm install @lilytube/api
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Python</h4>
                  <div className="bg-muted p-2 rounded text-sm font-mono">
                    pip install lilytube-api
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">PHP</h4>
                  <div className="bg-muted p-2 rounded text-sm font-mono">
                    composer require lilytube/api
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Go</h4>
                  <div className="bg-muted p-2 rounded text-sm font-mono">
                    go get github.com/lilytube/api-go
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
