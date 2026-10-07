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
- **Platform**: Vercel (as Serverless Functions)
- **Directory**: `/api-server`

### Deploy to Vercel
1. Vercel can host Express applications via Serverless Functions. Make sure your project's routing allows `/api/*` requests to hit the backend entry point.
2. Add environment variables in the Vercel project settings:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `STRIPE_SECRET_KEY`: Stripe API key
   - `STRIPE_PUBLISHABLE_KEY`: Stripe public key
   - `NODE_ENV`: `production`

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
