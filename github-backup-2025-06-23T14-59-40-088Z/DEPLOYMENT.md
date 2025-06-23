# GitHub Deployment Instructions

## Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Create new repository on GitHub: contentscale-platform
   # Clone this backup content
   git clone https://github.com/yourusername/contentscale-platform.git
   cd contentscale-platform
   ```

2. **Upload Content**
   ```bash
   # Copy all files from this backup to repository
   cp -r github-backup-*/* .
   git add .
   git commit -m "ContentScale Platform v02 - Initial commit"
   git push origin main
   ```

## Replit Integration

1. **Import from GitHub**
   - Go to Replit.com
   - Click "Import from GitHub"
   - Enter repository URL
   - Configure environment variables

2. **Environment Variables**
   - PERPLEXITY_API_KEY (required)
   - SENDGRID_API_KEY (optional)
   - STRIPE_SECRET_KEY (optional)
   - VITE_STRIPE_PUBLIC_KEY (optional)

3. **Deploy**
   - Click "Deploy" button in Replit
   - Configure custom domain: contentscale.site

## Custom Hosting

### Option 1: Vercel
```bash
npm install -g vercel
vercel --prod
```

### Option 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: DigitalOcean/AWS
1. Create server instance
2. Install Node.js 18+
3. Clone repository
4. Configure environment variables
5. Start with PM2: `pm2 start start.ts`

## Domain Configuration

### DNS Settings for contentscale.site
```
Type: A
Name: @
Value: [Server IP]

Type: CNAME  
Name: www
Value: contentscale.site
```

## Monitoring & Maintenance

- **Health Check**: `GET /health`
- **Admin Panel**: `/admin/download`
- **Logs**: Check server logs for errors
- **Updates**: Regular dependency updates recommended

## Support

- Contact: O. Francisca (+31 628073996)
- Repository: github.com/yourusername/contentscale-platform
- Live Demo: https://strategic-pro-biyohes387.replit.app
