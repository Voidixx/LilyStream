# Overview

LilyTube is a premium video streaming platform that allows users to create, share, and discover video content. The application provides a complete video hosting solution with features like video upload, streaming, commenting, likes/dislikes, playlists, and user profiles. Built as a full-stack web application, it offers both content creation and consumption capabilities in a modern, responsive interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript, using a modern component-based architecture:
- **UI Framework**: React with TypeScript for type safety
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Theme Support**: Custom theme provider with light/dark mode switching

## Backend Architecture
The server follows a REST API architecture:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the stack
- **File Upload**: Multer middleware for handling video and thumbnail uploads
- **Session Management**: Express sessions with PostgreSQL storage
- **Real-time Features**: WebSocket support for live comments and interactions

## Authentication System
Uses Replit's OpenID Connect (OIDC) authentication:
- **Strategy**: Passport.js with OpenID Connect strategy
- **Session Storage**: PostgreSQL-backed sessions with connect-pg-simple
- **User Management**: Automatic user creation/updates on login
- **Security**: HTTP-only cookies with secure session handling

## Database Design
PostgreSQL database with Drizzle ORM:
- **Users**: Profile information, subscriber counts, authentication data
- **Videos**: Metadata, file paths, view counts, privacy settings, categories
- **Comments**: Hierarchical commenting system with like/dislike support
- **Likes**: Separate like/dislike tracking for videos and comments
- **Playlists**: User-created video collections
- **Video Progress**: Track user viewing progress for resume functionality
- **Sessions**: Secure session storage for authentication

## File Storage Strategy
Local file system storage with organized directory structure:
- **Videos**: Stored in `/uploads/videos/` with unique filenames
- **Thumbnails**: Stored in `/uploads/thumbnails/` with automatic generation support
- **File Validation**: MIME type checking and size limits (2GB for videos)
- **Serving**: Static file serving through Express with proper headers

## API Architecture
RESTful API endpoints organized by resource:
- **Authentication**: `/api/auth/*` for login/logout/user info
- **Videos**: `/api/videos/*` for CRUD operations, streaming, and metadata
- **Comments**: `/api/videos/:id/comments` for comment management
- **Likes**: `/api/videos/:id/like` for like/dislike functionality
- **Playlists**: `/api/playlists/*` for playlist management
- **Progress**: `/api/videos/:id/progress` for tracking viewing progress

## Real-time Features
WebSocket integration for live updates:
- **Live Comments**: Real-time comment updates during video viewing
- **View Count Updates**: Live view counter updates
- **Connection Management**: Automatic connection handling and reconnection

# External Dependencies

## Database
- **Neon Database**: PostgreSQL hosting service via `@neondatabase/serverless`
- **Drizzle ORM**: Type-safe database operations and migrations
- **Connection Pooling**: Built-in connection management

## UI Components
- **Radix UI**: Accessible, unstyled UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built component library based on Radix UI and Tailwind
- **Lucide React**: Icon library for consistent iconography

## Authentication
- **Replit Auth**: OpenID Connect integration with Replit's authentication system
- **Passport.js**: Authentication middleware with OIDC strategy
- **Session Management**: PostgreSQL-backed session storage

## Media Processing
- **Multer**: File upload middleware for handling video/image uploads
- **File System**: Local storage for media files with organized structure

## Development Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast bundling for production server builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Runtime Environment
- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Web framework for API and static file serving
- **WebSocket**: Real-time communication via `ws` library