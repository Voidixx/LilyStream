import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Building a Fair Algorithm: Our Journey to Creator Equality",
      excerpt: "How we designed an algorithm that gives every creator an equal chance at success, regardless of their channel size or previous performance.",
      author: "LilyTube Engineering Team",
      date: "January 20, 2025",
      category: "Engineering",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "Creator Spotlight: How Sarah Built a Million-Subscriber Channel",
      excerpt: "Meet Sarah, a cooking creator who grew from 0 to 1M subscribers using LilyTube's creator tools and fair discovery system.",
      author: "Creator Relations Team",
      date: "January 18, 2025",
      category: "Creator Stories",
      readTime: "5 min read",
      featured: false
    },
    {
      id: 3,
      title: "Privacy First: Why We Don't Sell Your Data",
      excerpt: "A deep dive into our privacy philosophy and the technical measures we take to protect user data on our platform.",
      author: "Privacy Team",
      date: "January 15, 2025",
      category: "Privacy",
      readTime: "6 min read",
      featured: false
    },
    {
      id: 4,
      title: "New Analytics Dashboard: Understanding Your Audience",
      excerpt: "Introducing powerful new analytics tools that help creators understand their audience and optimize their content strategy.",
      author: "Product Team",
      date: "January 12, 2025",
      category: "Product Updates",
      readTime: "4 min read",
      featured: false
    },
    {
      id: 5,
      title: "The Future of Live Streaming on LilyTube",
      excerpt: "Our vision for live streaming and how we're building features that put streamers and their communities first.",
      author: "Product Team",
      date: "January 10, 2025",
      category: "Product Updates",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 6,
      title: "Community Guidelines: Building a Positive Platform",
      excerpt: "How we're fostering a supportive creator community while maintaining content quality and safety standards.",
      author: "Community Team",
      date: "January 8, 2025",
      category: "Community",
      readTime: "5 min read",
      featured: false
    }
  ];

  const categories = ["All", "Engineering", "Creator Stories", "Privacy", "Product Updates", "Community"];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">LilyTube Blog</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stories, insights, and updates from the team building the future of video sharing. 
              Learn about our technology, creator success stories, and platform updates.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={category === "All" ? "default" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          {blogPosts.find(post => post.featured) && (
            <Card className="mb-12 border-primary/20">
              <div className="p-2 bg-primary/10 rounded-t-lg">
                <Badge variant="secondary" className="ml-4 mt-2">Featured</Badge>
              </div>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Badge className="mb-3">{blogPosts[0].category}</Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                    <p className="text-muted-foreground mb-6 text-lg">{blogPosts[0].excerpt}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {blogPosts[0].date}
                      </div>
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                    <Button>
                      Read Full Post
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="flex flex-col h-full">
                <CardHeader>
                  <div className="w-full h-32 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <Badge className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-lg leading-tight">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-1">{post.excerpt}</p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {post.date}
                      </div>
                      <Button variant="ghost" size="sm">
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-16">
            <CardContent className="pt-6 text-center">
              <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter to get the latest updates on new features, 
                creator stories, and platform improvements delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}