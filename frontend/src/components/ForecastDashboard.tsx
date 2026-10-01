import React, { useState } from 'react';
import axios from 'axios';
import { Play, RotateCcw, AlertCircle, TrendingUp, Cpu, Server, CheckCircle2 } from 'lucide-react';
import { getApiUrl } from '../api/client';

interface ForecastDashboardProps {
  apiHealthy: boolean | null;
}

const VALID_PORTS = [
  'Deendayal',
  'Mumbai',
  'JNPA',
  'Mormugao',
  'New Mangalore',
  'Cochin',
  'V.O. Chidambaranar',
  'Chennai',
  'Kamarajar',
  'Visakhapatnam',
  'Paradip'
];

const JNPA_PRESET = {
  port: 'JNPA',
  capacity_mt: 88.97,
  capacity_utilization_pct: 96.4,
  turnaround_time_hr: 28.5,
  pre_berthing_detention_hr: 9.2,
  avg_output_per_berth_day_tonnes: 27500,
  cargo_lag_1: 85.82,
  capacity_growth_pct: 4.2,
  output_change_pct: 3.1
};

export const ForecastDashboard: React.FC<ForecastDashboardProps> = ({ apiHealthy }) => {
  const [formData, setFormData] = useState(JNPA_PRESET);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    port: string;
    predicted_cargo_mt: number;
    target_variable: string;
    model_name: string;
    model_version: string;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'port' ? value : parseFloat(value) || 0
    }));
  };

  const handleLoadPreset = () => {
    setFormData(JNPA_PRESET);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(getApiUrl('/predict'), formData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      setResult(response.data);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(`API Error (422): ${err.response.data.detail}`);
      } else if (err.code === 'ECONNABORTED') {
        setError('Connection timeout. Please verify backend FastAPI server is running on 127.0.0.1:8000.');
      } else {
        setError('FastAPI Backend unavailable. Ensure server is running (`python -m uvicorn src.api.main:app --reload`).');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
            Indian Major Port Cargo Forecasting
          </h1>
          <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '4px' }}>
            Machine Learning based next-year cargo traffic forecasting for India's major ports using operational and capacity indicators.
          </p>
        </div>

        {apiHealthy === false && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <div>
              <strong>FastAPI Backend Unavailable:</strong> Could not connect to `http://127.0.0.1:8000`. Please start the server (`python -m uvicorn src.api.main:app --port 8000`).
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Port Selection Section */}
          <div style={{ marginBottom: '24px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.95rem', color: '#1E293B', fontWeight: 700 }}>
                Select Major Port Target (11 Supported Ports)
              </label>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleLoadPreset}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RotateCcw size={14} />
                <span>Load JNPA Benchmark Preset</span>
              </button>
            </div>

            <select
              className="form-select"
              style={{ width: '100%', fontSize: '1rem', fontWeight: 600, padding: '12px', backgroundColor: '#FFFFFF' }}
              value={formData.port}
              onChange={(e) => handleInputChange('port', e.target.value)}
            >
              {VALID_PORTS.map((p) => (
                <option key={p} value={p}>
                  {p} Port
                </option>
              ))}
            </select>
          </div>

          {/* Operational Parameters Grid */}
          <div style={{ marginBottom: '16px', fontWeight: 700, fontSize: '1rem', color: '#1E293B' }}>
            Operational & Capacity Parameters
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Port Capacity (Million Tonnes, MT)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.capacity_mt}
                onChange={(e) => handleInputChange('capacity_mt', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capacity Utilization (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.capacity_utilization_pct}
                onChange={(e) => handleInputChange('capacity_utilization_pct', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Vessel Turnaround Time (Hours)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.turnaround_time_hr}
                onChange={(e) => handleInputChange('turnaround_time_hr', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pre-Berthing Detention (Hours)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.pre_berthing_detention_hr}
                onChange={(e) => handleInputChange('pre_berthing_detention_hr', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Output per Berth Day (Tonnes)</label>
              <input
                type="number"
                step="1"
                className="form-input"
                value={formData.avg_output_per_berth_day_tonnes}
                onChange={(e) => handleInputChange('avg_output_per_berth_day_tonnes', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Previous-Year Cargo Volume (MT)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.cargo_lag_1}
                onChange={(e) => handleInputChange('cargo_lag_1', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Annual Capacity Growth (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.capacity_growth_pct}
                onChange={(e) => handleInputChange('capacity_growth_pct', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Berth Output Annual Change (%)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.output_change_pct}
                onChange={(e) => handleInputChange('output_change_pct', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginTop: '28px' }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>Predicting with FastAPI Backend...</span>
              ) : (
                <>
                  <Play size={18} />
                  <span>Forecast Next-Year Cargo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Prominent Prediction Result Card */}
      {result && (
        <div className="result-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <CheckCircle2 size={18} />
            <span>Official Prediction Result ({result.port} Port)</span>
          </div>

          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>Forecasted Next-Year Total Cargo Throughput:</div>
            <div className="result-value">
              {result.predicted_cargo_mt.toFixed(3)} <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>MT</span>
            </div>
          </div>

          <div className="result-meta">
            <div className="meta-item">
              <span className="meta-label">Selected Port</span>
              <span className="meta-val">{result.port}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Model Deployed</span>
              <span className="meta-val">{result.model_name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Model Version</span>
              <span className="meta-val">v{result.model_version}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Historical Test MAE</span>
              <span className="meta-val">3.146 MT</span>
            </div>
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic', borderTop: '1px dashed #E2E8F0', paddingTop: '8px' }}>
            MAE represents the model's average absolute error on the held-out test set. It is not a prediction interval.
          </div>
        </div>
      )}
    </div>
  );
};
