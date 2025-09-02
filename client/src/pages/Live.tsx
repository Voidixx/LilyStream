
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radio, Users, Zap, Camera, Monitor, Mic } from "lucide-react";

export default function Live() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Radio className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Streaming</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with your audience in real-time. Professional-grade live streaming tools for creators of all levels.
            </p>
            <Button size="lg" className="mt-6 bg-red-600 hover:bg-red-700">
              <Radio className="w-4 h-4 mr-2" />
              Go Live Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Multi-Camera Setup</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Support for multiple camera angles and seamless switching between sources.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Screen Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share your screen, applications, or browser tabs directly in your live stream.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mic className="w-5 h-5" />
                  <span>Professional Audio</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Crystal-clear audio with noise cancellation and multiple audio source support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Interactive Chat</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time chat with moderation tools, emotes, and subscriber-only modes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Low Latency</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ultra-low latency streaming for real-time interaction with your audience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>4K Streaming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stream in up to 4K resolution with adaptive bitrate for all viewers.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Getting Started with Live Streaming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Set Up Your Stream</h3>
                  <p className="text-sm text-muted-foreground">Configure your camera, microphone, and streaming settings.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Go Live</h3>
                  <p className="text-sm text-muted-foreground">Click the "Go Live" button and start streaming to your audience.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Engage & Grow</h3>
                  <p className="text-sm text-muted-foreground">Interact with chat, build community, and grow your audience.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>System Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Minimum Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Chrome 88+ or Firefox 85+</li>
                    <li>• Upload speed: 5+ Mbps</li>
                    <li>• 8GB RAM</li>
                    <li>• Webcam & microphone</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recommended</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Latest Chrome or Firefox</li>
                    <li>• Upload speed: 20+ Mbps</li>
                    <li>• 16GB+ RAM</li>
                    <li>• Professional camera & audio</li>
                  </ul>
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
