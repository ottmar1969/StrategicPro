# GitHub Repository Setup - ContentScale Platform

## Repository Creation
1. Create new GitHub repository: `contentscale-platform`
2. Initialize with README, .gitignore (Node.js template)
3. Set repository to public or private as needed

## Upload Instructions

### Method 1: Direct Upload
1. Download this backup
2. Extract source-code folder
3. Upload all files to GitHub repository
4. Commit message: "ContentScale Platform v02 - Complete backup"

### Method 2: Git Commands
```bash
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform
cp -r /path/to/backup/source-code/* .
git add .
git commit -m "ContentScale Platform v02 - Complete deployment ready"
git push origin main
```

## Repository Structure
```
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
```

## Environment Variables for GitHub Actions (Optional)
If deploying via GitHub Actions:
- PERPLEXITY_API_KEY
- SENDGRID_API_KEY
- STRIPE_SECRET_KEY
- VITE_STRIPE_PUBLIC_KEY

## Branch Strategy
- `main` - Production ready code
- `development` - Active development
- `feature/*` - Feature branches

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
