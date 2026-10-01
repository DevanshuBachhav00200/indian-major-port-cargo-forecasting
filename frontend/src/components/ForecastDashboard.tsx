import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api/client';
import {
  ArrowRight, TrendingUp, TrendingDown, Layers, Clock, Ship,
  CheckCircle2, BarChart2, AlertCircle, Activity, Play, Zap, HelpCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';

interface ForecastDashboardProps {
  apiHealthy: boolean | null;
}

const VALID_PORTS = [
  { id: 'JNPA', name: 'JNPA', full: 'Jawaharlal Nehru Port Authority' },
  { id: 'Deendayal', name: 'Deendayal', full: 'Deendayal Port Authority (Kandla)' },
  { id: 'Mumbai', name: 'Mumbai', full: 'Mumbai Port Authority' },
  { id: 'Mormugao', name: 'Mormugao', full: 'Mormugao Port Authority' },
  { id: 'New Mangalore', name: 'New Mangalore', full: 'New Mangalore Port Authority' },
  { id: 'Cochin', name: 'Cochin', full: 'Cochin Port Authority' },
  { id: 'V.O. Chidambaranar', name: 'V.O. Chidambaranar', full: 'V.O. Chidambaranar Port Authority (Tuticorin)' },
  { id: 'Chennai', name: 'Chennai', full: 'Chennai Port Authority' },
  { id: 'Kamarajar', name: 'Kamarajar', full: 'Kamarajar Port Authority (Ennore)' },
  { id: 'Visakhapatnam', name: 'Visakhapatnam', full: 'Visakhapatnam Port Authority' },
  { id: 'Paradip', name: 'Paradip', full: 'Paradip Port Authority' }
];

// Default operational state
const INITIAL_STATE = {
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
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    port: string;
    predicted_cargo_mt: number;
    target_variable: string;
    model_name: string;
    model_version: string;
  } | null>({
    port: 'JNPA',
    predicted_cargo_mt: 79.317,
    target_variable: 'cargo_next_year_mt',
    model_name: 'Tuned Lasso Regression',
    model_version: '1.0.0'
  });

  const [historyData, setHistoryData] = useState<any[]>([]);

  // Fetch real historical series from backend
  useEffect(() => {
    fetchPortHistory(formData.port);
  }, [formData.port]);

  const fetchPortHistory = async (port: string) => {
    try {
      const res = await axios.get(getApiUrl(`/analytics/${port}`));
      if (res.data && res.data.history) {
        setHistoryData(res.data.history);
      }
    } catch {
      // Fallback silently if offline
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'port' ? value : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
        setError('Connection timeout. Please verify backend FastAPI service is online.');
      } else {
        setError('FastAPI Backend unavailable. Ensure backend API service is online.');
      }
    } finally {
      setLoading(false);
    }
  };

  const activePortObj = VALID_PORTS.find(p => p.id === formData.port) || VALID_PORTS[0];

  // Calculate delta
  const currentCargo = formData.cargo_lag_1;
  const forecastCargo = result ? result.predicted_cargo_mt : null;
  const deltaVal = (forecastCargo !== null && currentCargo > 0) ? forecastCargo - currentCargo : null;
  const deltaPct = (deltaVal !== null && currentCargo > 0) ? (deltaVal / currentCargo) * 100 : null;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
          FORECAST / PRODUCTION MODEL
        </div>
        <h1 className="page-title">Major Port Cargo Forecasting</h1>
        <p className="page-subtitle">
          AI-powered next-year cargo throughput forecasting using operational and capacity indicators.
        </p>
        <div className="page-meta-pills">
          <span className="meta-pill">11 supported ports</span>
          <span className="meta-pill">Annual forecasting</span>
          <span className="meta-pill">Production ML model</span>
        </div>
      </div>

      {apiHealthy === false && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: '#991B1B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <div>
            <strong>FastAPI Backend Unavailable:</strong> Could not connect to API service. Verify backend availability.
          </div>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: '#991B1B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Two-Column Forecast Workspace Grid (44% / 56%) */}
      <div className="forecast-workspace-grid">
        
        {/* LEFT COLUMN: Forecast Configuration (44%) */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Forecast Configuration</h2>
              <div className="card-subtitle">Configure the latest operating and capacity indicators used by the production forecasting model.</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Target Port Selector */}
            <div style={{ marginBottom: '18px' }}>
              <label className="form-label-compact" style={{ fontWeight: 700 }}>Select Major Port</label>
              <select
                className="form-select-compact"
                value={formData.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
              >
                {VALID_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} Port</option>
                ))}
              </select>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                {activePortObj.full}
              </div>
            </div>

            {/* CAPACITY GROUP */}
            <div className="form-section-header">
              <Layers size={13} /> CAPACITY
            </div>
            <div className="form-grid-compact">
              <div className="form-group-compact">
                <label className="form-label-compact">Port Capacity</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.01"
                    className="form-input-compact"
                    value={formData.capacity_mt}
                    onChange={(e) => handleInputChange('capacity_mt', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">MT</span>
                </div>
              </div>
              <div className="form-group-compact">
                <label className="form-label-compact">Capacity Utilization</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-compact"
                    value={formData.capacity_utilization_pct}
                    onChange={(e) => handleInputChange('capacity_utilization_pct', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">%</span>
                </div>
              </div>
            </div>

            {/* OPERATIONS GROUP */}
            <div className="form-section-header">
              <Clock size={13} /> OPERATIONS
            </div>
            <div className="form-grid-compact">
              <div className="form-group-compact">
                <label className="form-label-compact">Vessel Turnaround Time</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-compact"
                    value={formData.turnaround_time_hr}
                    onChange={(e) => handleInputChange('turnaround_time_hr', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">hrs</span>
                </div>
              </div>
              <div className="form-group-compact">
                <label className="form-label-compact">Pre-Berthing Detention</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-compact"
                    value={formData.pre_berthing_detention_hr}
                    onChange={(e) => handleInputChange('pre_berthing_detention_hr', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">hrs</span>
                </div>
              </div>
            </div>

            {/* PRODUCTIVITY GROUP */}
            <div className="form-section-header">
              <Activity size={13} /> PRODUCTIVITY
            </div>
            <div className="form-grid-compact">
              <div className="form-group-compact" style={{ gridColumn: 'span 2' }}>
                <label className="form-label-compact">Average Output per Berth Day</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="1"
                    className="form-input-compact"
                    value={formData.avg_output_per_berth_day_tonnes}
                    onChange={(e) => handleInputChange('avg_output_per_berth_day_tonnes', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">tonnes/day</span>
                </div>
              </div>
            </div>

            {/* TRAFFIC GROUP */}
            <div className="form-section-header">
              <Ship size={13} /> TRAFFIC
            </div>
            <div className="form-grid-compact" style={{ marginBottom: '20px' }}>
              <div className="form-group-compact" style={{ gridColumn: 'span 2' }}>
                <label className="form-label-compact">Previous-Year Cargo</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.01"
                    className="form-input-compact"
                    value={formData.cargo_lag_1}
                    onChange={(e) => handleInputChange('cargo_lag_1', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">MT</span>
                </div>
              </div>
              <div className="form-group-compact">
                <label className="form-label-compact">Annual Capacity Growth</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-compact"
                    value={formData.capacity_growth_pct}
                    onChange={(e) => handleInputChange('capacity_growth_pct', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">%</span>
                </div>
              </div>
              <div className="form-group-compact">
                <label className="form-label-compact">Berth Output Annual Change</label>
                <div className="input-wrapper-compact">
                  <input
                    type="number"
                    step="0.1"
                    className="form-input-compact"
                    value={formData.output_change_pct}
                    onChange={(e) => handleInputChange('output_change_pct', e.target.value)}
                    required
                  />
                  <span className="input-suffix-compact">%</span>
                </div>
              </div>
            </div>

            {/* Compact Action Row (240px wide, aligned right/bottom) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Ready to forecast • Production model
              </div>
              <button
                type="submit"
                className="btn-forecast-action"
                disabled={loading}
              >
                {loading ? (
                  <span>Executing Model...</span>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    <span>Forecast Cargo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Forecast Output Result Panel (56% - Visual Focal Point) */}
        <div className="result-hero-panel">
          <div className="card-header">
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FORECAST OUTPUT
            </div>
            <div className="status-indicator">
              <span className="dot green pulse" />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-success-text)' }}>Production model</span>
            </div>
          </div>

          {result ? (
            <div>
              <div style={{ margin: '12px 0 20px 0' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  NEXT-YEAR CARGO
                </div>
                <div>
                  <span className="result-value-large">{result.predicted_cargo_mt.toFixed(3)}</span>
                  <span className="result-unit-text">MT</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {activePortObj.name} — Next fiscal year
                </div>
              </div>

              {/* Comparison Flow Widget */}
              <div className="flow-comparison-widget">
                <div className="flow-step">
                  <span className="flow-step-label">CURRENT YEAR</span>
                  <span className="flow-step-val">{currentCargo.toFixed(3)} MT</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ArrowRight size={18} color="var(--text-muted)" />
                  {deltaPct !== null && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: deltaVal! >= 0 ? 'var(--color-success-text)' : 'var(--color-warning-text)' }}>
                      {deltaVal! >= 0 ? '+' : ''}{deltaPct.toFixed(2)}% YoY
                    </span>
                  )}
                </div>

                <div className="flow-step" style={{ textAlign: 'right' }}>
                  <span className="flow-step-label">FORECAST</span>
                  <span className="flow-step-val" style={{ color: 'var(--color-primary)' }}>{result.predicted_cargo_mt.toFixed(3)} MT</span>
                </div>
              </div>

              {/* Metadata Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>MODEL</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{result.model_name}</div>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>ALPHA</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>0.0241</div>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>VERSION</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>v{result.model_version}</div>
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>TEST MAE</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>3.146 MT</div>
                </div>
              </div>

              {/* Footnote Explanation */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--border-subtle)', paddingTop: '10px', lineHeight: 1.4 }}>
                Historical Test MAE is the average absolute error on the held-out test set. It is not a prediction interval.
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <BarChart2 size={36} style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Ready for Model Inference</div>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Click "Forecast Cargo" to run predictions.</p>
            </div>
          )}
        </div>
      </div>

      {/* FORECAST CONTEXT SECTION */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">FORECAST CONTEXT</h3>
            <div className="card-subtitle">Historical cargo throughput and projected next-year value for {activePortObj.name} Port.</div>
          </div>
        </div>

        {historyData.length > 0 ? (
          <div>
            <div style={{ height: '240px', marginBottom: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis dataKey="target_year" stroke="var(--text-secondary)" fontSize={11} />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} label={{ value: 'Cargo (MT)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(val: number) => [`${val.toFixed(2)} MT`, 'Cargo Throughput']} />
                  <Line type="monotone" dataKey="cargo_traffic_mt" name="Historical Cargo (MT)" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                  {result && (
                    <ReferenceDot
                      x={historyData[historyData.length - 1]?.target_year}
                      y={result.predicted_cargo_mt}
                      r={6}
                      fill="var(--color-success)"
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* KPI STRIP */}
            <div className="kpi-grid" style={{ marginBottom: 0 }}>
              <div className="kpi-card">
                <div className="kpi-label">CURRENT CARGO</div>
                <div className="kpi-value">{formData.cargo_lag_1.toFixed(2)}<span className="kpi-unit">MT</span></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">CAPACITY UTILIZATION</div>
                <div className="kpi-value">{formData.capacity_utilization_pct.toFixed(2)}<span className="kpi-unit">%</span></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">TURNAROUND</div>
                <div className="kpi-value">{formData.turnaround_time_hr.toFixed(2)}<span className="kpi-unit">hrs</span></div>
              </div>
              <div className="kpi-card">
                <div className="kpi-label">BERTH OUTPUT</div>
                <div className="kpi-value">{formData.avg_output_per_berth_day_tonnes.toLocaleString()}<span className="kpi-unit">t/day</span></div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Loading historical context series from dataset...
          </div>
        )}
      </div>

      {/* OPERATIONAL SNAPSHOT SECTION (PHASE 11) */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">OPERATIONAL SNAPSHOT</h3>
          <div className="card-subtitle">Current operating intensity and efficiency indicators</div>
        </div>

        <div className="grid-2">
          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <span>Capacity Utilization</span>
              <span style={{ color: 'var(--color-primary)' }}>{formData.capacity_utilization_pct.toFixed(1)}%</span>
            </div>
            <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(formData.capacity_utilization_pct, 100)}%`, height: '100%', background: 'var(--color-primary)' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              Operating near physical capacity ceiling
            </div>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
              <span>Berth Output Rate</span>
              <span style={{ color: 'var(--color-teal)' }}>{formData.avg_output_per_berth_day_tonnes.toLocaleString()} t/day</span>
            </div>
            <div style={{ height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((formData.avg_output_per_berth_day_tonnes / 35000) * 100, 100)}%`, height: '100%', background: 'var(--color-teal)' }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              High-productivity berth handling efficiency
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
