import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, EyeOff, Globe, Lock } from "lucide-react";
import { format, addDays, addHours, addMinutes, isAfter } from "date-fns";

const schedulingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
  description: z.string().max(5000, "Description must be under 5000 characters").optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  privacy: z.enum(["public", "unlisted", "private"]),
  scheduleType: z.enum(["now", "scheduled"]),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
  thumbnail: z.any().optional(),
});

type SchedulingForm = z.infer<typeof schedulingSchema>;

interface VideoSchedulerProps {
  videoFile: File;
  onSchedule: (data: SchedulingForm & { scheduledAt?: Date }) => void;
  onCancel: () => void;
  isUploading?: boolean;
}

const categories = [
  "Gaming", "Music", "Entertainment", "Education", "Science & Technology",
  "Comedy", "Sports", "News & Politics", "Howto & Style", "Pets & Animals",
  "Travel & Events", "Film & Animation", "Autos & Vehicles", "Nonprofits & Activism"
];

const quickScheduleOptions = [
  { label: "In 1 hour", value: () => addHours(new Date(), 1) },
  { label: "In 6 hours", value: () => addHours(new Date(), 6) },
  { label: "Tomorrow", value: () => addDays(new Date(), 1) },
  { label: "In 3 days", value: () => addDays(new Date(), 3) },
  { label: "Next week", value: () => addDays(new Date(), 7) },
];

export function VideoScheduler({ videoFile, onSchedule, onCancel, isUploading }: VideoSchedulerProps) {
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<SchedulingForm>({
    resolver: zodResolver(schedulingSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      privacy: "public",
      scheduleType: "now",
      scheduledDate: "",
      scheduledTime: "",
    },
  });

  const scheduleType = form.watch("scheduleType");
  const privacy = form.watch("privacy");

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedThumbnail(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const setQuickSchedule = (getDate: () => Date) => {
    const date = getDate();
    form.setValue("scheduledDate", format(date, "yyyy-MM-dd"));
    form.setValue("scheduledTime", format(date, "HH:mm"));
  };

  const onSubmit = async (data: SchedulingForm) => {
    let scheduledAt: Date | undefined;
    
    if (data.scheduleType === "scheduled" && data.scheduledDate && data.scheduledTime) {
      scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
      
      // Validate that scheduled time is in the future
      if (!isAfter(scheduledAt, new Date())) {
        form.setError("scheduledTime", {
          message: "Scheduled time must be in the future"
        });
        return;
      }
    }

    // If scheduling for later, create the video with scheduled status
    const videoData = {
      ...data,
      thumbnail: selectedThumbnail,
      scheduledAt,
      status: data.scheduleType === "scheduled" ? "scheduled" : "published"
    };

    onSchedule(videoData);
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case "public": return <Globe className="h-4 w-4" />;
      case "unlisted": return <EyeOff className="h-4 w-4" />;
      case "private": return <Lock className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getPrivacyDescription = () => {
    switch (privacy) {
      case "public": return "Anyone can search for and view";
      case "unlisted": return "Anyone with the link can view";
      case "private": return "Only you can view";
      default: return "";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Schedule Your Video</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Video Info */}
            <div className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Video File</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]" title={videoFile.name}>
                      {videoFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(videoFile.size)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-3">
                <h3 className="font-medium">Custom Thumbnail (Optional)</h3>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-32 object-cover rounded"
                        data-testid="thumbnail-preview"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() => {
                          setSelectedThumbnail(null);
                          setThumbnailPreview(null);
                        }}
                        data-testid="button-remove-thumbnail"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        id="thumbnail-upload"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                        data-testid="input-thumbnail"
                      />
                      <label
                        htmlFor="thumbnail-upload"
                        className="cursor-pointer inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
                      >
                        <span>📷</span>
                        <span>Click to upload thumbnail</span>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Recommended: 1280x720 (16:9) | Max: 2MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Scheduling Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter video title"
                          {...field}
                          data-testid="input-video-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your video..."
                          className="resize-none"
                          rows={3}
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="privacy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Privacy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-privacy">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4" />
                                <span>Public</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="unlisted">
                              <div className="flex items-center space-x-2">
                                <EyeOff className="h-4 w-4" />
                                <span>Unlisted</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4" />
                                <span>Private</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-1 mt-1">
                          {getPrivacyIcon()}
                          <span className="text-xs text-muted-foreground">
                            {getPrivacyDescription()}
                          </span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="gaming, tutorial, entertainment (comma separated)"
                          {...field}
                          data-testid="input-tags"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="scheduleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Option</FormLabel>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={field.value === "scheduled"}
                              onCheckedChange={(checked) => 
                                field.onChange(checked ? "scheduled" : "now")
                              }
                              data-testid="switch-schedule"
                            />
                            <span className="text-sm">
                              {field.value === "scheduled" ? "Schedule for later" : "Publish now"}
                            </span>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {scheduleType === "scheduled" && (
                    <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-sm">Schedule Settings</span>
                      </div>

                      {/* Quick Schedule Options */}
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Quick options:</span>
                        <div className="flex flex-wrap gap-2">
                          {quickScheduleOptions.map((option, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                              onClick={() => setQuickSchedule(option.value)}
                              data-testid={`quick-schedule-${index}`}
                            >
                              {option.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="scheduledDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  min={format(new Date(), "yyyy-MM-dd")}
                                  {...field}
                                  data-testid="input-scheduled-date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="scheduledTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  data-testid="input-scheduled-time"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1"
                    data-testid="button-schedule-video"
                  >
                    {isUploading 
                      ? "Uploading..." 
                      : scheduleType === "scheduled" 
                        ? "Schedule Video" 
                        : "Publish Now"
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isUploading}
                    data-testid="button-cancel-schedule"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}