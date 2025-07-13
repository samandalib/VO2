# Domain and SSL Configuration Guide

## 🌐 Domain Setup Overview

This guide covers setting up custom domains and SSL certificates for your VO₂Max training app across different hosting providers.

## 📋 Domain Architecture

```
Production:
├── https://your-app.com (Frontend - Vercel)
├── https://api.your-app.com (Backend - Railway)
└── https://status.your-app.com (Status page - Optional)

Staging:
├── https://staging.your-app.com (Frontend - Vercel)
└── https://api-staging.your-app.com (Backend - Railway)
```

## 🔧 DNS Configuration

### Primary Domain (your-app.com)

```dns
# A Record (if using A records)
@    A    76.76.19.61    # Vercel IP (check current)

# CNAME Records (recommended)
www  CNAME  your-app.vercel.app.
@    CNAME  your-app.vercel.app.

# API Subdomain
api  CNAME  your-backend.railway.app.

# Staging Subdomains
staging     CNAME  your-app-staging.vercel.app.
api-staging CNAME  your-backend-staging.railway.app.

# Additional subdomains
status      CNAME  your-status-page.statuspage.io.
www.staging CNAME  your-app-staging.vercel.app.
```

### Email and Additional Records

```dns
# Email (if using custom email)
mail    A    your-email-provider-ip
@       MX   10 mail.your-app.com.

# Security and verification
@       TXT  "v=spf1 include:_spf.google.com ~all"
_dmarc  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@your-app.com"

# Domain verification (varies by provider)
@       TXT  "vercel-verification=your-verification-code"
@       TXT  "railway-verification=your-verification-code"
```

## 🔒 SSL Certificate Configuration

### Vercel SSL (Automatic)

Vercel automatically provides SSL certificates via Let's Encrypt:

1. **Add Domain** in Vercel dashboard
2. **Configure DNS** as shown above
3. **SSL is automatic** - no configuration needed

### Railway SSL (Automatic)

Railway also provides automatic SSL:

1. **Add Custom Domain** in Railway dashboard
2. **Point DNS** to Railway
3. **SSL certificate** generated automatically

### Manual SSL (Advanced)

For custom SSL certificates:

```bash
# Generate SSL certificate (Let's Encrypt example)
certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials ~/.secrets/cloudflare.cfg \
  -d your-app.com \
  -d *.your-app.com

# Certificate files will be at:
# /etc/letsencrypt/live/your-app.com/fullchain.pem
# /etc/letsencrypt/live/your-app.com/privkey.pem
```

## 🛠️ Provider-Specific Setup

### Vercel Domain Configuration

1. **Dashboard Setup**:

   ```bash
   # Via CLI
   vercel domains add your-app.com
   vercel domains add www.your-app.com
   vercel domains add staging.your-app.com
   ```

2. **Project Configuration**:
   ```json
   // vercel.json
   {
     "redirects": [
       {
         "source": "/:path*",
         "has": [{ "type": "host", "value": "www.your-app.com" }],
         "destination": "https://your-app.com/:path*",
         "permanent": true
       }
     ]
   }
   ```

### Railway Domain Configuration

1. **Add Domain** in Railway dashboard:

   - Go to your service
   - Settings → Domains
   - Add `api.your-app.com`

2. **Environment Variables**:
   ```bash
   RAILWAY_PUBLIC_DOMAIN=api.your-app.com
   CORS_ORIGIN=https://your-app.com
   ```

### Cloudflare Setup (Recommended)

1. **Add Site** to Cloudflare
2. **Update Nameservers** at your domain registrar
3. **Configure DNS** in Cloudflare dashboard
4. **SSL Settings**:
   - SSL/TLS mode: Full (strict)
   - Edge Certificates: Universal SSL enabled
   - Always Use HTTPS: On

## 🔐 Security Headers Configuration

### Vercel Security Headers

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.your-app.com"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Railway Security Headers

