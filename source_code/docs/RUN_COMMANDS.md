# VS Code Terminal Commands

Use these commands from the project root:

```powershell
cd "C:\Users\91950\Documents\village_api"
```

## 1. Install And Prepare

```powershell
npm install
npm run prisma:generate
```

## 2. Run Locally

API server:

```powershell
npm run dev:api
```

Admin and B2B dashboard:

```powershell
npm run dev:dashboard
```

Demo client:

```powershell
npm run dev:demo
```

## 3. Open In Browser

```text
http://localhost:3000/health
http://localhost:3000/docs
http://localhost:5173
http://localhost:5174
```

## 4. Test API From Terminal

```powershell
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "http://localhost:3000/v1/states"
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "http://localhost:3000/v1/autocomplete?q=man"
curl.exe -H "X-API-Key: ak_demo_public_key_for_presentations" "http://localhost:3000/v1/search?q=dh&state=Maharashtra"
```

## 5. Validate Dataset

```powershell
npm run etl:setup
npm run etl:dry-run
```

## 6. Build For Submission

```powershell
npm run build
```

## 7. Database Commands

Use these after setting `DATABASE_URL` in `.env`:

```powershell
npm run prisma:push
npm run prisma:seed
npm run etl:dry-run
npm run etl:import
```

## 8. Vercel Commands

Use these after filling `.env.production` and adding the same values in Vercel:

```powershell
npm install -g vercel
vercel login
vercel link
npm run deploy:preview
npm run deploy:prod
```

Full deployment steps are in `docs\DEPLOYMENT.md`.

## 9. Optional Folder Rename

Close VS Code first, then run from `C:\Users\91950\Documents`:

```powershell
Rename-Item "old_folder_name" "village_api"
cd "C:\Users\91950\Documents\village_api"
code .
```
