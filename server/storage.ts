import {
  users,
  videos,
  comments,
  likes,
  playlists,
  playlistVideos,
  videoProgress,
  subscriptions,
  notifications,
  uploadSessions,
  algorithmData,
  categories,
  type User,
  type InsertUser,
  type RegisterUser,
  type Video,
  type InsertVideo,
  type Comment,
  type InsertComment,
  type Playlist,
  type InsertPlaylist,
  type Like,
  type VideoProgress,
  type Subscription,
  type Notification,
  type UploadSession,
  type AlgorithmData,
  type Category,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations - custom auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: RegisterUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: string): Promise<Video | undefined>;
  getVideos(userId?: string, category?: string, search?: string): Promise<Video[]>;
  updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;
  incrementViews(id: string): Promise<void>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getComments(videoId: string): Promise<Comment[]>;
  deleteComment(id: string): Promise<boolean>;
  
  // Like operations
  toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike'): Promise<void>;
  getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined>;
  
  // Playlist operations
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  getPlaylists(userId: string): Promise<Playlist[]>;
  addVideoToPlaylist(playlistId: string, videoId: string): Promise<void>;
  
  // Video progress operations
  updateVideoProgress(userId: string, videoId: string, progress: number, completed?: boolean): Promise<void>;
  getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private videos: Map<string, Video> = new Map();
  private comments: Map<string, Comment> = new Map();
  private likes: Map<string, Like> = new Map();
  private playlists: Map<string, Playlist> = new Map();
  private playlistVideos: Map<string, any> = new Map();
  private videoProgress: Map<string, VideoProgress> = new Map();

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  async createUser(userData: RegisterUser): Promise<User> {
    const user: User = {
      id: randomUUID(),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      displayName: userData.displayName || userData.username,
      profileImageUrl: null,
      bannerImageUrl: null,
      bio: null,
      location: null,
      website: null,
      subscriberCount: 0,
      videoCount: 0,
      totalViews: 0,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(existingUser.id, updatedUser);
    return updatedUser;
  }

  // Video operations
  async createVideo(videoData: InsertVideo): Promise<Video> {
    const video: Video = {
      id: randomUUID(),
      views: 0,
      likes: 0,
      dislikes: 0,
      comments: 0,
      shares: 0,
      engagementRate: 0,
      watchTime: 0,
      avgWatchTime: 0,
      retentionRate: 100,
      clickThroughRate: 0,
      algorithmScore: 100,
      impressions: 0,
      publishedAt: videoData.status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...videoData,
    };
    this.videos.set(video.id, video);
    return video;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideos(userId?: string, category?: string, search?: string): Promise<Video[]> {
    let videos = Array.from(this.videos.values());
    
    if (userId) {
      videos = videos.filter(v => v.userId === userId);
    }
    
    if (category && category !== 'All') {
      videos = videos.filter(v => v.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(v => 
        v.title.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower) ||
        v.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return videos.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    
    const updatedVideo: Video = {
      ...video,
      ...updates,
      updatedAt: new Date(),
    };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videos.delete(id);
  }

  async incrementViews(id: string): Promise<void> {
    const video = this.videos.get(id);
    if (video) {
      video.views = (video.views || 0) + 1;
      this.videos.set(id, video);
    }
  }

  // Comment operations
  async createComment(commentData: InsertComment): Promise<Comment> {
    const comment: Comment = {
      id: randomUUID(),
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...commentData,
    };
    this.comments.set(comment.id!, comment);
    return comment;
  }

  async getComments(videoId: string): Promise<Comment[]> {
    const comments = Array.from(this.comments.values())
      .filter(c => c.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
    return comments;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  // Like operations
  async toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike'): Promise<void> {
    const existingLike = Array.from(this.likes.values()).find(l => 
      l.userId === userId && 
      (videoId ? l.videoId === videoId : l.commentId === commentId)
    );

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove like/dislike
        this.likes.delete(existingLike.id!);
        this.updateLikeCounts(videoId, commentId, type, -1);
      } else {
        // Change like to dislike or vice versa
        this.updateLikeCounts(videoId, commentId, existingLike.type, -1);
        existingLike.type = type;
        this.likes.set(existingLike.id!, existingLike);
        this.updateLikeCounts(videoId, commentId, type, 1);
      }
    } else {
      // Add new like/dislike
      const like: Like = {
        id: randomUUID(),
        userId,
        videoId: videoId || null,
        commentId: commentId || null,
        type,
        createdAt: new Date(),
      };
      this.likes.set(like.id!, like);
      this.updateLikeCounts(videoId, commentId, type, 1);
    }
  }

  private updateLikeCounts(videoId?: string, commentId?: string, type: 'like' | 'dislike' = 'like', delta: number = 1): void {
    if (videoId) {
      const video = this.videos.get(videoId);
      if (video) {
        if (type === 'like') {
          video.likes = (video.likes || 0) + delta;
        } else {
          video.dislikes = (video.dislikes || 0) + delta;
        }
        this.videos.set(videoId, video);
      }
    } else if (commentId) {
      const comment = this.comments.get(commentId);
      if (comment) {
        if (type === 'like') {
          comment.likes = (comment.likes || 0) + delta;
        } else {
          comment.dislikes = (comment.dislikes || 0) + delta;
        }
        this.comments.set(commentId, comment);
      }
    }
  }

  async getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(l => 
      l.userId === userId && 
      (videoId ? l.videoId === videoId : l.commentId === commentId)
    );
  }

  // Playlist operations
  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    const playlist: Playlist = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...playlistData,
    };
    this.playlists.set(playlist.id!, playlist);
    return playlist;
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
    const key = `${playlistId}-${videoId}`;
    const playlistVideo = {
      id: randomUUID(),
      playlistId,
      videoId,
      position: this.getPlaylistVideoCount(playlistId),
      createdAt: new Date(),
    };
    this.playlistVideos.set(key, playlistVideo);
  }

  private getPlaylistVideoCount(playlistId: string): number {
    return Array.from(this.playlistVideos.values())
      .filter((pv: any) => pv.playlistId === playlistId).length;
  }

  // Video progress operations
  async updateVideoProgress(userId: string, videoId: string, progress: number, completed: boolean = false): Promise<void> {
    const key = `${userId}-${videoId}`;
    const videoProgressData: VideoProgress = {
      id: randomUUID(),
      userId,
      videoId,
      progress,
      completed,
      updatedAt: new Date(),
    };
    this.videoProgress.set(key, videoProgressData);
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    const key = `${userId}-${videoId}`;
    return this.videoProgress.get(key);
  }
}

export const storage = new MemStorage();
