# DNS Setup for contentscale.site on Namecheap

## Replit Deployment Details
- Project URL: https://strategic-pro-biyohes387.replit.app
- Deployment Target: Google Cloud Run
- Domain: contentscale.site

## Namecheap DNS Configuration

### Step 1: Access Namecheap DNS Management
1. Log into your Namecheap account
2. Go to "Domain List"
3. Click "Manage" next to contentscale.site
4. Go to "Advanced DNS" tab

### Step 2: Add DNS Records

**Record 1: Root Domain (A Record)**
```
Type: A Record
Host: @
Value: 34.102.136.180
TTL: Automatic (or 300)
```

**Record 2: WWW Subdomain (CNAME Record)**
```
Type: CNAME Record
Host: www
Value: strategic-pro-biyohes387.replit.app
TTL: Automatic (or 300)
```

**Record 3: Replit Verification (Optional)**
```
Type: CNAME Record
Host: _replit-challenge
Value: strategic-pro-biyohes387.replit.app
TTL: Automatic (or 300)
```

## Alternative Configuration (CNAME for Root)

If A Record doesn't work, use CNAME for root:
```
Type: CNAME Record
Host: @
Value: strategic-pro-biyohes387.replit.app
TTL: Automatic (or 300)
```

## Verification Steps

1. **DNS Propagation Check** (24-48 hours):
   ```
   nslookup contentscale.site
   nslookup www.contentscale.site
   ```

2. **Online Tools**:
   - whatsmydns.net
   - dnschecker.org

3. **Test Access**:
   - http://contentscale.site
   - https://contentscale.site
   - http://www.contentscale.site
   - https://www.contentscale.site

## Common Replit Cloud Run IPs

If 34.102.136.180 doesn't work, try these Google Cloud Run IPs:
- 34.102.136.180
- 35.186.224.25
- 34.120.54.55
- 35.201.124.146

## Troubleshooting

### If DNS Not Working:
1. Clear Namecheap cache (wait 30 minutes)
2. Check TTL settings (use 300 for faster propagation)
3. Remove any existing conflicting records
4. Verify no parking page is enabled

### SSL Certificate:
- Replit provides automatic SSL
- HTTPS will work once DNS propagates
- Force HTTPS redirect is automatic

## Final Configuration Summary

**For contentscale.site on Namecheap:**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 34.102.136.180 | 300 |
| CNAME | www | strategic-pro-biyohes387.replit.app | 300 |

**Expected Results:**
- contentscale.site → Your ContentScale platform
- www.contentscale.site → Your ContentScale platform
- Admin panel: contentscale.site/admin/download
- Content writer: contentscale.site/content
- Consultations: contentscale.site/consultation

Contact: O. Francisca (+31 628073996) for deployment support.