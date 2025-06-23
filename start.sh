#!/bin/bash
# Production start script for deployment
export NODE_ENV=production
export PORT=${PORT:-5173}

echo "Starting ContentScale Platform..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Start the production server
tsx server/index.ts