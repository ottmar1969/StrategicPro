# GitHub Repository Setup Guide

## Quick GitHub Deployment

Follow these steps to get your ContentScale platform on GitHub:

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** button → **"New repository"**
3. Repository name: `contentscale-platform`
4. Description: `AI-powered content generation and business consulting platform`
5. Set to **Public** or **Private** (your choice)
6. **Don't** initialize with README (we have one)
7. Click **"Create repository"**

### 2. Push Your Code

Open terminal in your ContentScale directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: ContentScale Platform v1.0.0

- AI content generation with CRAFT framework
- Business consulting with 12 categories
- Fraud protection and security features
- Agent automation APIs
- Integrated pricing model"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/contentscale-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username**

### 3. Set Up Environment Variables

If using GitHub Actions or Vercel deployment:

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SESSION_SECRET`: Random secret (generate with `openssl rand -base64 32`)

### 4. Repository Structure

Your GitHub repository will contain:

```
contentscale-platform/
├── README.md              # Project documentation
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── Dockerfile             # Docker deployment
├── docker-compose.yml     # Multi-service deployment
├── deploy.sh              # Deployment script
├── DEPLOYMENT.md          # Deployment guide
├── client/                # Frontend React app
├── server/                # Backend Express API
├── shared/                # Shared TypeScript types
└── dev-server.ts          # Development server
```

### 5. Auto-Deployment Options

#### Option A: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. In your repository: `vercel --prod`
3. Follow prompts to connect GitHub
4. Set environment variables in Vercel dashboard

#### Option B: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy ContentScale Platform

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
    
    - name: Deploy to production
      # Add your deployment steps here
      run: echo "Deploy to your server"
```

#### Option C: Railway

1. Connect your GitHub repository to [Railway](https://railway.app)
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### 6. Clone and Run Locally

Anyone can now clone and run your platform:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/contentscale-platform.git
cd contentscale-platform

# Install dependencies
npm install

# Set environment variables
export GEMINI_API_KEY="your_key_here"

# Start development server
npm run dev
```

### 7. Repository Management

#### Branching Strategy
```bash
# Create feature branch
git checkout -b feature/new-content-type

# Make changes, commit
git add .
git commit -m "Add new content type support"

# Push feature branch
git push origin feature/new-content-type

# Create pull request on GitHub
```

#### Releases
```bash
# Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 8. GitHub Features to Enable

1. **Issues**: For bug reports and feature requests
2. **Wiki**: For detailed documentation
3. **Discussions**: For community support
4. **Security**: Enable vulnerability alerts
5. **Insights**: Monitor repository activity

### 9. License and Legal

The repository includes:
- Commercial license for business use
- White-label rights for resale
- Full source code access
- Documentation for customization

### 10. Sharing Your Repository

Once published, share your repository:

- **Repository URL**: `https://github.com/YOUR_USERNAME/contentscale-platform`
- **Live Demo**: Deploy and share the URL
- **Documentation**: Point users to README.md

## Need Help?

If you encounter issues:
1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
2. Review GitHub's documentation
3. Contact: consultant@contentscale.site

Your ContentScale platform is now ready for GitHub and the world to see!