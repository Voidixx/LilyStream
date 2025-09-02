import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CloudUpload, Video, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UploadFormProps {
  onSuccess: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const { toast } = useToast();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    privacy: "public",
    schedule: "now",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    "Gaming",
    "Technology", 
    "Education",
    "Music",
    "Travel",
    "Cooking",
    "Entertainment",
    "Sports",
    "News",
    "Other"
  ];

  const onVideoDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      // Auto-fill title from filename if empty
      if (!formData.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setFormData(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  }, [formData.title]);

  const onThumbnailDropAccepted = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setThumbnailFile(file);
    }
  }, []);

  const {
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
    isDragActive: isVideoDragActive,
  } = useDropzone({
    onDropAccepted: onVideoDropAccepted,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
  });

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
    isDragActive: isThumbnailDragActive,
  } = useDropzone({
    onDropAccepted: onThumbnailDropAccepted,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile) throw new Error("No video file selected");
      
      setIsUploading(true);
      setUploadProgress(0);

      const formDataPayload = new FormData();
      formDataPayload.append('video', videoFile);
      formDataPayload.append('title', formData.title);
      formDataPayload.append('description', formData.description);
      formDataPayload.append('category', formData.category);
      formDataPayload.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)));
      formDataPayload.append('privacy', formData.privacy);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      try {
        const response = await fetch('/api/videos', {
          method: 'POST',
          body: formDataPayload,
          credentials: 'include',
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`${response.status}: ${errorText}`);
        }

        const video = await response.json();

        // Upload thumbnail if provided
        if (thumbnailFile) {
          const thumbnailFormData = new FormData();
          thumbnailFormData.append('thumbnail', thumbnailFile);
          
          await fetch(`/api/videos/${video.id}/thumbnail`, {
            method: 'POST',
            body: thumbnailFormData,
            credentials: 'include',
          });
        }

        return video;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: () => {
      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded and is now available.",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload video. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your video.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your video.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate();
  };

  const removeVideoFile = () => {
    setVideoFile(null);
    setUploadProgress(0);
  };

  const removeThumbnailFile = () => {
    setThumbnailFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Video Upload Zone */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Video File</Label>
        {!videoFile ? (
          <div
            {...getVideoRootProps()}
            className={`upload-zone rounded-lg p-12 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
              isVideoDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary hover:bg-primary/5'
            }`}
            data-testid="video-upload-zone"
          >
            <input {...getVideoInputProps()} />
            <CloudUpload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              {isVideoDragActive ? 'Drop your video here' : 'Drop your video here'}
            </h3>
            <p className="text-muted-foreground mb-4">or click to browse your files</p>
            <p className="text-sm text-muted-foreground">
              Supports MP4, MOV, AVI, MKV, WebM up to 2GB
            </p>
          </div>
        ) : (
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Video className="w-10 h-10 text-primary" />
                  <div>
                    <p className="font-medium text-card-foreground">{videoFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeVideoFile}
                  className="text-muted-foreground hover:text-destructive"
                  data-testid="remove-video-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Video Details */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Video Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter a compelling title for your video..."
              className="mt-2"
              maxLength={100}
              required
              data-testid="title-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell viewers about your video..."
              rows={4}
              className="mt-2 resize-none"
              maxLength={5000}
              data-testid="description-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/5000 characters
            </p>
          </div>

          <div>
            <Label className="text-base font-medium">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger className="mt-2" data-testid="category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags" className="text-base font-medium">
              Tags
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="Add tags separated by commas (e.g., gaming, tutorial, fun)"
              className="mt-2"
              data-testid="tags-input"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Help people find your video with relevant tags
            </p>
          </div>
        </div>

        {/* Right Column - Settings */}
        <div className="space-y-6">
          {/* Thumbnail Upload */}
          <div>
            <Label className="text-base font-medium mb-3 block">Custom Thumbnail</Label>
            {!thumbnailFile ? (
              <div
                {...getThumbnailRootProps()}
                className={`upload-zone rounded-lg p-8 text-center cursor-pointer border-2 border-dashed transition-all duration-300 ${
                  isThumbnailDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
                data-testid="thumbnail-upload-zone"
              >
                <input {...getThumbnailInputProps()} />
                <Image className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-2">Upload custom thumbnail</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP up to 2MB</p>
              </div>
            ) : (
              <Card className="border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground text-sm">{thumbnailFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(thumbnailFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeThumbnailFile}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid="remove-thumbnail-button"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Privacy Settings */}
          <div>
            <Label className="text-base font-medium mb-3 block">Privacy</Label>
            <RadioGroup
              value={formData.privacy}
              onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
              className="space-y-3"
              data-testid="privacy-radio-group"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="public" id="public" />
                <div className="flex-1">
                  <Label htmlFor="public" className="font-medium text-card-foreground">
                    Public
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Anyone can search for and view
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="unlisted" id="unlisted" />
                <div className="flex-1">
                  <Label htmlFor="unlisted" className="font-medium text-card-foreground">
                    Unlisted
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only people with the link can view
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="private" id="private" />
                <div className="flex-1">
                  <Label htmlFor="private" className="font-medium text-card-foreground">
                    Private
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only you can view
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Schedule */}
          <div>
            <Label className="text-base font-medium mb-3 block">Schedule</Label>
            <RadioGroup
              value={formData.schedule}
              onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}
              className="space-y-3"
              data-testid="schedule-radio-group"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="text-card-foreground">
                  Publish immediately
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="later" id="later" />
                <Label htmlFor="later" className="text-card-foreground">
                  Schedule for later
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Uploading your video...
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {uploadProgress}%
              </span>
            </div>
            <Progress value={uploadProgress} className="mb-2" data-testid="upload-progress" />
            <p className="text-xs text-muted-foreground">
              This may take a few minutes depending on your file size and internet connection.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-border">
        <Button 
          type="button"
          variant="outline"
          disabled={isUploading}
          data-testid="save-draft-button"
        >
          Save Draft
        </Button>
        <Button 
          type="submit"
          disabled={!videoFile || !formData.title.trim() || !formData.category || isUploading}
          className="bg-primary text-primary-foreground px-8 hover:bg-primary/90 disabled:opacity-50"
          data-testid="upload-video-button"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </Button>
      </div>
    </form>
  );
}
