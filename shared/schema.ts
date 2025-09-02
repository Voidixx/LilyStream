import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for custom auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced User storage table with custom auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(), // hashed password
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  displayName: varchar("display_name"),
  profileImageUrl: varchar("profile_image_url"),
  bannerImageUrl: varchar("banner_image_url"),
  bio: text("bio"),
  location: varchar("location"),
  website: varchar("website"),
  subscriberCount: integer("subscriber_count").default(0),
  videoCount: integer("video_count").default(0),
  totalViews: integer("total_views").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced Videos table with scheduling and algorithm features
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  videoUrl: varchar("video_url").notNull(),
  duration: integer("duration"), // in seconds
  fileSize: integer("file_size"), // in bytes
  resolution: varchar("resolution"), // e.g., "1920x1080"
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  comments: integer("comments").default(0),
  shares: integer("shares").default(0),
  category: varchar("category"),
  tags: text("tags").array(),
  privacy: varchar("privacy", { enum: ["public", "unlisted", "private"] }).default("public"),
  status: varchar("status", { enum: ["processing", "published", "scheduled", "draft"] }).default("draft"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  // Algorithm metrics
  engagementRate: integer("engagement_rate").default(0), // likes + comments / views * 100
  watchTime: integer("watch_time").default(0), // total seconds watched
  avgWatchTime: integer("avg_watch_time").default(0), // average seconds per view
  retentionRate: integer("retention_rate").default(100), // percentage who watch to end
  clickThroughRate: integer("click_through_rate").default(0), // impressions to views ratio
  algorithmScore: integer("algorithm_score").default(100), // fair algorithm score
  impressions: integer("impressions").default(0),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments table
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  parentId: varchar("parent_id").references(() => comments.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Likes table for videos and comments
export const likes = pgTable("likes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  videoId: varchar("video_id").references(() => videos.id),
  commentId: varchar("comment_id").references(() => comments.id),
  type: varchar("type", { enum: ["like", "dislike"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Playlists table
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  privacy: varchar("privacy", { enum: ["public", "unlisted", "private"] }).default("public"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Playlist videos junction table
export const playlistVideos = pgTable("playlist_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: varchar("playlist_id").references(() => playlists.id).notNull(),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  position: integer("position").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Video progress tracking
export const videoProgress = pgTable("video_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  progress: integer("progress").default(0), // in seconds
  completed: boolean("completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriberId: varchar("subscriber_id").references(() => users.id).notNull(),
  channelId: varchar("channel_id").references(() => users.id).notNull(),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type", { enum: ["new_video", "like", "comment", "subscribe", "mention"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  relatedVideoId: varchar("related_video_id").references(() => videos.id),
  relatedUserId: varchar("related_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Upload sessions for progress tracking
export const uploadSessions = pgTable("upload_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  filename: varchar("filename").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedBytes: integer("uploaded_bytes").default(0),
  status: varchar("status", { enum: ["uploading", "processing", "completed", "failed"] }).default("uploading"),
  estimatedTimeRemaining: integer("estimated_time_remaining"), // in seconds
  uploadSpeed: integer("upload_speed"), // bytes per second
  type: varchar("type", { enum: ["video", "thumbnail"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Algorithm data for fair distribution
export const algorithmData = pgTable("algorithm_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").references(() => videos.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  actionType: varchar("action_type", { enum: ["view", "like", "comment", "share", "watch_time"] }).notNull(),
  value: integer("value").notNull(), // duration for watch_time, 1 for others
  sessionId: varchar("session_id"), // to track unique sessions
  deviceType: varchar("device_type", { enum: ["mobile", "desktop", "tablet"] }),
  source: varchar("source", { enum: ["recommended", "search", "trending", "subscriptions", "direct"] }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").unique().notNull(),
  description: text("description"),
  color: varchar("color").default("#3b82f6"),
  icon: varchar("icon"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  subscriberCount: true,
  videoCount: true,
  totalViews: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerUserSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  views: true,
  likes: true,
  dislikes: true,
  comments: true,
  shares: true,
  engagementRate: true,
  watchTime: true,
  avgWatchTime: true,
  retentionRate: true,
  clickThroughRate: true,
  algorithmScore: true,
  impressions: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUploadSessionSchema = createInsertSchema(uploadSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlgorithmDataSchema = createInsertSchema(algorithmData).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  likes: true,
  dislikes: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type VideoProgress = typeof videoProgress.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type UploadSession = typeof uploadSessions.$inferSelect;
export type AlgorithmData = typeof algorithmData.$inferSelect;
export type Category = typeof categories.$inferSelect;
