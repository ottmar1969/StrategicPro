# ContentScale Platform

A comprehensive AI-powered content generation platform with advanced fraud protection and flexible pricing models.

## Features

- **Smart Pricing System**: First article free, API key users get 10 free articles, then $1/article with API or $10/article without
- **Advanced Fraud Protection**: VPN/VPS detection, browser fingerprinting, abuse tracking
- **Multiple Payment Options**: Credit packages, pay-per-article, Stripe integration
- **CRAFT Framework**: SEO-optimized content generation methodology
- **Real-time Analytics**: Usage tracking, fraud monitoring, payment analytics

## Quick Start

```bash
# Install dependencies
npm install

# Set required environment variable
export STRIPE_SECRET_KEY=your_stripe_secret_key

# Start development server
npm run dev
```

## Environment Variables

```bash
STRIPE_SECRET_KEY=sk_test_your_key_here  # Required for payments
```

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Payments**: Stripe
- **AI Integration**: Google AI, OpenAI (user-provided)
- **Validation**: Zod schemas
- **State Management**: TanStack Query

## Project Structure

```
client/          # React frontend application
server/          # Express backend API
shared/          # Shared types and schemas
DEPLOYMENT_GUIDE.md  # Complete deployment instructions
```

## API Endpoints

- `POST /api/generate-content` - Generate AI content with fraud protection
- `POST /api/api-keys` - Save user API keys (encrypted)
- `POST /api/create-payment-intent` - Process payments via Stripe
- `GET /api/user/:id` - Get user profile and usage data

## Security Features

- Browser fingerprinting for device identification
- IP-based VPN/VPS detection
- Abuse tracking and rate limiting
- Encrypted API key storage
- Session-based fraud scoring

## Commercial Use

This platform is ready for:
- White label deployment
- Commercial content generation services
- Integration with existing platforms
- Resale to other developers

See `DEPLOYMENT_GUIDE.md` for complete setup and customization instructions.