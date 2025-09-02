import { useLocation } from "wouter";
import { Heart, Shield, FileText, HelpCircle, Mail, Globe } from "lucide-react";

export default function Footer() {
  const [, setLocation] = useLocation();

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
    ],
    Legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Community Guidelines", href: "/guidelines" },
      { name: "Copyright Policy", href: "/copyright" },
    ],
    Support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Report Issue", href: "/report" },
      { name: "Safety Center", href: "/safety" },
    ],
    Features: [
      { name: "Creator Studio", href: "/studio" },
      { name: "Analytics", href: "/analytics" },
      { name: "Live Streaming", href: "/live" },
      { name: "API Documentation", href: "/api-docs" },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LilyTube
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              The future of video sharing. Built for creators, designed for everyone.
            </p>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Globe className="w-3 h-3" />
              <span>Available worldwide</span>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="min-w-0">
              <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{category}</h4>
              <ul className="space-y-1 sm:space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => setLocation(link.href)}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-muted-foreground">
            <span className="text-center sm:text-left">© {currentYear} LilyTube. All rights reserved.</span>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure Platform</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setLocation('/terms')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <FileText className="w-3 h-3" />
              <span className="hidden sm:inline">Terms</span>
            </button>
            <button
              onClick={() => setLocation('/privacy')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Privacy</span>
            </button>
            <button
              onClick={() => setLocation('/help')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span className="hidden sm:inline">Help</span>
            </button>
            <button
              onClick={() => setLocation('/contact')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
            >
              <Mail className="w-3 h-3" />
              <span className="hidden sm:inline">Contact</span>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              LilyTube is committed to creating the most advanced video platform with features that surpass YouTube.
              <br />
              Built with modern technology for creators worldwide.
            </p>
            <div className="flex justify-center items-center space-x-4 mt-3">
              <span className="text-xs text-muted-foreground">Powered by AI</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span className="text-xs text-muted-foreground">Advanced Analytics</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span className="text-xs text-muted-foreground">Real-time Features</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}