#!/bin/bash
# Production deployment script
export NODE_ENV=production
export PORT=${PORT:-5173}

echo "Starting ContentScale Platform..."
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Start the deployment server
exec tsx server/deploy-server.ts