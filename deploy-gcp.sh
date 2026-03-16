#!/bin/bash
set -e

# ==========================================
# HIFZ JOURNEY - GCP DEPLOYMENT SCRIPT
# Execute this file from your authenticated
# terminal to deploy the application.
# ==========================================

export PROJECT_ID=gen-lang-client-0144128710
export PROJECT_NUMBER=1023943268533
export REGION=us-central1
export SA=hifz-run-sa@$PROJECT_ID.iam.gserviceaccount.com
export IMAGE_BASE=$REGION-docker.pkg.dev/$PROJECT_ID/hifz-journey

echo "→ Configuring gcloud project..."
gcloud config set project $PROJECT_ID

gcloud projects describe $PROJECT_ID >/dev/null || {
  echo "✗ Cannot access project $PROJECT_ID — check permissions or authenticate using 'gcloud auth login'"
  exit 1
}

# 1. Enable APIs
echo "→ Enabling necessary GCP APIs..."
REQUIRED_APIS=(
  run.googleapis.com
  storage.googleapis.com
  secretmanager.googleapis.com
  artifactregistry.googleapis.com
  iam.googleapis.com
)
for api in "${REQUIRED_APIS[@]}"; do
  gcloud services enable "$api"
done

# 2. Artifact Registry
echo "→ Ensuring Artifact Registry exists..."
EXISTING_REPO=$(gcloud artifacts repositories list --location=$REGION --format="value(name)" 2>/dev/null | grep hifz || true)
if [ -z "$EXISTING_REPO" ]; then
  gcloud artifacts repositories create hifz-journey \
    --repository-format=docker \
    --location=$REGION
fi
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

# 3. Service Account
echo "→ Ensuring Service Account exists..."
EXISTING_SA=$(gcloud iam service-accounts list --format="value(email)" | grep hifz-run-sa || true)
if [ -z "$EXISTING_SA" ]; then
  gcloud iam service-accounts create hifz-run-sa --display-name="Hifz Journey Cloud Run SA"
  for role in roles/secretmanager.secretAccessor; do
    gcloud projects add-iam-policy-binding $PROJECT_ID \
      --member="serviceAccount:$SA" --role="$role" --quiet
  done
fi

# 4. Build & Push Backend Container via Cloud Build
echo "→ Building Cloud Run Backend Container on Google Cloud Build..."
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")

cat > cloudbuild.api.yaml << EOF
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', '\$_IMAGE_BASE/api:\$COMMIT_SHA', '-t', '\$_IMAGE_BASE/api:latest', '-f', 'Dockerfile.api', '.']
images:
- '\$_IMAGE_BASE/api:\$COMMIT_SHA'
- '\$_IMAGE_BASE/api:latest'
EOF

gcloud builds submit --config cloudbuild.api.yaml --substitutions=_IMAGE_BASE=$IMAGE_BASE,COMMIT_SHA=$GIT_SHA .


# 5. Deploy Cloud Run
echo "→ Deploying Backend to Cloud Run..."
gcloud run deploy hifz-api \
  --image=$IMAGE_BASE/api:latest \
  --platform=managed \
  --region=$REGION \
  --service-account=$SA \
  --set-env-vars="NODE_ENV=production,PROJECT_ID=$PROJECT_ID" \
  --min-instances=0 \
  --max-instances=5 \
  --memory=512Mi \
  --allow-unauthenticated

API_URL=$(gcloud run services describe hifz-api --region=$REGION --format='value(status.url)')
echo "✓ API deployed: $API_URL"

# 6. Build Frontend
echo "→ Building Vite frontend..."
npm run build

# 7. Deploy Firebase Hosting
echo "→ Deploying frontend to Firebase Hosting..."
# Check for firebase tools
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

firebase use --add $PROJECT_ID || firebase use $PROJECT_ID
firebase deploy --only hosting --project $PROJECT_ID

echo ""
echo "═══════════════════════════════════════════"
echo " DEPLOYMENT COMPLETE"
echo " API: $API_URL"
echo " Please ensure all Secrets mapped in your original prompt"
echo " (e.g., ADMIN_EMAILS, GOOGLE_CLIENT_ID) are populated manually"
echo " in Google Cloud Secret Manager if you plan to bind them."
echo "═══════════════════════════════════════════"
