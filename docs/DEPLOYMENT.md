# 🚀 Production Deployment & Operations Guide

This guide is the single source of truth for preparing, deploying, and managing the **GREECE** application in production environments. It covers containerization, hosting platforms, database administration, backups, and disaster recovery.

---

## 📋 Pre-Deployment Checklist

Before triggering a production build, verify that:

- [ ] All unit, integration, and type-checks pass successfully.
- [ ] Production environment configurations (API keys, ports) are secure.
- [ ] Database credentials and SSL parameters are set correctly.
- [ ] No console logs, debug wrappers, or source map exposures exist in client-side production builds.
- [ ] Error-monitoring integrations (e.g., Sentry) are active.
- [ ] Backups are operational and recovery paths verified.

---

## ⚙️ Environment Variables Reference

### Backend API Server (`.env`)

```ini
# Core Environment
PORT=3001
NODE_ENV=production

# Security & Origin Control
CORS_ORIGINS=https://greece-hieroglyphs.com,https://www.greece-hieroglyphs.com

# Stripe Integration (Required for live transactions)
STRIPE_SECRET_KEY=sk_live_your_actual_production_key

# PostgreSQL Connection String
DATABASE_URL=postgresql://db_user:db_secure_password@prod-db-host:5432/greece?sslmode=require
```

### Frontend Storefront (`.env`)

```ini
# Production API endpoint targeting the backend gateway
VITE_API_URL=https://api.greece-hieroglyphs.com
```

### Mobile Client (`greece-mobile/`)

Environment variables in Expo must be prefixed with `EXPO_PUBLIC_` to be compiled into the native application bundle:

```ini
# Production API endpoint targeting the backend gateway
EXPO_PUBLIC_API_URL=https://api.greece-hieroglyphs.com
```

---

## 📦 Containerization & Orchestration

We use Docker to package both frontend and backend packages into isolated containers.

### 1. Backend Dockerfile (`api-server/Dockerfile`)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps
COPY --from=builder /app/dist ./dist
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/index.mjs"]
```

### 2. Frontend Dockerfile (`greece/Dockerfile`)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3. Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./api-server
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      PORT: 3001
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      CORS_ORIGINS: https://greece-hieroglyphs.com
    restart: always

  frontend:
    build:
      context: ./greece
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

To run your orchestrations locally in production mode:
```bash
docker-compose up -d --build
```

---

## 🌐 Hosting & Cloud Infrastructure

### Vercel (Recommended for Frontend Storefront)
Deploy the frontend `greece/` client via Vercel for global edge CDN distribution:
```bash
cd greece
npm install -g vercel
vercel --prod
```
> [!TIP]
> Ensure you configure `VITE_API_URL` under your project's environment variables in the Vercel Dashboard.

### Heroku (Recommended for Express Backend API)
Deploy the Express server package:
```bash
# Create and configure Heroku app
heroku create greece-api
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...

# Push repository to trigger build pipeline
git push heroku main
```

### AWS EC2 Instance Deployment (PM2 + Nginx)
For manual infrastructure management on AWS:

1. **Server Setup**: SSH into your instance and install dependencies:
   ```bash
   ssh -i key.pem ec2-user@your-instance-ip
   curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
   sudo yum install -y nodejs nginx
   ```
2. **Setup API Server & PM2 Process Manager**:
   ```bash
   cd /var/www/greece-hieroglyphs-full/api-server
   npm install --legacy-peer-deps
   npm run build
   npm install -g pm2
   pm2 start dist/index.mjs --name "greece-api"
   pm2 save
   pm2 startup
   ```
3. **Nginx Reverse Proxy Config**: Route public port 80/443 traffic to the backend:
   ```nginx
   server {
       listen 80;
       server_name api.greece-hieroglyphs.com;
       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### DigitalOcean App Platform & Droplets
DigitalOcean's **App Platform** allows direct deployment by connecting your GitHub repo, defining the build output directory for each service component (`greece/dist` for frontend), and exposing target ports (`3001` for backend).

### Expo Application Services (EAS) (Mobile Storefront App)
To compile and submit the mobile application to the Apple App Store and Google Play Store:

1. **Configure EAS CLI**: Install EAS CLI globally and log in to your Expo developer account:
   ```bash
   npm install -g eas-cli
   eas login
   ```
2. **Project Initialization**: Initialize EAS build settings in the mobile workspace:
   ```bash
   cd greece-mobile
   eas build:configure
   ```
   This generates an `eas.json` configuration detailing production and development build profiles.
3. **Execute Production Build**:
   * **For iOS (builds a `.ipa` file or simulator-compatible build)**:
     ```bash
     eas build --platform ios --profile production
     ```
   * **For Android (builds a `.aab` bundle for Google Play)**:
     ```bash
     eas build --platform android --profile production
     ```
   * **For Both Platforms**:
     ```bash
     eas build --platform all --profile production
     ```
4. **Submit to App Stores**:
   You can automatically submit your production builds to Apple App Store Connect and Google Play Console using:
   ```bash
   eas submit --platform all
   ```
5. **Over-The-Air (OTA) Updates via EAS Update**:
   To push rapid JS updates without requiring users to download a new app bundle from the store:
   ```bash
   eas update --branch production --message "Fix mobile cart glassmorphic blur render"
   ```

---

## 🔒 SSL & Security Configuration

### Let's Encrypt Certbot
To secure AWS EC2 or DigitalOcean Droplets with free SSL certificates:
```bash
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d greece-hieroglyphs.com -d www.greece-hieroglyphs.com
```

### AWS Certificate Manager (ACM)
If utilizing AWS Application Load Balancers (ALB) or CloudFront distributions:
1. Request a certificate in the **ACM console**.
2. Add the generated DNS CNAME records to verify domain ownership.
3. Attach the validated SSL certificate to the ALB listener on port 443 or CloudFront distribution.

---

## 💾 Database Production Commands

Once database integrations are active, run migrations and operations:

```bash
# Execute outstanding schema migrations
npm run db:migrate

# Populate production seed tables (e.g. initial clothing catalog)
npm run db:seed

# Roll back the latest migration batch
npm run db:rollback
```

---

## 🔍 Logging & Administration

### Backend Pino Logging
In production, backend logs are output to stdout as structured JSON:
```bash
# View and format PM2 logs
pm2 logs greece-api --json

# Read structured Docker containers logs
docker logs -f greece-backend-1
```

### Compression & Security Headers
* Ensure Express utilizes the `compression` middleware to reduce payload sizes:
  ```typescript
  import compression from 'compression';
  app.use(compression());
  ```
* Leverage `helmet` to set robust security headers:
  ```typescript
  import helmet from 'helmet';
  app.use(helmet());
  ```

---

## 🛡️ Disaster Recovery & Backups

### Automated Database Backups
Schedule daily database dumps via a cron job on your server instance:
```bash
# Dump DB schema and data, compress, and store
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Delete backups older than 30 days
find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### Rollback Protocols
In the event of a deployment failure or data corruption:
* **Code Rollback**: Revert to the last stable git commit and rebuild:
  ```bash
  git revert HEAD
  npm run build
  pm2 restart greece-api
  ```
* **Database Restoration**: Import the latest daily database snapshot:
  ```bash
  gunzip -c /backups/db-YYYYMMDD.sql.gz | psql $DATABASE_URL
  ```
