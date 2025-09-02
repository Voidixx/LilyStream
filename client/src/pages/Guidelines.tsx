import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Heart, AlertTriangle, CheckCircle } from "lucide-react";

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
            <p className="text-muted-foreground text-lg">
              Building a positive, creative, and safe community for everyone
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Respect and Kindness</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>LilyTube is built on respect, kindness, and creativity. We expect all community members to:</p>
                <ul>
                  <li>Treat others with respect and dignity</li>
                  <li>Be constructive in feedback and criticism</li>
                  <li>Celebrate diversity and different perspectives</li>
                  <li>Help create a welcoming environment for new creators</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Prohibited Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>The following types of content are not allowed on LilyTube:</p>
                <ul>
                  <li>Hate speech, harassment, or discriminatory content</li>
                  <li>Violence, graphic content, or content that promotes harm</li>
                  <li>Spam, misleading information, or deceptive practices</li>
                  <li>Copyright infringement or unauthorized use of others' work</li>
                  <li>Adult content or sexually explicit material</li>
                  <li>Content that violates local laws or regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>What We Encourage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>We love to see content that:</p>
                <ul>
                  <li>Shows creativity, originality, and passion</li>
                  <li>Educates, entertains, or inspires others</li>
                  <li>Builds positive communities around shared interests</li>
                  <li>Showcases diverse voices and perspectives</li>
                  <li>Promotes learning, growth, and collaboration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Reporting and Enforcement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>If you encounter content that violates our guidelines:</p>
                <ul>
                  <li>Use the report button on any video or comment</li>
                  <li>Provide specific details about the violation</li>
                  <li>Our moderation team reviews all reports within 24 hours</li>
                  <li>We may remove content, issue warnings, or suspend accounts</li>
                  <li>Appeals can be submitted through our support system</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}