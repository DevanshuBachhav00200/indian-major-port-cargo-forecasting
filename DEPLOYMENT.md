# Indian Major Port Cargo Forecasting & Performance Intelligence System
## Production Deployment Guide

This document provides complete instructions for deploying the Python FastAPI backend and React TypeScript frontend application into a production environment.

---

### 1. Project Architecture

The system consists of two decoupled services:

```
                              ┌─────────────────────────────────────────┐
                              │            React TypeScript             │
                              │           Single Page App               │
                              │   (Vite / Responsive Dashboard UI)      │
                              └────────────────────┬────────────────────┘
                                                   │
                                     HTTP REST API │ VITE_API_BASE_URL
                                                   ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    FastAPI REST Backend                                       │
│                                                                                               │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌────────────────────────────────┐  │
│  │   GET /health         │   │   GET /model-info      │   │   POST /predict                │  │
│  │   GET /analytics/...  │   │   Metadata & Metrics   │   │   Tuned Lasso Model Inference  │  │
│  └───────────────────────┘   └────────────────────────┘   └───────────────┬────────────────┘  │
│                                                                           │                   │
│                                                            Joblib Load    ▼                   │
│                                                  ┌─────────────────────────────────────────┐  │
│                                                  │   Frozen ML Artifacts                   │  │
│                                                  │   - final_lasso_model.pkl (α=0.0241)    │  │
│                                                  │   - final_preprocessor.pkl              │  │
│                                                  │   - model_metadata.json                 │  │
│                                                  └─────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 2. Environment Variables Configuration

#### Backend Environment Variables
Set these variables in your backend hosting environment (or `.env` file):

| Variable | Type | Default | Description |
|---|---|---|---|
| `HOST` | String | `0.0.0.0` | Binding host address for Uvicorn server |
| `PORT` | Integer | `8000` | Listening port for FastAPI backend |
| `CORS_ORIGINS` | String | `*` | Comma-separated list of allowed origin URLs (e.g. `https://your-frontend.com`) |
| `MODELS_DIR` | String | `models` | Directory path containing frozen `.pkl` model artifacts |

#### Frontend Environment Variables
Set this variable before building the frontend bundle (`npm run build`):

| Variable | Type | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | String | `/api` | Base URL of the deployed FastAPI backend (e.g. `https://api.yourdomain.com`) |

---

### 3. Backend Production Setup

#### Prerequisites
* Python 3.10+
* pip & virtualenv

#### Installation Steps
1. Navigate to the project root directory:
   ```bash
   cd PORT_ML_PROJECT
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate    # On Linux/macOS
   # OR
   venv\Scripts\activate       # On Windows PowerShell
   ```

3. Install production dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Verify tests pass cleanly:
   ```bash
   python -m unittest discover tests
   ```

5. Start backend server:
   ```bash
   python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

---

### 4. Frontend Production Setup

#### Prerequisites
* Node.js 18+ & npm

#### Installation & Build Steps
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create production `.env` file:
   ```bash
   echo "VITE_API_BASE_URL=https://api.yourdomain.com" > .env.production
   ```

4. Run production build:
   ```bash
   npm run build
   ```
   * The static production assets will be compiled into `frontend/dist/`.

5. Preview local production build:
   ```bash
   npm run preview
   ```

---

### 5. Serving Frontend via Web Server (Nginx / Static Host)

#### Option A: Deploying `frontend/dist` to Netlify / Vercel / Cloudflare Pages
* Build command: `npm run build`
* Output directory: `dist`
* Environment variable: `VITE_API_BASE_URL=https://api.yourdomain.com`

#### Option B: Serving via Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/port_ml_project/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### 6. Production Health Checks & Regression Benchmark

#### Health Check Endpoint
* **URL**: `GET /health`
* **Expected Response**:
  ```json
  {
    "status": "healthy",
    "model_loaded": true
  }
  ```

#### Model Metadata Endpoint
* **URL**: `GET /model-info`
* **Expected Response**:
  ```json
  {
    "model_name": "Port Cargo Forecasting Lasso Model",
    "model_version": "1.0.0",
    "algorithm": "Lasso Regression",
    "alpha": 0.0241,
    "target_variable": "cargo_next_year_mt"
  }
  ```

#### JNPA Benchmark Regression Test
* **URL**: `POST /predict`
* **Payload**:
  ```json
  {
    "port": "JNPA",
    "capacity_mt": 88.97,
    "capacity_utilization_pct": 96.4,
    "turnaround_time_hr": 28.5,
    "pre_berthing_detention_hr": 9.2,
    "avg_output_per_berth_day_tonnes": 27500,
    "cargo_lag_1": 85.82,
    "capacity_growth_pct": 4.2,
    "output_change_pct": 3.1
  }
  ```
* **Expected Response**:
  ```json
  {
    "port": "JNPA",
    "predicted_cargo_mt": 79.317,
    "target_variable": "cargo_next_year_mt",
    "model_name": "Port Cargo Forecasting Lasso Model",
    "model_version": "1.0.0"
  }
  ```
