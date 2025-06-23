# ContentScale Platform - Deployment Guide v02

## Quick Deployment Steps

### 1. Replit Deployment
1. Import this backup to new Replit project
2. Install dependencies: `npm install`
3. Set environment variables:
   - PERPLEXITY_API_KEY (required)
   - SENDGRID_API_KEY (optional - for admin emails)
   - STRIPE_SECRET_KEY (optional - for payments)
   - VITE_STRIPE_PUBLIC_KEY (optional - for payments)
4. Run: `npm run dev` or `tsx start.ts`
5. Deploy using Replit's deploy button

### 2. Custom Domain Setup (contentscale.site)
```
DNS Records:
A Record: @ → [Replit deployment IP]
CNAME: www → strategic-pro-biyohes387.replit.app
```

### 3. Environment Variables Setup
Copy from `.env.example` and configure:
```
PERPLEXITY_API_KEY=your_perplexity_key_here
SENDGRID_API_KEY=your_sendgrid_key_here
STRIPE_SECRET_KEY=sk_test_or_live_key
VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_key
```

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
