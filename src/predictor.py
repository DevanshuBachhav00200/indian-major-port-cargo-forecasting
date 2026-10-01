import os
import json
import joblib
import pandas as pd
import numpy as np
from typing import Union, Dict, List

class PortCargoPredictor:
    """
    Production-ready Predictor class for Port Cargo Forecasting.
    Loads saved model and preprocessor artifacts to perform validated predictions.
    """
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            models_dir = os.getenv('MODELS_DIR')
        if not models_dir or not os.path.isabs(models_dir):
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            candidate = os.path.join(base_dir, models_dir if models_dir else 'models')
            if os.path.exists(candidate):
                models_dir = candidate
            elif not models_dir:
                models_dir = 'models'

        self.models_dir = models_dir
        self.model_path = os.path.join(models_dir, 'final_lasso_model.pkl')
        self.preprocessor_path = os.path.join(models_dir, 'final_preprocessor.pkl')
        self.metadata_path = os.path.join(models_dir, 'model_metadata.json')
        
        # Load artifacts
        self._load_artifacts()

    def _load_artifacts(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model artifact not found at {self.model_path}")
        if not os.path.exists(self.preprocessor_path):
            raise FileNotFoundError(f"Preprocessor artifact not found at {self.preprocessor_path}")
        if not os.path.exists(self.metadata_path):
            raise FileNotFoundError(f"Metadata artifact not found at {self.metadata_path}")
            
        self.model = joblib.load(self.model_path)
        self.preprocessor = joblib.load(self.preprocessor_path)
        
        with open(self.metadata_path, 'r', encoding='utf-8') as f:
            self.metadata = json.load(f)
            
        self.scaler = self.preprocessor['scaler']
        self.required_features = self.preprocessor['required_input_features']
        self.encoded_feature_cols = self.preprocessor['encoded_feature_cols']
        self.valid_ports = self.preprocessor['all_ports']
        self.reference_port = self.preprocessor['reference_port']

    def validate_input(self, data_df: pd.DataFrame):
        """
        Validates input DataFrame structure, required feature presence, and valid port names.
        """
        missing = [f for f in self.required_features if f not in data_df.columns]
        if missing:
            raise ValueError(f"Input record is missing required feature(s): {missing}")
            
        # Check for null values
        null_counts = data_df[self.required_features].isnull().sum()
        if null_counts.sum() > 0:
            null_cols = null_counts[null_counts > 0].index.tolist()
            raise ValueError(f"Input data contains null/missing values in column(s): {null_cols}")
            
        # Validate port names
        invalid_ports = [p for p in data_df['port'].unique() if p not in self.valid_ports]
        if invalid_ports:
            raise ValueError(f"Invalid port name(s) detected: {invalid_ports}. Must be one of: {self.valid_ports}")

    def preprocess(self, input_df: pd.DataFrame) -> np.ndarray:
        """
        Preprocesses input DataFrame into encoded, scaled numpy array matching model schema.
        """
        self.validate_input(input_df)
        
        df_proc = input_df.copy()
        
        # One-hot encode port
        for p in self.valid_ports:
            if p != self.reference_port:
                col_name = f"port_{p}"
                df_proc[col_name] = (df_proc['port'] == p).astype(int)
                
        # Select exact 18 encoded feature columns in exact order
        X_encoded = df_proc[self.encoded_feature_cols]
        
        # Apply standard scaling
        X_scaled = self.scaler.transform(X_encoded)
        return X_scaled

    def predict(self, input_record: Union[Dict, List[Dict], pd.DataFrame]) -> Union[float, List[float]]:
        """
        Accepts a dictionary, list of dictionaries, or pandas DataFrame,
        applies validation & preprocessing, and returns predicted cargo traffic (in MT).
        """
        if isinstance(input_record, dict):
            input_df = pd.DataFrame([input_record])
            single_output = True
        elif isinstance(input_record, list):
            input_df = pd.DataFrame(input_record)
            single_output = False
        elif isinstance(input_record, pd.DataFrame):
            input_df = input_record
            single_output = len(input_df) == 1
        else:
            raise ValueError("Input record must be a dict, list of dicts, or pandas DataFrame.")
            
        X_scaled = self.preprocess(input_df)
        predictions = self.model.predict(X_scaled)
        
        if single_output:
            return float(predictions[0])
        return [float(p) for p in predictions]


def get_predictor(models_dir: str = None) -> PortCargoPredictor:
    """Convenience factory function."""
    return PortCargoPredictor(models_dir=models_dir)
