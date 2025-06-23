# ContentScale Platform - Replit Deployment Guide

## Overview

ContentScale Platform is a comprehensive AI-powered business consulting application that combines content generation capabilities with intelligent business consultation services. The platform provides automated analysis across 12 business categories and includes specialized agent endpoints for automation and integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript for type safety
- **Build Tool**: Vite 6.3 for fast development and optimized builds
- **Styling**: Tailwind CSS 4.1 with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query v5 for server state management
- **Forms**: React Hook Form with Zod schema validation

### Backend Architecture
- **Runtime**: Node.js 20+ with tsx for TypeScript execution
- **Framework**: Express.js with comprehensive middleware stack
- **AI Integration**: Google Gemini API for consultation analysis
- **Storage**: In-memory TypeScript-based storage system (PostgreSQL ready)
- **Security**: Multi-layered security with CORS, rate limiting, input sanitization
- **Session Management**: Express sessions with configurable storage

## Key Components

### 1. AI Consultation System
- **12 Business Categories**: SEO, Strategy, Finance, Marketing, Operations, HR, IT, Legal, Sales, Customer Experience, Sustainability, Cybersecurity
- **Analysis Engine**: Google Gemini AI integration for comprehensive business analysis
- **Consultation Workflow**: Request → Analysis → Report generation with status tracking

### 2. Content Generation Platform
- **CRAFT Framework**: Cut, Review, Add, Fact-check, Trust methodology
- **Multi-Model Support**: Google Gemini, OpenAI, and user-provided API keys
- **Fraud Protection**: Advanced VPN/proxy detection and abuse prevention
- **Pricing System**: Free tier, credit packages, and pay-per-article options

### 3. Agent Automation APIs
- **Batch Processing**: Handle multiple consultations simultaneously
- **Quick Analysis**: Single-step consultation and analysis generation
- **Data Export**: Complete data extraction capabilities
- **Health Monitoring**: Real-time status and performance metrics

### 4. Security Layer
- **Input Validation**: Zod schema validation for all inputs
- **Rate Limiting**: Configurable limits per endpoint and user type
- **CORS Protection**: Environment-specific origin restrictions
- **Admin Authentication**: Protected administrative endpoints

## Data Flow

1. **User Request** → Form validation → Security checks → Storage
2. **AI Processing** → Gemini API call → Analysis generation → Result storage
3. **Response Delivery** → Format results → Return to client → Update status
4. **Agent Integration** → Batch processing → Automated workflows → Export capabilities

## External Dependencies

### Required APIs
- **Google Gemini AI**: Primary AI consultation engine
- **Perplexity API**: Enhanced research capabilities (optional)

### Optional Integrations
- **SendGrid**: Email notifications and admin communications
- **Stripe**: Payment processing for content generation
- **OpenAI/Claude**: Alternative AI models for content generation

### Development Dependencies
- **TypeScript**: Type safety and development experience
- **Vite**: Development server and build tooling
- **ESLint/Prettier**: Code quality and formatting

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 with Python 3.11 support
- **Ports**: 3000, 5000, 5173, and 24678 (mapped to 80)
- **Deployment Target**: Google Cloud Run for production
- **Custom Domain**: contentscale.site with DNS configuration

### Environment Variables
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key
PERPLEXITY_API_KEY=your_perplexity_key

# Optional
SENDGRID_API_KEY=your_sendgrid_key
STRIPE_SECRET_KEY=your_stripe_key
SESSION_SECRET=your_session_secret
```

### Startup Process
1. Health check endpoints for deployment verification
2. Dependency installation and type checking
3. Security middleware initialization
4. API route registration
5. Agent endpoint activation
6. Production server startup on port 5173

### Backup and Recovery
- **Multiple Backup Systems**: Comprehensive, GitHub, and Replit-specific backups
- **Admin Access**: Protected download endpoints with authentication
- **Package Export**: Complete application packages for replication
- **Data Export**: JSON exports of all stored data

## Recent Changes

- **June 23, 2025**: Enhanced keyword research system with Google AI Mode and AI Overview optimization
  - Added Perplexity API integration for real-time fact-checking and online investigation
  - Implemented AI Overview trigger potential scoring for keywords
  - Added Google AI Mode compatibility scoring for titles (1-10 scale)
  - Enhanced content outlines with featured snippet sections and FAQ optimization
  - Integrated question-based content structure for AI parsing
  - Added conversational search pattern optimization

## Changelog

- June 23, 2025. Initial setup
- June 23, 2025. Google AI optimization implementation

## User Preferences

Preferred communication style: Simple, everyday language.