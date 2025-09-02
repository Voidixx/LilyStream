import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const categories = ['All', 'Gaming', 'Technology', 'Education', 'Music', 'Travel', 'Cooking'];

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['/api/videos'],
    enabled: true,
  });

  const filteredVideos = videos?.filter((video: any) => {
    const categoryMatch = selectedCategory === 'All' || video.category === selectedCategory;
    const searchMatch = !searchQuery || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch && video.privacy === 'public';
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader onSearch={setSearchQuery} />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=2464&h=1000')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center text-white fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Welcome to LilyTube
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Your personal premium video streaming experience
              </p>
              <Button 
                onClick={() => setLocation('/upload')}
                className="bg-white text-primary px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                data-testid="upload-first-video-button"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First Video
              </Button>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
                data-testid={`category-${category.toLowerCase()}`}
              >
                {category}
              </button>
            ))}
          </div>
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
