# LilyTube Deployment Guide

## Deploy to External Hosting Services

This guide will help you deploy your LilyTube video platform to various hosting services.

## Overview

LilyTube is a full-stack application with:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Local filesystem (can be migrated to cloud storage)

## Prerequisites

1. **GitHub Account**: Your code should be in a GitHub repository
2. **Database**: PostgreSQL database (we recommend Neon or Supabase for free hosting)
3. **Environment Variables**: Configure all necessary environment variables

## Deployment Options

### Option 1: Render (Recommended - Full Stack)

Render can host both your backend and frontend for free.

#### Backend Deployment

1. **Create a Web Service** on Render
2. **Connect your GitHub repo**
3. **Configure Build Settings**:
   ```bash
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

4. **Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_session_secret_key
   PORT=5000
   ```

5. **Advanced Settings**:
   - Auto-Deploy: Yes
   - Build Filter: Include backend files

#### Frontend Deployment (Static Site)

1. **Create a Static Site** on Render
2. **Configure Build Settings**:
   ```bash
   Build Command: cd client && npm install && npm run build
   Publish Directory: client/dist
   ```

### Option 2: Railway (Full Stack)

Railway provides excellent full-stack hosting with PostgreSQL.

1. **Connect GitHub Repository**
2. **Deploy Backend**:
   ```bash
   # Railway automatically detects Node.js
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Add PostgreSQL Plugin**
4. **Configure Environment Variables**

### Option 3: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend to Vercel

1. **Connect GitHub repo** to Vercel
2. **Configure build settings**:
   ```bash
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=your_backend_url
   ```

#### Backend to Railway/Render
Follow the backend deployment steps from Option 1 or 2.

### Option 4: Digital Ocean App Platform

1. **Create a new App**
2. **Connect GitHub repository**
3. **Configure Services**:
   - **Web Service** (Backend): Node.js
   - **Static Site** (Frontend): Built from client directory
   - **Database**: PostgreSQL

## Database Setup

### Option 1: Neon (Recommended - Free)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Use as `DATABASE_URL` environment variable

### Option 2: Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Use as `DATABASE_URL` environment variable

### Option 3: PlanetScale

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Create a connection string
4. Use as `DATABASE_URL` environment variable

## Environment Variables

Create these environment variables in your hosting service:

### Backend Environment Variables
```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session
SESSION_SECRET=your-very-long-random-string-here

# Application
NODE_ENV=production
PORT=5000

# Optional: For file storage (if using cloud storage)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1
```

### Frontend Environment Variables
```bash
# API URL (if frontend and backend are on different domains)
VITE_API_URL=https://your-backend-domain.com
```

## File Storage Migration

### Option 1: Keep Local Storage (Simple)
- Works for small applications
- Files stored on server filesystem
- **Note**: Files may be lost on redeployment

### Option 2: AWS S3 (Recommended)
```javascript
// Update server/routes.ts for S3 upload
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer-s3 for direct S3 uploads
```

### Option 3: Cloudinary
```javascript
// Install cloudinary
npm install cloudinary

// Configure in server/routes.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
```

## Database Migration

After deploying, run the database migration:

```bash
# If using Drizzle Studio locally
npm run db:push

# Or connect to production database
DATABASE_URL=your_production_url npm run db:push
```

## Performance Optimizations

### 1. Enable Gzip Compression
```javascript
// Add to server/index.ts
import compression from 'compression';
app.use(compression());
```

### 2. Add Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

### 3. CDN for Static Assets
- Use Cloudflare or AWS CloudFront
- Configure for your domain
- Cache video thumbnails and static assets

## SSL/HTTPS

Most hosting services provide free SSL certificates. Ensure:

1. **HTTPS is enabled** in your hosting service settings
2. **Update CORS settings** if frontend and backend are on different domains
3. **Configure secure cookies** in production:

```javascript
// server/auth.ts
cookie: {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',
  maxAge: sessionTtl,
}
```

## Domain Configuration

### Custom Domain Setup

1. **Purchase a domain** (from Namecheap, GoDaddy, etc.)
2. **Configure DNS** in your hosting service
3. **Update CORS settings** for your domain
4. **Update environment variables** with new domain

### CORS Configuration
```javascript
// server/index.ts
app.use(cors({
  origin: [
    'https://your-domain.com',
    'https://www.your-domain.com',
    // Add your production URLs
  ],
  credentials: true,
}));
```

## Monitoring and Analytics

### 1. Error Tracking (Sentry)
```bash
npm install @sentry/node @sentry/react
```

### 2. Analytics (Google Analytics)
```bash
npm install gtag
```

### 3. Uptime Monitoring
- Use UptimeRobot (free)
- Set up alerts for downtime

## Cost Estimation

### Free Tier Hosting:
- **Render**: Free plan (limited)
- **Vercel**: Free plan (generous limits)
- **Railway**: $5/month (500 hours free)
- **Neon**: Free PostgreSQL plan

### Recommended Stack for Production:
- **Frontend**: Vercel ($0 - free tier sufficient)
- **Backend**: Railway ($5-10/month)
- **Database**: Neon Pro ($24/month) or Railway PostgreSQL
- **File Storage**: AWS S3 ($5-20/month depending on usage)
- **CDN**: Cloudflare (free tier)

**Total Monthly Cost**: $10-50 depending on traffic and storage needs

## Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] Domain purchased (optional)
- [ ] SSL certificate configured
- [ ] File storage configured (S3/Cloudinary)

### Post-Deployment
- [ ] Test all functionality
- [ ] Verify admin dashboard access
- [ ] Test file uploads
- [ ] Verify authentication works
- [ ] Check responsive design on mobile
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update DNS settings (if using custom domain)

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Check if database allows external connections
   - Ensure IP whitelisting is configured

2. **File Upload Issues**
   - Check file size limits on hosting service
   - Verify file permissions
   - Consider migrating to cloud storage

3. **CORS Errors**
   - Update allowed origins in server configuration
   - Check if credentials are properly configured

4. **Build Failures**
   - Verify Node.js version compatibility
   - Check for missing dependencies
   - Review build logs for specific errors

## Support

For deployment support:
1. Check hosting service documentation
2. Review application logs
3. Test in development environment first
4. Consider professional deployment services

---

## Quick Start Commands

```bash
# 1. Prepare for deployment
npm run build

# 2. Test production build locally
npm start

# 3. Push database schema to production
DATABASE_URL=your_production_url npm run db:push

# 4. Deploy to your chosen hosting service
git push origin main
```

Your LilyTube platform is now ready for production deployment! 🚀