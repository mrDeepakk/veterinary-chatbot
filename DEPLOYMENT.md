# 🐳 Docker Deployment Guide

Complete guide for deploying the Veterinary Chatbot SDK using Docker.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Local Development](#-local-development)
- [Production Deployment](#-production-deployment)
- [Environment Configuration](#-environment-configuration)
- [Deployment Platforms](#-deployment-platforms)
- [Monitoring & Logs](#-monitoring--logs)
- [Troubleshooting](#-troubleshooting)
- [Scaling](#-scaling)

---

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Veterinary-ChatBot

# 2. Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 3. Start all services
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f server

# 6. Access the application
# Demo: http://localhost:3000/demo/
# API: http://localhost:3000/health
# MongoDB Admin: http://localhost:8081 (dev only)
```

### Using Docker Only

```bash
# 1. Build the image
cd server
docker build -t vet-chatbot-server .

# 2. Run MongoDB
docker run -d --name mongodb \
  -p 27017:27017 \
  mongo:7.0

# 3. Run the server
docker run -d --name vet-chatbot \
  -p 3000:3000 \
  -e GEMINI_API_KEY=your_key_here \
  -e MONGODB_URI=mongodb://mongodb:27017/veterinary-chatbot \
  --link mongodb:mongodb \
  vet-chatbot-server
```

---

## 📦 Prerequisites

- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/get-docker/))
- **Docker Compose**: Version 2.0+ (included with Docker Desktop)
- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## 💻 Local Development

### Start Development Environment

```bash
# Start all services (including mongo-express for DB admin)
docker-compose --profile dev up -d

# Rebuild after code changes
docker-compose build server
docker-compose up -d server

# Watch logs
docker-compose logs -f
```

### Development Endpoints

- **Application**: http://localhost:3000/demo/
- **API Health**: http://localhost:3000/health
- **MongoDB Admin**: http://localhost:8081
  - Username: `admin`
  - Password: Set in `.env` as `MONGO_EXPRESS_PASSWORD`

### Hot Reload During Development

For active development with hot reload:

```bash
# Keep Docker MongoDB running
docker-compose up -d mongodb

# Run server locally with nodemon
cd server
npm run dev
```

---

## 🌐 Production Deployment

### Using docker-compose.prod.yml

```bash
# 1. Create production environment file
cp .env.example .env.prod

# 2. Edit .env.prod with production values:
# - Strong MongoDB credentials
# - Production CORS_ORIGIN (your domain)
# - Production GEMINI_API_KEY

# 3. Deploy
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# 4. Verify
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:3000/health
```

### Production Checklist

- [ ] Use strong MongoDB username/password
- [ ] Set specific CORS_ORIGIN (not `*`)
- [ ] Use managed MongoDB (Atlas, DocumentDB) instead of containerized
- [ ] Configure SSL/TLS certificates
- [ ] Set up reverse proxy (Nginx, Traefik)
- [ ] Configure log aggregation
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure automated backups
- [ ] Enable Docker logging driver

---

## ⚙️ Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIza...` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://mongodb:27017/veterinary-chatbot` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |
| `LOG_LEVEL` | `info` | Logging level |

### Production-Specific Variables

| Variable | Description |
|----------|-------------|
| `MONGO_ROOT_USERNAME` | MongoDB admin username |
| `MONGO_ROOT_PASSWORD` | MongoDB admin password |

### Using External MongoDB (Recommended for Production)

```bash
# Update MONGODB_URI in .env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/veterinary-chatbot

# Start only the server
docker-compose up -d server
```

---

## 🚢 Deployment Platforms

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml vet-chatbot

# Scale service
docker service scale vet-chatbot_server=3

# Check status
docker stack services vet-chatbot
```

### Kubernetes

```bash
# Build and push image
docker build -t your-registry/vet-chatbot:latest ./server
docker push your-registry/vet-chatbot:latest

# Apply Kubernetes manifests (create these based on docker-compose)
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/ingress.yml
```

### AWS ECS

1. Build and push to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker build -t vet-chatbot ./server
docker tag vet-chatbot:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vet-chatbot:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vet-chatbot:latest
```

2. Create ECS task definition using the pushed image
3. Use AWS DocumentDB for MongoDB
4. Configure ALB for load balancing

### DigitalOcean App Platform

```bash
# Install doctl
# Create app.yaml based on docker-compose.yml

doctl apps create --spec app.yaml
```

### Google Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/vet-chatbot ./server

# Deploy to Cloud Run
gcloud run deploy vet-chatbot \
  --image gcr.io/PROJECT-ID/vet-chatbot \
  --platform managed \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your_key,MONGODB_URI=your_mongodb_uri \
  --allow-unauthenticated
```

### Azure Container Instances

```bash
# Build and push to ACR
az acr build --registry myregistry --image vet-chatbot:latest ./server

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name vet-chatbot \
  --image myregistry.azurecr.io/vet-chatbot:latest \
  --cpu 1 --memory 1 \
  --registry-login-server myregistry.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --dns-name-label vet-chatbot \
  --ports 3000 \
  --environment-variables GEMINI_API_KEY=your_key MONGODB_URI=your_mongodb_uri
```

---

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server

# Last 100 lines
docker-compose logs --tail=100 server

# Follow with timestamps
docker-compose logs -f -t server
```

### Health Checks

```bash
# Check server health
curl http://localhost:3000/health

# Check container health status
docker inspect --format='{{.State.Health.Status}}' vet-chatbot-server

# All container stats
docker stats
```

### Export Logs

```bash
# Export to file
docker-compose logs > logs.txt

# Use Docker logging driver (add to docker-compose.yml)
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check logs
docker-compose logs server

# Check if port is already in use
netstat -tuln | grep 3000  # Linux/Mac
netstat -ano | findstr :3000  # Windows

# Remove and recreate
docker-compose down
docker-compose up -d
```

#### 2. MongoDB Connection Failed

```bash
# Check MongoDB status
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker exec -it vet-chatbot-mongodb mongosh --eval "db.adminCommand('ping')"
```

#### 3. Widget Not Loading

```bash
# Rebuild with fresh widget build
docker-compose build --no-cache server
docker-compose up -d server

# Check widget files exist
docker exec vet-chatbot-server ls -la /app/widget/dist
docker exec vet-chatbot-server ls -la /app/sdk
```

#### 4. CORS Errors

```bash
# Update CORS_ORIGIN in .env
CORS_ORIGIN=https://yourdomain.com,http://localhost:3000

# Restart server
docker-compose restart server
```

#### 5. Out of Memory

```bash
# Check memory usage
docker stats

# Add memory limits to docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

### Debug Mode

```bash
# Run with interactive shell
docker-compose run --rm server sh

# Execute commands inside container
docker exec -it vet-chatbot-server sh

# Check environment variables
docker exec vet-chatbot-server env
```

### Reset Everything

```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v

# Remove dangling images
docker image prune -a

# Fresh start
docker-compose up -d
```

---

## 📈 Scaling

### Horizontal Scaling

#### Using Docker Compose

```bash
# Scale to 3 instances
docker-compose up -d --scale server=3

# Add load balancer (Nginx)
# See nginx.conf example in docs/
```

#### Using Docker Swarm

```bash
# Update replicas in docker-compose.prod.yml
deploy:
  replicas: 3

# Apply changes
docker stack deploy -c docker-compose.prod.yml vet-chatbot
```

#### Using Kubernetes

```yaml
# In deployment.yml
spec:
  replicas: 3
```

### Vertical Scaling

Update resource limits in `docker-compose.prod.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Performance Tips

1. **Use production build**: Always use `NODE_ENV=production`
2. **External MongoDB**: Use managed MongoDB service (Atlas, DocumentDB)
3. **Enable compression**: Use Nginx/reverse proxy with gzip
4. **Cache static assets**: Configure CDN for widget.js
5. **Connection pooling**: Configure MongoDB connection pool
6. **Health checks**: Enable proper health check endpoints
7. **Log rotation**: Configure log rotation to prevent disk fill

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use secrets management** for production (Docker Secrets, AWS Secrets Manager, etc.)
3. **Run as non-root user** (already configured in Dockerfile)
4. **Keep images updated** regularly:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```
5. **Scan for vulnerabilities**:
   ```bash
   docker scan vet-chatbot-server
   ```
6. **Use specific CORS origins** in production
7. **Enable HTTPS** with reverse proxy
8. **Limit MongoDB access** to specific networks

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review container logs: `docker-compose logs -f`
3. Check health endpoint: `curl http://localhost:3000/health`
4. Open an issue on GitHub with:
   - Docker version
   - OS/Platform
   - Full error logs
   - Steps to reproduce
