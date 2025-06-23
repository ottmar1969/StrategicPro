# Replit Secrets Configuration

## Required Secrets
Add these in the Replit Secrets tab (Tools > Secrets):

### PERPLEXITY_API_KEY
- **Purpose**: AI consultation with real-time research
- **Get it**: https://www.perplexity.ai/settings/api
- **Format**: pplx-xxxxxxxxxxxxxxxxxxxxxxxxxx
- **Required**: Yes

### SENDGRID_API_KEY (Optional)
- **Purpose**: Admin email notifications
- **Get it**: https://app.sendgrid.com/settings/api_keys
- **Format**: SG.xxxxxxxxxx.xxxxxxxxxxxxxxxxxxx
- **Required**: No

### STRIPE_SECRET_KEY (Optional)
- **Purpose**: Payment processing
- **Get it**: https://dashboard.stripe.com/apikeys
- **Format**: sk_test_xxxxxxxxx or sk_live_xxxxxxxxx
- **Required**: No

### VITE_STRIPE_PUBLIC_KEY (Optional)
- **Purpose**: Frontend payment integration
- **Get it**: https://dashboard.stripe.com/apikeys
- **Format**: pk_test_xxxxxxxxx or pk_live_xxxxxxxxx
- **Required**: No

## How to Add Secrets in Replit

1. Open your Replit project
2. Click "Tools" in the sidebar
3. Select "Secrets"
4. Click "New Secret"
5. Enter key name and value
6. Click "Add Secret"

## Environment Variables (Automatic)
These are set automatically by Replit:
- REPLIT_DB_URL
- REPLIT_DOMAINS
- REPL_ID
- REPL_SLUG
- REPL_OWNER

## Testing Secrets
Use this endpoint to verify secrets are configured:
`GET /health` - Shows which secrets are available

## Security Notes
- Never commit secrets to code
- Use Replit's built-in secrets management
- Rotate API keys regularly
- Monitor usage in respective dashboards
