
import NavigationHeader from "@/components/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions, feedback, or need support? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input placeholder="Your last name" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input placeholder="What is this regarding?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your question or feedback..."
                    rows={6}
                  />
                </div>
                <Button className="w-full">Send Message</Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <p className="text-muted-foreground">
                    Choose the best way to reach us based on your needs.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        For general inquiries and support questions
                      </p>
                      <p className="text-sm">support@lilytube.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MessageCircle className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Live Chat</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Real-time support during business hours
                      </p>
                      <Button variant="outline" size="sm">Start Chat</Button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">Phone Support</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        For urgent issues requiring immediate assistance
                      </p>
                      <p className="text-sm">1-800-LILY-TUBE</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri, 9 AM - 6 PM EST</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">For Press Inquiries</h3>
                    <p className="text-sm text-muted-foreground">press@lilytube.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Business Partnerships</h3>
                    <p className="text-sm text-muted-foreground">partnerships@lilytube.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Legal Matters</h3>
                    <p className="text-sm text-muted-foreground">legal@lilytube.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For DMCA Claims</h3>
                    <p className="text-sm text-muted-foreground">dmca@lilytube.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Email: Within 24 hours</li>
                    <li>• Live Chat: Immediate during business hours</li>
                    <li>• Phone: Immediate during business hours</li>
                    <li>• Press inquiries: Within 48 hours</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
