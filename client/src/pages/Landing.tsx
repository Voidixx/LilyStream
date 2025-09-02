import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Video, Users, Eye, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-purple-600/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=2464&h=1000')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                LilyTube
              </h1>
            </div>
            <p className="text-2xl lg:text-3xl mb-8 opacity-90 max-w-4xl mx-auto">
              Your personal premium video streaming experience
            </p>
            <p className="text-lg lg:text-xl mb-12 opacity-80 max-w-2xl mx-auto">
              Create, share, and discover amazing content with a platform designed for creators who demand excellence.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-white text-primary px-8 py-4 text-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
              data-testid="login-button"
            >
              <Video className="w-6 h-6 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why Choose LilyTube?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the future of video streaming with features designed for both creators and viewers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 glass-effect border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group hover:scale-105">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/30 transition-colors">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">
                Experience videos in stunning quality with our advanced streaming technology and premium UI design that surpasses traditional platforms.
              </p>
            </Card>

            <Card className="p-8 glass-effect border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group hover:scale-105">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                <Users className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Real-time Interaction</h3>
              <p className="text-muted-foreground leading-relaxed">
                Engage with your audience through real-time comments, live reactions, and instant notifications powered by WebSocket technology.
              </p>
            </Card>

            <Card className="p-8 glass-effect border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group hover:scale-105">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                <Eye className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Advanced Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Track your content performance with detailed analytics, viewer insights, and engagement metrics to grow your audience.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/20 to-purple-600/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join LilyTube today and experience the most advanced video streaming platform designed for creators.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-primary text-primary-foreground px-12 py-6 text-xl font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            data-testid="cta-login-button"
          >
            Start Creating Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Play className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LilyTube
              </span>
            </div>
            <p className="text-muted-foreground">
              &copy; 2024 LilyTube. All rights reserved. Built with love for creators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
