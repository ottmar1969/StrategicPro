# ContentScale Platform Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S contentscale -u 1001

# Change ownership
RUN chown -R contentscale:nodejs /app
USER contentscale

# Expose port
EXPOSE 5173

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173/api/agent/health || exit 1

# Start application
CMD ["npm", "start"]