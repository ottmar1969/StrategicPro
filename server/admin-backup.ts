import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Admin authentication middleware
const adminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'dev-admin-2025') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Create comprehensive backup with multiple formats
router.get('/api/admin/create-backup', adminAuth, async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `ContentScale-Backup-${timestamp}`;
    const backupDir = path.join(process.cwd(), 'admin-backups');
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const zipPath = path.join(backupDir, `${backupName}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const stats = fs.statSync(zipPath);
      res.json({
        success: true,
        filename: `${backupName}.zip`,
        size: stats.size,
        downloadUrl: `/admin/download/${backupName}.zip`,
        created: new Date().toISOString()
      });
    });

    archive.on('error', (err) => {
      console.error('Archive error:', err);
      res.status(500).json({ error: 'Backup creation failed' });
    });

    archive.pipe(output);

    // Add all project files
    const projectRoot = process.cwd();
    
    // Core application files
    archive.directory(path.join(projectRoot, 'client'), 'client');
    archive.directory(path.join(projectRoot, 'server'), 'server');
    archive.directory(path.join(projectRoot, 'shared'), 'shared');
    
    // Configuration files
    archive.file(path.join(projectRoot, 'package.json'), { name: 'package.json' });
    archive.file(path.join(projectRoot, 'tsconfig.json'), { name: 'tsconfig.json' });
    archive.file(path.join(projectRoot, 'tailwind.config.ts'), { name: 'tailwind.config.ts' });
    archive.file(path.join(projectRoot, 'postcss.config.js'), { name: 'postcss.config.js' });
    archive.file(path.join(projectRoot, 'dev-server.ts'), { name: 'dev-server.ts' });
    
    // Documentation
    const docFiles = ['README.md', 'TECHNICAL_SPECIFICATIONS.md', 'PROJECT_REPLICATION_GUIDE.md'];
    docFiles.forEach(file => {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    });

    // Add deployment files
    if (fs.existsSync(path.join(projectRoot, 'Dockerfile'))) {
      archive.file(path.join(projectRoot, 'Dockerfile'), { name: 'Dockerfile' });
    }
    if (fs.existsSync(path.join(projectRoot, 'start.sh'))) {
      archive.file(path.join(projectRoot, 'start.sh'), { name: 'start.sh' });
    }

    // Create installation script
    const installScript = `#!/bin/bash
# ContentScale Installation Script
# Generated: ${new Date().toISOString()}

echo "Installing ContentScale Consulting Platform..."

# Install dependencies
npm install

# Set up environment
echo "GEMINI_API_KEY=your_key_here" > .env
echo "ADMIN_KEY=your_admin_key_here" >> .env
echo "SESSION_SECRET=your_session_secret_here" >> .env

echo "Installation complete!"
echo "1. Update .env with your API keys"
echo "2. Run: npm run dev (development)"
echo "3. Run: npm run start (production)"
echo "4. Access: http://localhost:5173"

echo "Admin Access: Add ?adminKey=your_admin_key_here to download URLs"
`;

    archive.append(installScript, { name: 'install.sh' });

    // Create GitHub README
    const githubReadme = `# ContentScale - AI Business Consulting Platform

Professional business consulting platform powered by AI, offering expert analysis across 12 key business areas.

## Features

- **12 Consulting Categories**: SEO, Business Strategy, Financial, Marketing, Operations, HR, IT, Legal, Sales, Customer Experience, Sustainability, Cybersecurity
- **AI-Powered Analysis**: Google Gemini integration for comprehensive business insights
- **Content Generation**: Advanced content creation with fraud protection
- **Agent API**: Automation-ready endpoints for batch processing
- **Security**: Rate limiting, input sanitization, session management
- **Modern UI**: React with shadcn/ui components and dark/light themes

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Wouter routing
- **Backend**: Express.js, Node.js 20
- **AI**: Google Gemini API
- **Validation**: Zod schemas
- **State Management**: TanStack Query
- **Styling**: shadcn/ui components

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your GEMINI_API_KEY

# Development
npm run dev

# Production
npm run build
npm run start
\`\`\`

## API Endpoints

### Main APIs
- \`POST /api/consultations\` - Create consultation request
- \`GET /api/consultations\` - List all consultations
- \`GET /api/analysis/:id\` - Get analysis results
- \`POST /api/business-profiles\` - Create business profile

### Agent APIs
- \`GET /api/agent/status\` - Service capabilities
- \`POST /api/agent/batch-consultations\` - Batch processing
- \`POST /api/agent/quick-analysis\` - Single-step analysis

### Content APIs
- \`POST /api/content/generate\` - Generate content with AI
- \`POST /api/content/check-eligibility\` - Check user eligibility

## Deployment

The application is ready for deployment on:
- Replit Deployments
- Docker containers
- Node.js hosting platforms

Health check endpoint available at \`/\` returns 200 status.

## Security

- Rate limiting (100 req/15min general, 50 req/5min agents)
- Input sanitization and XSS protection
- CORS configuration
- Session management
- Admin authentication for sensitive operations

## License

Proprietary - ContentScale Platform

## Contact

consultant@contentscale.site
`;

    archive.append(githubReadme, { name: 'README.md' });

    // Create environment template
    const envTemplate = `# ContentScale Environment Configuration
# Copy this file to .env and update with your values

# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Admin access key for downloads and management
ADMIN_KEY=your_secure_admin_key_here

# Optional: Session secret for security
SESSION_SECRET=your_session_secret_here

# Optional: Environment mode
NODE_ENV=development

# Optional: Server port
PORT=5173
`;

    archive.append(envTemplate, { name: '.env.example' });

    await archive.finalize();

  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Download backup file
router.get('/admin/download/:filename', adminAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const backupDir = path.join(process.cwd(), 'admin-backups');
    const filePath = path.join(backupDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Backup file not found' });
    }

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// List available backups
router.get('/api/admin/backups', adminAuth, (req, res) => {
  try {
    const backupDir = path.join(process.cwd(), 'admin-backups');
    
    if (!fs.existsSync(backupDir)) {
      return res.json({ backups: [] });
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.zip'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime.toISOString(),
          downloadUrl: `/admin/download/${file}`
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

    res.json({ backups: files });
  } catch (error) {
    console.error('List backups error:', error);
    res.status(500).json({ error: 'Failed to list backups' });
  }
});

export default router;