
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Heart, Users, Zap, Globe, Code } from "lucide-react";

export default function Careers() {
  const jobOpenings = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Help build the next generation of creator tools with React, TypeScript, and modern web technologies.",
    },
    {
      title: "Backend Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time", 
      description: "Scale our video infrastructure and build APIs that serve millions of creators worldwide.",
    },
    {
      title: "Creator Success Manager",
      department: "Creator Relations",
      location: "Remote",
      type: "Full-time",
      description: "Work directly with top creators to help them succeed and grow their audiences on our platform.",
    },
    {
      title: "Product Designer",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Design beautiful, intuitive experiences for creators and viewers across web and mobile.",
    },
    {
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and maintain infrastructure that powers video streaming for millions of users.",
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Build and nurture our creator community through social media, events, and direct engagement.",
    },
  ];

  const benefits = [
    { icon: Heart, title: "Health & Wellness", description: "Comprehensive health insurance and wellness programs" },
    { icon: Globe, title: "Remote First", description: "Work from anywhere in the world with flexible hours" },
    { icon: Zap, title: "Learning Budget", description: "$2,000 annual budget for courses, conferences, and books" },
    { icon: Users, title: "Equity Package", description: "Meaningful equity stake in the company's success" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Help us build the future of video sharing. We're looking for passionate people who 
              want to empower creators and revolutionize online video.
            </p>
          </div>

          {/* Why Work Here */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Work at LilyTube?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <benefit.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded">{job.department}</span>
                          <span className="bg-muted px-2 py-1 rounded">{job.location}</span>
                          <span className="bg-muted px-2 py-1 rounded">{job.type}</span>
                        </div>
                      </div>
                      <Button className="mt-4 sm:mt-0">Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{job.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Culture */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Our Culture</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Code className="w-5 h-5 mr-2 text-primary" />
                    Innovation First
                  </h3>
                  <p className="text-muted-foreground">
                    We encourage experimentation and learning from failure. Every team member 
                    has the autonomy to propose and implement new ideas.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-primary" />
                    Creator Obsessed
                  </h3>
                  <p className="text-muted-foreground">
                    Every decision we make starts with "How does this help creators succeed?" 
                    We're building for the people who make our platform amazing.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    Global Impact
                  </h3>
                  <p className="text-muted-foreground">
                    Our work reaches millions of people worldwide. We take responsibility 
                    for building technology that makes the world more creative and connected.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-primary" />
                    Work-Life Balance
                  </h3>
                  <p className="text-muted-foreground">
                    We believe great work comes from well-rested, happy people. Flexible schedules 
                    and unlimited PTO help you do your best work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Process */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Apply?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't see a position that fits? We're always looking for exceptional people. 
              Send us your resume and tell us how you'd like to contribute to LilyTube's mission.
            </p>
            <Button size="lg" className="mr-4">
              View All Positions
            </Button>
            <Button variant="outline" size="lg">
              Send General Application
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
