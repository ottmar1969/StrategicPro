# ContentScale Platform

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
```bash
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Run Development Server
```bash
npm run dev
# or
tsx start.ts
```

### 4. Deploy to Replit
1. Import repository to Replit
2. Configure environment variables
3. Click Deploy button

## 🔑 Environment Variables

```env
PERPLEXITY_API_KEY=your_perplexity_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🌐 Domain Setup

### DNS Configuration for contentscale.site
```
A Record: @ → [Replit deployment IP]
CNAME: www → strategic-pro-biyohes387.replit.app
```

## 📊 Admin Access

- **URL**: `/admin/download`
- **Password**: `dev-admin-2025`
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

```
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
```

## 🎯 Key Endpoints

- **Health Check**: `GET /health`
- **Consultations**: `POST /api/consultations`
- **Content Generation**: `POST /api/content/generate`
- **Admin Panel**: `GET /admin/download`

## 🔧 Development

### Adding New Features
1. Create feature branch: `git checkout -b feature/new-feature`
2. Implement changes
3. Test thoroughly
4. Submit pull request

### Database Integration
The platform is ready for PostgreSQL integration. Update `server/storage.ts` to switch from in-memory to persistent storage.

## 🚀 Deployment Options

### Replit (Recommended)
1. Import this repository
2. Configure environment variables
3. Deploy with one click

### Custom Hosting
1. Build: `npm run build`
2. Start: `npm start`
3. Configure reverse proxy (nginx/Apache)

## 📞 Support

- **Contact**: O. Francisca (+31 628073996)
- **Domain**: contentscale.site
- **Repository**: github.com/yourusername/contentscale-platform

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for intelligent business consulting**
