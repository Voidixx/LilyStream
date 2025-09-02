
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Download, Mail, ExternalLink } from "lucide-react";

export default function Press() {
  const pressReleases = [
    {
      date: "January 15, 2025",
      title: "LilyTube Announces Fair Algorithm Initiative",
      excerpt: "Revolutionary new algorithm ensures every creator gets equal opportunity for discovery",
      link: "#"
    },
    {
      date: "December 20, 2024",
      title: "LilyTube Reaches 1 Million Active Creators",
      excerpt: "Platform celebrates milestone with new creator tools and expanded support programs",
      link: "#"
    },
    {
      date: "November 30, 2024",
      title: "LilyTube Launches Advanced Analytics Dashboard",
      excerpt: "Comprehensive analytics help creators understand and grow their audiences",
      link: "#"
    },
    {
      date: "October 25, 2024",
      title: "LilyTube Introduces Live Streaming Features",
      excerpt: "Real-time streaming capabilities with interactive chat and creator monetization",
      link: "#"
    }
  ];

  const mediaKit = [
    { name: "Logo Package", description: "High-resolution logos in various formats", size: "2.5 MB" },
    { name: "Brand Guidelines", description: "Complete brand style guide and usage instructions", size: "1.8 MB" },
    { name: "Product Screenshots", description: "High-quality screenshots of the platform", size: "15.3 MB" },
    { name: "Executive Photos", description: "Professional headshots of leadership team", size: "8.7 MB" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Newspaper className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Press Center</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Latest news, press releases, and media resources for journalists and content creators 
              covering LilyTube's mission to revolutionize video sharing.
            </p>
          </div>

          {/* Press Contact */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Press Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Media Inquiries</h3>
                  <p className="text-muted-foreground mb-4">
                    For all media inquiries, interview requests, and press-related questions, 
                    please contact our communications team.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-primary" />
                      <span>press@lilytube.com</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-muted-foreground">Phone: +1 (555) LILY-PRESS</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quick Facts</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Founded: 2024</li>
                    <li>• 1M+ Active Creators</li>
                    <li>• 100M+ Videos Uploaded</li>
                    <li>• 1B+ Monthly Views</li>
                    <li>• Available Worldwide</li>
                    <li>• Headquarters: Global Remote</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Press Releases */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Recent Press Releases</h2>
            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-2">{release.date}</div>
                        <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                        <p className="text-muted-foreground mb-4 sm:mb-0">{release.excerpt}</p>
                      </div>
                      <Button variant="outline" className="mt-4 sm:mt-0 sm:ml-4">
                        Read More
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Media Kit */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Media Kit</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mediaKit.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <span className="text-xs text-muted-foreground">{item.size}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About LilyTube</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>
                LilyTube is the next-generation video sharing platform that puts creators first. 
                Founded in 2024, we're revolutionizing how video content is discovered, shared, 
                and monetized through our innovative fair algorithm and creator-focused features.
              </p>
              <p>
                Our platform serves over 1 million active creators and has facilitated the upload 
                of more than 100 million videos, generating over 1 billion monthly views. Unlike 
                traditional platforms, LilyTube's fair algorithm ensures every creator has an equal 
                opportunity for discovery, regardless of their follower count or previous success.
              </p>
              <p>
                Key features include advanced analytics, live streaming capabilities, flexible 
                monetization options, and comprehensive creator tools. LilyTube is available 
                worldwide and is committed to maintaining user privacy while fostering a 
                positive, inclusive creator community.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
