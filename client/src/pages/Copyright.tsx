
import NavigationHeader from "@/components/NavigationHeader";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, AlertCircle, Mail } from "lucide-react";

export default function Copyright() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Copyright Policy</h1>
            <p className="text-muted-foreground text-lg">
              Protecting intellectual property rights on LilyTube
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>DMCA Compliance</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  LilyTube complies with the Digital Millennium Copyright Act (DMCA) and other applicable 
                  copyright laws. We respect the intellectual property rights of others and expect our 
                  users to do the same.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Copyright Infringement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>If you believe your copyrighted work has been used without permission:</p>
                <ul>
                  <li>Submit a DMCA takedown notice with the required information</li>
                  <li>Include your contact information and a description of the copyrighted work</li>
                  <li>Provide the URL of the allegedly infringing content</li>
                  <li>Include a statement of good faith belief and authorization</li>
                  <li>Sign the notice with your physical or electronic signature</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>How to File a DMCA Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>Send your DMCA notice to:</p>
                <ul>
                  <li>Email: dmca@lilytube.com</li>
                  <li>Mail: LilyTube DMCA Agent, Legal Department</li>
                  <li>Phone: 1-800-LILY-DMCA</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>Counter-Notification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p>
                  If you believe your content was removed in error, you may file a counter-notification. 
                  We will restore the content within 10-14 business days unless the copyright owner 
                  files a lawsuit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
