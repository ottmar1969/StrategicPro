#!/usr/bin/env node

/**
 * ContentScale Platform - GitHub Backup & Deployment v02
 * Specialized GitHub repository setup and backup
 * Contact: O. Francisca (+31 628073996)
 * Domain: contentscale.site
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubBackup {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.version = '02';
    this.repoName = 'contentscale-platform';
    this.outputDir = `./github-backup-${this.timestamp}`;
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  log(message) {
    console.log(`[GitHub Backup] ${message}`);
  }

  createGitHubReadme() {
    const readme = `# ContentScale Platform

> AI-powered business consulting platform with super-intelligent consultation agent

## 🚀 Features

- **Super-Intelligent AI Consultation**: Perplexity API integration for real-time research with source citations
- **Multi-Model Content Generation**: GPT-4, Claude, Gemini Pro support
- **12 Business Categories**: Comprehensive consulting across all major business areas
- **25+ Languages**: Global content generation support
- **Admin Management**: Email forwarding, consultation downloads, analytics
- **Credit System**: Flexible pricing with free tier and API key integration

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **AI APIs**: Perplexity, Google Gemini, OpenAI
- **Deployment**: Replit, Google Cloud Run
- **Database**: In-memory (PostgreSQL ready)

## 📋 Quick Start

### 1. Installation
\`\`\`bash
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform
npm install
\`\`\`

### 2. Environment Setup
\`\`\`bash
cp .env.example .env
# Edit .env with your API keys
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
# or
tsx start.ts
\`\`\`

### 4. Deploy to Replit
1. Import repository to Replit
2. Configure environment variables
3. Click Deploy button

## 🔑 Environment Variables

\`\`\`env
PERPLEXITY_API_KEY=your_perplexity_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
\`\`\`

## 🌐 Domain Setup

### DNS Configuration for contentscale.site
\`\`\`
A Record: @ → [Replit deployment IP]
CNAME: www → strategic-pro-biyohes387.replit.app
\`\`\`

## 📊 Admin Access

- **URL**: \`/admin/download\`
- **Password**: \`dev-admin-2025\`
- **Features**: Email management, consultation downloads, system analytics

## 💰 Pricing Structure

### AI Consultations
- First consultation per IP: **Free**
- Additional consultations: **$1 each**

### Content Generation
- **Credits**: $3 per article
- **Premium**: $10 per article  
- **Own API Keys**: $1 per article (10 free articles included)

## 📂 Project Structure

\`\`\`
contentscale-platform/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   └── lib/         # Utilities and configurations
├── server/              # Express backend application
│   ├── routes.ts        # API route definitions
│   ├── ai-consultant.ts # AI consultation logic
│   └── storage.ts       # Data storage management
├── shared/              # Shared types and schemas
├── public/              # Static assets
├── start.ts             # Main server entry point
└── package.json         # Dependencies and scripts
\`\`\`

## 🎯 Key Endpoints

- **Health Check**: \`GET /health\`
- **Consultations**: \`POST /api/consultations\`
- **Content Generation**: \`POST /api/content/generate\`
- **Admin Panel**: \`GET /admin/download\`

## 🔧 Development

### Adding New Features
1. Create feature branch: \`git checkout -b feature/new-feature\`
2. Implement changes
3. Test thoroughly
4. Submit pull request

### Database Integration
The platform is ready for PostgreSQL integration. Update \`server/storage.ts\` to switch from in-memory to persistent storage.

## 🚀 Deployment Options

### Replit (Recommended)
1. Import this repository
2. Configure environment variables
3. Deploy with one click

### Custom Hosting
1. Build: \`npm run build\`
2. Start: \`npm start\`
3. Configure reverse proxy (nginx/Apache)

## 📞 Support

- **Contact**: O. Francisca (+31 628073996)
- **Domain**: contentscale.site
- **Repository**: github.com/yourusername/contentscale-platform

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for intelligent business consulting**
`;

    fs.writeFileSync(`${this.outputDir}/README.md`, readme);
  }

  createPackageJson() {
    const packageJson = {
      "name": "contentscale-platform",
      "version": "2.0.0",
      "description": "AI-powered business consulting platform with super-intelligent consultation agent",
      "main": "start.ts",
      "scripts": {
        "dev": "tsx start.ts",
        "start": "tsx start.ts",
        "build": "tsc",
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [
        "ai-consulting",
        "business-consulting",
        "perplexity-api",
        "content-generation",
        "typescript",
        "react",
        "express"
      ],
      "author": "O. Francisca <contact@contentscale.site>",
      "license": "MIT",
      "repository": {
        "type": "git",
        "url": "https://github.com/yourusername/contentscale-platform.git"
      },
      "homepage": "https://contentscale.site",
      "dependencies": {
        "@google/genai": "^1.6.0",
        "@google/generative-ai": "^0.24.1",
        "@hookform/resolvers": "^5.1.1",
        "@radix-ui/react-select": "^2.2.5",
        "@radix-ui/react-slot": "^1.2.3",
        "@radix-ui/react-toast": "^1.2.14",
        "@sendgrid/mail": "^8.1.5",
        "@stripe/react-stripe-js": "^3.7.0",
        "@stripe/stripe-js": "^2.7.2",
        "@tanstack/react-query": "^5.61.2",
        "@types/express": "^5.0.0",
        "@types/node": "^22.10.2",
        "@types/react": "^18.3.17",
        "@types/react-dom": "^18.3.5",
        "@vitejs/plugin-react": "^4.3.4",
        "archiver": "^7.0.1",
        "autoprefixer": "^10.4.20",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "concurrently": "^9.1.0",
        "cors": "^2.8.5",
        "drizzle-orm": "^0.37.0",
        "drizzle-zod": "^0.5.1",
        "express": "^4.21.2",
        "express-rate-limit": "^7.4.1",
        "express-session": "^1.18.1",
        "helmet": "^8.0.0",
        "lucide-react": "^0.468.0",
        "postcss": "^8.5.11",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "react-hook-form": "^7.54.2",
        "react-icons": "^5.4.0",
        "stripe": "^17.4.0",
        "tailwind-merge": "^2.5.5",
        "tailwindcss": "^3.4.17",
        "tsx": "^4.19.2",
        "typescript": "^5.7.2",
        "vite": "^6.0.5",
        "wouter": "^3.3.5",
        "zod": "^3.24.1"
      }
    };

    fs.writeFileSync(
      `${this.outputDir}/package.json`,
      JSON.stringify(packageJson, null, 2)
    );
  }

  createGitIgnore() {
    const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/
.next/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# NYC test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Logs
logs
*.log

# Backup files
backups/
*.backup

# Temporary files
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Replit specific
.replit.nix
.config/
.upm/

# Database
*.db
*.sqlite
*.sqlite3

# Compiled TypeScript
*.tsbuildinfo
`;

    fs.writeFileSync(`${this.outputDir}/.gitignore`, gitignore);
  }

  createEnvExample() {
    const envExample = `# ContentScale Platform Environment Variables

# Required - Perplexity API for AI consultations
PERPLEXITY_API_KEY=your_perplexity_api_key_here

# Optional - SendGrid for admin email notifications
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Optional - Stripe for payment processing
STRIPE_SECRET_KEY=sk_test_or_live_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_your_stripe_public_key

# Optional - Admin configuration
ADMIN_EMAIL=admin@contentscale.site
ADMIN_PASSWORD=dev-admin-2025

# Optional - Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/contentscale

# Optional - Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional - CORS configuration
CORS_ORIGIN=https://contentscale.site,http://localhost:3000

# Development settings
NODE_ENV=production
PORT=3000
`;

    fs.writeFileSync(`${this.outputDir}/.env.example`, envExample);
  }

  createGitHubActions() {
    const workflowDir = `${this.outputDir}/.github/workflows`;
    fs.mkdirSync(workflowDir, { recursive: true });

    const deployWorkflow = `name: Deploy to Replit

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test --if-present
    
    - name: Build application
      run: npm run build --if-present
    
    - name: Deploy to Replit
      run: echo "Manual deployment to Replit required"
      # Add Replit deployment steps here if available
`;

    fs.writeFileSync(`${workflowDir}/deploy.yml`, deployWorkflow);
  }

  copySourceFiles() {
    this.log('Copying source files...');
    
    const filesToCopy = [
      'client/',
      'server/',
      'shared/',
      'public/',
      'start.ts',
      'dev-start.ts',
      'index.html',
      'tsconfig.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'vite.config.ts'
    ];

    filesToCopy.forEach(file => {
      try {
        if (fs.existsSync(file)) {
          if (file.endsWith('/')) {
            execSync(`cp -r "${file}" "${this.outputDir}/"`);
          } else {
            execSync(`cp "${file}" "${this.outputDir}/"`);
          }
        }
      } catch (error) {
        this.log(`Warning: Could not copy ${file}: ${error.message}`);
      }
    });
  }

  createDeploymentInstructions() {
    const instructions = `# GitHub Deployment Instructions

## Repository Setup

1. **Create GitHub Repository**
   \`\`\`bash
   # Create new repository on GitHub: contentscale-platform
   # Clone this backup content
   git clone https://github.com/yourusername/contentscale-platform.git
   cd contentscale-platform
   \`\`\`

2. **Upload Content**
   \`\`\`bash
   # Copy all files from this backup to repository
   cp -r github-backup-*/\* .
   git add .
   git commit -m "ContentScale Platform v02 - Initial commit"
   git push origin main
   \`\`\`

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
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

### Option 2: Netlify
\`\`\`bash
npm install -g netlify-cli
netlify deploy --prod
\`\`\`

### Option 3: DigitalOcean/AWS
1. Create server instance
2. Install Node.js 18+
3. Clone repository
4. Configure environment variables
5. Start with PM2: \`pm2 start start.ts\`

## Domain Configuration

### DNS Settings for contentscale.site
\`\`\`
Type: A
Name: @
Value: [Server IP]

Type: CNAME  
Name: www
Value: contentscale.site
\`\`\`

## Monitoring & Maintenance

- **Health Check**: \`GET /health\`
- **Admin Panel**: \`/admin/download\`
- **Logs**: Check server logs for errors
- **Updates**: Regular dependency updates recommended

## Support

- Contact: O. Francisca (+31 628073996)
- Repository: github.com/yourusername/contentscale-platform
- Live Demo: https://strategic-pro-biyohes387.replit.app
`;

    fs.writeFileSync(`${this.outputDir}/DEPLOYMENT.md`, instructions);
  }

  execute() {
    this.log('Starting GitHub backup process...');
    
    // Create all necessary files
    this.createGitHubReadme();
    this.createPackageJson();
    this.createGitIgnore();
    this.createEnvExample();
    this.createGitHubActions();
    this.createDeploymentInstructions();
    
    // Copy source files
    this.copySourceFiles();
    
    this.log('='.repeat(50));
    this.log('GITHUB BACKUP COMPLETED');
    this.log('='.repeat(50));
    this.log(`Output directory: ${this.outputDir}`);
    this.log('Next steps:');
    this.log('1. Create GitHub repository: contentscale-platform');
    this.log('2. Upload contents of output directory');
    this.log('3. Configure environment variables');
    this.log('4. Deploy to Replit or custom hosting');
    this.log('='.repeat(50));
    
    return this.outputDir;
  }
}

// Execute if run directly
if (require.main === module) {
  const backup = new GitHubBackup();
  backup.execute();
}

module.exports = GitHubBackup;