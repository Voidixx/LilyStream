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
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, like, desc, asc, or, and, count, sql } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

const sql_conn = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql_conn);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Interface for storage operations
export interface IStorage {
  // User operations - custom auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: RegisterUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  upsertUser(user: any): Promise<User>;
  
  // Admin operations
  getAllUsers(page?: number, limit?: number, search?: string): Promise<{ users: User[]; total: number }>;
  getAllVideos(page?: number, limit?: number, search?: string, status?: string): Promise<{ videos: Video[]; total: number }>;
  getAllComments(page?: number, limit?: number, search?: string): Promise<{ comments: Comment[]; total: number }>;
  banUser(userId: string, reason: string, adminId: string): Promise<void>;
  unbanUser(userId: string, adminId: string): Promise<void>;
  moderateVideo(videoId: string, status: string, reason: string, adminId: string): Promise<void>;
  moderateComment(commentId: string, status: string, reason: string, adminId: string): Promise<void>;
  getAnalytics(): Promise<any>;
  
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

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async upsertUser(userData: any): Promise<User> {
    try {
      const existingUser = await db.select().from(users).where(eq(users.id, userData.id)).limit(1);
      
      if (existingUser.length > 0) {
        const [updatedUser] = await db.update(users)
          .set({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            lastLoginAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id))
          .returning();
        return updatedUser;
      } else {
        // Create default admin account if this is the first user
        const userCount = await db.select({ count: count() }).from(users);
        const isFirstUser = userCount[0].count === 0;
        
        const [newUser] = await db.insert(users).values({
          id: userData.id,
          username: userData.email?.split('@')[0] || `user_${Date.now()}`,
          email: userData.email,
          password: await hashPassword('admin123'), // Default password
          firstName: userData.firstName,
          lastName: userData.lastName,
          displayName: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email?.split('@')[0],
          profileImageUrl: userData.profileImageUrl,
          isAdmin: isFirstUser, // First user becomes admin
          lastLoginAt: new Date(),
        }).returning();
        return newUser;
      }
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(userData: RegisterUser): Promise<User> {
    try {
      // Check if this is the first user (make them admin)
      const userCount = await db.select({ count: count() }).from(users);
      const isFirstUser = userCount[0].count === 0;
      
      const [user] = await db.insert(users).values({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName || userData.username,
        isAdmin: isFirstUser, // First user becomes admin
      }).returning();
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [user] = await db.update(users)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
  }

  // Admin operations
  async getAllUsers(page = 1, limit = 20, search = ''): Promise<{ users: User[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(users);
      let countQuery = db.select({ count: count() }).from(users);
      
      if (search) {
        const searchCondition = or(
          like(users.username, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.displayName, `%${search}%`)
        );
        query = query.where(searchCondition);
        countQuery = countQuery.where(searchCondition);
      }
      
      const [usersResult, totalResult] = await Promise.all([
        query.orderBy(desc(users.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);
      
      return {
        users: usersResult,
        total: totalResult[0].count
      };
    } catch (error) {
      console.error('Error getting all users:', error);
      return { users: [], total: 0 };
    }
  }

  async getAllVideos(page = 1, limit = 20, search = '', status = ''): Promise<{ videos: Video[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(videos);
      let countQuery = db.select({ count: count() }).from(videos);
      
      const conditions = [];
      if (search) {
        conditions.push(or(
          like(videos.title, `%${search}%`),
          like(videos.description, `%${search}%`),
          like(videos.category, `%${search}%`)
        ));
      }
      if (status) {
        conditions.push(eq(videos.status, status));
      }
      
      if (conditions.length > 0) {
        const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
        query = query.where(whereCondition);
        countQuery = countQuery.where(whereCondition);
      }
      
      const [videosResult, totalResult] = await Promise.all([
        query.orderBy(desc(videos.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);
      
      return {
        videos: videosResult,
        total: totalResult[0].count
      };
    } catch (error) {
      console.error('Error getting all videos:', error);
      return { videos: [], total: 0 };
    }
  }

  async getAllComments(page = 1, limit = 20, search = ''): Promise<{ comments: Comment[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = db.select().from(comments);
      let countQuery = db.select({ count: count() }).from(comments);
      
      if (search) {
        const searchCondition = like(comments.content, `%${search}%`);
        query = query.where(searchCondition);
        countQuery = countQuery.where(searchCondition);
      }
      
      const [commentsResult, totalResult] = await Promise.all([
        query.orderBy(desc(comments.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);
      
      return {
        comments: commentsResult,
        total: totalResult[0].count
      };
    } catch (error) {
      console.error('Error getting all comments:', error);
      return { comments: [], total: 0 };
    }
  }

  async banUser(userId: string, reason: string, adminId: string): Promise<void> {
    try {
      await db.update(users)
        .set({
          isBanned: true,
          banReason: reason,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  }

  async unbanUser(userId: string, adminId: string): Promise<void> {
    try {
      await db.update(users)
        .set({
          isBanned: false,
          banReason: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error unbanning user:', error);
      throw error;
    }
  }

  async moderateVideo(videoId: string, status: string, reason: string, adminId: string): Promise<void> {
    try {
      await db.update(videos)
        .set({
          moderationStatus: status,
          moderationNotes: reason,
          moderatedBy: adminId,
          moderatedAt: new Date(),
          isBlocked: status === 'blocked',
          blockReason: status === 'blocked' ? reason : null,
          updatedAt: new Date()
        })
        .where(eq(videos.id, videoId));
    } catch (error) {
      console.error('Error moderating video:', error);
      throw error;
    }
  }

  async moderateComment(commentId: string, status: string, reason: string, adminId: string): Promise<void> {
    try {
      await db.update(comments)
        .set({
          moderationStatus: status,
          moderatedBy: adminId,
          moderatedAt: new Date(),
          isBlocked: status === 'blocked',
          blockReason: status === 'blocked' ? reason : null,
          isSpam: status === 'spam',
          updatedAt: new Date()
        })
        .where(eq(comments.id, commentId));
    } catch (error) {
      console.error('Error moderating comment:', error);
      throw error;
    }
  }

  async getAnalytics(): Promise<any> {
    try {
      const [totalUsers, totalVideos, totalComments, totalViews] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(videos),
        db.select({ count: count() }).from(comments),
        db.select({ views: sql<number>`SUM(${videos.views})` }).from(videos)
      ]);
      
      return {
        totalUsers: totalUsers[0].count,
        totalVideos: totalVideos[0].count,
        totalComments: totalComments[0].count,
        totalViews: totalViews[0].views || 0,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {};
    }
  }

  // Video operations
  async createVideo(videoData: InsertVideo): Promise<Video> {
    try {
      const [video] = await db.insert(videos).values(videoData).returning();
      return video;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  }

  async getVideo(id: string): Promise<Video | undefined> {
    try {
      const [video] = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
      return video;
    } catch (error) {
      console.error('Error getting video:', error);
      return undefined;
    }
  }

  async getVideos(userId?: string, category?: string, search?: string): Promise<Video[]> {
    try {
      let query = db.select().from(videos);
      
      const conditions = [eq(videos.privacy, 'public'), eq(videos.status, 'published')];
      
      if (userId) {
        conditions.push(eq(videos.userId, userId));
      }
      if (category && category !== 'All') {
        conditions.push(eq(videos.category, category));
      }
      if (search) {
        conditions.push(or(
          like(videos.title, `%${search}%`),
          like(videos.description, `%${search}%`)
        ));
      }
      
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      return await query.where(whereCondition).orderBy(desc(videos.createdAt));
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    try {
      const [video] = await db.update(videos)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(videos.id, id))
        .returning();
      return video;
    } catch (error) {
      console.error('Error updating video:', error);
      return undefined;
    }
  }

  async deleteVideo(id: string): Promise<boolean> {
    try {
      await db.delete(videos).where(eq(videos.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      await db.update(videos)
        .set({ views: sql`${videos.views} + 1` })
        .where(eq(videos.id, id));
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // Comment operations
  async createComment(commentData: InsertComment): Promise<Comment> {
    try {
      const [comment] = await db.insert(comments).values(commentData).returning();
      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  async getComments(videoId: string): Promise<Comment[]> {
    try {
      return await db.select().from(comments)
        .where(and(eq(comments.videoId, videoId), eq(comments.isApproved, true)))
        .orderBy(desc(comments.createdAt));
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      await db.delete(comments).where(eq(comments.id, id));
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  // Like operations
  async toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike' = 'like'): Promise<void> {
    try {
      const existingLike = await this.getUserLike(userId, videoId, commentId);
      
      if (existingLike) {
        await db.delete(likes).where(eq(likes.id, existingLike.id!));
      } else {
        await db.insert(likes).values({
          userId,
          videoId,
          commentId,
          type
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }

  async getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined> {
    try {
      const conditions = [eq(likes.userId, userId)];
      if (videoId) conditions.push(eq(likes.videoId, videoId));
      if (commentId) conditions.push(eq(likes.commentId, commentId));
      
      const [like] = await db.select().from(likes)
        .where(and(...conditions))
        .limit(1);
      return like;
    } catch (error) {
      console.error('Error getting user like:', error);
      return undefined;
    }
  }

  // Playlist operations
  async createPlaylist(playlistData: InsertPlaylist): Promise<Playlist> {
    try {
      const [playlist] = await db.insert(playlists).values(playlistData).returning();
      return playlist;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    try {
      return await db.select().from(playlists)
        .where(eq(playlists.userId, userId))
        .orderBy(desc(playlists.createdAt));
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  }

  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
    try {
      const maxPosition = await db.select({ max: sql<number>`MAX(${playlistVideos.position})` })
        .from(playlistVideos)
        .where(eq(playlistVideos.playlistId, playlistId));
      
      const position = (maxPosition[0].max || 0) + 1;
      
      await db.insert(playlistVideos).values({
        playlistId,
        videoId,
        position
      });
    } catch (error) {
      console.error('Error adding video to playlist:', error);
    }
  }

  // Video progress operations
  async updateVideoProgress(userId: string, videoId: string, progress: number, completed = false): Promise<void> {
    try {
      const existing = await db.select().from(videoProgress)
        .where(and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId)))
        .limit(1);
      
      if (existing.length > 0) {
        await db.update(videoProgress)
          .set({ progress, completed, updatedAt: new Date() })
          .where(eq(videoProgress.id, existing[0].id!));
      } else {
        await db.insert(videoProgress).values({
          userId,
          videoId,
          progress,
          completed
        });
      }
    } catch (error) {
      console.error('Error updating video progress:', error);
    }
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    try {
      const [progress] = await db.select().from(videoProgress)
        .where(and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId)))
        .limit(1);
      return progress;
    } catch (error) {
      console.error('Error getting video progress:', error);
      return undefined;
    }
  }
}

// Use database storage
export const storage = new DatabaseStorage();
