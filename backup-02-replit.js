#!/usr/bin/env node

/**
 * ContentScale Platform - Replit Backup & Configuration v02
 * Specialized Replit deployment and backup system
 * Contact: O. Francisca (+31 628073996)
 * Domain: contentscale.site
 */

const fs = require('fs');
const archiver = require('archiver');

class ReplitBackup {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.version = '02';
    this.outputDir = `./replit-backup-${this.timestamp}`;
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  log(message) {
    console.log(`[Replit Backup] ${message}`);
  }

  createReplitConfig() {
    const replitConfig = `modules = ["nodejs-20", "python-3.11"]

[nix]
channel = "stable-24_05"

[[ports]]
localPort = 3000
externalPort = 3000

[[ports]]
localPort = 5000
externalPort = 5000

[[ports]]
localPort = 5173
externalPort = 5173

[[ports]]
localPort = 24678
externalPort = 80

[deployment]
deploymentTarget = "cloudrun"

run = "tsx start.ts"

[env]
REPLIT = "1"
NODE_ENV = "production"

[packager]
language = "nodejs"

[packager.features]
packageSearch = true
guessImports = true
enabledForHosting = false

[languages]

[languages.javascript]
pattern = "**/{*.js,*.jsx,*.ts,*.tsx,*.json}"

[languages.javascript.languageServer]
start = "typescript-language-server --stdio"

[unitTest]
language = "nodejs"

[debugger]
support = true

[debugger.interactive]
transport = "localhost:0"
startCommand = ["dap-node"]

[debugger.interactive.initializeMessage]
command = "initialize"
type = "request"

[debugger.interactive.initializeMessage.arguments]
clientID = "replit"
clientName = "replit.com"
columnsStartAt1 = true
linesStartAt1 = true
locale = "en-us"
pathFormat = "path"
supportsInvalidatedEvent = true
supportsProgressReporting = true
supportsRunInTerminalRequest = true
supportsVariablePaging = true
supportsVariableType = true

[debugger.interactive.launchMessage]
command = "launch"
type = "request"

[debugger.interactive.launchMessage.arguments]
console = "externalTerminal"
cwd = "."
pauseForSourceMap = false
program = "./start.ts"
request = "launch"
sourceMaps = true
stopOnEntry = false
type = "pwa-node"
`;

    fs.writeFileSync(`${this.outputDir}/.replit`, replitConfig);
  }

  createReplitNix() {
    const nixConfig = `{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.ts-node
    pkgs.python311
    pkgs.python311Packages.pip
    pkgs.curl
    pkgs.wget
    pkgs.git
    pkgs.nano
    pkgs.vim
  ];
  
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.libuuid
      pkgs.stdenv.cc.cc.lib
    ];
  };
}`;

    fs.writeFileSync(`${this.outputDir}/replit.nix`, nixConfig);
  }

  createReplitSecrets() {
    const secretsGuide = `# Replit Secrets Configuration

## Required Secrets
Add these in the Replit Secrets tab (Tools > Secrets):

### PERPLEXITY_API_KEY
- **Purpose**: AI consultation with real-time research
- **Get it**: https://www.perplexity.ai/settings/api
- **Format**: pplx-xxxxxxxxxxxxxxxxxxxxxxxxxx
- **Required**: Yes

### SENDGRID_API_KEY (Optional)
- **Purpose**: Admin email notifications
- **Get it**: https://app.sendgrid.com/settings/api_keys
- **Format**: SG.xxxxxxxxxx.xxxxxxxxxxxxxxxxxxx
- **Required**: No

### STRIPE_SECRET_KEY (Optional)
- **Purpose**: Payment processing
- **Get it**: https://dashboard.stripe.com/apikeys
- **Format**: sk_test_xxxxxxxxx or sk_live_xxxxxxxxx
- **Required**: No

### VITE_STRIPE_PUBLIC_KEY (Optional)
- **Purpose**: Frontend payment integration
- **Get it**: https://dashboard.stripe.com/apikeys
- **Format**: pk_test_xxxxxxxxx or pk_live_xxxxxxxxx
- **Required**: No

## How to Add Secrets in Replit

1. Open your Replit project
2. Click "Tools" in the sidebar
3. Select "Secrets"
4. Click "New Secret"
5. Enter key name and value
6. Click "Add Secret"

## Environment Variables (Automatic)
These are set automatically by Replit:
- REPLIT_DB_URL
- REPLIT_DOMAINS
- REPL_ID
- REPL_SLUG
- REPL_OWNER

## Testing Secrets
Use this endpoint to verify secrets are configured:
\`GET /health\` - Shows which secrets are available

## Security Notes
- Never commit secrets to code
- Use Replit's built-in secrets management
- Rotate API keys regularly
- Monitor usage in respective dashboards
`;

    fs.writeFileSync(`${this.outputDir}/REPLIT_SECRETS.md`, secretsGuide);
  }

