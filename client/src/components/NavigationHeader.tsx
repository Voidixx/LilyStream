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
import { Play, Search, Plus, Bell, Moon, Sun, User, Upload, LogOut, Menu, BarChart3, Shield, ChevronDown, LogIn } from "lucide-react";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Placeholder for notifications and handlers - replace with actual implementation
  const notifications = []; 
  const handleMarkAsRead = () => {};
  const handleMarkAllAsRead = () => {};

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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <button
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 mr-2 sm:mr-4"
            data-testid="logo-button"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <Play className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              LilyTube
            </span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm sm:max-w-md md:max-w-xl mx-2 sm:mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-7 sm:pl-10 pr-2 sm:pr-4 h-8 sm:h-10 text-sm sm:text-base bg-muted/50 border-muted focus:border-primary focus:bg-background transition-colors"
                data-testid="search-input"
              />
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3 sm:w-4 sm:h-4" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-1.5 sm:p-2 rounded-full hover:bg-primary/90"
                data-testid="search-button"
              >
                <Search className="w-3 h-3" />
              </Button>
            </form>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {/* Upload Button */}
            <Button 
              onClick={() => handleFeatureClick('upload', () => setLocation('/upload'))}
              size="sm" 
              variant="ghost"
              className="flex items-center space-x-1 p-1 sm:p-2"
              data-testid="upload-button"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-sm">Upload</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1 sm:p-2"
                data-testid="notification-button"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-0 -right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-1 z-50">
                  <NotificationCenter 
                    notifications={notifications}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 p-1 sm:p-2"
                  data-testid="user-menu-button"
                >
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {user.firstName && user.lastName 
                        ? `${user.firstName[0]}${user.lastName[0]}`
                        : user.username?.slice(0, 2).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline font-medium text-sm">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'User'}</span>
                  <ChevronDown className="w-3 h-3 hidden sm:block" />
                </Button>

                {showUserMenu && (
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
                )}
              </div>
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
                  onClick={() => setLocation("/auth")} 
                  size="sm"
                  className="flex items-center space-x-1 p-1 sm:p-2"
                  data-testid="sign-in-button"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Sign In</span>
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