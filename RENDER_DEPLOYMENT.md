# 🚀 Deploying to Render

This guide covers deploying the Veterinary Chatbot to [Render](https://render.com/) using Docker.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com/)
2. **MongoDB Database**: Set up [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
3. **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. **GitHub Repository**: Push your code to GitHub (Render deploys from Git)

---

## Quick Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Prepare MongoDB**
   ```bash
   # Create a free MongoDB Atlas cluster
   # Copy the connection string (looks like: mongodb+srv://user:password@cluster.mongodb.net/dbname)
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Docker deployment configuration"
   git push origin main
   ```

3. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **"New +"** → **"Blueprint"**
   - Connect your GitHub repository
   - Render will detect `render.yaml` automatically
   - Click **"Apply"**

4. **Set Environment Variables**
   - In Render dashboard, go to your service
   - Navigate to **Environment** tab
   - Add:
     - `GEMINI_API_KEY`: Your Google Gemini API key
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `CORS_ORIGIN`: Your frontend domain (or `*` for development)

5. **Deploy**
   - Render will automatically build and deploy
   - Wait for build to complete (3-5 minutes)
   - Access your app at: `https://your-service-name.onrender.com`

---

### Option 2: Manual Deployment

1. **Create Web Service**
   - Go to Render Dashboard
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `veterinary-chatbot`
     - **Environment**: `Docker`
     - **Region**: Choose closest to you
     - **Branch**: `main`
     - **Dockerfile Path**: `server/Dockerfile`
     - **Docker Context**: `.` (project root)

2. **Configure Build**
   - **Docker Build Context**: `.`
   - **Dockerfile Path**: `./server/Dockerfile`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3000
   GEMINI_API_KEY=<your-gemini-api-key>
   MONGODB_URI=<your-mongodb-atlas-uri>
   CORS_ORIGIN=*
   ```

4. **Deploy**
   - Click **"Create Web Service"**
   - Render will build and deploy automatically

---

## Pre-Deployment Checklist

Before deploying, ensure you've completed these steps:

- [ ] Widget built locally: `cd server && npm run build`
- [ ] Committed `public/widget.js` and `public/chatbot.js` to Git
- [ ] Created MongoDB Atlas cluster and copied connection string
- [ ] Obtained Gemini API key
- [ ] Tested Docker build locally: `docker build -t veterinary-chatbot -f server/Dockerfile .`
- [ ] Updated `CORS_ORIGIN` if deploying frontend separately

---

## MongoDB Setup (MongoDB Atlas)

### Free Tier Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for free

2. **Create Cluster**
   - Click **"Build a Database"**
   - Select **"FREE"** (M0 Sandbox)
   - Choose cloud provider and region
   - Click **"Create Cluster"**

3. **Create Database User**
   - Go to **"Database Access"**
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Username: `veterinary-chatbot`
   - Password: Generate a secure password
   - User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

4. **Configure Network Access**
   - Go to **"Network Access"**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
     - ⚠️ For production, restrict to Render's IP ranges
   - Click **"Confirm"**

5. **Get Connection String**
   - Go to **"Database"** → **"Connect"**
   - Click **"Connect your application"**
   - Copy the connection string:
     ```
     mongodb+srv://veterinary-chatbot:<password>@cluster0.xxxxx.mongodb.net/veterinary-chatbot?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Replace `/veterinary-chatbot` with your database name

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini AI API key | `AIza...` |
| `MONGODB_URI` | ✅ Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | No | Server port (Render sets automatically) | `3000` |
| `NODE_ENV` | No | Environment mode | `production` |
| `CORS_ORIGIN` | No | Allowed CORS origins | `*` or `https://yourdomain.com` |

---

## Build Process

Render will execute these steps automatically:

1. **Clone Repository** from GitHub
2. **Build Docker Image**:
   ```bash
   docker build -t veterinary-chatbot -f server/Dockerfile .
   ```
3. **Run Container**:
   ```bash
   docker run -p 3000:3000 \
     -e GEMINI_API_KEY=$GEMINI_API_KEY \
     -e MONGODB_URI=$MONGODB_URI \
     veterinary-chatbot
   ```
4. **Health Check**: Render pings `/health` endpoint

**Build Time**: ~3-5 minutes

---

## Testing Your Deployment

After deployment succeeds:

1. **Check Health Endpoint**
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "Veterinary Chatbot API is running",
     "timestamp": "2026-01-12T..."
   }
   ```

2. **Test Demo Page**
   ```
   https://your-service-name.onrender.com/demo/
   ```

3. **Test Chatbot Loader**
   ```
   https://your-service-name.onrender.com/chatbot.js
   ```

---

## Custom Domain

To use your own domain:

1. **Add Custom Domain in Render**
   - Go to your service settings
   - Navigate to **"Custom Domains"**
   - Click **"Add Custom Domain"**
   - Enter your domain: `chat.yourdomain.com`

2. **Configure DNS**
   - Add CNAME record in your DNS provider:
     ```
     Type: CNAME
     Name: chat
     Value: your-service-name.onrender.com
     ```

3. **SSL Certificate**
   - Render automatically provisions and renews SSL certificates
   - HTTPS will be enabled within minutes

---

## Continuous Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update chatbot"
git push origin main

# Render will automatically:
# 1. Detect the push
# 2. Rebuild Docker image
# 3. Deploy new version
# 4. Run health checks
```

### Disable Auto-Deploy

If you want manual deployments:
- Go to service **Settings**
- Toggle **"Auto-Deploy"** to **OFF**
- Click **"Manual Deploy"** to deploy manually

---

## Monitoring & Logs

### View Logs

```bash
# In Render Dashboard:
# 1. Go to your service
# 2. Click "Logs" tab
# 3. Real-time logs stream automatically
```

### Metrics

Render provides:
- CPU usage
- Memory usage
- Request count
- Response times
- Health check status

Access at: **Dashboard** → **Your Service** → **Metrics**

---

## Troubleshooting

### Build Fails

**Error**: `failed to solve: failed to read dockerfile`
- **Fix**: Ensure `server/Dockerfile` exists in repository
- **Fix**: Check Docker Context is set to `.` (root)

**Error**: `COPY failed: file not found`
- **Fix**: Run `cd server && npm run build` before pushing
- **Fix**: Ensure `public/widget.js` is committed to Git

### Application Won't Start

**Error**: `GEMINI_API_KEY environment variable is required`
- **Fix**: Add `GEMINI_API_KEY` in Render environment variables

**Error**: `MongooseServerSelectionError`
- **Fix**: Verify MongoDB Atlas connection string
- **Fix**: Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **Fix**: Verify database user credentials

### Health Check Fails

- Check logs for errors
- Verify container is listening on correct PORT
- Ensure `/health` endpoint is accessible

---

## Scaling

### Vertical Scaling (Upgrade Plan)

Render Plans:
- **Starter** (Free): 512 MB RAM, 0.1 CPU
- **Standard**: 2 GB RAM, 1 CPU
- **Pro**: 4 GB RAM, 2 CPU

Upgrade at: **Settings** → **Plan**

### Horizontal Scaling

For high traffic:
1. Deploy multiple instances
2. Use Render's load balancing (automatic)
3. Consider MongoDB Atlas shared cluster → dedicated cluster

---

## Cost Estimate

### Free Tier (Perfect for Testing)
- **Render Web Service**: Free (with limitations)
  - Spins down after 15 min inactivity
  - 750 hours/month free
- **MongoDB Atlas**: Free (M0)
  - 512 MB storage
  - Shared CPU/RAM

### Production (Low Traffic)
- **Render Standard**: $7/month
  - Always online
  - 2 GB RAM
- **MongoDB Atlas M2**: $9/month
  - 2 GB storage
  - Dedicated resources

**Total**: ~$16/month for low-traffic production

---

## Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use Render's secret management
   - Rotate API keys regularly

2. **CORS Configuration**
   ```bash
   # Production: Set specific origin
   CORS_ORIGIN=https://yourdomain.com
   
   # Development: Allow all (not recommended for production)
   CORS_ORIGIN=*
   ```

3. **MongoDB**
   - Use strong database passwords
   - Restrict IP access in production
   - Enable MongoDB authentication

4. **HTTPS**
   - Render provides automatic SSL
   - Always use HTTPS in production

---

## Rollback

If deployment breaks:

1. **Go to Render Dashboard**
2. Navigate to **"Events"** tab
3. Find previous successful deploy
4. Click **"Redeploy"**

Or redeploy from Git:
```bash
git revert HEAD
git push origin main
```

---

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Docker Deployment](https://render.com/docs/deploy-docker)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [Google Gemini API](https://ai.google.dev/docs)

---

## Support

If you encounter issues:

1. **Check Logs**: Render Dashboard → Logs
2. **Verify Environment Variables**: Settings → Environment
3. **Test Locally**: `docker-compose up -d`
4. **Render Community**: [community.render.com](https://community.render.com/)

---

## Summary

✅ **Deployment Steps**:
1. Set up MongoDB Atlas (free)
2. Get Gemini API key
3. Push code to GitHub
4. Connect repository to Render
5. Configure environment variables
6. Deploy!

Your Veterinary Chatbot will be live at `https://your-service-name.onrender.com` 🚀
