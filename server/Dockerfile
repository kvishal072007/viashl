# Multi-stage Docker build for Node.js Express TypeScript Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for building TypeScript)
RUN npm ci

# Copy application source code
COPY . .

# Compile TypeScript to JavaScript in /app/dist
RUN npm run build

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package manifests and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/db/schema.sql ./dist/db/schema.sql

EXPOSE 5000

CMD ["node", "dist/server.js"]
