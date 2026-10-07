# Deployment Guide

This project is a monorepo with separate frontend and backend deployments.

## Frontend (Vite + React)
- **Platform**: Vercel
- **Directory**: `/greece`
- **Config**: `greece/vercel.json`
- **URL**: https://greece.vercel.app

### Deploy to Vercel
1. Connect your GitHub repo to Vercel
2. Set root directory to `greece`
3. Build command: `npm run build`
4. Output directory: `dist`

## Backend (Express + Node)
- **Platform**: Render.com (or alternative)
- **Directory**: `/api-server`
- **Config**: `api-server/render.yaml`

### Why Not Netlify for Backend?
Netlify **does not support** traditional Node.js server applications. It only supports:
- Static sites
- Serverless Functions
- Edge Functions

Your Express backend requires a platform with full Node.js runtime support.

### Deploy to Render.com
1. Create account at https://render.com
2. Connect your GitHub repo
3. Create new Web Service
4. Set name: `greece-api`
5. Set runtime: `Node`
6. Set build command: `npm ci && npm run build`
7. Set start command: `npm run start`
8. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `STRIPE_SECRET_KEY`: Stripe API key
   - `STRIPE_PUBLISHABLE_KEY`: Stripe public key
   - `NODE_ENV`: `production`
9. Deploy

### Alternative Platforms
If you prefer not to use Render, these also support full Node.js:
- **Railway.app** - Great free tier
- **Heroku** - Paid (no free tier anymore)
- **DigitalOcean App Platform** - Good pricing
- **AWS Elastic Beanstalk** - More complex setup
- **Google Cloud Run** - Pay per use
- **Azure App Service** - Pay per use

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@host:port/dbname
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production
PORT=3000
```

## Monorepo Commands

```bash
# Install all dependencies
npm run install:all

# Build backend only
npm run build:api

# Build frontend only
npm run build:frontend

# Build both
npm run build
```