  createDeploymentGuide() {
    const guide = `# Replit Deployment Guide - ContentScale Platform

## Quick Deploy Steps

### 1. Import Project
- Fork or import this repository to new Replit
- Ensure all files are copied correctly
- Verify package.json dependencies

### 2. Configure Secrets
Add in Replit Secrets (Tools > Secrets):
\`\`\`
PERPLEXITY_API_KEY=your_perplexity_key
SENDGRID_API_KEY=your_sendgrid_key (optional)
STRIPE_SECRET_KEY=your_stripe_key (optional)  
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key (optional)
\`\`\`

### 3. Install Dependencies
Run in Shell:
\`\`\`bash
npm install
\`\`\`

### 4. Start Development
Click "Run" button or execute:
\`\`\`bash
tsx start.ts
\`\`\`

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
   \`\`\`
   A Record: @ → [Replit IP]
   CNAME: www → your-repl-name.replit.app
   \`\`\`

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
- Endpoint: \`/health\`
- Shows system status
- Verifies API connections

### Admin Panel
- URL: \`/admin/download\`
- Password: \`dev-admin-2025\`
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
\`\`\`bash
node backup-02-replit.js
\`\`\`

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
3. **Dependencies**: Run \`npm install\` if packages missing
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
`;

    fs.writeFileSync(`${this.outputDir}/REPLIT_DEPLOYMENT.md`, guide);
  }

  createStartScript() {
    const startScript = `#!/bin/bash

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
`;

    fs.writeFileSync(`${this.outputDir}/start.sh`, startScript);
    
    // Make executable
    try {
      const { execSync } = require('child_process');
      execSync(`chmod +x "${this.outputDir}/start.sh"`);
    } catch (error) {
      this.log('Note: Could not set executable permission on start.sh');
    }
  }

  createReplitReadme() {
    const readme = `# ContentScale Platform - Replit Edition

> Super-intelligent AI business consulting platform optimized for Replit deployment

## 🚀 Quick Start on Replit

1. **Import this project** to your Replit
2. **Add secrets** in Tools > Secrets:
   - \`PERPLEXITY_API_KEY\` (required)
   - \`SENDGRID_API_KEY\` (optional)
3. **Click Run** button
4. **Deploy** when ready

## 📋 Features

✅ **AI Consultation**: Perplexity API integration  
✅ **Content Generation**: Multi-model support  
✅ **Admin Panel**: Email management & analytics  
✅ **Pricing System**: Credits & free tier  
✅ **Custom Domain**: contentscale.site ready  

## 🔧 Replit Configuration

### Secrets Required
\`\`\`
PERPLEXITY_API_KEY=pplx-xxxxxxxxx
\`\`\`

### Optional Secrets
\`\`\`
SENDGRID_API_KEY=SG.xxxxxxxxx
STRIPE_SECRET_KEY=sk_xxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_xxxxxxxxx
\`\`\`

### Run Command
\`\`\`bash
tsx start.ts
\`\`\`

## 🌐 Deployment

1. Go to **Deploy** tab
2. Connect to **Google Cloud Run**
3. Add custom domain: **contentscale.site**
4. Configure DNS records
5. Deploy!

## 📞 Support

**Contact**: O. Francisca (+31 628073996)  
**Domain**: contentscale.site  
**Admin**: /admin/download (password: dev-admin-2025)

---
**Optimized for Replit's cloud infrastructure**
`;

    fs.writeFileSync(`${this.outputDir}/README-REPLIT.md`, readme);
  }

  execute() {
    this.log('Creating Replit-optimized backup...');
    
    // Create Replit-specific files
    this.createReplitConfig();
    this.createReplitNix();
    this.createReplitSecrets();
    this.createDeploymentGuide();
    this.createStartScript();
    this.createReplitReadme();
    
    this.log('='.repeat(50));
    this.log('REPLIT BACKUP COMPLETED');
    this.log('='.repeat(50));
    this.log(`Output directory: ${this.outputDir}`);
    this.log('Files created:');
    this.log('- .replit (configuration)');
    this.log('- replit.nix (dependencies)');
    this.log('- REPLIT_SECRETS.md (secrets guide)');
    this.log('- REPLIT_DEPLOYMENT.md (deployment guide)');
    this.log('- start.sh (startup script)');
    this.log('- README-REPLIT.md (Replit-specific docs)');
    this.log('='.repeat(50));
    
    return this.outputDir;
  }
}

// Execute if run directly
if (require.main === module) {
  const backup = new ReplitBackup();
  backup.execute();
}

module.exports = ReplitBackup;