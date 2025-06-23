# ContentScale Platform - Deployment Guide

## Deployment Options

### 1. GitHub Repository Setup

1. **Create GitHub Repository**:
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: ContentScale Platform v1.0.0"

# Add GitHub remote
git remote add origin https://github.com/yourusername/contentscale-platform.git
git branch -M main
git push -u origin main
```

2. **Set up GitHub Secrets** (for GitHub Actions):
- `GEMINI_API_KEY`: Your Google Gemini API key
- `SESSION_SECRET`: Random secret for session encryption

### 2. Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform

# Install dependencies
npm install

# Set environment variables
export GEMINI_API_KEY="your_key_here"
export SESSION_SECRET="your_secret_here"

# Start development server
npm run dev
```

### 3. Production Deployment

#### Option A: Direct Server Deployment

1. **Server Requirements**:
   - Node.js 20+
   - 512MB RAM minimum
   - 1GB storage
   - Ubuntu/CentOS/Debian

2. **Deploy**:
```bash
# Upload files to server
scp -r ./* user@server:/opt/contentscale/

# SSH into server
ssh user@server

# Navigate to directory
cd /opt/contentscale

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

#### Option B: Docker Deployment

1. **Build and run**:
```bash
# Build Docker image
docker build -t contentscale-platform .

# Run container
docker run -d \
  -p 5173:5173 \
  -e GEMINI_API_KEY="your_key" \
  -e SESSION_SECRET="your_secret" \
  --name contentscale \
  contentscale-platform
```

2. **Using Docker Compose**:
```bash
# Create .env file
echo "GEMINI_API_KEY=your_key" > .env
echo "SESSION_SECRET=your_secret" >> .env

# Start services
docker-compose up -d
```

#### Option C: Cloud Platform Deployment

**Vercel**:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Railway**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway deploy
```

**Render**:
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### 4. Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes | - |
| `SESSION_SECRET` | Session encryption secret | ⚠️ Recommended | Auto-generated |
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5173` |

### 5. SSL/HTTPS Setup

#### Using Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Using Caddy

```
yourdomain.com {
    reverse_proxy localhost:5173
}
```

### 6. Monitoring & Maintenance

#### Health Checks
```bash
# Check application health
curl -f http://localhost:5173/api/agent/health

# Check specific endpoints
curl http://localhost:5173/api/agent/status
```

#### Log Monitoring
```bash
# Production logs
npm run start 2>&1 | tee logs/contentscale.log

# Docker logs
docker logs contentscale -f
```

#### Database Backup (if using persistent storage)
```bash
# Export application data
curl http://localhost:5173/api/agent/export-data > backup.json
```

### 7. Scaling Considerations

#### Horizontal Scaling
- Load balancer (nginx/HAProxy)
- Multiple server instances
- Shared session storage (Redis)

#### Vertical Scaling
- Increase server resources
- Optimize memory usage
- Database caching

### 8. Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Input validation active
- [ ] CORS properly configured
- [ ] Security headers implemented
- [ ] Regular security updates

### 9. Troubleshooting

**Common Issues**:

1. **Port already in use**:
```bash
export PORT=3000
npm run start
```

2. **Missing API key**:
```bash
export GEMINI_API_KEY="your_actual_key"
```

3. **Build failures**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

4. **Memory issues**:
```bash
node --max-old-space-size=2048 server/index.js
```

### 10. Updates & Maintenance

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm update

# Rebuild and restart
npm run build
npm run start
```

---

For support: consultant@contentscale.site