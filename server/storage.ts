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
  reports,
  userSettings,
  watchHistory,
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
  type Report,
  type UserSettings,
  type WatchHistory,
  type AlgorithmData,
  type Category,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, asc, or, and, count, sql } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

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
  
  // Admin operations
  getAllUsers(page?: number, limit?: number, search?: string): Promise<{ users: User[]; total: number }>;
  getAllVideos(page?: number, limit?: number, search?: string, status?: string): Promise<{ videos: Video[]; total: number }>;
  getAllComments(page?: number, limit?: number, search?: string): Promise<{ comments: Comment[]; total: number }>;
  getAnalytics(): Promise<any>;
  
  // Video operations
  createVideo(video: InsertVideo): Promise<Video>;
  getVideo(id: string): Promise<Video | undefined>;
  getVideos(userId?: string, category?: string, search?: string, fyp?: boolean): Promise<Video[]>;
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

  // Subscription operations
  subscribe(subscriberId: string, channelId: string): Promise<void>;
  unsubscribe(subscriberId: string, channelId: string): Promise<void>;
  getSubscriptions(userId: string): Promise<Subscription[]>;
  
  // Notification operations
  createNotification(notification: Notification): Promise<Notification>;
  getNotifications(userId: string): Promise<Notification[]>;
  markNotificationRead(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: RegisterUser): Promise<User> {
    const hashedPassword = await hashPassword(userData.password);
    
    const [user] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        displayName: userData.displayName,
        isAdmin: false, // First user will be made admin manually
      })
      .returning();
    
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    
    return user || undefined;
  }

  // Admin operations
  async getAllUsers(page = 1, limit = 50, search = ""): Promise<{ users: User[]; total: number }> {
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
    
    const [usersList, totalResult] = await Promise.all([
      query.offset(offset).limit(limit).orderBy(desc(users.createdAt)),
      countQuery
    ]);
    
    return {
      users: usersList,
      total: totalResult[0].count as number
    };
  }

  async getAllVideos(page = 1, limit = 50, search = "", status = ""): Promise<{ videos: Video[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select().from(videos);
    let countQuery = db.select({ count: count() }).from(videos);
    
    const conditions = [];
    
    if (search) {
      conditions.push(or(
        like(videos.title, `%${search}%`),
        like(videos.description, `%${search}%`)
      ));
    }
    
    if (status && status !== 'all') {
      conditions.push(eq(videos.status, status));
    }
    
    if (conditions.length > 0) {
      const whereCondition = conditions.length === 1 ? conditions[0] : and(...conditions);
      query = query.where(whereCondition);
      countQuery = countQuery.where(whereCondition);
    }
    
    const [videosList, totalResult] = await Promise.all([
      query.offset(offset).limit(limit).orderBy(desc(videos.createdAt)),
      countQuery
    ]);
    
    return {
      videos: videosList,
      total: totalResult[0].count as number
    };
  }

  async getAllComments(page = 1, limit = 50, search = ""): Promise<{ comments: Comment[]; total: number }> {
    const offset = (page - 1) * limit;
    
    let query = db.select().from(comments);
    let countQuery = db.select({ count: count() }).from(comments);
    
    if (search) {
      const searchCondition = like(comments.content, `%${search}%`);
      query = query.where(searchCondition);
      countQuery = countQuery.where(searchCondition);
    }
    
    const [commentsList, totalResult] = await Promise.all([
      query.offset(offset).limit(limit).orderBy(desc(comments.createdAt)),
      countQuery
    ]);
    
    return {
      comments: commentsList,
      total: totalResult[0].count as number
    };
  }

  async getAnalytics(): Promise<any> {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    const [totalVideos] = await db.select({ count: count() }).from(videos);
    const [totalComments] = await db.select({ count: count() }).from(comments);
    
    return {
      totalUsers: totalUsers.count,
      totalVideos: totalVideos.count,
      totalComments: totalComments.count,
      newUsersToday: 0, // Would need date filtering
      newVideosToday: 0,
    };
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    
    return newVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async getVideos(userId?: string, category?: string, search?: string, fyp = false): Promise<Video[]> {
    let query = db.select().from(videos);
    
    const conditions = [eq(videos.privacy, 'public')];
    
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
    
    query = query.where(and(...conditions));
    
    if (fyp) {
      // Advanced recommendation algorithm - fair distribution
      query = query.orderBy(
        desc(sql`(${videos.algorithmScore} * 0.3 + ${videos.engagementRate} * 0.2 + random() * 0.5)`)
      );
    } else {
      query = query.orderBy(desc(videos.createdAt));
    }
    
    return await query.limit(50);
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video | undefined> {
    const [video] = await db
      .update(videos)
      .set(updates)
      .where(eq(videos.id, id))
      .returning();
    
    return video || undefined;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return result.rowCount > 0;
  }

  async incrementViews(id: string): Promise<void> {
    await db
      .update(videos)
      .set({ views: sql`${videos.views} + 1` })
      .where(eq(videos.id, id));
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values(comment)
      .returning();
    
    return newComment;
  }

  async getComments(videoId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.videoId, videoId))
      .orderBy(desc(comments.createdAt));
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return result.rowCount > 0;
  }

  // Like operations
  async toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike'): Promise<void> {
    // Check if like already exists
    let existingLike;
    if (videoId) {
      [existingLike] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)));
    } else if (commentId) {
      [existingLike] = await db
        .select()
        .from(likes)
        .where(and(eq(likes.userId, userId), eq(likes.commentId, commentId)));
    }

    if (existingLike) {
      if (existingLike.type === type) {
        // Remove like/dislike
        await db.delete(likes).where(eq(likes.id, existingLike.id));
      } else {
        // Update like/dislike
        await db
          .update(likes)
          .set({ type })
          .where(eq(likes.id, existingLike.id));
      }
    } else {
      // Create new like/dislike
      await db.insert(likes).values({
        userId,
        videoId,
        commentId,
        type,
      });
    }
  }

  async getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined> {
    let query = db.select().from(likes).where(eq(likes.userId, userId));
    
    if (videoId) {
      query = query.where(eq(likes.videoId, videoId));
    } else if (commentId) {
      query = query.where(eq(likes.commentId, commentId));
    }
    
    const [like] = await query;
    return like || undefined;
  }

  // Playlist operations
  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db
      .insert(playlists)
      .values(playlist)
      .returning();
    
    return newPlaylist;
  }

  async getPlaylists(userId: string): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.createdAt));
  }

  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
    await db.insert(playlistVideos).values({
      playlistId,
      videoId,
      position: 0, // Would calculate proper position
    });
  }

  // Video progress operations
  async updateVideoProgress(userId: string, videoId: string, progress: number, completed = false): Promise<void> {
    const existingProgress = await this.getVideoProgress(userId, videoId);
    
    if (existingProgress) {
      await db
        .update(videoProgress)
        .set({ 
          currentTime: progress,
          percentage: Math.round((progress / 100) * 100),
          completed 
        })
        .where(and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId)));
    } else {
      await db.insert(videoProgress).values({
        userId,
        videoId,
        currentTime: progress,
        percentage: Math.round((progress / 100) * 100),
        completed,
      });
    }
  }

  async getVideoProgress(userId: string, videoId: string): Promise<VideoProgress | undefined> {
    const [progress] = await db
      .select()
      .from(videoProgress)
      .where(and(eq(videoProgress.userId, userId), eq(videoProgress.videoId, videoId)));
    
    return progress || undefined;
  }

  // Subscription operations
  async subscribe(subscriberId: string, channelId: string): Promise<void> {
    await db.insert(subscriptions).values({
      subscriberId,
      channelId,
    });
  }

  async unsubscribe(subscriberId: string, channelId: string): Promise<void> {
    await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.subscriberId, subscriberId), eq(subscriptions.channelId, channelId)));
  }

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.subscriberId, userId));
  }

  // Notification operations
  async createNotification(notification: Notification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    
    return newNotification;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }
}

export const storage = new DatabaseStorage();