import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  ThumbsUp, 
  Play, 
  Upload,
  Zap,
  Star,
  Flame,
  Users,
  Music,
  Gamepad2,
  GraduationCap,
  Plane,
  ChefHat,
  Laptop
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format, formatDistance } from "date-fns";

const categories = [
  { name: 'All', icon: Play, color: 'bg-gray-500' },
  { name: 'Trending', icon: TrendingUp, color: 'bg-red-500' },
  { name: 'Gaming', icon: Gamepad2, color: 'bg-purple-500' },
  { name: 'Music', icon: Music, color: 'bg-pink-500' },
  { name: 'Education', icon: GraduationCap, color: 'bg-blue-500' },
  { name: 'Technology', icon: Laptop, color: 'bg-green-500' },
  { name: 'Travel', icon: Plane, color: 'bg-cyan-500' },
  { name: 'Cooking', icon: ChefHat, color: 'bg-orange-500' },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Check if we're on a specific route
  const [matchTrending] = useRoute('/trending');
  const [matchCategory] = useRoute('/category/:category');
  const [matchSearch] = useRoute('/search');

  const { data: videos, isLoading } = useQuery({
    queryKey: ['/api/videos', selectedCategory, searchQuery],
    enabled: true,
  });

  const { data: trendingVideos } = useQuery({
    queryKey: ['/api/videos/trending'],
    enabled: true,
  });

  const { data: categoryStats } = useQuery({
    queryKey: ['/api/categories/stats'],
    enabled: true,
  });

  // Filter videos based on current view
  const getFilteredVideos = () => {
    if (!videos) return [];
    
    let filtered = videos.filter((video: any) => video.privacy === 'public');
    
    if (matchTrending) {
      // Sort by engagement for trending
      return filtered.sort((a: any, b: any) => {
        const aEngagement = (a.views * 0.4) + (a.likes * 2) + (a.comments * 3);
        const bEngagement = (b.views * 0.4) + (b.likes * 2) + (b.comments * 3);
        return bEngagement - aEngagement;
      }).slice(0, 50);
    }
    
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter((video: any) => video.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((video: any) => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredVideos = getFilteredVideos();

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader onSearch={setSearchQuery} />
      
      <main className="pt-16">
        {/* Quick Stats Bar */}
        <section className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <Play className="w-4 h-4" />
                  <span>{filteredVideos.length} videos available</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Join thousands of creators</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>Fair algorithm for everyone</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                {!user && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setLocation('/auth')}
                    data-testid="quick-login-button"
                  >
                    Login to Upload
                  </Button>
                )}
                <span className="text-xs opacity-75">© 2025 LilyTube</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Category Navigation */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Discover Amazing Content</h2>
            <div className="hidden md:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Star className="w-3 h-3 mr-1" />
                New Algorithm
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Zap className="w-3 h-3 mr-1" />
                Fair Discovery
              </Badge>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="recommended" data-testid="tab-recommended">
                <Flame className="w-4 h-4 mr-2" />
                For You
              </TabsTrigger>
              <TabsTrigger value="trending" data-testid="tab-trending">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="latest" data-testid="tab-latest">
                <Clock className="w-4 h-4 mr-2" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="categories" data-testid="tab-categories">
                <Play className="w-4 h-4 mr-2" />
                Categories
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setActiveTab('recommended');
                      }}
                      className={`group relative overflow-hidden rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 ${
                        selectedCategory === category.name
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-md'
                      }`}
                      data-testid={`category-${category.name.toLowerCase()}`}
                    >
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${category.color} flex items-center justify-center text-white`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-medium">{category.name}</span>
                      {categoryStats?.[category.name] && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {categoryStats[category.name]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Videos Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No Videos Yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery 
                  ? `No videos found for "${searchQuery}". Try a different search term.`
                  : "Be the first to share amazing content! Upload your first video to get started."
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setLocation('/upload')}
                  className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-all duration-300"
                  data-testid="upload-button"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Video
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVideos.map((video: any) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              
              {filteredVideos.length >= 8 && (
                <div className="text-center mt-12">
                  <Button 
                    onClick={() => refetch()}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
                    data-testid="load-more-button"
                  >
                    Load More Videos
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
