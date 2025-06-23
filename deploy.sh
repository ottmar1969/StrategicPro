#!/bin/bash

# ContentScale Platform Deployment Script

set -e

echo "🚀 Starting ContentScale Platform deployment..."

# Check if required environment variables are set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Error: GEMINI_API_KEY environment variable is required"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check
echo "🔍 Running type checks..."
npm run type-check

# Build the application
echo "🏗️  Building application..."
npm run build

# Set production environment
export NODE_ENV=production

# Generate session secret if not provided
if [ -z "$SESSION_SECRET" ]; then
    export SESSION_SECRET=$(openssl rand -base64 32)
    echo "🔐 Generated session secret"
fi

echo "✅ Build completed successfully!"
echo "🌐 Starting production server..."
echo "📧 Contact: consultant@contentscale.site"

# Start the production server
npm run start