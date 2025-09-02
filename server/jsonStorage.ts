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
  private data!: DatabaseFile; // Initialize data property

  // Ensure data is loaded
  private async ensureInitialized(): Promise<void> {
    if (!this.data) {
      this.data = this.loadData();
    }
  }

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
      // Attempt to recover by returning empty data or default data
      const defaultData: DatabaseFile = {
        users: [], videos: [], comments: [], likes: [], subscriptions: [], notifications: [], reports: [], userSettings: [], watchHistory: [], algorithmData: [], categories: [], playlists: [], videoProgress: []
      };
      return defaultData;
    }
  }

  private saveData(data: DatabaseFile): void {
    try {
      writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
      this.data = data; // Update in-memory data
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
    await this.ensureInitialized();
    return this.data.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.ensureInitialized();
    return this.data.users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    return this.data.users.find(user => user.email === email);
  }

  async createUser(userData: RegisterUser): Promise<User> {
    await this.ensureInitialized();
    const hashedPassword = await this.hashPassword(userData.password);

    const isFirstUser = this.data.users.length === 0;

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
      isAdmin: isFirstUser,
      isModerator: false,
      isBanned: false,
      banReason: null,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.data.users.push(user);

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

    this.data.userSettings.push(userSettings);

    this.saveData(this.data);

    if (isFirstUser) {
      console.log(`🎉 First user created as admin: ${user.username}`);
    }

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    await this.ensureInitialized();
    const userIndex = this.data.users.findIndex(user => user.id === id);

    if (userIndex === -1) return undefined;

    this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates, updatedAt: new Date() };
    this.saveData(this.data);

    return this.data.users[userIndex];
  }

  // Admin operations
  async getAllUsers(page = 1, limit = 50, search = ""): Promise<{ users: User[]; total: number }> {
    await this.ensureInitialized();
    let users = this.data.users;

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
    await this.ensureInitialized();
    let videos = this.data.videos;

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
    await this.ensureInitialized();
    let comments = this.data.comments;

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
    await this.ensureInitialized();
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const newUsersToday = this.data.users.filter(user =>
      user.createdAt && new Date(user.createdAt) >= today
    ).length;

    const newVideosToday = this.data.videos.filter(video =>
      video.createdAt && new Date(video.createdAt) >= today
    ).length;

    const totalViews = this.data.videos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = this.data.videos.reduce((sum, video) => sum + (video.likes || 0), 0);

    return {
      totalUsers: this.data.users.length,
      totalVideos: this.data.videos.length,
      totalComments: this.data.comments.length,
      newUsersToday,
      newVideosToday,
      totalViews,
      totalLikes,
      totalSubscriptions: this.data.subscriptions.length,
      totalPlaylists: this.data.playlists.length
    };
  }

  // Video operations
  async createVideo(video: InsertVideo): Promise<Video> {
    await this.ensureInitialized();
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
      scheduledAt: video.status === 'scheduled' ? new Date(video.scheduledAt!) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.data.videos.push(newVideo);
    this.saveData(this.data);

    return newVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    await this.ensureInitialized();
    return this.data.videos.find(video => video.id === id);
  }

  async getVideos(userId?: string, category?: string, search?: string, fyp = false): Promise<Video[]> {
    await this.ensureInitialized();
    let videos = this.data.videos.filter(video => video.privacy === 'public' && video.status === 'published');

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

  // Add scheduled videos methods
  async getScheduledVideos(userId: string): Promise<Video[]> {
    await this.ensureInitialized();
    return this.data.videos.filter(video =>
      video.userId === userId && video.status === 'scheduled'
    ).sort((a, b) => new Date(a.scheduledAt || 0).getTime() - new Date(b.scheduledAt || 0).getTime());
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    await this.ensureInitialized();
    const videoIndex = this.data.videos.findIndex(video => video.id === id);

    if (videoIndex === -1) return undefined;

    this.data.videos[videoIndex] = { ...this.data.videos[videoIndex], ...updates, updatedAt: new Date() };
    this.saveData(this.data);

    return this.data.videos[videoIndex];
  }

  async deleteVideo(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const videoIndex = this.data.videos.findIndex(video => video.id === id);

    if (videoIndex === -1) return false;

    this.data.videos.splice(videoIndex, 1);
    this.saveData(this.data);

    return true;
  }

  async incrementViews(id: string): Promise<void> {
    await this.ensureInitialized();
    const video = this.data.videos.find(video => video.id === id);

    if (video) {
      video.views = (video.views || 0) + 1;
      this.saveData(this.data);
    }
  }

  // Subscription operations  
  async subscribe(subscriberId: string, channelId: string): Promise<void> {
    await this.ensureInitialized();
    const existing = this.data.subscriptions.find(sub =>
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

      this.data.subscriptions.push(subscription);

      const channel = this.data.users.find(user => user.id === channelId);
      if (channel) {
        channel.subscriberCount = (channel.subscriberCount || 0) + 1;
      }

      this.saveData(this.data);
    }
  }

  async unsubscribe(subscriberId: string, channelId: string): Promise<void> {
    await this.ensureInitialized();
    const subIndex = this.data.subscriptions.findIndex(sub =>
      sub.subscriberId === subscriberId && sub.channelId === channelId
    );

    if (subIndex !== -1) {
      this.data.subscriptions.splice(subIndex, 1);

      const channel = this.data.users.find(user => user.id === channelId);
      if (channel) {
        channel.subscriberCount = Math.max(0, (channel.subscriberCount || 0) - 1);
      }

      this.saveData(this.data);
    }
  }

  async getSubscriptions(userId: string): Promise<Subscription[]> {
    await this.ensureInitialized();
    return this.data.subscriptions.filter(sub => sub.subscriberId === userId);
  }

  async isSubscribed(subscriberId: string, channelId: string): Promise<boolean> {
    await this.ensureInitialized();
    return this.data.subscriptions.some(sub =>
      sub.subscriberId === subscriberId && sub.channelId === channelId
    );
  }

  // Comment operations
  async createComment(comment: InsertComment): Promise<Comment> {
    await this.ensureInitialized();
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

    this.data.comments.push(newComment);

    const video = this.data.videos.find(v => v.id === comment.videoId);
    if (video) {
      video.comments = (video.comments || 0) + 1;
    }

    this.saveData(this.data);

    return newComment;
  }

  async getComments(videoId: string): Promise<Comment[]> {
    await this.ensureInitialized();
    return this.data.comments
      .filter(comment => comment.videoId === videoId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteComment(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const commentIndex = this.data.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) return false;

    const comment = this.data.comments[commentIndex];
    this.data.comments.splice(commentIndex, 1);

    const video = this.data.videos.find(v => v.id === comment.videoId);
    if (video) {
      video.comments = Math.max(0, (video.comments || 0) - 1);
    }

    this.saveData(this.data);

    return true;
  }

  // Like operations
  async toggleLike(userId: string, videoId?: string, commentId?: string, type: 'like' | 'dislike'): Promise<void> {
    await this.ensureInitialized();
    const existingLike = this.data.likes.find(like =>
      like.userId === userId &&
      (videoId ? like.videoId === videoId : like.commentId === commentId)
    );

    if (existingLike) {
      if (existingLike.type === type) {
        this.data.likes.splice(this.data.likes.indexOf(existingLike), 1);

        if (videoId) {
          const video = this.data.videos.find(v => v.id === videoId);
          if (video) {
            if (type === 'like') {
              video.likes = Math.max(0, (video.likes || 0) - 1);
            } else {
              video.dislikes = Math.max(0, (video.dislikes || 0) - 1);
            }
          }
        }
      } else {
        existingLike.type = type;

        if (videoId) {
          const video = this.data.videos.find(v => v.id === videoId);
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
      const newLike: Like = {
        id: nanoid(),
        userId,
        videoId: videoId || null,
        commentId: commentId || null,
        type,
        createdAt: new Date()
      };

      this.data.likes.push(newLike);

      if (videoId) {
        const video = this.data.videos.find(v => v.id === videoId);
        if (video) {
          if (type === 'like') {
            video.likes = (video.likes || 0) + 1;
          } else {
            video.dislikes = (video.dislikes || 0) + 1;
          }
        }
      }
    }

    this.saveData(this.data);
  }

  async getUserLike(userId: string, videoId?: string, commentId?: string): Promise<Like | undefined> {
    await this.ensureInitialized();
    return this.data.likes.find(like =>
      like.userId === userId &&
      (videoId ? like.videoId === videoId : like.commentId === commentId)
    );
  }

  // Advanced analytics for creators
  async getAdvancedAnalytics(userId: string): Promise<any> {
    await this.ensureInitialized();
    const userVideos = this.data.videos.filter(video => video.userId === userId);

    const totalViews = userVideos.reduce((sum, video) => sum + (video.views || 0), 0);
    const totalLikes = userVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
    const totalComments = userVideos.reduce((sum, video) => sum + (video.comments || 0), 0);

    const engagementRate = totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    const topVideos = userVideos
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentVideos = userVideos.filter(video =>
      video.createdAt && new Date(video.createdAt) >= thirtyDaysAgo
    );

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
        subscriberCount: this.data.users.find(u => u.id === userId)?.subscriberCount || 0
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