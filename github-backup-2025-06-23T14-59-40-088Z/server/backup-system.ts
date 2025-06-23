import express from 'express';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { agentAuth } from './security.js';

const router = express.Router();

// Admin authentication required for all backup routes
router.use(agentAuth);

// Generate complete backup zip
router.get('/download/complete', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipName = `01-contentscale-complete-backup-${timestamp}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    archive.pipe(res);
    
    // Project root directory
    const projectRoot = path.resolve('.');
    
    // Include all essential files and directories
    const includePaths = [
      'client',
      'server', 
      'shared',
      'public',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'index.html',
      'README.md',
      'start.ts',
      'dev-server.ts',
      'dev-start.ts',
      '.replit',
      'replit.nix'
    ];
    
    // Exclude patterns
    const excludePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.env',
      '*.log',
      '.DS_Store',
      'Thumbs.db',
      '*.tmp',
      '*.temp'
    ];
    
    for (const includePath of includePaths) {
      const fullPath = path.join(projectRoot, includePath);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          archive.directory(fullPath, includePath, {
            ignore: (filePath: string) => {
              return excludePatterns.some(pattern => 
                filePath.includes(pattern) || 
                path.basename(filePath).includes(pattern)
              );
            }
          });
        } else if (stats.isFile()) {
          archive.file(fullPath, { name: includePath });
        }
      }
    }
    
    // Add deployment and documentation files
    const deploymentFiles = [
      'DEPLOYMENT.md',
      'TECHNICAL_SPECIFICATIONS.md', 
      'PROJECT_REPLICATION_GUIDE.md',
      'AGENT_INSTRUCTION_MANUAL.md',
      'GITHUB_SETUP.md'
    ];
    
    for (const file of deploymentFiles) {
      const filePath = path.join(projectRoot, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
      }
    }
    
    await archive.finalize();
    
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Generate GitHub-specific backup
router.get('/download/github', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipName = `01-contentscale-github-${timestamp}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    archive.pipe(res);
    
    const projectRoot = path.resolve('.');
    
    // GitHub-specific files (exclude Replit-specific)
    const githubPaths = [
      'client',
      'server',
      'shared', 
      'public',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'index.html',
      'README.md',
      'start.ts',
      'DEPLOYMENT.md',
      'TECHNICAL_SPECIFICATIONS.md',
      'GITHUB_SETUP.md'
    ];
    
    // Create .gitignore for GitHub
    const gitignoreContent = `
node_modules/
dist/
build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
.DS_Store
Thumbs.db
*.tmp
*.temp
.replit
replit.nix
`.trim();
    
    archive.append(gitignoreContent, { name: '.gitignore' });
    
    // Add GitHub workflow
    const githubWorkflow = `
name: Deploy ContentScale Platform

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
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
      
    - name: Build project
      run: npm run build
      
    - name: Run tests
      run: npm test
`.trim();
    
    archive.append(githubWorkflow, { name: '.github/workflows/deploy.yml' });
    
    for (const includePath of githubPaths) {
      const fullPath = path.join(projectRoot, includePath);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          archive.directory(fullPath, includePath, {
            ignore: (filePath: string) => {
              return filePath.includes('node_modules') || 
                     filePath.includes('.git') ||
                     filePath.includes('dist') ||
                     filePath.includes('build');
            }
          });
        } else if (stats.isFile()) {
          archive.file(fullPath, { name: includePath });
        }
      }
    }
    
    await archive.finalize();
    
  } catch (error) {
    console.error('GitHub backup creation error:', error);
    res.status(500).json({ error: 'Failed to create GitHub backup' });
  }
});

// Generate Replit-specific backup
router.get('/download/replit', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const zipName = `01-contentscale-replit-${timestamp}.zip`;
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
    
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });
    
    archive.pipe(res);
    
    const projectRoot = path.resolve('.');
    
    // Include everything for Replit
    const replitPaths = [
      'client',
      'server',
      'shared',
      'public', 
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'tsconfig.node.json',
      'tailwind.config.ts',
      'postcss.config.js',
      'index.html',
      'README.md',
      'start.ts',
      'dev-server.ts',
      'dev-start.ts',
      '.replit',
      'replit.nix',
      'DEPLOYMENT.md',
      'TECHNICAL_SPECIFICATIONS.md',
      'PROJECT_REPLICATION_GUIDE.md',
      'AGENT_INSTRUCTION_MANUAL.md'
    ];
    
    for (const includePath of replitPaths) {
      const fullPath = path.join(projectRoot, includePath);
      
      if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          archive.directory(fullPath, includePath, {
            ignore: (filePath: string) => {
              return filePath.includes('node_modules') || 
                     filePath.includes('.git') ||
                     filePath.includes('dist');
            }
          });
        } else if (stats.isFile()) {
          archive.file(fullPath, { name: includePath });
        }
      }
    }
    
    await archive.finalize();
    
  } catch (error) {
    console.error('Replit backup creation error:', error);
    res.status(500).json({ error: 'Failed to create Replit backup' });
  }
});

// Get backup status and file list
router.get('/status', (req, res) => {
  const projectRoot = path.resolve('.');
  const backupInfo = {
    timestamp: new Date().toISOString(),
    projectSize: getDirectorySize(projectRoot),
    availableBackups: ['complete', 'github', 'replit'],
    includedPaths: {
      complete: ['client', 'server', 'shared', 'public', 'config files', 'documentation'],
      github: ['source code', 'config files', 'documentation', '.gitignore', 'GitHub Actions'],
      replit: ['complete project', 'Replit config', 'deployment files']
    }
  };
  
  res.json(backupInfo);
});

function getDirectorySize(dirPath: string): string {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      if (file === 'node_modules' || file === '.git') continue;
      
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += parseInt(getDirectorySize(filePath).replace(/[^0-9]/g, '')) || 0;
      }
    }
  } catch (error) {
    console.error('Error calculating directory size:', error);
  }
  
  return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
}

export { router as default };