import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { nanoid } from 'nanoid';
import type {
  User,
  RegisterUser,
  Video,
  InsertVideo,
  Comment,
  InsertComment,
  Like,
  VideoProgress,
  Subscription,
  Notification,
  Report,
  UserSettings,
  WatchHistory,
  AlgorithmData,
  Category,
  Playlist,
  InsertPlaylist
} from '@shared/schema';

const scryptAsync = promisify(scrypt);

interface DatabaseFile {
  users: User[];
  videos: Video[];
  comments: Comment[];
  likes: Like[];
  subscriptions: Subscription[];
  notifications: Notification[];
  reports: Report[];
  userSettings: UserSettings[];
  watchHistory: WatchHistory[];
  algorithmData: AlgorithmData[];
  categories: Category[];
  playlists: Playlist[];
  videoProgress: VideoProgress[];
}

export class JsonStorage {
  private dataPath = join(process.cwd(), 'database.json');
  private adminCreated = false;

  private loadData(): DatabaseFile {
    if (!existsSync(this.dataPath)) {
      const defaultData: DatabaseFile = {
        users: [],
        videos: [],
        comments: [],
        likes: [],
        subscriptions: [],
        notifications: [],
        reports: [],
        userSettings: [],
        watchHistory: [],
        algorithmData: [],
        categories: [
          { id: nanoid(), name: 'Gaming', description: 'Gaming content', color: '#8b5cf6', icon: 'gamepad-2', isActive: true, createdAt: new Date() },
          { id: nanoid(), name: 'Music', description: 'Music and audio content', color: '#ec4899', icon: 'music', isActive: true, createdAt: new Date() },
          { id: nanoid(), name: 'Education', description: 'Educational content', color: '#3b82f6', icon: 'graduation-cap', isActive: true, createdAt: new Date() },
          { id: nanoid(), name: 'Technology', description: 'Tech and programming', color: '#10b981', icon: 'laptop', isActive: true, createdAt: new Date() },
          { id: nanoid(), name: 'Travel', description: 'Travel and adventure', color: '#06b6d4', icon: 'plane', isActive: true, createdAt: new Date() },
          { id: nanoid(), name: 'Cooking', description: 'Cooking and food', color: '#f97316', icon: 'chef-hat', isActive: true, createdAt: new Date() },
        ],
        playlists: [],
        videoProgress: []
      };
      this.saveData(defaultData);
      return defaultData;
    }

    try {
      const fileContent = readFileSync(this.dataPath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error reading database file:', error);
      return this.loadData(); // Return default data if corrupted
    }
  }

  private saveData(data: DatabaseFile): void {
    try {
      writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving database file:', error);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  async comparePasswords(supplied: string, stored: string): Promise<boolean> {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return hashedBuf.equals(suppliedBuf);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const data = this.loadData();
    return data.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const data = this.loadData();
    return data.users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const data = this.loadData();
    return data.users.find(user => user.email === email);
  }

  async createUser(userData: RegisterUser): Promise<User> {
    const data = this.loadData();
    const hashedPassword = await this.hashPassword(userData.password);
    
    // Check if this is the first user and make them admin
    const isFirstUser = data.users.length === 0;
    
    const user: User = {
      id: nanoid(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
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
      isAdmin: isFirstUser, // First user becomes admin
      isModerator: false,
      isBanned: false,
      banReason: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    data.users.push(user);
    
    // Create default user settings
    const userSettings: UserSettings = {
      id: nanoid(),
      userId: user.id,
      emailNotifications: true,
      pushNotifications: true,
      privacyLevel: 'public',
      showWatchHistory: true,
      showSubscriptions: true,
      autoplay: true,
      quality: 'auto',
      theme: 'auto',
      language: 'en',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    data.userSettings.push(userSettings);
    
    this.saveData(data);
    
    if (isFirstUser) {
      console.log(`🎉 First user created as admin: ${user.username}`);
    }
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const data = this.loadData();
    const userIndex = data.users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return undefined;
    
    data.users[userIndex] = { ...data.users[userIndex], ...updates, updatedAt: new Date() };
    this.saveData(data);
    
    return data.users[userIndex];
  }

  // Admin operations
  async getAllUsers(page = 1, limit = 50, search = ""): Promise<{ users: User[]; total: number }> {
    const data = this.loadData();
    let users = data.users;
    
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.displayName?.toLowerCase().includes(searchLower)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      users: users.slice(startIndex, endIndex),
      total: users.length
    };
  }

  async getAllVideos(page = 1, limit = 50, search = "", status = ""): Promise<{ videos: Video[]; total: number }> {
    const data = this.loadData();
    let videos = data.videos;
    
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower)
      );
    }
    
    if (status && status !== 'all') {
      videos = videos.filter(video => video.status === status);
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      videos: videos.slice(startIndex, endIndex),
      total: videos.length
    };
  }

  async getAllComments(page = 1, limit = 50, search = ""): Promise<{ comments: Comment[]; total: number }> {
    const data = this.loadData();
    let comments = data.comments;
    
    if (search) {
      const searchLower = search.toLowerCase();
      comments = comments.filter(comment => 
        comment.content.toLowerCase().includes(searchLower)
      );
    }
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      comments: comments.slice(startIndex, endIndex),
      total: comments.length
    };
  }

