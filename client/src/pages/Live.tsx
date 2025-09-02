import { useState, useRef, useEffect } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Radio, Users, Zap, Camera, Monitor, Mic, Play, Square, Settings, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Live() {
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState("");
  const [streamSettings, setStreamSettings] = useState({
    quality: "1080p",
    bitrate: "6000",
    fps: "60"
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startStream = async () => {
    if (!streamTitle.trim()) {
      toast({
        title: "Stream title required",
        description: "Please enter a title for your stream",
        variant: "destructive"
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1920, height: 1080 }, 
        audio: true 
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsLive(true);
      setViewerCount(Math.floor(Math.random() * 100) + 1);

      toast({
        title: "Stream started!",
        description: "You are now live streaming"
      });
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera and microphone access to start streaming",
        variant: "destructive"
      });
    }
  };

  const stopStream = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsLive(false);
    setViewerCount(0);
    toast({
      title: "Stream ended",
      description: "Your live stream has been stopped"
    });
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: "You",
        message: newMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  useEffect(() => {
    // Simulate incoming chat messages
    if (isLive) {
      const interval = setInterval(() => {
        const viewers = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
        const messages = [
          "Great stream!",
          "Love the content",
          "Keep it up!",
          "Amazing quality",
          "First time here, loving it!"
        ];

        if (Math.random() > 0.7) {
          const message = {
            id: Date.now().toString(),
            user: viewers[Math.floor(Math.random() * viewers.length)],
            message: messages[Math.floor(Math.random() * messages.length)],
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev.slice(-20), message]);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Live Stream Interface */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Stream Preview & Controls */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Stream Preview</span>
                    </span>
                    {isLive && (
                      <Badge variant="destructive" className="animate-pulse">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE • {viewerCount} viewers
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    {!isLive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center text-white">
                          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Stream preview will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Stream title (required)"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        disabled={isLive}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Stream description (optional)"
                        value={streamDescription}
                        onChange={(e) => setStreamDescription(e.target.value)}
                        disabled={isLive}
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-3">
                      {!isLive ? (
                        <Button 
                          onClick={startStream}
                          className="bg-red-600 hover:bg-red-700 flex-1"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Go Live
                        </Button>
                      ) : (
                        <Button 
                          onClick={stopStream}
                          variant="destructive"
                          className="flex-1"
                        >
                          <Square className="w-4 h-4 mr-2" />
                          End Stream
                        </Button>
                      )}
                      <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stream Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Stream Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Quality</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={streamSettings.quality}
                        onChange={(e) => setStreamSettings(prev => ({...prev, quality: e.target.value}))}
                      >
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                        <option value="4K">4K</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bitrate</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={streamSettings.bitrate}
                        onChange={(e) => setStreamSettings(prev => ({...prev, bitrate: e.target.value}))}
                      >
                        <option value="3000">3000 kbps</option>
                        <option value="6000">6000 kbps</option>
                        <option value="8000">8000 kbps</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">FPS</label>
                      <select 
                        className="w-full mt-1 p-2 border rounded"
                        value={streamSettings.fps}
                        onChange={(e) => setStreamSettings(prev => ({...prev, fps: e.target.value}))}
                      >
                        <option value="30">30 FPS</option>
                        <option value="60">60 FPS</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Chat */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Live Chat</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-96">
                  <div className="flex-1 space-y-2 overflow-y-auto mb-4">
                    {chatMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Chat will appear here when you go live
                      </p>
                    ) : (
                      chatMessages.map((msg) => (
                        <div key={msg.id} className="text-sm">
                          <span className="font-medium text-primary">{msg.user}:</span>{' '}
                          <span>{msg.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!isLive}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!isLive}
                      size="sm"
                    >
                      Send
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Radio className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Live Streaming Platform</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with your audience in real-time. Professional-grade live streaming tools for creators of all levels.
            </p>
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