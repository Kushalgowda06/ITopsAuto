# Deployment Guide - Knowledge Assist Dashboard

This guide provides comprehensive instructions for deploying the Knowledge Assist Dashboard in various environments.

## 🚀 Quick Deployment Options

### 1. Netlify (Recommended - Free)

**Pros**: Free hosting, automatic SSL, continuous deployment, global CDN
**Best for**: Small to medium applications

```bash
# Build the project
npm run build

# Option A: Drag & Drop
# 1. Go to https://app.netlify.com/drop
# 2. Drag the 'build' folder to the deployment area

# Option B: Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Custom Domain Setup**:
1. Go to Site settings > Domain management
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Vercel (Recommended - Free)

**Pros**: Excellent performance, automatic SSL, serverless functions
**Best for**: Modern web applications

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Or connect GitHub repository at https://vercel.com
```

### 3. AWS S3 + CloudFront

**Pros**: Scalable, cost-effective, enterprise-grade
**Best for**: Production applications with traffic

```bash
# Build the project
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload build files
aws s3 sync build/ s3://your-bucket-name --delete

# Create CloudFront distribution (via AWS Console)
```

### 4. GitHub Pages

**Pros**: Free for public repos, version control integration
**Best for**: Open source projects, documentation

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
{
  "homepage": "https://yourusername.github.io/knowledge-assist-dashboard",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}

# Deploy
npm run deploy
```

## 🐳 Docker Deployment

### Local Docker

```bash
# Build image
docker build -t knowledge-assist .

# Run container
docker run -p 80:80 knowledge-assist

# Or use docker-compose
docker-compose up -d
```

### Docker Hub

```bash
# Tag image
docker tag knowledge-assist yourusername/knowledge-assist:latest

# Push to Docker Hub
docker push yourusername/knowledge-assist:latest
```

### Production Docker

```bash
# Production docker-compose
version: '3.8'
services:
  app:
    image: yourusername/knowledge-assist:latest
    ports:
      - "80:80"
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(\`yourdomain.com\`)"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
```

## ☁️ Cloud Platform Deployment

### Google Cloud Platform

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Initialize project
gcloud init

# Deploy to Cloud Run
gcloud run deploy knowledge-assist \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Microsoft Azure

```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login
az login

# Create resource group
az group create --name myResourceGroup --location eastus

# Deploy to Container Instances
az container create \
  --resource-group myResourceGroup \
  --name knowledge-assist \
  --image yourusername/knowledge-assist:latest \
  --ports 80 \
  --ip-address public
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Deploy
git push heroku main
```

## 🔧 Environment Configuration

### Environment Variables

Create `.env.production` file:

```env
REACT_APP_TITLE=Knowledge Assist Dashboard
REACT_APP_VERSION=1.0.0
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ANALYTICS_ID=GA_MEASUREMENT_ID
GENERATE_SOURCEMAP=false
```

### Build Optimization

```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Optimize build
npm run build -- --analyze
```

## 🔒 Security Configuration

### SSL/TLS Setup

**Nginx Configuration** (`nginx-ssl.conf`):

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
}
```

### Let's Encrypt SSL

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring and Analytics

### Google Analytics

Add to `public/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

Add to `src/index.js`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm test -- --coverage --watchAll=false

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=build --site=$NETLIFY_SITE_ID
  only:
    - main
```

## 🎯 Performance Optimization

### Service Worker (PWA)

```bash
# Install workbox
npm install workbox-webpack-plugin
```

### CDN Configuration

**CloudFlare Settings**:
- Cache Level: Standard
- Browser Cache TTL: 4 hours
- Always Online: On
- Minification: HTML, CSS, JS

### Image Optimization

```bash
# Install image optimization tools
npm install --save-dev imagemin imagemin-webp
```

## 🔍 Health Checks

### Basic Health Check

Create `public/health.json`:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2023-12-07T10:00:00Z"
}
```

### Docker Health Check

Add to `Dockerfile`:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health.json || exit 1
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache
   npm run build -- --reset-cache
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Memory Issues**
   ```bash
   # Increase Node.js memory
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

3. **Routing Issues (404 on refresh)**
   - Ensure server configuration handles client-side routing
   - Check nginx/apache configuration for `try_files`

4. **SSL Issues**
   ```bash
   # Check certificate
   openssl x509 -in certificate.crt -text -noout
   
   # Test SSL
   openssl s_client -connect yourdomain.com:443
   ```

### Debug Mode

```bash
# Enable debug mode
REACT_APP_DEBUG=true npm start

# Analyze bundle
npm run build -- --analyze
```

## 📋 Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] All routes work (test navigation)
- [ ] Search functionality works
- [ ] Voice recognition works (HTTPS required)
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] SSL certificate is valid
- [ ] Performance metrics are acceptable
- [ ] Error tracking is configured
- [ ] Analytics are working
- [ ] Backup strategy is in place

## 📞 Support

If you encounter issues during deployment:

1. Check the application logs
2. Verify all environment variables
3. Test locally with production build
4. Review network and DNS settings
5. Contact support with detailed error messages

---

**Happy Deploying! 🚀** 