```javascript
// server/middleware/security.js
app.use((req, res, next) => {
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
```

## 🧪 Testing and Validation

### SSL Certificate Testing

```bash
# Test SSL certificate
openssl s_client -connect your-app.com:443 -servername your-app.com

# Check certificate expiration
echo | openssl s_client -connect your-app.com:443 2>/dev/null | openssl x509 -noout -dates

# Test all domains
curl -I https://your-app.com
curl -I https://www.your-app.com
curl -I https://api.your-app.com
curl -I https://staging.your-app.com
```

### DNS Propagation Testing

```bash
# Check DNS propagation
dig your-app.com
dig www.your-app.com
dig api.your-app.com

# Check from different locations
nslookup your-app.com 8.8.8.8
nslookup your-app.com 1.1.1.1
```

### Security Headers Testing

```bash
# Test security headers
curl -I https://your-app.com

# Use online tools
# - securityheaders.com
# - ssllabs.com/ssltest
# - observatory.mozilla.org
```

## 🚨 Troubleshooting

### Common DNS Issues

1. **Propagation Delay**: DNS changes can take 24-48 hours
2. **Caching**: Clear browser/DNS cache
3. **TTL Settings**: Lower TTL before making changes

### SSL Issues

1. **Certificate Mismatch**: Ensure domain matches certificate
2. **Mixed Content**: Use HTTPS for all resources
3. **Chain Issues**: Verify full certificate chain

### Domain Configuration Issues

```bash
# Check domain configuration
vercel domains ls
railway domains

# Remove and re-add domain if needed
vercel domains rm your-app.com
vercel domains add your-app.com
```

## 📊 Monitoring and Maintenance

### Automated Monitoring

```bash
# Create monitoring script
#!/bin/bash
# monitor-domains.sh

DOMAINS=(
  "https://your-app.com"
  "https://api.your-app.com"
  "https://staging.your-app.com"
)

for domain in "${DOMAINS[@]}"; do
  if curl -f "$domain" --max-time 10 >/dev/null 2>&1; then
    echo "✅ $domain is up"
  else
    echo "❌ $domain is down"
    # Send alert
  fi
done
```

### Certificate Renewal

Most hosting providers handle this automatically, but you can monitor:

```bash
# Check certificate expiration
curl -s https://your-app.com 2>/dev/null | openssl x509 -noout -dates
```

## 🔄 Environment-Specific Configuration

### Production Environment

```bash
# Environment variables
DOMAIN=your-app.com
API_DOMAIN=api.your-app.com
CORS_ORIGIN=https://your-app.com
SSL_ENABLED=true
FORCE_HTTPS=true
```

### Staging Environment

```bash
# Environment variables
DOMAIN=staging.your-app.com
API_DOMAIN=api-staging.your-app.com
CORS_ORIGIN=https://staging.your-app.com
SSL_ENABLED=true
FORCE_HTTPS=true
```

## 📋 Checklist

### Domain Setup Checklist

- [ ] Domain purchased and registered
- [ ] DNS configured with hosting providers
- [ ] Custom domains added to Vercel
- [ ] Custom domains added to Railway
- [ ] SSL certificates generated/configured
- [ ] Security headers implemented
- [ ] Redirects configured (www → non-www)
- [ ] All subdomains tested
- [ ] DNS propagation verified
- [ ] SSL certificate chain validated

### Security Checklist

- [ ] HTTPS enforced on all domains
- [ ] Security headers configured
- [ ] Content Security Policy implemented
- [ ] HSTS configured
- [ ] Certificate monitoring set up
- [ ] Domain monitoring configured

## 🎯 Next Steps

After domain and SSL configuration:

1. **Test all endpoints** with custom domains
2. **Update environment variables** with new URLs
3. **Configure monitoring** for uptime and SSL
4. **Set up alerts** for certificate expiration
5. **Update documentation** with new URLs
6. **Inform team** of new domain structure

Ready for the final infrastructure setup tasks! 🚀
