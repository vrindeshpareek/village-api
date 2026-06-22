# Village API

Production-style SaaS project for standardized Indian village-level geography data. The platform exposes REST APIs, plus an admin dashboard, B2B user portal views, a demo integration client, and Python ETL tools for Excel/CSV source data.

## What Is Included

- Express.js REST API with API-key authentication, rate-limit metadata, OpenAPI docs, and mock-data fallback
- Prisma schema for NeonDB PostgreSQL with normalized country, state, district, sub-district, village, user, API key, and API log tables
- React + Vite dashboard for admin analytics, user management, API logs, village browsing, and B2B portal workflows
- Separate React demo contact form that consumes the autocomplete API
- Python ETL pipeline for validating and importing the MDDS village master list
- Documentation for architecture, examples, dataset validation, team execution, and VS Code commands

## Quick Start In VS Code

Open a terminal in:

```powershell
C:\Users\91950\Documents\village_api
```

Install dependencies and generate Prisma client:

```powershell
npm install
npm run prisma:generate
```

Start the API:

```powershell
npm run dev:api
```

In a second VS Code terminal, start the dashboard:

```powershell
npm run dev:dashboard
```

In a third VS Code terminal, start the demo client:

```powershell
npm run dev:demo
```

Open these URLs:

- API health: `http://localhost:3000/health`
- API docs: `http://localhost:3000/docs`
- Dashboard: `http://localhost:5173`
- Demo client: `http://localhost:5174`

Without `DATABASE_URL`, the API uses built-in Maharashtra sample data so the system works immediately.

## Dataset

Source archive:

```text
C:\Users\91950\Downloads\all-india-villages-master-list-excel.zip
```

Extracted project path:

```text
etl/input/all-india-villages-master-list-excel/dataset/
```

Validate the dataset:

```powershell
npm run etl:setup
npm run etl:dry-run
```

The latest validation found `619,245` import-ready village rows across `30` state/UT files. See [docs/DATASET_REPORT.md](C:/Users/91950/Documents/village_api/docs/DATASET_REPORT.md) for the state-wise summary.

## Default API Headers

```http
X-API-Key: ak_demo_public_key_for_presentations
X-API-Secret: as_demo_secret_for_write_operations
```

Example request:

```powershell
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "http://localhost:3000/v1/autocomplete?q=man"
```

## Build And Verify

```powershell
npm run build
npx tsc -p frontend\tsconfig.json --noEmit
npx tsc -p demo-client\tsconfig.json --noEmit
```

## Deploy

Deployment is prepared for Vercel + NeonDB + Upstash. Follow the copy-paste runbook in [docs/DEPLOYMENT.md](C:/Users/91950/Documents/village_api/docs/DEPLOYMENT.md).

## Project Structure

```text
api/              Express API, middleware, services, routes, OpenAPI spec
frontend/         Admin + B2B dashboard
demo-client/      Public integration demo
prisma/           PostgreSQL schema and seed data
etl/              MDDS data cleaning and import tools
docs/             Architecture, API examples, runbook, team execution notes
```

## Recommended Folder Name

To rename the local folder to match the project name after closing VS Code, run this from `C:\Users\91950\Documents`:

```powershell
Rename-Item "old_folder_name" "village_api"
```
