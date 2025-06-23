# Replit Deployment Guide - ContentScale Platform

## Quick Deploy Steps

### 1. Import Project
- Fork or import this repository to new Replit
- Ensure all files are copied correctly
- Verify package.json dependencies

### 2. Configure Secrets
Add in Replit Secrets (Tools > Secrets):
```
PERPLEXITY_API_KEY=your_perplexity_key
SENDGRID_API_KEY=your_sendgrid_key (optional)
STRIPE_SECRET_KEY=your_stripe_key (optional)  
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key (optional)
```

### 3. Install Dependencies
Run in Shell:
```bash
npm install
```

### 4. Start Development
Click "Run" button or execute:
```bash
tsx start.ts
```

### 5. Deploy to Production
1. Click "Deploy" tab
2. Connect to Google Cloud Run
3. Configure domain: contentscale.site
4. Deploy with one click

## Domain Configuration

### Custom Domain Setup
1. Go to Deploy tab in Replit
2. Add custom domain: contentscale.site
3. Configure DNS records:
   ```
   A Record: @ → [Replit IP]
   CNAME: www → your-repl-name.replit.app
   ```

### SSL Certificate
- Automatic with Replit deployment
- Custom domains get free SSL
- HTTPS enforced by default

## Performance Optimization

### Replit Boosters
- Consider Replit Booster for better performance
- Reduces cold start times
- Improves response speeds

### Resource Usage
- Monitor CPU and memory usage
- Optimize heavy operations
- Use rate limiting for API calls

## Monitoring & Logs

### Health Check
- Endpoint: `/health`
- Shows system status
- Verifies API connections

### Admin Panel
- URL: `/admin/download`
- Password: `dev-admin-2025`
- Download consultation data
- System statistics

### Debugging
- Use Replit debugger
- Check console logs
- Monitor network requests

## Backup Strategy

### Automatic Backups
- Replit creates automatic snapshots
- Download project regularly
- Export to GitHub for version control

### Manual Backup
```bash
node backup-02-replit.js
```

## Scaling Considerations

### Database
- Currently using in-memory storage
- Ready for PostgreSQL integration
- Consider Replit Database for persistence

### Traffic
- Monitor concurrent users
- Implement rate limiting
- Consider CDN for static assets

## Troubleshooting

### Common Issues
1. **Secrets not loading**: Check Secrets tab configuration
2. **Port conflicts**: Ensure ports 3000, 5000 are available
3. **Dependencies**: Run `npm install` if packages missing
4. **API limits**: Monitor Perplexity API usage

### Performance Issues
- Check memory usage in Stats tab
- Optimize database queries
- Implement caching where appropriate

## Support

- **Contact**: O. Francisca (+31 628073996)
- **Domain**: contentscale.site
- **Replit URL**: https://replit.com/@username/project-name
- **GitHub**: https://github.com/username/contentscale-platform

## Next Steps

1. ✅ Deploy to Replit
2. ✅ Configure custom domain
3. ✅ Set up monitoring
4. ✅ Test all features
5. ✅ Go live!

---
**Ready for production deployment with Replit's reliable infrastructure**
