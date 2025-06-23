#!/bin/bash

# ContentScale Platform - Replit Start Script
# Automated startup for Replit environment

echo "🚀 Starting ContentScale Platform..."
echo "📧 Contact: O. Francisca (+31 628073996)"
echo "🌐 Domain: contentscale.site"
echo ""

# Check Node.js version
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo ""
fi

# Check required secrets
echo "🔐 Checking secrets configuration..."
if [ -z "$PERPLEXITY_API_KEY" ]; then
  echo "⚠️  Warning: PERPLEXITY_API_KEY not set"
  echo "   Add it in Tools > Secrets for AI consultations"
else
  echo "✅ PERPLEXITY_API_KEY configured"
fi

if [ -z "$SENDGRID_API_KEY" ]; then
  echo "ℹ️  Optional: SENDGRID_API_KEY not set (admin emails won't work)"
else
  echo "✅ SENDGRID_API_KEY configured"
fi

echo ""

# Start the application
echo "🎯 Starting ContentScale Platform..."
echo "📊 Health check: http://localhost:3000/health"
echo "🏠 Landing page: http://localhost:3000"
echo "👨‍💼 Admin panel: http://localhost:3000/admin/download"
echo "🔑 Admin password: dev-admin-2025"
echo ""

# Execute the main application
exec tsx start.ts
