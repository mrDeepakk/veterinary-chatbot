#!/bin/bash

# ==========================================
# Docker Build Script for Veterinary Chatbot
# ==========================================
# Usage: ./scripts/build-docker.sh [tag]

set -e

# Default tag
TAG="${1:-latest}"
IMAGE_NAME="vet-chatbot-server"

echo "🐳 Building Docker image: $IMAGE_NAME:$TAG"
echo "=========================================="

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Dockerfile exists
if [ ! -f "server/Dockerfile" ]; then
    echo "❌ Error: server/Dockerfile not found!"
    exit 1
fi

# Build the image
echo "📦 Building server image..."
docker build -t "$IMAGE_NAME:$TAG" -f server/Dockerfile .

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "Image: $IMAGE_NAME:$TAG"
    echo ""
    echo "To run the container:"
    echo "  docker-compose up -d"
    echo ""
    echo "Or manually:"
    echo "  docker run -d -p 3000:3000 \\"
    echo "    -e GEMINI_API_KEY=your_key \\"
    echo "    -e MONGODB_URI=mongodb://mongodb:27017/veterinary-chatbot \\"
    echo "    $IMAGE_NAME:$TAG"
else
    echo "❌ Build failed!"
    exit 1
fi
