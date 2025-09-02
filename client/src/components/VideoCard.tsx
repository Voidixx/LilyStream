import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Clock, Edit, Trash } from "lucide-react";
import FollowButton from "./FollowButton";

interface VideoCardProps {
  video: any;
  showOptions?: boolean;
}

export default function VideoCard({ video, showOptions = false }: VideoCardProps) {
  const [, setLocation] = useLocation();
  const [imageError, setImageError] = useState(false);

  const handleVideoClick = () => {
    setLocation(`/watch/${video.id}`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - videoDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <Card className="video-card overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 w-full">
      <div className="relative" onClick={handleVideoClick}>
        <img 
          src={imageError || !video.thumbnailUrl 
            ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop"
            : video.thumbnailUrl
          }
          alt={video.title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover"
          onError={() => setImageError(true)}
          data-testid="video-thumbnail"
        />
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded">
            <span data-testid="video-duration">
              {formatDuration(video.duration)}
            </span>
          </div>
        )}
        {showOptions && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  data-testid="video-options-button"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem data-testid="edit-video-option">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" data-testid="delete-video-option">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      <div className="p-4" onClick={handleVideoClick}>
        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 text-sm" data-testid="video-title">
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span data-testid="video-views">
              {formatViews(video.views || 0)} views
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span data-testid="video-upload-time">
              {formatTimeAgo(video.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={video.user?.profileImageUrl} />
              <AvatarFallback className="text-xs">
                {video.user?.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate" data-testid="channel-name">
              {video.user?.firstName && video.user?.lastName
                ? `${video.user.firstName} ${video.user.lastName}`
                : 'Unknown User'
              }
            </span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <FollowButton 
              channelId={video.userId} 
              subscriberCount={video.user?.subscriberCount}
              size="sm"
              showCount={false}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
