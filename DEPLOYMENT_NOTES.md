# Deployment Notes

## Pre-Deployment Steps

Before deploying to Render, you MUST build the widget locally:

```bash
cd server
npm run build
```

This generates:
- `public/widget.js`
- `public/widget.js.LICENSE.txt`
- `public/chatbot.js`

These files must be committed to your Git repository because Render's Docker build expects them to exist.

## Why Build Locally?

The Dockerfile copies pre-built files from `public/` directory. We simplified the Docker build to avoid building the widget inside Docker because:

1. Faster builds (widget build happens once locally, not on every deploy)
2. Smaller Docker context
3. Consistent builds across environments

## Git Workflow

```bash
# 1. Build widget
cd server && npm run build

# 2. Commit build artifacts
git add public/
git commit -m "Build widget for deployment"

# 3. Push to trigger Render deployment
git push origin main
```

## MongoDB Configuration for Render

Use MongoDB Atlas (free tier):
1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Whitelist all IPs (0.0.0.0/0) for Render access
4. Copy connection string
5. Set `MONGODB_URI` in Render environment variables

Connection string format:
```
mongodb+srv://username:password@cluster.mongodb.net/veterinary-chatbot?retryWrites=true&w=majority
```

## Environment Variables Required on Render

Set these in Render Dashboard → Environment:

```
GEMINI_API_KEY=<your-key>
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

## Render Configuration

- **Type**: Web Service
- **Environment**: Docker
- **Dockerfile Path**: `server/Dockerfile`
- **Docker Context**: `.` (project root)
- **Health Check Path**: `/health`

## First Deployment

1. Ensure `public/` folder has built files
2. Commit and push to GitHub
3. Create Web Service on Render
4. Connect GitHub repository
5. Configure as above
6. Set environment variables
7. Deploy

Render will:
- Clone your repository
- Build Docker image using `server/Dockerfile`
- Start container
- Run health checks on `/health`

## Deployment Time

- First build: 3-5 minutes
- Subsequent builds: 2-3 minutes (with caching)

## Testing Deployment

After deployment:
```bash
# Health check
curl https://your-app.onrender.com/health

# Demo page
https://your-app.onrender.com/demo/

# SDK loader
https://your-app.onrender.com/chatbot.js
```
