
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Search, Book, MessageCircle, Mail, Phone } from "lucide-react";

export default function Help() {
  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn the basics of using LilyTube",
      articles: ["Creating your account", "Uploading your first video", "Setting up your profile", "Understanding the interface"]
    },
    {
      title: "Video Upload & Management",
      description: "Everything about uploading and managing videos",
      articles: ["Video upload guidelines", "Editing video details", "Managing video privacy", "Video scheduling"]
    },
    {
      title: "Analytics & Growth",
      description: "Understanding your analytics and growing your audience",
      articles: ["Reading your analytics", "Optimizing for discovery", "Understanding the fair algorithm", "Growing your subscriber base"]
    },
    {
      title: "Monetization",
      description: "Ways to earn money on LilyTube",
      articles: ["Creator fund eligibility", "Setting up monetization", "Understanding revenue sharing", "Payment methods"]
    },
    {
      title: "Community & Safety",
      description: "Staying safe and building positive communities",
      articles: ["Community guidelines", "Reporting content", "Managing comments", "Privacy settings"]
    },
    {
      title: "Technical Issues",
      description: "Troubleshooting common problems",
      articles: ["Upload problems", "Playback issues", "Account access", "Browser compatibility"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Help Center</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to common questions and get help with using LilyTube
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Help Topics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {helpTopics.map((topic, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Button variant="ghost" className="h-auto p-0 text-left justify-start text-sm text-primary hover:text-primary/80">
                          {article}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Still Need Help?</CardTitle>
              <p className="text-center text-muted-foreground">
                Can't find what you're looking for? Our support team is here to help.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get help via email. We typically respond within 24 hours.
                    </p>
                    <Button variant="outline" size="sm">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chat with our support team in real-time during business hours.
                    </p>
                    <Button variant="outline" size="sm">
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 text-center">
                    <Book className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Creator Resources</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access guides, tips, and best practices for creators.
                    </p>
                    <Button variant="outline" size="sm">
                      View Resources
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
