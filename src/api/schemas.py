from pydantic import BaseModel, Field
from typing import Dict, Any, List

class PredictionRequest(BaseModel):
    port: str = Field(..., description="Name of the major Indian port (e.g. 'JNPA', 'Paradip', 'Chennai')", example="JNPA")
    capacity_mt: float = Field(..., description="Current year port handling capacity in Million Tonnes (MT)", example=88.97)
    capacity_utilization_pct: float = Field(..., description="Current year capacity utilization percentage (%)", example=96.4)
    turnaround_time_hr: float = Field(..., description="Current year average vessel turnaround time in hours", example=28.5)
    pre_berthing_detention_hr: float = Field(..., description="Current year pre-berthing detention time in hours", example=9.2)
    avg_output_per_berth_day_tonnes: float = Field(..., description="Current year average output per berth day in tonnes", example=27500.0)
    cargo_lag_1: float = Field(..., description="Previous year total cargo throughput in MT (cargo_lag_1)", example=85.82)
    capacity_growth_pct: float = Field(..., description="Annual capacity growth percentage (%)", example=4.2)
    output_change_pct: float = Field(..., description="Berth output annual change percentage (%)", example=3.1)

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }

class PredictionResponse(BaseModel):
    port: str = Field(..., description="Target port name")
    predicted_cargo_mt: float = Field(..., description="Forecasted next-year cargo traffic in Million Tonnes (MT)")
    target_variable: str = Field(..., description="Name of target variable", example="cargo_next_year_mt")
    model_name: str = Field(..., description="Name of deployed forecasting model")
    model_version: str = Field(..., description="Version of deployed model")

class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    model_loaded: bool = Field(..., example=True)

class ModelInfoResponse(BaseModel):
    model_name: str
    model_version: str
    algorithm: str
    alpha: float
    target_variable: str
    training_period: Dict[str, Any]
    evaluation_test_period: Dict[str, Any]
    evaluation_metrics: Dict[str, float]
    dataset_description: str
