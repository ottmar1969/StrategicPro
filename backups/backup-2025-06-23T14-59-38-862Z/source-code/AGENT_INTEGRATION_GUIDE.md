# Agent Integration Guide - ContentScale Consulting AI App 1

## Quick Start for Agents

### Application Status Check
```bash
curl http://localhost:5173/api/agent/status
```

### Single Consultation Analysis
```bash
curl -X POST http://localhost:5173/api/agent/quick-analysis \
  -H "Content-Type: application/json" \
  -H "x-agent-type: automated-consultant" \
  -d '{
    "category": "seo",
    "title": "Website Traffic Analysis",
    "description": "Organic traffic dropped 40% in last quarter",
    "businessContext": "E-commerce site, 500 products, B2C market",
    "urgency": "high"
  }'
```

### Batch Processing
```bash
curl -X POST http://localhost:5173/api/agent/batch-consultations \
  -H "Content-Type: application/json" \
  -H "x-agent-type: automated-consultant" \
  -d '{
    "consultations": [
      {
        "category": "marketing",
        "title": "Customer Acquisition Strategy",
        "description": "Need to improve conversion rates",
        "businessContext": "SaaS company, B2B market",
        "urgency": "medium"
      }
    ]
  }'
```

### Data Export
```bash
curl http://localhost:5173/api/agent/export-data
```

### Health Monitoring
```bash
curl http://localhost:5173/api/agent/health
```

## Security Headers for Agent Requests
- `x-agent-type: automated-consultant` (identifies as agent)
- `x-api-key: your-key-here` (for write operations)
- `Content-Type: application/json`

## Response Formats
All endpoints return JSON with consistent structure:
- Success: `{status: "success", data: {...}}`
- Error: `{error: "message", details: "..."}`

## Rate Limits
- General API: 100 requests per 15 minutes
- Agent endpoints: 50 requests per 5 minutes

## Categories Available
seo, business-strategy, financial, marketing, operations, human-resources, it-consulting, legal, sales, customer-experience, sustainability, cybersecurity

## Contact
consultant@contentscale.site