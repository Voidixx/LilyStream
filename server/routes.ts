import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { jsonStorage as storage } from "./jsonStorage";
import { setupAuth, requireAuth } from "./auth";
import { insertVideoSchema, insertCommentSchema, insertPlaylistSchema, User } from "@shared/schema";

// Admin middleware
const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const user = await storage.getUser(req.user.id);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  
  req.adminUser = user;
  next();
};

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videoDir = path.join(uploadDir, 'videos');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const thumbnailStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const thumbDir = path.join(uploadDir, 'thumbnails');
    if (!fs.existsSync(thumbDir)) {
      fs.mkdirSync(thumbDir, { recursive: true });
    }
    cb(null, thumbDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadVideo = multer({ 
  storage: videoStorage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2GB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  }
});

const uploadThumbnail = multer({ 
  storage: thumbnailStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.use('/uploads', express.static(uploadDir));

  // Auth routes
  app.get('/api/auth/user', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes
  app.get('/api/admin/analytics', requireAdmin, async (req: any, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/admin/users', requireAdmin, async (req: any, res) => {
    try {
      const { page = '1', limit = '20', search = '' } = req.query;
      const result = await storage.getAllUsers(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );
      
      // Remove passwords from all users
      const users = result.users.map(({ password, ...user }) => user);
      res.json({ ...result, users });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/videos', requireAdmin, async (req: any, res) => {
    try {
      const { page = '1', limit = '20', search = '', status = '' } = req.query;
      const result = await storage.getAllVideos(
        parseInt(page as string),
        parseInt(limit as string),
        search as string,
        status as string
      );
      res.json(result);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get('/api/admin/comments', requireAdmin, async (req: any, res) => {
    try {
      const { page = '1', limit = '20', search = '' } = req.query;
      const result = await storage.getAllComments(
        parseInt(page as string),
        parseInt(limit as string),
        search as string
      );
      res.json(result);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/admin/users/:id/ban', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      await storage.banUser(id, reason, req.adminUser.id);
      res.json({ message: "User banned successfully" });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });

  app.post('/api/admin/users/:id/unban', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.unbanUser(id, req.adminUser.id);
      res.json({ message: "User unbanned successfully" });
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ message: "Failed to unban user" });
    }
  });

  app.post('/api/admin/videos/:id/moderate', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      await storage.moderateVideo(id, status, reason, req.adminUser.id);
      res.json({ message: "Video moderated successfully" });
    } catch (error) {
      console.error("Error moderating video:", error);
      res.status(500).json({ message: "Failed to moderate video" });
    }
  });

  app.post('/api/admin/comments/:id/moderate', requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      await storage.moderateComment(id, status, reason, req.adminUser.id);
      res.json({ message: "Comment moderated successfully" });
    } catch (error) {
      console.error("Error moderating comment:", error);
      res.status(500).json({ message: "Failed to moderate comment" });
    }
  });

  // Video routes
  app.get('/api/videos', async (req, res) => {
    try {
      const { userId, category, search } = req.query;
      const videos = await storage.getVideos(
        userId as string, 
        category as string, 
        search as string
      );
      
      // Add user info to each video
      const videosWithUsers = await Promise.all(videos.map(async (video) => {
        const user = await storage.getUser(video.userId);
        return {
          ...video,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
          } : null,
        };
      }));
      
      res.json(videosWithUsers);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Trending videos API
  app.get('/api/videos/trending', async (req, res) => {
    try {
      const videos = await storage.getVideos();
      // Sort by engagement score (views + likes*2 + comments*3)
      const trending = videos
        .map(video => ({
          ...video,
          engagementScore: (video.views || 0) + (video.likes || 0) * 2 + (video.comments || 0) * 3
        }))
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, 50);
      
      // Add user info to each video
      const videosWithUsers = await Promise.all(trending.map(async (video) => {
        const user = await storage.getUser(video.userId);
        return {
          ...video,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
          } : null,
        };
      }));
      
      res.json(videosWithUsers);
    } catch (error) {
      console.error("Error fetching trending videos:", error);
      res.status(500).json({ message: "Failed to fetch trending videos" });
    }
  });

  // User profile APIs
  app.get('/api/users/:username', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose sensitive information
      const publicUser = {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        bio: user.bio,
        location: user.location,
        website: user.website,
        profileImageUrl: user.profileImageUrl,
        bannerImageUrl: user.bannerImageUrl,
        subscriberCount: user.subscriberCount,
        videoCount: user.videoCount,
        totalViews: user.totalViews,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      };
      
      res.json(publicUser);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.get('/api/users/:username/videos', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const videos = await storage.getVideos(user.id);
      // Only show public videos for profile viewing
      const publicVideos = videos.filter(video => video.privacy === 'public');
      
      res.json(publicVideos);
    } catch (error) {
      console.error("Error fetching user videos:", error);
      res.status(500).json({ message: "Failed to fetch user videos" });
    }
  });

  app.get('/api/users/:username/playlists', async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // TODO: Implement playlists when storage supports it
      res.json([]);
    } catch (error) {
      console.error("Error fetching user playlists:", error);
      res.status(500).json({ message: "Failed to fetch user playlists" });
    }
  });

  // Category stats API
  app.get('/api/categories/stats', async (req, res) => {
    try {
      const videos = await storage.getVideos();
      const stats: Record<string, number> = {};
      
      videos.forEach(video => {
        if (video.category) {
          stats[video.category] = (stats[video.category] || 0) + 1;
        }
      });
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching category stats:", error);
      res.status(500).json({ message: "Failed to fetch category stats" });
    }
  });

  app.get('/api/videos/:id', async (req, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Increment view count
      await storage.incrementViews(req.params.id);
      
      // Add user info
      const user = await storage.getUser(video.userId);
      const videoWithUser = {
        ...video,
        views: (video.views || 0) + 1,
        user: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          subscriberCount: user.subscriberCount,
        } : null,
      };
      
      res.json(videoWithUser);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post('/api/videos', requireAuth, uploadVideo.single('video'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
      }
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const userId = req.user.id;
      const { title, description, category, privacy = 'public', tags } = req.body;
      
      if (!title?.trim()) {
        return res.status(400).json({ message: "Video title is required" });
      }
      
      const videoData = {
        title: title.trim(),
        description: description?.trim() || '',
        category: category || 'Other',
        privacy,
        status: 'published', // Auto-publish videos when uploaded
        userId,
        videoUrl: `/uploads/videos/${req.file.filename}`,
        thumbnailUrl: null,
        views: 0,
        likes: 0,
        dislikes: 0,
        duration: 0,
        tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      };
      
      const video = await storage.createVideo(videoData);
      
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video: " + error.message });
    }
  });

  app.post('/api/videos/:id/thumbnail', requireAuth, uploadThumbnail.single('thumbnail'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Thumbnail file is required" });
      }
      
      const userId = req.user.id;
      const video = await storage.getVideo(req.params.id);
      
      if (!video || video.userId !== userId) {
        return res.status(404).json({ message: "Video not found or unauthorized" });
      }
      
      const updatedVideo = await storage.updateVideo(req.params.id, {
        thumbnailUrl: `/uploads/thumbnails/${req.file.filename}`,
      });
      
      res.json(updatedVideo);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
      res.status(500).json({ message: "Failed to upload thumbnail" });
    }
  });

  app.delete('/api/videos/:id', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const video = await storage.getVideo(req.params.id);
      
      if (!video || video.userId !== userId) {
        return res.status(404).json({ message: "Video not found or unauthorized" });
      }
      
      // Delete video file
      const videoPath = path.join(process.cwd(), video.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      
      // Delete thumbnail file
      if (video.thumbnailUrl) {
        const thumbnailPath = path.join(process.cwd(), video.thumbnailUrl);
        if (fs.existsSync(thumbnailPath)) {
          fs.unlinkSync(thumbnailPath);
        }
      }
      
      const deleted = await storage.deleteVideo(req.params.id);
      if (deleted) {
        res.json({ message: "Video deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete video" });
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Like/dislike routes
  app.post('/api/videos/:id/like', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { type } = req.body; // 'like' or 'dislike'
      
      await storage.toggleLike(userId, req.params.id, undefined, type);
      const video = await storage.getVideo(req.params.id);
      
      res.json({
        likes: video?.likes || 0,
        dislikes: video?.dislikes || 0,
      });
    } catch (error) {
      console.error("Error toggling video like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  app.get('/api/videos/:id/like-status', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const like = await storage.getUserLike(userId, req.params.id);
      
      res.json({
        type: like?.type || null,
      });
    } catch (error) {
      console.error("Error fetching like status:", error);
      res.status(500).json({ message: "Failed to fetch like status" });
    }
  });

  // Comment routes
  app.get('/api/videos/:id/comments', async (req, res) => {
    try {
      const comments = await storage.getComments(req.params.id);
      
      // Add user info to each comment
      const commentsWithUsers = await Promise.all(comments.map(async (comment) => {
        const user = await storage.getUser(comment.userId);
        return {
          ...comment,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
          } : null,
        };
      }));
      
      res.json(commentsWithUsers);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/videos/:id/comments', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const commentData = {
        ...req.body,
        userId,
        videoId: req.params.id,
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedData);
      
      // Add user info
      const user = await storage.getUser(userId);
      const commentWithUser = {
        ...comment,
        user: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
        } : null,
      };
      
      // Broadcast new comment via WebSocket
      broadcastToRoom(`video-${req.params.id}`, {
        type: 'new-comment',
        comment: commentWithUser,
      });
      
      res.status(201).json(commentWithUser);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.post('/api/comments/:id/like', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { type } = req.body;
      
      await storage.toggleLike(userId, undefined, req.params.id, type);
      const comment = await storage.getComments(''); // This is a hack - we'd need to restructure to get comment by id
      
      res.json({ message: "Comment like toggled" });
    } catch (error) {
      console.error("Error toggling comment like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Video progress routes
  app.post('/api/videos/:id/progress', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { progress, completed } = req.body;
      
      await storage.updateVideoProgress(userId, req.params.id, progress, completed);
      res.json({ message: "Progress updated" });
    } catch (error) {
      console.error("Error updating video progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/videos/:id/progress', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progress = await storage.getVideoProgress(userId, req.params.id);
      
      res.json(progress || { progress: 0, completed: false });
    } catch (error) {
      console.error("Error fetching video progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Playlist routes
  app.get('/api/playlists', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const playlists = await storage.getPlaylists(userId);
      
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.post('/api/playlists', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const playlistData = {
        ...req.body,
        userId,
      };
      
      const validatedData = insertPlaylistSchema.parse(playlistData);
      const playlist = await storage.createPlaylist(validatedData);
      
      res.status(201).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  // Subscription routes
  app.post('/api/users/:channelId/subscribe', requireAuth, async (req: any, res) => {
    try {
      const subscriberId = req.user.id;
      const { channelId } = req.params;
      
      if (subscriberId === channelId) {
        return res.status(400).json({ message: "Cannot subscribe to yourself" });
      }
      
      await storage.subscribe(subscriberId, channelId);
      res.json({ message: "Subscribed successfully" });
    } catch (error) {
      console.error("Error subscribing:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  app.post('/api/users/:channelId/unsubscribe', requireAuth, async (req: any, res) => {
    try {
      const subscriberId = req.user.id;
      const { channelId } = req.params;
      
      await storage.unsubscribe(subscriberId, channelId);
      res.json({ message: "Unsubscribed successfully" });
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).json({ message: "Failed to unsubscribe" });
    }
  });

  app.get('/api/users/:channelId/subscription-status', requireAuth, async (req: any, res) => {
    try {
      const subscriberId = req.user.id;
      const { channelId } = req.params;
      
      const isSubscribed = await storage.isSubscribed(subscriberId, channelId);
      res.json({ isSubscribed });
    } catch (error) {
      console.error("Error checking subscription status:", error);
      res.status(500).json({ message: "Failed to check subscription status" });
    }
  });

  app.get('/api/users/:userId/subscriptions', requireAuth, async (req: any, res) => {
    try {
      const subscriptions = await storage.getSubscriptions(req.params.userId);
      
      // Add user info to subscriptions
      const subscriptionsWithUsers = await Promise.all(subscriptions.map(async (sub) => {
        const user = await storage.getUser(sub.channelId);
        return {
          ...sub,
          channel: user ? {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            profileImageUrl: user.profileImageUrl,
            subscriberCount: user.subscriberCount,
          } : null,
        };
      }));
      
      res.json(subscriptionsWithUsers);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  // Advanced analytics route
  app.get('/api/analytics/advanced/:userId', requireAuth, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user.id;
      
      // Only allow users to view their own analytics
      if (userId !== requestingUserId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const analytics = await storage.getAdvancedAnalytics(userId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Admin routes
  app.get('/api/admin/stats', requireAuth, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  app.get('/api/admin/system-health', requireAuth, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const health = {
        cpuUsage: Math.floor(Math.random() * 30) + 10,
        memoryUsage: Math.floor(Math.random() * 50) + 30,
        diskUsage: Math.floor(Math.random() * 40) + 20,
        activeConnections: Math.floor(Math.random() * 50) + 10,
        bandwidthUsage: (Math.random() * 20 + 5).toFixed(1),
        responseTime: Math.floor(Math.random() * 100) + 20,
        threats: Math.floor(Math.random() * 10),
        storageUsed: (Math.random() * 5 + 1).toFixed(1),
        totalStorage: 100
      };
      
      res.json(health);
    } catch (error) {
      console.error("Error fetching system health:", error);
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  app.get('/api/admin/recent-activity', requireAuth, async (req: any, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const activities = [
        {
          action: "User registered",
          user: "New User",
          timestamp: "5 minutes ago",
          type: "success"
        },
        {
          action: "Video uploaded",
          user: req.user.username,
          timestamp: "10 minutes ago",
          type: "success"
        }
      ];
      
      res.json(activities);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Watch history route
  app.get('/api/watch-history', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const history = await storage.getWatchHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching watch history:", error);
      res.status(500).json({ message: "Failed to fetch watch history" });
    }
  });

  // Notification routes
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      // Mock notifications for demo - in production this would come from database
      const mockNotifications = [
        {
          id: '1',
          type: 'like',
          title: 'New Like on Your Video',
          message: 'Someone liked your video "Amazing Content"',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          actionUrl: '/watch/1'
        },
        {
          id: '2',
          type: 'subscription',
          title: 'New Subscriber!',
          message: 'You have a new subscriber to your channel',
          isRead: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        },
        {
          id: '3',
          type: 'milestone',
          title: 'Milestone Reached!',
          message: 'Your video has reached 1,000 views!',
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        }
      ];
      
      res.json(mockNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      // In production, update the notification in the database
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.patch('/api/notifications/mark-all-read', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      // In production, mark all notifications as read for this user
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  app.delete('/api/notifications/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      // In production, delete the notification from the database
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Profile update route
  app.patch('/api/users/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Only allow users to edit their own profile
      if (id !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const updates = req.body;
      const updatedUser = await storage.updateUser(id, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Search route
  app.get('/api/search', async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const videos = await storage.getVideos(undefined, undefined, query);
      
      // Add user info to each video
      const videosWithUsers = await Promise.all(videos.map(async (video) => {
        const user = await storage.getUser(video.userId);
        return {
          ...video,
          user: user ? {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            profileImageUrl: user.profileImageUrl,
          } : null,
        };
      }));
      
      res.json(videosWithUsers);
    } catch (error) {
      console.error("Error searching videos:", error);
      res.status(500).json({ message: "Failed to search videos" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const rooms = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join-room') {
          const roomId = message.roomId;
          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId)!.add(ws);
          
          // Store room info on socket
          (ws as any).roomId = roomId;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove from room when disconnected
      const roomId = (ws as any).roomId;
      if (roomId && rooms.has(roomId)) {
        rooms.get(roomId)!.delete(ws);
        if (rooms.get(roomId)!.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });

  // Function to broadcast to room
  function broadcastToRoom(roomId: string, data: any) {
    const room = rooms.get(roomId);
    if (room) {
      const message = JSON.stringify(data);
      room.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  return httpServer;
}
