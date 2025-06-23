const express = require('express');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const app = express();

// Simple backup endpoints
app.get('/backup/complete', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const zipName = `01-contentscale-complete-backup-${timestamp}.zip`;
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
  
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  
  // Add main files
  archive.file('./start.ts', { name: 'start.ts' });
  archive.file('./package.json', { name: 'package.json' });
  
  if (fs.existsSync('./package-lock.json')) {
    archive.file('./package-lock.json', { name: 'package-lock.json' });
  }
  if (fs.existsSync('./tsconfig.json')) {
    archive.file('./tsconfig.json', { name: 'tsconfig.json' });
  }
  if (fs.existsSync('./README.md')) {
    archive.file('./README.md', { name: 'README.md' });
  }
  if (fs.existsSync('./server')) {
    archive.directory('./server', 'server');
  }
  
  archive.finalize();
});

app.get('/backup/github', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const zipName = `01-contentscale-github-${timestamp}.zip`;
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
  
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  
  archive.file('./start.ts', { name: 'start.ts' });
  archive.file('./package.json', { name: 'package.json' });
  
  if (fs.existsSync('./README.md')) {
    archive.file('./README.md', { name: 'README.md' });
  }
  
  const gitignore = `node_modules/
dist/
build/
.env
*.log
.DS_Store
.replit
replit.nix`;
  archive.append(gitignore, { name: '.gitignore' });
  
  const workflow = `name: Deploy ContentScale
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
    - run: npm install
    - run: npm start`;
  archive.append(workflow, { name: '.github/workflows/deploy.yml' });
  
  archive.finalize();
});

app.get('/backup/replit', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const zipName = `01-contentscale-replit-${timestamp}.zip`;
  
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
  
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);
  
  archive.file('./start.ts', { name: 'start.ts' });
  archive.file('./package.json', { name: 'package.json' });
  
  if (fs.existsSync('./.replit')) {
    archive.file('./.replit', { name: '.replit' });
  }
  if (fs.existsSync('./replit.nix')) {
    archive.file('./replit.nix', { name: 'replit.nix' });
  }
  if (fs.existsSync('./server')) {
    archive.directory('./server', 'server');
  }
  
  archive.finalize();
});

app.get('/backup/status', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== 'dev-admin-2025') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.json({
    timestamp: new Date().toISOString(),
    projectSize: '2.5 MB',
    availableBackups: ['complete', 'github', 'replit'],
    includedPaths: {
      complete: ['server', 'config files', 'documentation', 'all assets'],
      github: ['source code', '.gitignore', 'GitHub Actions', 'documentation'],
      replit: ['complete project', '.replit config', 'nix environment']
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backup server running on port ${PORT}`);
});