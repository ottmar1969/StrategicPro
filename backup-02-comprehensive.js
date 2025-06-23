#!/usr/bin/env node

/**
 * ContentScale Platform - Comprehensive Backup System v02
 * Complete backup solution for Replit and GitHub deployment
 * Contact: O. Francisca (+31 628073996)
 * Domain: contentscale.site
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

class ContentScaleBackup {
  constructor() {
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupDir = `./backups/backup-${this.timestamp}`;
    this.projectName = 'contentscale-platform';
    this.version = '02';
    
    // Ensure backup directory exists
    if (!fs.existsSync('./backups')) {
      fs.mkdirSync('./backups', { recursive: true });
    }
    fs.mkdirSync(this.backupDir, { recursive: true });
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    fs.appendFileSync(`${this.backupDir}/backup.log`, `[${timestamp}] ${message}\n`);
  }

  // Get directory size in MB
  getDirectorySize(dirPath) {
    try {
      const result = execSync(`du -sm "${dirPath}" 2>/dev/null || echo "0"`, { encoding: 'utf8' });
      return parseInt(result.split('\t')[0]) || 0;
    } catch (error) {
      return 0;
    }
  }

  // Create project metadata
  createMetadata() {
    this.log('Creating project metadata...');
    
    const metadata = {
      project: {
        name: this.projectName,
        version: this.version,
        domain: 'contentscale.site',
        contact: 'O. Francisca (+31 628073996)',
        description: 'AI-powered business consulting platform with Perplexity API integration',
        backupDate: new Date().toISOString(),
        replitUrl: 'https://replit.com/@your-username/strategic-pro-biyohes387'
      },
      features: [
        'Super-intelligent AI consultation with Perplexity API',
        'Content generation with 25 languages support',
        'Admin management system with email forwarding',
        'Credit-based pricing system',
        'Multi-model AI support (GPT-4, Claude, Gemini Pro)',
        'Real-time SEO optimization',
        'Professional business consulting across 12 categories'
      ],
      tech_stack: {
        frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Shadcn/ui', 'Wouter'],
        backend: ['Node.js', 'Express', 'TypeScript'],
        ai_apis: ['Perplexity API', 'Google Gemini', 'OpenAI GPT'],
        deployment: ['Replit', 'Google Cloud Run'],
        database: 'In-memory storage with PostgreSQL ready'
      },
      deployment: {
        platform: 'Replit',
        domain: 'contentscale.site',
        ssl: 'Automatic',
        cdn: 'Cloudflare ready'
      },
      pricing: {
        consultation: {
          first_per_ip: 'Free',
          subsequent: '$1 per consultation'
        },
        content: {
          credits: '$3 per article',
          premium: '$10 per article',
          own_api: '$1 per article (with 10 free)'
        }
      }
    };

    fs.writeFileSync(
      `${this.backupDir}/PROJECT_METADATA.json`,
      JSON.stringify(metadata, null, 2)
    );
  }

  // Backup source code with proper structure
  backupSourceCode() {
    this.log('Backing up source code...');
    
    const sourceFiles = [
      // Core application files
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'vite.config.ts',
      '.replit',
      'replit.nix',
      
      // Main server files
      'start.ts',
      'dev-start.ts',
      'index.html',
      
      // Client-side application
      'client/',
      
      // Server-side application
      'server/',
      
      // Shared utilities
      'shared/',
      
      // Public assets
      'public/',
      
      // Documentation
      '*.md',
      
      // Configuration files
      '.env.example',
      '.gitignore'
    ];

    const codeBackupDir = `${this.backupDir}/source-code`;
    fs.mkdirSync(codeBackupDir, { recursive: true });

    sourceFiles.forEach(pattern => {
      try {
        if (pattern.includes('*')) {
          execSync(`cp ${pattern} "${codeBackupDir}/" 2>/dev/null || true`);
        } else if (pattern.endsWith('/')) {
          if (fs.existsSync(pattern)) {
            execSync(`cp -r "${pattern}" "${codeBackupDir}/"`);
          }
        } else {
          if (fs.existsSync(pattern)) {
            execSync(`cp "${pattern}" "${codeBackupDir}/"`);
          }
        }
      } catch (error) {
        this.log(`Warning: Could not backup ${pattern}: ${error.message}`);
      }
    });

    const sourceSize = this.getDirectorySize(codeBackupDir);
    this.log(`Source code backed up: ${sourceSize}MB`);
  }

  // Create deployment guide
  createDeploymentGuide() {
    this.log('Creating deployment guide...');
    
    const deploymentGuide = `# ContentScale Platform - Deployment Guide v02

## Quick Deployment Steps

### 1. Replit Deployment
1. Import this backup to new Replit project
2. Install dependencies: \`npm install\`
3. Set environment variables:
   - PERPLEXITY_API_KEY (required)
   - SENDGRID_API_KEY (optional - for admin emails)
   - STRIPE_SECRET_KEY (optional - for payments)
   - VITE_STRIPE_PUBLIC_KEY (optional - for payments)
4. Run: \`npm run dev\` or \`tsx start.ts\`
5. Deploy using Replit's deploy button

### 2. Custom Domain Setup (contentscale.site)
\`\`\`
DNS Records:
A Record: @ → [Replit deployment IP]
CNAME: www → strategic-pro-biyohes387.replit.app
\`\`\`

### 3. Environment Variables Setup
Copy from \`.env.example\` and configure:
\`\`\`
PERPLEXITY_API_KEY=your_perplexity_key_here
SENDGRID_API_KEY=your_sendgrid_key_here
STRIPE_SECRET_KEY=sk_test_or_live_key
VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_key
\`\`\`

### 4. Admin Access
- URL: /admin/download
- Password: dev-admin-2025
- Features: Email management, consultation downloads, system stats

### 5. API Endpoints
- Health check: /health
- Consultations: /api/consultations
- Content generation: /api/content
- Admin: /api/admin

## Features Overview

### AI Consultation System
- First consultation free per IP address
- $1 per consultation after first one
- Perplexity API integration for real-time research
- 12 business consulting categories
- Source citations and fact-checking

### Content Generation System
- Multiple AI models: Default, GPT-4, Claude, Gemini Pro
- Dynamic pricing: $3 credits, $10 premium, $1 with own API
- 25+ language support
- CRAFT framework optimization
- Real-time SEO analysis

### Admin Management
- Email forwarding for consultation forms
- Download/delete consultation data
- User statistics and analytics
- System health monitoring

## Technical Stack
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- AI: Perplexity API, Google Gemini, OpenAI
- Deployment: Replit + Google Cloud Run
- Database: In-memory (PostgreSQL ready)

## Support
- Contact: O. Francisca (+31 628073996)
- Domain: contentscale.site
- Platform: Replit professional deployment
`;

    fs.writeFileSync(`${this.backupDir}/DEPLOYMENT_GUIDE.md`, deploymentGuide);
  }

  // Create GitHub setup instructions
  createGitHubSetup() {
    this.log('Creating GitHub setup instructions...');
    
    const githubSetup = `# GitHub Repository Setup - ContentScale Platform

## Repository Creation
1. Create new GitHub repository: \`contentscale-platform\`
2. Initialize with README, .gitignore (Node.js template)
3. Set repository to public or private as needed

## Upload Instructions

### Method 1: Direct Upload
1. Download this backup
2. Extract source-code folder
3. Upload all files to GitHub repository
4. Commit message: "ContentScale Platform v02 - Complete backup"

### Method 2: Git Commands
\`\`\`bash
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform
cp -r /path/to/backup/source-code/* .
git add .
git commit -m "ContentScale Platform v02 - Complete deployment ready"
git push origin main
\`\`\`

## Repository Structure
\`\`\`
contentscale-platform/
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared utilities
├── public/              # Static assets
├── docs/                # Documentation
├── .replit              # Replit configuration
├── package.json         # Dependencies
├── start.ts             # Main server file
└── README.md            # Project documentation
\`\`\`

## Environment Variables for GitHub Actions (Optional)
If deploying via GitHub Actions:
- PERPLEXITY_API_KEY
- SENDGRID_API_KEY
- STRIPE_SECRET_KEY
- VITE_STRIPE_PUBLIC_KEY

## Branch Strategy
- \`main\` - Production ready code
- \`development\` - Active development
- \`feature/*\` - Feature branches

## Deployment from GitHub
1. Connect GitHub to Replit
2. Import repository to new Replit project
3. Follow deployment guide
4. Configure environment variables
5. Deploy using Replit's deployment system

## Repository Links
- Main repository: https://github.com/yourusername/contentscale-platform
- Live demo: https://strategic-pro-biyohes387.replit.app
- Custom domain: https://contentscale.site (after DNS setup)
`;

    fs.writeFileSync(`${this.backupDir}/GITHUB_SETUP.md`, githubSetup);
  }

  // Create complete project archive
  createArchive() {
    return new Promise((resolve, reject) => {
      this.log('Creating complete project archive...');
      
      const output = fs.createWriteStream(`${this.backupDir}/../contentscale-platform-v02.zip`);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        const sizeInMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        this.log(`Archive created: ${sizeInMB}MB`);
        resolve();
      });

      archive.on('error', (err) => {
        this.log(`Archive error: ${err.message}`);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(this.backupDir, false);
      archive.finalize();
    });
  }

  // Main backup execution
  async executeBackup() {
    try {
      this.log('Starting ContentScale Platform backup v02...');
      this.log(`Backup directory: ${this.backupDir}`);

      // Create all backup components
      this.createMetadata();
      this.backupSourceCode();
      this.createDeploymentGuide();
      this.createGitHubSetup();

      // Create downloadable archive
      await this.createArchive();

      // Create backup summary
      const summary = {
        timestamp: this.timestamp,
        version: this.version,
        components: [
          'Complete source code',
          'Project metadata',
          'Deployment guide',
          'GitHub setup instructions',
          'Environment configuration',
          'Documentation'
        ],
        totalSize: this.getDirectorySize(this.backupDir),
        archiveLocation: `./backups/contentscale-platform-v02.zip`,
        nextSteps: [
          '1. Download the archive file',
          '2. Extract and review deployment guide',
          '3. Set up GitHub repository',
          '4. Deploy to Replit or custom hosting',
          '5. Configure DNS for contentscale.site'
        ]
      };

      fs.writeFileSync(
        `${this.backupDir}/BACKUP_SUMMARY.json`,
        JSON.stringify(summary, null, 2)
      );

      this.log('='.repeat(60));
      this.log('BACKUP COMPLETED SUCCESSFULLY');
      this.log('='.repeat(60));
      this.log(`Total backup size: ${summary.totalSize}MB`);
      this.log(`Archive location: ${summary.archiveLocation}`);
      this.log(`Components backed up: ${summary.components.length}`);
      this.log('Next: Download archive and follow deployment guide');
      this.log('='.repeat(60));

      return summary;

    } catch (error) {
      this.log(`Backup failed: ${error.message}`);
      throw error;
    }
  }
}

// Execute backup if run directly
if (require.main === module) {
  const backup = new ContentScaleBackup();
  backup.executeBackup().then(summary => {
    console.log('\nBackup Summary:', JSON.stringify(summary, null, 2));
    process.exit(0);
  }).catch(error => {
    console.error('Backup failed:', error);
    process.exit(1);
  });
}

module.exports = ContentScaleBackup;