import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure project root directory is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from src.api.main import app

class TestFastAPIEndpoints(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.jnpa_sample = {
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

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertTrue(data["model_loaded"])

    def test_model_info_endpoint(self):
        response = self.client.get("/model-info")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["algorithm"], "Lasso Regression")
        self.assertEqual(data["alpha"], 0.0241)

    def test_predict_valid_jnpa_request(self):
        response = self.client.post("/predict", json=self.jnpa_sample)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["port"], "JNPA")
        self.assertAlmostEqual(data["predicted_cargo_mt"], 79.317, delta=0.01)

    def test_predict_invalid_port_error(self):
        invalid_sample = self.jnpa_sample.copy()
        invalid_sample["port"] = "InvalidPortName"
        response = self.client.post("/predict", json=invalid_sample)
        self.assertEqual(response.status_code, 422)

    def test_predict_missing_field_error(self):
        missing_sample = self.jnpa_sample.copy()
        del missing_sample["cargo_lag_1"]
        response = self.client.post("/predict", json=missing_sample)
        self.assertEqual(response.status_code, 422)

    def test_analytics_ports_endpoint(self):
        response = self.client.get("/analytics/ports")
        self.assertEqual(response.status_code, 200)
        ports = response.json()
        self.assertEqual(len(ports), 11)
        self.assertIn("JNPA", ports)

    def test_analytics_port_history_endpoint(self):
        response = self.client.get("/analytics/JNPA")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["port"], "JNPA")
        self.assertGreater(data["total_observations"], 0)
        self.assertIn("cargo_traffic_mt", data["history"][0])

if __name__ == '__main__':
    unittest.main()
