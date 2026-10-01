import os
import sys
import pandas as pd
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Ensure project root directory is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from src.predictor import get_predictor
from src.api.schemas import (
    PredictionRequest,
    PredictionResponse,
    HealthResponse,
    ModelInfoResponse
)

# Initialize FastAPI App
app = FastAPI(
    title="Port Cargo Forecasting & Performance Intelligence API",
    description="Official Indian Ministry of Ports, Shipping & Waterways Cargo Forecasting API",
    version="1.0.0"
)

# Environment Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
raw_cors = os.getenv("CORS_ORIGINS", "*")
cors_origins = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Predictor Instance & Data Cache
models_dir = os.path.join(project_root, 'models')
data_path = os.path.join(project_root, 'data', 'major_port_ml_ready.csv')

try:
    predictor = get_predictor(models_dir=models_dir)
    model_loaded = True
except Exception as e:
    predictor = None
    model_loaded = False
    print(f"Warning: Predictor initialization error: {e}")

# Exception Handler for Predictor Validation Errors
@app.exception_handler(ValueError)
async def value_error_exception_handler(request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc)}
    )

# Static Frontend Mounting (Single-container deployment support)
frontend_dist = os.path.join(project_root, "frontend", "dist")
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    app.mount("/ui", StaticFiles(directory=frontend_dist, html=True), name="frontend_ui")

@app.get("/", summary="Root Endpoint")
async def root():
    return {
        "message": "Port Cargo Forecasting & Performance Intelligence API",
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health", response_model=HealthResponse, summary="API Health Check")
async def health_check():
    return HealthResponse(
        status="healthy",
        model_loaded=model_loaded
    )

@app.get("/model-info", response_model=ModelInfoResponse, summary="Model Metadata Information")
async def get_model_info():
    if not predictor or not model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Forecasting model artifacts are not loaded."
        )
        
    meta = predictor.metadata
    return ModelInfoResponse(
        model_name=meta.get("model_name", "Port Cargo Forecasting Lasso Model"),
        model_version=meta.get("model_version", "1.0.0"),
        algorithm=meta.get("algorithm", "Lasso Regression"),
        alpha=meta.get("alpha", 0.0241),
        target_variable=meta.get("target_variable", "cargo_next_year_mt"),
        training_period=meta.get("training_period", {}),
        evaluation_test_period=meta.get("evaluation_test_period", {}),
        evaluation_metrics=meta.get("evaluation_metrics", {}),
        dataset_description=meta.get("dataset_description", "")
    )

@app.post("/predict", response_model=PredictionResponse, summary="Forecast Next-Year Port Cargo Traffic")
async def predict_cargo(request: PredictionRequest):
    if not predictor or not model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Forecasting model artifacts are not loaded."
        )
        
    input_dict = request.model_dump()
    
    try:
        predicted_val = predictor.predict(input_dict)
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(ve)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction execution failed: {str(exc)}"
        )
        
    meta = predictor.metadata
    return PredictionResponse(
        port=request.port,
        predicted_cargo_mt=round(predicted_val, 3),
        target_variable=meta.get("target_variable", "cargo_next_year_mt"),
        model_name=meta.get("model_name", "Port Cargo Forecasting Lasso Model"),
        model_version=meta.get("model_version", "1.0.0")
    )

# --- READ-ONLY ANALYTICS ENDPOINTS FOR FRONTEND DASHBOARD ---

@app.get("/analytics/ports", summary="Get List of Supported Ports")
async def get_analytics_ports() -> List[str]:
    if predictor:
        return predictor.valid_ports
    return ['Chennai', 'Cochin', 'Deendayal', 'JNPA', 'Kamarajar', 'Mormugao', 'Mumbai', 'New Mangalore', 'Paradip', 'V.O. Chidambaranar', 'Visakhapatnam']

@app.get("/analytics/{port_name}", summary="Get Historical Port Performance Data")
async def get_port_analytics(port_name: str) -> Dict[str, Any]:
    if not os.path.exists(data_path):
        raise HTTPException(status_code=500, detail="Historical dataset file not found.")
        
    df_raw = pd.read_csv(data_path)
    if port_name not in df_raw['port'].unique():
        raise HTTPException(
            status_code=404,
            detail=f"Port '{port_name}' not found. Valid ports: {sorted(df_raw['port'].unique().tolist())}"
        )
        
    port_df = df_raw[df_raw['port'] == port_name].sort_values('year_index').copy()
    
    history_records = []
    for _, row in port_df.iterrows():
        # Cargo throughput in current observation year t = capacity_mt * capacity_utilization_pct / 100
        cargo_actual = round(row['capacity_mt'] * (row['capacity_utilization_pct'] / 100.0), 3)
        history_records.append({
            "year_index": int(row['year_index']),
            "target_year": str(row['target_year']),
            "cargo_traffic_mt": cargo_actual,
            "capacity_mt": round(float(row['capacity_mt']), 2),
            "capacity_utilization_pct": round(float(row['capacity_utilization_pct']), 2),
            "turnaround_time_hr": round(float(row['turnaround_time_hr']), 2),
            "pre_berthing_detention_hr": round(float(row['pre_berthing_detention_hr']), 2),
            "avg_output_per_berth_day_tonnes": int(row['avg_output_per_berth_day_tonnes']),
            "cargo_next_year_mt": round(float(row['cargo_next_year_mt']), 3)
        })
        
    return {
        "port": port_name,
        "total_observations": len(history_records),
        "history": history_records
    }

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("src.api.main:app", host=HOST, port=PORT, reload=False)
