import { useRef, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface VideoPlayerProps {
  video: any;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressUpdateRef = useRef<NodeJS.Timeout>();

  const progressMutation = useMutation({
    mutationFn: async ({ progress, completed }: { progress: number; completed: boolean }) => {
      await apiRequest('POST', `/api/videos/${video.id}/progress`, { progress, completed });
    },
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };

    const handleTimeUpdate = () => {
      const current = videoElement.currentTime;
      setCurrentTime(current);
      setProgress((current / videoElement.duration) * 100);

      // Update progress every 10 seconds
      if (user && current > 0) {
        if (progressUpdateRef.current) {
          clearTimeout(progressUpdateRef.current);
        }
        progressUpdateRef.current = setTimeout(() => {
          const completed = current >= videoElement.duration * 0.9; // 90% completion
          progressMutation.mutate({ 
            progress: Math.floor(current), 
            completed 
          });
        }, 10000);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (user) {
        progressMutation.mutate({ 
          progress: Math.floor(videoElement.duration), 
          completed: true 
        });
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current);
      }
    };
  }, [video.id, user, progressMutation]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (newProgress: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newTime = (newProgress[0] / 100) * duration;
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress[0]);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const volumeValue = newVolume[0] / 100;
    videoElement.volume = volumeValue;
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isMuted) {
      videoElement.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoElement.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const playerElement = videoRef.current?.parentElement;
    if (!playerElement) return;

    if (!isFullscreen) {
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setShowControls(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const playerElement = videoRef.current?.parentElement;
    if (playerElement) {
      playerElement.addEventListener('mousemove', handleMouseMove);
      playerElement.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setShowControls(false);
        }
      });
    }

    return () => {
      if (playerElement) {
        playerElement.removeEventListener('mousemove', handleMouseMove);
      }
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying]);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden aspect-video group">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full"
        poster={video.thumbnailUrl}
        onClick={togglePlayPause}
        data-testid="video-element"
      />
      
      {/* Custom Controls */}
      <div 
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}
        data-testid="video-controls"
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[progress]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
            data-testid="progress-slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-white hover:text-primary hover:bg-white/20"
              data-testid="play-pause-button"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-white hover:text-primary hover:bg-white/20"
                data-testid="mute-button"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              
              <div className="w-24">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={1}
                  className="w-full"
                  data-testid="volume-slider"
                />
              </div>
            </div>
            
            <span className="text-white text-sm font-mono" data-testid="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:text-primary hover:bg-white/20"
              data-testid="fullscreen-button"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Play Button Overlay */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlayPause}
          data-testid="play-overlay"
        >
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
}
