import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertVideoSchema, insertCommentSchema, insertPlaylistSchema } from "@shared/schema";

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
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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

  app.post('/api/videos', isAuthenticated, uploadVideo.single('video'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
      }
      
      const userId = req.user.claims.sub;
      const videoData = {
        ...req.body,
        userId,
        videoUrl: `/uploads/videos/${req.file.filename}`,
        tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      };
      
      const validatedData = insertVideoSchema.parse(videoData);
      const video = await storage.createVideo(validatedData);
      
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.post('/api/videos/:id/thumbnail', isAuthenticated, uploadThumbnail.single('thumbnail'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Thumbnail file is required" });
      }
      
      const userId = req.user.claims.sub;
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

  app.delete('/api/videos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.post('/api/videos/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get('/api/videos/:id/like-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/videos/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/comments/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.post('/api/videos/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { progress, completed } = req.body;
      
      await storage.updateVideoProgress(userId, req.params.id, progress, completed);
      res.json({ message: "Progress updated" });
    } catch (error) {
      console.error("Error updating video progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/videos/:id/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getVideoProgress(userId, req.params.id);
      
      res.json(progress || { progress: 0, completed: false });
    } catch (error) {
      console.error("Error fetching video progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Playlist routes
  app.get('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlists = await storage.getPlaylists(userId);
      
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.post('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
