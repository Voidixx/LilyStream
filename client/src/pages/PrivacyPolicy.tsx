import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              Your privacy matters to us. Last updated: January 2025
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Information We Collect</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We collect information you provide directly to us, information we obtain automatically when you use our service, 
                  and information from third parties.
                </p>
                <h4>Information you provide to us:</h4>
                <ul>
                  <li>Account information (username, email, password)</li>
                  <li>Profile information (display name, bio, profile picture)</li>
                  <li>Content you upload (videos, comments, descriptions)</li>
                  <li>Communications with us (support requests, feedback)</li>
                </ul>
                <h4>Information we collect automatically:</h4>
                <ul>
                  <li>Usage data (videos watched, search queries, interaction patterns)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Performance data (load times, errors, feature usage)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5" />
                  <span>How We Use Your Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, security alerts, and support messages</li>
                  <li>Respond to your comments, questions, and customer service requests</li>
                  <li>Communicate with you about products, services, offers, and events</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>Personalize and improve your experience</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Information Sharing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, 
                  except in the following circumstances:
                </p>
                <ul>
                  <li>With your consent or at your direction</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                  <li>With service providers who assist us in operating our platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Data Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against 
                  unauthorized or unlawful processing, accidental loss, destruction, or damage.
                </p>
                <h4>Our security measures include:</h4>
                <ul>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Employee training on data protection and privacy</li>
                  <li>Incident response procedures</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights and Choices</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>You have several rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> You can request access to your personal information</li>
                  <li><strong>Correction:</strong> You can request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> You can request deletion of your personal information</li>
                  <li><strong>Portability:</strong> You can request a copy of your data in a structured format</li>
                  <li><strong>Objection:</strong> You can object to processing of your personal information</li>
                  <li><strong>Restriction:</strong> You can request restriction of processing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided at the end of this policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We use cookies and similar tracking technologies to collect and track information and to improve our service. 
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
                <h4>Types of cookies we use:</h4>
                <ul>
                  <li><strong>Essential cookies:</strong> Necessary for the website to function</li>
                  <li><strong>Performance cookies:</strong> Help us understand how visitors use our site</li>
                  <li><strong>Functionality cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Analytics cookies:</strong> Help us improve our service</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Our service is not intended for children under the age of 13. We do not knowingly collect personal information 
                  from children under 13. If you are a parent or guardian and you are aware that your child has provided us with 
                  personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Data Transfers</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  Your information may be transferred to and maintained on computers located outside of your jurisdiction 
                  where data protection laws may differ. We ensure appropriate safeguards are in place for such transfers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul>
                  <li>Email: privacy@lilytube.com</li>
                  <li>Address: LilyTube Privacy Team</li>
                  <li>Phone: 1-800-LILY-TUBE</li>
                  <li>Data Protection Officer: dpo@lilytube.com</li>
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