  async getAnalytics(): Promise<any> {
    const data = this.loadData();
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const newUsersToday = data.users.filter(user => 
      user.createdAt && new Date(user.createdAt) >= today
    ).length;
    
    const newVideosToday = data.videos.filter(video => 
      video.createdAt && new Date(video.createdAt) >= today
    ).length;
    
    const totalViews = data.videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = data.videos.reduce((sum, video) => sum + (video.likes || 0), 0);
    
    return {
      totalUsers: data.users.length,
      totalVideos: data.videos.length,
      totalComments: data.comments.length,
      newUsersToday,
      newVideosToday,
      totalViews,
      totalLikes,
      totalSubscriptions: data.subscriptions.length,
      totalPlaylists: data.playlists.length
    };
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    const data = this.loadData();
    
    const newVideo: Video = {
      ...video,
      id: nanoid(),
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
      isApproved: true,
      isBlocked: false,
      blockReason: null,
      contentRating: 'general',
      isNSFW: false,
      moderationStatus: 'approved',
      moderationNotes: null,
      moderatedBy: null,
      moderatedAt: null,
      publishedAt: video.status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    data.videos.push(newVideo);
    this.saveData(data);
    
    return newVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const data = this.loadData();
    return data.videos.find(video => video.id === id);
  }

  async getVideos(userId?: string, category?: string, search?: string, fyp = false): Promise<Video[]> {
    const data = this.loadData();
    let videos = data.videos.filter(video => video.privacy === 'public' && video.status === 'published');
    
    if (userId) {
      videos = videos.filter(video => video.userId === userId);
    }
    
    if (category && category !== 'All') {
      videos = videos.filter(video => video.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      videos = videos.filter(video => 
        video.title.toLowerCase().includes(searchLower) ||
        video.description?.toLowerCase().includes(searchLower) ||
        video.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (fyp) {
      // Advanced fair algorithm - mix of engagement, recency, and randomness
      videos = videos.sort((a, b) => {
        const aScore = (a.algorithmScore || 100) * 0.3 + (a.engagementRate || 0) * 0.2 + Math.random() * 0.5;
        const bScore = (b.algorithmScore || 100) * 0.3 + (b.engagementRate || 0) * 0.2 + Math.random() * 0.5;
        return bScore - aScore;
      });
    } else {
      videos = videos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return videos.slice(0, 50);
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    const data = this.loadData();
    const videoIndex = data.videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) return undefined;
    
    data.videos[videoIndex] = { ...data.videos[videoIndex], ...updates, updatedAt: new Date() };
    this.saveData(data);
    
    return data.videos[videoIndex];
  }

  async deleteVideo(id: string): Promise<boolean> {
    const data = this.loadData();
    const videoIndex = data.videos.findIndex(video => video.id === id);
    
    if (videoIndex === -1) return false;
    
    data.videos.splice(videoIndex, 1);
    this.saveData(data);
    
    return true;
  }

  async incrementViews(id: string): Promise<void> {
    const data = this.loadData();
    const video = data.videos.find(video => video.id === id);
    
    if (video) {
      video.views = (video.views || 0) + 1;
      this.saveData(data);
    }
  }

  // Subscription operations  
  async subscribe(subscriberId: string, channelId: string): Promise<void> {
    const data = this.loadData();
    
    // Check if already subscribed
    const existing = data.subscriptions.find(sub => 
      sub.subscriberId === subscriberId && sub.channelId === channelId
    );
    
    if (!existing) {
      const subscription: Subscription = {
        id: nanoid(),
        subscriberId,
        channelId,
        notificationsEnabled: true,
        createdAt: new Date()
      };
      
      data.subscriptions.push(subscription);
      
      // Update subscriber count
      const channel = data.users.find(user => user.id === channelId);
      if (channel) {
        channel.subscriberCount = (channel.subscriberCount || 0) + 1;
      }
      
      this.saveData(data);
    }
  }

  async unsubscribe(subscriberId: string, channelId: string): Promise<void> {
    const data = this.loadData();
    const subIndex = data.subscriptions.findIndex(sub => 
      sub.subscriberId === subscriberId && sub.channelId === channelId
    );
    
    if (subIndex !== -1) {
      data.subscriptions.splice(subIndex, 1);
      
      // Update subscriber count
      const channel = data.users.find(user => user.id === channelId);
      if (channel) {
        channel.subscriberCount = Math.max(0, (channel.subscriberCount || 0) - 1);
      }
      
      this.saveData(data);
    }
  }

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    const data = this.loadData();
    return data.subscriptions.filter(sub => sub.subscriberId === userId);
  }

  async isSubscribed(subscriberId: string, channelId: string): Promise<boolean> {
    const data = this.loadData();
    return data.subscriptions.some(sub => 
      sub.subscriberId === subscriberId && sub.channelId === channelId
    );
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    const data = this.loadData();
    
    const newComment: Comment = {
      ...comment,
      id: nanoid(),
      likes: 0,
      dislikes: 0,
      isApproved: true,
      isBlocked: false,
      blockReason: null,
      isSpam: false,
      moderationStatus: 'approved',
      moderatedBy: null,
      moderatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    data.comments.push(newComment);
    
    // Update video comment count
    const video = data.videos.find(v => v.id === comment.videoId);
    if (video) {
      video.comments = (video.comments || 0) + 1;
    }
    
    this.saveData(data);
    
    return newComment;
  }

  async getComments(videoId: string): Promise<Comment[]> {
    const data = this.loadData();
    return data.comments
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteComment(id: string): Promise<boolean> {
    const data = this.loadData();
    const commentIndex = data.comments.findIndex(comment => comment.id === id);
    
    if (commentIndex === -1) return false;
    
    const comment = data.comments[commentIndex];
    data.comments.splice(commentIndex, 1);
    
    // Update video comment count
    const video = data.videos.find(v => v.id === comment.videoId);
    if (video) {
      video.comments = Math.max(0, (video.comments || 0) - 1);
    }
    
    this.saveData(data);
    
    return true;
  }

  // Like operations
  async toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike'): Promise<void> {
    const data = this.loadData();
    
    // Find existing like
    const existingLike = data.likes.find(like =>
      like.userId === userId &&
      (videoId ? like.videoId === videoId : like.commentId === commentId)
    );
    
    if (existingLike) {
      if (existingLike.type === type) {
        // Remove like/dislike
        const likeIndex = data.likes.indexOf(existingLike);
        data.likes.splice(likeIndex, 1);
        
        // Update counts
        if (videoId) {
          const video = data.videos.find(v => v.id === videoId);
          if (video) {
            if (type === 'like') {
              video.likes = Math.max(0, (video.likes || 0) - 1);
            } else {
              video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
            }
          }
        }
      } else {
        // Change like to dislike or vice versa
        existingLike.type = type;
        
        // Update counts
        if (videoId) {
          const video = data.videos.find(v => v.id === videoId);
          if (video) {
            if (type === 'like') {
              video.likes = (video.likes || 0) + 1;
              video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
            } else {
              video.dislikes = (video.dislikes || 0) + 1;
              video.likes = Math.max(0, (video.likes || 0) - 1);
            }
          }
        }
      }
    } else {
      // Create new like/dislike
      const newLike: Like = {
        id: nanoid(),
        userId,
        videoId: videoId || null,
        commentId: commentId || null,
        type,
        createdAt: new Date()
      };
      
      data.likes.push(newLike);
      
      // Update counts
      if (videoId) {
        const video = data.videos.find(v => v.id === videoId);
        if (video) {
          if (type === 'like') {
            video.likes = (video.likes || 0) + 1;
          } else {
            video.dislikes = (video.dislikes || 0) + 1;
          }
        }
      }
    }
    
    this.saveData(data);
  }

  async getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined> {
    const data = this.loadData();
    return data.likes.find(like =>
      like.userId === userId &&
      (videoId ? like.videoId === videoId : like.commentId === commentId)
    );
  }

  // Advanced analytics for creators
  async getAdvancedAnalytics(userId: string): Promise<any> {
    const data = this.loadData();
    const userVideos = data.videos.filter(video => video.userId === userId);
    
    const totalViews = userVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = userVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
    const totalComments = userVideos.reduce((sum, video) => sum + (video.comments || 0), 0);
    
    // Calculate engagement rate
    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;
    
    // Top performing videos
    const topVideos = userVideos
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
    
    // View trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentVideos = userVideos.filter(video => 
      video.createdAt && new Date(video.createdAt) >= thirtyDaysAgo
    );
    
    // Category performance
    const categoryStats = userVideos.reduce((stats, video) => {
      const category = video.category || 'Uncategorized';
      if (!stats[category]) {
        stats[category] = { views: 0, videos: 0 };
      }
      stats[category].views += video.views || 0;
      stats[category].videos += 1;
      return stats;
    }, {} as Record<string, { views: number; videos: number }>);
    
    return {
      overview: {
        totalVideos: userVideos.length,
        totalViews,
        totalLikes,
        totalComments,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
        subscriberCount: data.users.find(u => u.id === userId)?.subscriberCount || 0
      },
      topVideos: topVideos.map(video => ({
        id: video.id,
        title: video.title,
        views: video.views,
        likes: video.likes,
        comments: video.comments,
        engagementRate: video.views > 0 ? ((video.likes + video.comments) / video.views * 100) : 0
      })),
      categoryStats,
      recentPerformance: {
        videosLast30Days: recentVideos.length,
        viewsLast30Days: recentVideos.reduce((sum, video) => sum + (video.views || 0), 0)
      },
      recommendations: this.generateCreatorRecommendations(userVideos, engagementRate)
    };
  }

  private generateCreatorRecommendations(videos: Video[], engagementRate: number): string[] {
    const recommendations = [];
    
    if (videos.length === 0) {
      recommendations.push("Upload your first video to start building your audience!");
    }
    
    if (videos.length > 0 && videos.length < 5) {
      recommendations.push("Keep uploading! Consistency is key to growing your channel.");
    }
    
    if (engagementRate < 2) {
      recommendations.push("Try creating more engaging titles and thumbnails to improve click-through rates.");
      recommendations.push("Ask questions in your videos to encourage more comments.");
    }
    
    if (engagementRate > 5) {
      recommendations.push("Great engagement! Consider creating a series or consistent content theme.");
    }
    
    const hasDescription = videos.some(video => video.description && video.description.length > 50);
    if (!hasDescription) {
      recommendations.push("Add detailed descriptions to your videos to improve discoverability.");
    }
    
    const hasTags = videos.some(video => video.tags && video.tags.length > 0);
    if (!hasTags) {
      recommendations.push("Use relevant tags to help people find your content.");
    }
    
    return recommendations;
  }
}

export const jsonStorage = new JsonStorage();