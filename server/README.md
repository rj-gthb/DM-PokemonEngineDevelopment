## Deploying the Python backend

This folder contains a small Flask API that implements `/api/select_team` and `/api/predict`.

Two quick deployment options are supported:

1) Deploy as a container (recommended)

- Build and push a Docker image, then host on Render, Railway, Google Cloud Run, etc.
- Example (local build):

```bash
docker build -t my-pokemon-backend:latest .
docker run -p 5000:5000 my-pokemon-backend:latest
```

2) Deploy using a Python host (Render with a Python service)

- Connect the repo to Render and point the service to this directory.
- Start command (if not using Docker): `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1`

After deploying, set the frontend environment variable in Vercel:

- `BACKEND_API_BASE_URL` = `https://your-backend-url` (for example `https://my-pokemon-backend.onrender.com`)

Then the Next API proxy at `app/api/select_team/route.js` will forward requests to your deployed backend.

Quick curl test (replace URL):

```bash
curl -X POST https://your-backend-url/api/select_team \
  -H "Content-Type: application/json" \
  -d '{"gymTeam": [], "candidatePool": [], "modelStrategy": "randomForest"}'
```

If you'd like, I can prepare a Render `render.yaml` or deploy config, or help you connect the repo and set the Vercel env var.
