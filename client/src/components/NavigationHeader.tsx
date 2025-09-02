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
import { Play, Search, Plus, Bell, Moon, Sun, User, Upload, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/ThemeProvider";

interface NavigationHeaderProps {
  onSearch?: (query: string) => void;
}

export default function NavigationHeader({ onSearch }: NavigationHeaderProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

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
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/upload')}
              className="hover:bg-muted"
              data-testid="upload-button"
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
              data-testid="notifications-button"
            >
              <Bell className="w-5 h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full"
                  data-testid="user-menu-button"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center space-x-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email || 'Unknown User'
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setLocation('/profile')}
                  data-testid="profile-menu-item"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLocation('/upload')}
                  data-testid="upload-menu-item"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="logout-menu-item"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
