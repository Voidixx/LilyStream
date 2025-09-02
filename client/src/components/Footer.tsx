import { useLocation } from "wouter";
import { Heart, Shield, FileText, HelpCircle, Mail, Globe } from "lucide-react";

export function Footer() {
  const [, setLocation] = useLocation();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold">LilyTube</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              The premium video platform where creators thrive and viewers discover amazing content.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setLocation("/about")} className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/careers")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/press")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Press
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/blog")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setLocation("/terms")} className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <FileText className="w-3 h-3" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/privacy")} className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <Shield className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/guidelines")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Community Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/copyright")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Copyright
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setLocation("/help")} className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Help Center</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/contact")} className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>Contact Us</span>
                </button>
              </li>
              <li>
                <button onClick={() => setLocation("/safety")} className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety Center
                </button>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1">
                  <Globe className="w-3 h-3" />
                  <span>Community</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {currentYear} LilyTube. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Made with ❤️ for creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}