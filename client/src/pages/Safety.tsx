
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Users, Eye, Lock } from "lucide-react";

export default function Safety() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Safety Center</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your safety is our priority. Learn about our policies, tools, and resources to help you stay safe on LilyTube.
            </p>
          </div>

          {/* Safety Features */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Content Moderation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-powered content screening combined with human review ensures harmful content is quickly identified and removed.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• 24/7 automated monitoring</li>
                  <li>• Expert human reviewers</li>
                  <li>• Rapid response team</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Privacy Controls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive privacy settings give you full control over your data and who can interact with you.
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Granular privacy settings</li>
                  <li>• Data download tools</li>
                  <li>• Account deletion options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Community Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Clear, fair guidelines that promote positive interactions and protect all community members.
                </p>
                <Button size="sm" variant="outline">View Guidelines</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report & Block</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Easy-to-use reporting tools help you flag inappropriate content and block unwanted interactions.
                </p>
                <Button size="sm" variant="outline">Learn More</Button>
              </CardContent>
            </Card>
          </div>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">For Creators</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Creator safety guide</li>
                    <li>• Comment management tools</li>
                    <li>• Audience insights</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">For Parents</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Parental controls guide</li>
                    <li>• Age-appropriate content</li>
                    <li>• Family safety tips</li>
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
