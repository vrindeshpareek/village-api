# Deployment Runbook

This project is ready for local execution and Vercel deployment. The only values you must provide yourself are account credentials and production secrets.

## Production URLs

```text
Production API: https://api.villageapi.com/v1/
Staging API:    https://staging-api.villageapi.com/v1/
Local API:      http://localhost:3000/v1/
Dashboard:      https://your-vercel-project.vercel.app/
Demo Client:    deploy separately from demo-client/ if required
```

## Required Accounts

- Vercel account for hosting
- Neon account for PostgreSQL
- Upstash account for Redis
- Domain/DNS provider if you want `api.villageapi.com`, `staging-api.villageapi.com`, or `demo.villageapi.com`

## 1. Install CLIs

```powershell
npm install
npm install -g vercel
npm run prisma:generate
```

## 2. Create Production Environment File

```powershell
Copy-Item .env.production.example .env.production
notepad .env.production
```

Fill these values:

```text
DATABASE_URL
REDIS_URL
REDIS_TOKEN
JWT_SECRET
CORS_ORIGINS
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
SMTP_FROM
VITE_API_URL
VITE_API_KEY
```

## 3. NeonDB Setup

Create a Neon project in the Neon console, copy the pooled PostgreSQL connection string, and paste it as `DATABASE_URL`.

Push the schema:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"
npm run prisma:push
```

Seed demo users and keys:

```powershell
npm run prisma:seed
```

Import the MDDS dataset:

```powershell
npm run etl:dry-run
npm run etl:import
```

## 4. Upstash Redis Setup

Create an Upstash Redis database and copy:

```text
REDIS_URL
REDIS_TOKEN
```

The current API runs with in-process rate limits locally and is structured so Redis-backed limits can be enabled through these env vars during production hardening.

## 5. Vercel Preview Deploy

Login and link the project:

```powershell
vercel login
vercel link
```

Add environment variables from `.env.production`:

```powershell
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
vercel env add REDIS_TOKEN production
vercel env add JWT_SECRET production
vercel env add CORS_ORIGINS production
vercel env add ADMIN_EMAIL production
vercel env add ADMIN_PASSWORD_HASH production
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASSWORD production
vercel env add SMTP_FROM production
vercel env add VITE_API_URL production
vercel env add VITE_API_KEY production
```

Deploy preview:

```powershell
npm run deploy:preview
```

Deploy production:

```powershell
npm run deploy:prod
```

## 6. Domain Setup

Add domains in Vercel:

```powershell
vercel domains add api.villageapi.com
vercel domains add staging-api.villageapi.com
```

Then create the DNS records shown by Vercel in your domain provider.

## 7. Production Smoke Tests

Replace the base URL with your deployed URL:

```powershell
curl.exe "https://api.villageapi.com/health"
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "https://api.villageapi.com/v1/autocomplete?q=man"
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "https://api.villageapi.com/v1/states"
```

Expected response envelope:

```json
{
  "success": true,
  "count": 1,
  "data": [],
  "meta": {
    "requestId": "req_xxx",
    "responseTime": 47,
    "rateLimit": {
      "remaining": 4850,
      "limit": 5000,
      "reset": "2026-05-27T00:00:00.000Z"
    }
  }
}
```

## 8. Demo Client Separate Deploy

```powershell
cd demo-client
vercel link
vercel env add VITE_API_URL production
vercel env add VITE_API_KEY production
vercel --prod
cd ..
```

Suggested demo env:

```text
VITE_API_URL=https://api.villageapi.com/v1
VITE_API_KEY=ak_demo_public_key_for_presentations
```
