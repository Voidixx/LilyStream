import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Play, Search, Plus, Bell, Moon, Sun, User, Upload, LogOut, Menu, BarChart3, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";
import { GuestPrompt, useGuestPrompt } from "./GuestPrompt";
import NotificationCenter from "./NotificationCenter";

interface NavigationHeaderProps {
  onSearch?: (query: string) => void;
}

export default function NavigationHeader({ onSearch }: NavigationHeaderProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const { currentPrompt, showPrompt, hidePrompt } = useGuestPrompt();
  
  const handleFeatureClick = (feature: "upload" | "like" | "comment" | "subscribe" | "save" | "history", action: () => void) => {
    if (user) {
      action();
    } else {
      showPrompt(feature);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (onSearch) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur border-b border-border bg-background/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              data-testid="logo-button"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LilyTube
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-12 bg-muted border-border focus:ring-2 focus:ring-primary focus:border-transparent rounded-full"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90"
                data-testid="search-button"
              >
                <Search className="w-3 h-3" />
              </Button>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-muted"
              data-testid="theme-toggle"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button
              onClick={() => handleFeatureClick('upload', () => setLocation('/upload'))}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4"
              data-testid="upload-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              {user ? 'Upload' : 'Upload Video'}
            </Button>

            {user && <NotificationCenter />}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full"
                    data-testid="user-menu-button"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {user.firstName && user.lastName 
                          ? `${user.firstName[0]}${user.lastName[0]}`
                          : user.username?.slice(0, 2).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {user.firstName && user.lastName 
                          ? `${user.firstName[0]}${user.lastName[0]}`
                          : user.username?.slice(0, 2).toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.username || 'User'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{user.username || 'user'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.subscriberCount || 0} subscribers
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setLocation(`/profile/${user.username}`)}
                    data-testid="profile-menu-item"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Your Channel
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation('/upload')}
                    data-testid="upload-menu-item"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Video
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleFeatureClick('history', () => setLocation('/history'))}
                    data-testid="history-menu-item"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Watch History
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setLocation('/analytics')}
                    data-testid="analytics-menu-item"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem 
                      onClick={() => setLocation('/admin')}
                      data-testid="admin-dashboard-menu-item"
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      localStorage.removeItem('user');
                      setLocation('/auth');
                    }}
                    data-testid="logout-menu-item"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="guest-menu">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <p className="font-medium text-sm">Browse as Guest</p>
                      <p className="text-xs text-muted-foreground">Sign in for more features</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLocation('/auth')} data-testid="sign-in-menu">
                      <User className="mr-2 h-4 w-4" />
                      Sign In / Join
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => showPrompt('upload')} data-testid="upload-menu-guest">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Video
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <Bell className="mr-2 h-4 w-4 opacity-50" />
                      Notifications (Sign in required)
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <Play className="mr-2 h-4 w-4 opacity-50" />
                      Watch History (Sign in required)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="outline"
                  onClick={() => setLocation('/auth')}
                  className="hidden sm:inline-flex"
                  data-testid="sign-in-button"
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Guest Prompts */}
      {currentPrompt && (
        <GuestPrompt 
          feature={currentPrompt} 
          onClose={hidePrompt}
        />
      )}
    </nav>
  );
}
