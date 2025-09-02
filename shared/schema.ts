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

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  bio: text("bio"),
  subscriberCount: integer("subscriber_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Videos table
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnail_url"),
  videoUrl: varchar("video_url").notNull(),
  duration: integer("duration"), // in seconds
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  dislikes: integer("dislikes").default(0),
  category: varchar("category"),
  tags: text("tags").array(),
  privacy: varchar("privacy", { enum: ["public", "unlisted", "private"] }).default("public"),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  views: true,
  likes: true,
  dislikes: true,
  createdAt: true,
  updatedAt: true,
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
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type VideoProgress = typeof videoProgress.$inferSelect;
