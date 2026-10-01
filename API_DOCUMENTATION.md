# Port Cargo Forecasting & Performance Intelligence API

FastAPI backend API built around the deployed Tuned Lasso Regression Model ($\alpha = 0.0241$) for forecasting next-year cargo traffic across major Indian ports.

---

## 🚀 Quick Start: Running the Server Locally

To start the FastAPI server locally on `http://127.0.0.1:8000`:

```bash
python -m uvicorn src.api.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive Swagger API Documentation will be available at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## 📡 API Endpoints Summary

### 1. `GET /health`
Returns the operational health status of the API service and model loading state.

#### Response Example (`200 OK`):
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

---

### 2. `GET /model-info`
Returns safe production metadata for the deployed forecasting model (without exposing internal filesystem paths).

#### Response Example (`200 OK`):
```json
{
  "model_name": "Port Cargo Forecasting Lasso Model",
  "model_version": "1.0.0",
  "algorithm": "Lasso Regression",
  "alpha": 0.0241,
  "target_variable": "cargo_next_year_mt",
  "training_period": {
    "year_index_range": "3 to 15",
    "target_years": "2007-08 to 2019-20",
    "sample_count": 143
  },
  "evaluation_test_period": {
    "year_index_range": "19 to 20",
    "target_years": "2023-24 to 2024-25",
    "sample_count": 21
  },
  "evaluation_metrics": {
    "test_mae_mt": 3.1463,
    "test_rmse_mt": 4.7013,
    "test_mape_pct": 5.2542,
    "test_r2": 0.9867
  },
  "dataset_description": "Official Indian Ministry of Ports, Shipping and Waterways Research Data (11 Major Ports, 195 Observations)"
}
```

---

### 3. `POST /predict`
Forecasts the upcoming year's total cargo throughput in Million Tonnes (MT) for a major Indian port.

#### Request Body Example (`application/json`):
```json
{
  "port": "JNPA",
  "capacity_mt": 88.97,
  "capacity_utilization_pct": 96.4,
  "turnaround_time_hr": 28.5,
  "pre_berthing_detention_hr": 9.2,
  "avg_output_per_berth_day_tonnes": 27500.0,
  "cargo_lag_1": 85.82,
  "capacity_growth_pct": 4.2,
  "output_change_pct": 3.1
}
```

#### Response Example (`200 OK`):
```json
{
  "port": "JNPA",
  "predicted_cargo_mt": 79.317,
  "target_variable": "cargo_next_year_mt",
  "model_name": "Port Cargo Forecasting Lasso Model",
  "model_version": "1.0.0"
}
```

#### Error Handling (`422 Unprocessable Entity`):
If an invalid port name (e.g. `"InvalidPort"`) or missing feature is sent:
```json
{
  "detail": "Invalid port name(s) detected: ['InvalidPort']. Must be one of: ['Chennai', 'Cochin', 'Deendayal', 'JNPA', 'Kamarajar', 'Mormugao', 'Mumbai', 'New Mangalore', 'Paradip', 'V.O. Chidambaranar', 'Visakhapatnam']"
}
```

---

## 🧪 Running Automated Unit Tests

To run the complete automated test suite (Predictor Unit Tests + FastAPI Endpoint Tests):

```bash
python -m unittest discover tests
```

---

## 🔒 Verification & Compliance

- **No Artifact Modification**: Deployed artifacts in `models/` were kept strictly frozen.
- **Identical Predictions**: The prediction returned by `POST /predict` for JNPA (`79.317 MT`) agrees 100% with `predictor.py`.
