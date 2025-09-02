
import { NavigationHeader } from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Mail, Calendar } from "lucide-react";

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Press & Media
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Download our press kit, logos, and brand assets. Get in touch with our media team for interviews and partnerships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Press Kit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Complete brand guidelines, logos, screenshots, and company information.
                </p>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Press Kit
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Media Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get in touch with our media relations team for interviews and press inquiries.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Media Team
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Recent Press Coverage</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">LilyTube Launches Fair Algorithm Initiative</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tech News Daily - March 15, 2024
                        </p>
                        <p className="text-muted-foreground mt-2">
                          "LilyTube's commitment to creator equality sets a new standard for video platforms..."
                        </p>
                      </div>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Company Facts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2024</div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Creator-Focused</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Fair</div>
                    <div className="text-sm text-muted-foreground">Algorithm</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
