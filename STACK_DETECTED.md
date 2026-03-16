# Stack detection results

## GCP Project
- Project ID: ornate-variety-471919-j3
- Existing services: [Cannot detect: gcloud CLI not found in environment]
- Existing databases: [Cannot detect: gcloud CLI not found in environment]
- Existing secrets: [Cannot detect: gcloud CLI not found in environment]

## Frontend
- Framework: Vite / React
- Build command: `npm run build` (tsc -b && vite build)
- Output directory: `dist`
- Deployment target: Firebase Hosting (per Decision 1: Vite -> Firebase Hosting)

## Backend
- Framework: Vercel Serverless Functions (found in `api/`)
- Entry point: Currently bound to Vercel's proprietary `api/*` routing. Needs an Express wrapper or conversion to Google Cloud Functions.
- Port: N/A (Serverless)
- Deployment target: Cloud Functions (per Decision 2: Serverless functions found -> Cloud Functions) OR Cloud Run if packaged via Express.

## Database
- Type: None (JSON flat files & localStorage currently in use)
- ORM: None detected
- Schema location: `src/data/surah-ground-truth.json`
- Deployment target: Purely client-side + external Auth/Audit APIs (per Decision 3)

## Existing deployment config
- Dockerfiles found: no
- Cloud Build config: no
- Environment files: None detected

## What will be created (does not already exist)
- Firebase Hosting setup
- Cloud Run / Cloud Functions for the Auth/Audit APIs
- Associated IAM and Secret Manager payloads

## What already exists (will be reused)
- Project: ornate-variety-471919-j3
