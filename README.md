# Indian Major Port Cargo Forecasting & Performance Intelligence System

[![Python Backend Tests](https://img.shields.io/badge/Backend%20Tests-12%2F12%20PASSED-success.svg)](#local-testing--verification)
[![Frontend Production Build](https://img.shields.io/badge/Frontend%20Build-0%20Errors-blue.svg)](#local-testing--verification)
[![Model Accuracy](https://img.shields.io/badge/Model%20R%C2%B2-0.9867-brightgreen.svg)](#model-performance-summary)

An evidence-based Machine Learning and Decision Intelligence platform designed to forecast next-year cargo throughput (Million Tonnes, MT) across 11 Major Public Port Authorities in India.

Developed under national logistics frameworks (PM Gati Shakti & Maritime India Vision 2030) using regularized linear machine learning (**Tuned Lasso Regression, $\alpha=0.0241$**).

---

## 🚀 Key Features

* **Interactive Forecast Dashboard**: Predict next-year cargo traffic based on 9 operational input parameters with instant sensitivity analysis and historical test error context.
* **JNPA Benchmark Preset**: One-click JNPA test sample validation yielding **`79.317 MT`**.
* **Port Performance Intelligence**: Historical multi-year operational trend charts (Cargo MT, Capacity, Utilization %, Berth Productivity, Turnaround & Detention Hours).
* **Model Governance & Intelligence**: Holdout benchmark comparison matrix (Lasso vs Ridge vs Naive Baseline vs LSTM) and exact production model feature weights.
* **12-Stage Empirical Methodology**: Comprehensive visual process pipeline and non-leakage protocol documentation.
* **Production-Ready FastAPI Backend**: Validated REST endpoints (`/health`, `/model-info`, `/predict`, `/analytics/{port}`).
* **Responsive React TypeScript UI**: Modern light maritime aesthetic with Recharts analytics components.

---

## 📊 Model Performance Summary

| Metric | Holdout Test Value | Evaluation Note |
|---|---|---|
| **Model Algorithm** | Tuned Lasso Regression ($\alpha=0.0241$) | L1 regularized linear model |
| **Mean Absolute Error (MAE)** | **3.1463 MT** | Average error on untouched holdout set |
| **Root Mean Squared Error (RMSE)** | **4.7013 MT** | Penalty-weighted error metric |
| **Mean Absolute Percentage Error (MAPE)** | **5.2542%** | Relative percentage error |
| **Coefficient of Determination ($R^2$)** | **0.9867** | Variance explained on test set |

---

## 🛠️ Quick Start & Local Execution

### 1. Clone & Set Up Backend

```bash
# Clone the repository
git clone https://github.com/your-username/indian-major-port-cargo-forecasting.git
cd indian-major-port-cargo-forecasting

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate    # On Linux/macOS
# OR: venv\Scripts\activate # On Windows

# Install backend dependencies
pip install -r requirements.txt

# Run backend unit tests
python -m unittest discover tests

# Start FastAPI backend server
python -m uvicorn src.api.main:app --reload --port 8000
```
Backend will be live at `http://127.0.0.1:8000` (Swagger docs at `/docs`).

### 2. Set Up & Run Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Frontend dashboard will be live at `http://localhost:5173`.

---

## 🐳 Docker Deployment

To run the entire system in a single container using Docker:

```bash
# Build and run container
docker-compose up -d --build
```
Access the backend API at `http://localhost:8000/health` and Swagger documentation at `http://localhost:8000/docs`.

For complete production deployment documentation, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## 📜 Project Structure

```text
.
├── DEPLOYMENT.md               # Operational deployment & configuration guide
├── Dockerfile                  # Multi-stage production Docker build file
├── docker-compose.yml          # Container orchestration configuration
├── requirements.txt            # Python backend dependencies
├── data/                       # Official Ministry ML-ready dataset
├── models/                     # Frozen production ML model & preprocessor artifacts
│   ├── final_lasso_model.pkl   # Fitted Tuned Lasso model (alpha = 0.0241)
│   ├── final_preprocessor.pkl  # Fitted StandardScaler & encoded schema
│   └── model_metadata.json     # Model selection metadata & evaluation metrics
├── notebooks/                  # ML experimentation & walk-forward notebooks
├── src/                        # Python backend package
│   ├── predictor.py            # Core predictor module
│   └── api/                    # FastAPI endpoints & schemas
├── tests/                      # Python unittest test suite
└── frontend/                   # React TypeScript Vite frontend UI
```

---

## ⚖️ License & Research Context

Developed as an academic research and decision-support project for Indian Maritime Transport Intelligence. Data sourced from official Ministry of Ports, Shipping and Waterways releases.
