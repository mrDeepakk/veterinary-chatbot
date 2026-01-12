# ==========================================
# Widget Builder (Standalone)
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build widget
RUN npm run build

# ==========================================
# Output Stage (for artifact extraction)
# ==========================================
FROM scratch AS artifact

# Copy only the built assets
COPY --from=builder /app/dist /dist
