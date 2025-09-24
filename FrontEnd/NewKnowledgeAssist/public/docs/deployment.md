# Knowledge Assist Dashboard - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Knowledge Curation Dashboard application to various environments.

## Prerequisites

Before deploying, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git** for version control

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/knowledge-assist-dashboard.git
cd knowledge-assist-dashboard
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://your-api-endpoint.com
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

## Development Deployment

### Local Development Server

```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

### Development Build

```bash
npm run build:dev
# or
yarn build:dev
```

## Production Deployment

### 1. Build for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build/` directory.

### 2. Deploy to Static Hosting

#### Netlify Deployment

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod --dir=build
   ```

#### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

#### AWS S3 + CloudFront

1. Build the application:
   ```bash
   npm run build
   ```

2. Upload to S3:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```

3. Invalidate CloudFront cache:
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

### 3. Docker Deployment

#### Dockerfile

```dockerfile
FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Build and Run

```bash
docker build -t knowledge-assist-dashboard .
docker run -p 80:80 knowledge-assist-dashboard
```

#### Docker Compose

```yaml
version: '3.8'
services:
  knowledge-assist:
    build: .
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=https://your-api-endpoint.com
    restart: unless-stopped
```

## Server Configuration

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</VirtualHost>
```

## Environment-Specific Configurations

### Staging Environment

```bash
# .env.staging
REACT_APP_API_URL=https://staging-api.your-domain.com
REACT_APP_ENVIRONMENT=staging
REACT_APP_VERSION=1.0.0-staging
```

### Production Environment

```bash
# .env.production
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## Performance Optimization

### Build Optimization

1. **Code Splitting**: Already implemented with React.lazy()
2. **Bundle Analysis**:
   ```bash
   npm run analyze
   ```

3. **Compression**: Enable gzip/brotli compression on your server

### Caching Strategy

- **Static Assets**: Cache for 1 year
- **HTML**: Cache for 5 minutes
- **API Responses**: Cache based on data freshness requirements

## Monitoring and Analytics

### Health Check Endpoint

Add a health check endpoint for monitoring:

```javascript
// public/health.json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Tracking

Configure error tracking with services like:
- Sentry
- LogRocket
- Bugsnag

## Security Considerations

### HTTPS Configuration

Always use HTTPS in production:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
}
```

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check Node.js version compatibility
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Runtime Errors**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Performance Issues**:
   - Enable compression
   - Optimize images
   - Implement lazy loading

### Logging

Enable application logging:

```javascript
// Add to your app
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.warn = () => {};
  console.error = (error) => {
    // Send to error tracking service
  };
}
```

## Rollback Strategy

### Quick Rollback

1. Keep previous build artifacts
2. Use blue-green deployment
3. Implement feature flags for safe rollbacks

### Database Rollback

If using a backend:
1. Backup database before deployment
2. Use database migration versioning
3. Test rollback procedures in staging

## Support and Maintenance

### Regular Maintenance Tasks

- Update dependencies monthly
- Monitor application performance
- Review and rotate secrets
- Update documentation

### Getting Help

- **Documentation**: Check the project README
- **Issues**: Report bugs on GitHub
- **Support**: Contact the development team

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintained by**: Knowledge Assist Team 