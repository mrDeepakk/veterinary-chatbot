# ==========================================
# Build Server Dependencies
# ==========================================
FROM node:18-alpine AS server-builder

WORKDIR /build

# Copy server package files
COPY server/package*.json ./
RUN npm ci --only=production

# ==========================================
# Production Image
# ==========================================
FROM node:18-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependencies from builder
COPY --from=server-builder /build/node_modules ./node_modules

# Copy pre-built widget assets from public folder
# NOTE: Run 'cd server && npm run build' before docker build to generate these
RUN mkdir -p public
COPY public/widget.js ./public/widget.js
COPY public/widget.js.LICENSE.txt ./public/widget.js.LICENSE.txt

# Copy SDK loader to public folder
COPY sdk/loader.js ./public/chatbot.js

# Copy demo folder (from root, not public/)
COPY demo ./public/demo

# Copy server source files
COPY server/*.js ./
COPY server/ai ./ai
COPY server/controllers ./controllers
COPY server/db ./db
COPY server/middleware ./middleware
COPY server/models ./models
COPY server/routes ./routes
COPY server/services ./services
COPY server/utils ./utils

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start server
CMD ["node", "server.js"]
