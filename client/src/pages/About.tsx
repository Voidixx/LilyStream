
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Globe, Zap, Shield, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About LilyTube</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're revolutionizing video sharing with a platform built for creators, by creators. 
              Our mission is to create the most fair and innovative video platform in the world.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-6 h-6 text-primary" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To democratize content creation and provide every creator with an equal opportunity 
                  to reach their audience through our revolutionary fair algorithm and creator-first approach.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-6 h-6 text-primary" />
                  <span>Our Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To become the world's leading video platform that prioritizes creator success, 
                  user privacy, and authentic content discovery over corporate interests.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What Makes Us Different */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    <span>Fair Algorithm</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our algorithm gives every video a chance to be discovered, regardless of channel size. 
                    Quality content rises to the top, not just popular creators.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-green-500" />
                    <span>Privacy First</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We don't sell your data or track you across the web. Your privacy is protected, 
                    and you control what information you share.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-blue-500" />
                    <span>Creator Focused</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built by creators, for creators. We provide the tools, analytics, and support 
                    you need to grow your audience and succeed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Story */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Our Story</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                LilyTube was founded in 2024 by a team of passionate creators and technologists who 
                were frustrated with the current state of video platforms. We saw talented creators 
                struggling to get discovered while algorithm manipulation and corporate interests 
                dominated the landscape.
              </p>
              <p>
                We decided to build something different - a platform where creativity and quality 
                matter more than gaming the system. Our team combines decades of experience in 
                technology, content creation, and community building to create the platform we 
                wish had existed when we started our own creative journeys.
              </p>
              <p>
                Today, LilyTube is home to millions of creators and viewers who share our vision 
                of a more fair and creator-friendly video platform.
              </p>
            </CardContent>
          </Card>

          {/* Team */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're a diverse team of creators, engineers, and visionaries working together 
              to build the future of video sharing.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Engineering Team</h3>
                  <p className="text-sm text-muted-foreground">
                    World-class engineers building scalable, reliable infrastructure
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Creator Relations</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicated team supporting creators and building community
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Product Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Designing experiences that put creators and viewers first
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
