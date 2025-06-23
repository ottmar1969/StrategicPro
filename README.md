# ContentScale Platform

A comprehensive AI-powered platform combining content generation and business consulting services.

## Features

### Content Generation
- **CRAFT Framework**: SEO-optimized content creation
- **Flexible Pricing**: First article free, $1 with API key, $10 without
- **Credit Packages**: Bulk purchase options with savings
- **Fraud Protection**: Advanced VPN/proxy detection
- **API Integration**: Support for user's own OpenAI/Gemini keys

### Business Consulting
- **12 Categories**: SEO, Strategy, Finance, Marketing, Operations, HR, IT, Legal, Sales, Customer Experience, Sustainability, Cybersecurity
- **AI Analysis**: Google Gemini-powered insights
- **Agent APIs**: Automation endpoints for integration
- **Professional Reports**: Downloadable analysis results

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **AI**: Google Gemini API
- **Security**: Rate limiting, input sanitization, fraud detection

## Quick Start

### Prerequisites
- Node.js 20 or higher
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/contentscale-platform.git
cd contentscale-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables:
```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
export SESSION_SECRET="your_session_secret"
```

4. Start development server:
```bash
npm run dev
```

5. Open browser to `http://localhost:5173`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `SESSION_SECRET` | Secret for session encryption | No (dev default provided) |
| `PORT` | Server port | No (default: 5173) |
| `NODE_ENV` | Environment mode | No (default: development) |

## API Endpoints

### Content Generation
- `POST /api/content/generate` - Generate AI content
- `POST /api/content/api-keys` - Save user API keys
- `POST /api/content/check-eligibility` - Check user status

### Business Consulting  
- `POST /api/consultations` - Create consultation
- `GET /api/consultations` - List consultations
- `GET /api/analysis/:id` - Get analysis results

### Agent Integration
- `GET /api/agent/status` - Platform capabilities
- `POST /api/agent/batch-consultations` - Batch processing
- `GET /api/agent/export-data` - Data export

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── services/           # Business logic
│   ├── routes.ts           # API routes
│   ├── content-routes.ts   # Content API
│   ├── storage.ts          # Data layer
│   └── security.ts         # Security middleware
├── shared/                 # Shared types/schemas
└── dev-server.ts           # Development server
```

## Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run type-check # TypeScript checking
```

### Adding New Features

1. **Content Generation**: Modify `server/services/content-generator.ts`
2. **Consulting Categories**: Update `server/ai-consultant.ts`
3. **UI Components**: Add to `client/src/components/`
4. **API Routes**: Extend `server/routes.ts`

## Security Features

- **Rate Limiting**: 100 requests/15min general, 50/5min for agents
- **Input Sanitization**: XSS protection
- **Fraud Detection**: VPN/proxy detection
- **Session Management**: Secure session handling
- **CORS Protection**: Configured origins

## Deployment

### Production Setup

1. Set production environment variables
2. Build the application:
```bash
npm run build
```
3. Start production server:
```bash
npm run start
```

### Environment Requirements
- Node.js 20+
- 512MB RAM minimum
- 100MB storage
- HTTPS recommended

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## License

This project is available for commercial use, white-labeling, and resale.

## Support

- **Contact**: consultant@contentscale.site
- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues tab

## Changelog

### v1.0.0
- Initial release
- Content generation with CRAFT framework
- Business consulting with 12 categories
- Fraud protection system
- Agent automation APIs
- Integrated pricing model

---

**ContentScale Platform** - AI-powered content generation and business consulting in one unified solution.