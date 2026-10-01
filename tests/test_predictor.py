import sys
import os
import unittest
import pandas as pd
import numpy as np

# Ensure project root is in sys.path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from src.predictor import PortCargoPredictor, get_predictor

class TestPortCargoPredictor(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        cls.models_dir = os.path.join(project_root, 'models')
        cls.predictor = PortCargoPredictor(models_dir=cls.models_dir)
        
        # Valid test sample record (e.g. Paradip Port)
        cls.valid_sample = {
            'port': 'Paradip',
            'capacity_mt': 147.89,
            'capacity_utilization_pct': 98.5,
            'turnaround_time_hr': 48.2,
            'pre_berthing_detention_hr': 12.4,
            'avg_output_per_berth_day_tonnes': 31200,
            'cargo_lag_1': 135.36,
            'capacity_growth_pct': 7.5,
            'output_change_pct': 4.2
        }

    def test_artifacts_loading(self):
        """1. Verify model artifacts load correctly."""
        self.assertIsNotNone(self.predictor.model)
        self.assertIsNotNone(self.predictor.scaler)
        self.assertIsNotNone(self.predictor.metadata)
        self.assertEqual(self.predictor.metadata['algorithm'], 'Lasso Regression')
        self.assertEqual(self.predictor.metadata['alpha'], 0.0241)

    def test_prediction_execution_and_numeric_output(self):
        """2. Verify prediction executes successfully and produces a numeric output."""
        prediction = self.predictor.predict(self.valid_sample)
        self.assertIsInstance(prediction, float)
        self.assertFalse(np.isnan(prediction))
        self.assertGreater(prediction, 0.0)
        print(f"\n[TEST PASSED] Single Record Sample Prediction (Paradip): {prediction:.3f} MT")

    def test_batch_dataframe_prediction(self):
        """3. Verify batch DataFrame prediction executes successfully."""
        sample_batch = [
            self.valid_sample,
            {
                'port': 'Cochin',
                'capacity_mt': 50.0,
                'capacity_utilization_pct': 74.5,
                'turnaround_time_hr': 32.1,
                'pre_berthing_detention_hr': 8.5,
                'avg_output_per_berth_day_tonnes': 18500,
                'cargo_lag_1': 36.31,
                'capacity_growth_pct': 2.1,
                'output_change_pct': 1.5
            }
        ]
        df_batch = pd.DataFrame(sample_batch)
        predictions = self.predictor.predict(df_batch)
        self.assertIsInstance(predictions, list)
        self.assertEqual(len(predictions), 2)
        for p in predictions:
            self.assertIsInstance(p, float)
            self.assertGreater(p, 0.0)
        print(f"[TEST PASSED] Batch Prediction Output: {predictions}")

    def test_missing_feature_validation(self):
        """4. Verify missing required feature produces a clear ValueError."""
        invalid_sample = self.valid_sample.copy()
        del invalid_sample['cargo_lag_1']  # Remove required feature
        
        with self.assertRaises(ValueError) as context:
            self.predictor.predict(invalid_sample)
        self.assertIn("missing required feature", str(context.exception))
        print(f"[TEST PASSED] Validation caught missing feature correctly.")

    def test_invalid_port_validation(self):
        """5. Verify invalid port name produces a clear ValueError."""
        invalid_sample = self.valid_sample.copy()
        invalid_sample['port'] = 'NonExistentPort'
        
        with self.assertRaises(ValueError) as context:
            self.predictor.predict(invalid_sample)
        self.assertIn("Invalid port name", str(context.exception))
        print(f"[TEST PASSED] Validation caught invalid port name correctly.")

if __name__ == '__main__':
    unittest.main()
