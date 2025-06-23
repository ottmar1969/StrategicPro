# ContentScale Consulting AI App - Deployment Guide

## Application Name
**ContentScale Consulting AI App 1**

## Agent Integration Features
This application is specifically designed for seamless integration with AI agents:

### Agent Endpoints
- `GET /api/agent/status` - Application status and capabilities
- `POST /api/agent/batch-consultations` - Process multiple consultations
- `GET /api/agent/export-data` - Export all data for analysis
- `POST /api/agent/quick-analysis` - Single-step analysis generation
- `GET /api/agent/health` - Health monitoring

### Security Features
- API key validation for write operations
- Rate limiting (100 requests/15min, 50 agent requests/5min)
- CORS protection with agent-friendly origins
- Input sanitization and XSS protection
- Security headers for enhanced protection

### Backup & Export
- Automated backup script: `node backup-script.js`
- Complete data export via agent API
- Downloadable consultation reports

## Environment Variables Required
```
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
PORT=5173
```

## Quick Start
1. Extract backup files
2. Install dependencies: `npm install`
3. Set environment variables
4. Run: `tsx dev-server.ts`
5. Access: http://localhost:5173

## Agent Authentication
For agent access, include header:
```
x-agent-type: automated-consultant
x-api-key: your-api-key-here
```

## Contact
consultant@contentscale.site