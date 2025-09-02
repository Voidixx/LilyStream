import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Clock, Wifi, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadProgressProps {
  file: File;
  uploadedBytes: number;
  totalBytes: number;
  uploadSpeed: number; // bytes per second
  status: "uploading" | "processing" | "completed" | "failed";
  estimatedTimeRemaining: number; // in seconds
  onCancel?: () => void;
  type: "video" | "thumbnail";
}

export function UploadProgress({
  file,
  uploadedBytes,
  totalBytes,
  uploadSpeed,
  status,
  estimatedTimeRemaining,
  onCancel,
  type
}: UploadProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  
  useEffect(() => {
    if (status === "uploading") {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const progressPercentage = totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0;
  
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    const mbps = (bytesPerSecond * 8) / (1024 * 1024);
    if (mbps < 1) {
      const kbps = (bytesPerSecond * 8) / 1024;
      return `${kbps.toFixed(1)} Kbps`;
    }
    return `${mbps.toFixed(1)} Mbps`;
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusColor = () => {
    switch (status) {
      case "uploading": return "bg-blue-500";
      case "processing": return "bg-yellow-500";
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "uploading": return <Upload className="h-4 w-4" />;
      case "processing": return <Clock className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "failed": return <AlertCircle className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading": return "Uploading";
      case "processing": return "Processing";
      case "completed": return "Completed";
      case "failed": return "Failed";
      default: return "Unknown";
    }
  };

  const getInternetSpeedClass = () => {
    const mbps = (uploadSpeed * 8) / (1024 * 1024);
    if (mbps > 25) return "text-green-600";
    if (mbps > 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="w-full" data-testid={`upload-progress-${type}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-sm font-medium">
              {type === "video" ? "Video Upload" : "Thumbnail Upload"}
            </CardTitle>
            <Badge variant="secondary" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
          {onCancel && status === "uploading" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              data-testid="button-cancel-upload"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="truncate max-w-[200px]" title={file.name}>
              {file.name}
            </span>
            <span className="text-muted-foreground">
              {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-2" 
            data-testid="progress-bar"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progressPercentage}%</span>
            {status === "uploading" && (
              <span>
                ETA: {formatTime(estimatedTimeRemaining)}
              </span>
            )}
          </div>
        </div>

        {status === "uploading" && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <Wifi className="h-3 w-3" />
              <span>Speed:</span>
              <span className={getInternetSpeedClass()}>
                {formatSpeed(uploadSpeed)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-3 w-3" />
              <span>Elapsed:</span>
              <span>{formatTime(elapsedTime)}</span>
            </div>
          </div>
        )}

        {status === "processing" && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-yellow-500"></div>
            <span>Processing {type}... This may take a few moments.</span>
          </div>
        )}

        {status === "completed" && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>{type === "video" ? "Video" : "Thumbnail"} uploaded successfully!</span>
          </div>
        )}

        {status === "failed" && (
          <div className="flex items-center space-x-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>Upload failed. Please try again.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Hook for managing upload progress
export function useUploadProgress() {
  const [uploadSessions, setUploadSessions] = useState<Map<string, any>>(new Map());

  const startUpload = (file: File, type: "video" | "thumbnail") => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    
    const session = {
      id: sessionId,
      file,
      type,
      uploadedBytes: 0,
      totalBytes: file.size,
      uploadSpeed: 0,
      status: "uploading" as const,
      estimatedTimeRemaining: 0,
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
      lastUploadedBytes: 0,
    };
    
    setUploadSessions(prev => new Map(prev.set(sessionId, session)));
    return sessionId;
  };

  const updateProgress = (sessionId: string, uploadedBytes: number) => {
    setUploadSessions(prev => {
      const newMap = new Map(prev);
      const session = newMap.get(sessionId);
      if (!session) return prev;

      const now = Date.now();
      const timeDiff = (now - session.lastUpdateTime) / 1000; // in seconds
      const bytesDiff = uploadedBytes - session.lastUploadedBytes;
      
      // Calculate upload speed (bytes per second)
      const instantSpeed = timeDiff > 0 ? bytesDiff / timeDiff : 0;
      
      // Use exponential moving average for smoother speed calculation
      const alpha = 0.3;
      const uploadSpeed = session.uploadSpeed 
        ? session.uploadSpeed * (1 - alpha) + instantSpeed * alpha
        : instantSpeed;

      // Calculate estimated time remaining
      const remainingBytes = session.totalBytes - uploadedBytes;
      const estimatedTimeRemaining = uploadSpeed > 0 
        ? Math.ceil(remainingBytes / uploadSpeed) 
        : 0;

      const updatedSession = {
        ...session,
        uploadedBytes,
        uploadSpeed: Math.max(0, uploadSpeed),
        estimatedTimeRemaining,
        lastUpdateTime: now,
        lastUploadedBytes: uploadedBytes,
      };

      newMap.set(sessionId, updatedSession);
      return newMap;
    });
  };

  const setStatus = (sessionId: string, status: "uploading" | "processing" | "completed" | "failed") => {
    setUploadSessions(prev => {
      const newMap = new Map(prev);
      const session = newMap.get(sessionId);
      if (!session) return prev;

      newMap.set(sessionId, { ...session, status });
      return newMap;
    });
  };

  const removeSession = (sessionId: string) => {
    setUploadSessions(prev => {
      const newMap = new Map(prev);
      newMap.delete(sessionId);
      return newMap;
    });
  };

  return {
    uploadSessions,
    startUpload,
    updateProgress,
    setStatus,
    removeSession,
  };
}