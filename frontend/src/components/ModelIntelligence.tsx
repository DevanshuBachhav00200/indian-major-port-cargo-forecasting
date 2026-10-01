import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Award, CheckCircle2, ShieldCheck, Sliders, TrendingUp, HelpCircle } from 'lucide-react';

interface ModelComparison {
  name: string;
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  wfMae: number;
  wfR2: number;
  status: 'Production' | 'Secondary' | 'Baseline' | 'Experimental / Not Selected';
  notes: string;
}

const comparisonData: ModelComparison[] = [
  {
    name: 'Tuned Lasso (alpha = 0.0241)',
    mae: 3.1463,
    rmse: 4.7013,
    mape: 5.2542,
    r2: 0.9867,
    wfMae: 6.2633,
    wfR2: 0.9129,
    status: 'Production',
    notes: 'Primary Deployed Model: L1 regularization eliminates noise, achieving highest holdout precision.'
  },
  {
    name: 'Tuned Ridge (alpha = 1.6638)',
    mae: 3.5383,
    rmse: 5.0568,
    mape: 5.7140,
    r2: 0.9846,
    wfMae: 5.9236,
    wfR2: 0.9381,
    status: 'Secondary',
    notes: 'Secondary Backup Model: Smooth L2 weight shrinkage with high multi-period stability.'
  },
  {
    name: 'Naive Persistence (Y_t-1)',
    mae: 7.4866,
    rmse: 9.6508,
    mape: 10.1906,
    r2: 0.9441,
    wfMae: 6.7368,
    wfR2: 0.9329,
    status: 'Baseline',
    notes: 'Minimal Performance Threshold: Assumes next-year traffic equals current year.'
  },
  {
    name: 'LSTM Deep Learning (L=3)',
    mae: 14.5264,
    rmse: 19.8131,
    mape: 17.9401,
    r2: 0.7643,
    wfMae: 0,
    wfR2: 0,
    status: 'Experimental / Not Selected',
    notes: 'Experimental Evaluation: Overfitted due to small sample size (N=11 ports, 15 years).'
  }
];

// Exact production coefficients from models/final_lasso_model.pkl
const productionCoefficients = [
  { name: 'capacity_mt', coef: 9.1683, dir: 'Positive', category: 'Physical Scale' },
  { name: 'cargo_lag_1', coef: 7.8999, dir: 'Positive', category: 'Cargo Lag' },
  { name: 'capacity_utilization_pct', coef: 6.4834, dir: 'Positive', category: 'Operational Efficiency' },
  { name: 'port_Deendayal', coef: 5.5601, dir: 'Positive', category: 'Port Fixed Effect' },
  { name: 'port_Paradip', coef: 3.4727, dir: 'Positive', category: 'Port Fixed Effect' },
  { name: 'port_Kamarajar', coef: -2.6501, dir: 'Negative', category: 'Port Fixed Effect' },
  { name: 'port_Mormugao', coef: -2.0755, dir: 'Negative', category: 'Port Fixed Effect' },
  { name: 'port_Visakhapatnam', coef: 1.8649, dir: 'Positive', category: 'Port Fixed Effect' },
  { name: 'port_Cochin', coef: -1.5411, dir: 'Negative', category: 'Port Fixed Effect' },
  { name: 'port_JNPA', coef: 1.5106, dir: 'Positive', category: 'Port Fixed Effect' },
  { name: 'avg_output_per_berth_day_tonnes', coef: 1.4948, dir: 'Positive', category: 'Berth Productivity' },
  { name: 'port_V.O. Chidambaranar', coef: -1.4372, dir: 'Negative', category: 'Port Fixed Effect' },
  { name: 'capacity_growth_pct', coef: 1.1076, dir: 'Positive', category: 'Capacity Expansion' },
  { name: 'port_New Mangalore', coef: -0.9039, dir: 'Negative', category: 'Port Fixed Effect' },
  { name: 'port_Mumbai', coef: 0.8347, dir: 'Positive', category: 'Port Fixed Effect' },
  { name: 'output_change_pct', coef: -0.7817, dir: 'Negative', category: 'Output Change' },
  { name: 'pre_berthing_detention_hr', coef: -0.5616, dir: 'Negative', category: 'Detention Delay' },
  { name: 'turnaround_time_hr', coef: 0.0000, dir: 'Zeroed', category: 'Turnaround Delay' }
];

export const ModelIntelligence: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'comparison' | 'coefficients'>('comparison');

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          PORT INTEL / MODEL
        </div>
        <h1 className="page-title">Model Intelligence & Governance</h1>
        <p className="page-subtitle">
          Empirical evaluation matrix, holdout metrics, and fitted regularized weights for production models.
        </p>
      </div>

      {/* Production Hero Panel - Clean White Card with Subtle Accent */}
      <div className="card" style={{ borderLeft: '4px solid var(--color-primary)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
              <Award size={14} /> PRODUCTION DEPLOYED MODEL
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Tuned Lasso Regression <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>(alpha = 0.0241)</span>
            </h2>
          </div>
          <span className="badge badge-production" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
            Production Deployed
          </span>
        </div>

        {/* Compact Hero Metrics Grid */}
        <div className="grid-4" style={{ gap: '12px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Test MAE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>3.1463 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MT</span></div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Holdout Mean Absolute Error</div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Test RMSE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>4.7013 <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MT</span></div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Root Mean Squared Error</div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Test MAPE</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)' }}>5.25%</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Percentage Forecast Error</div>
          </div>
          <div style={{ background: 'var(--bg-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Test R² Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>0.9867</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Variance Explained Ratio</div>
          </div>
        </div>
      </div>

      {/* Navigation View Switcher */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          className={`btn ${selectedView === 'comparison' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedView('comparison')}
        >
          <TrendingUp size={15} /> Model Comparison Matrix
        </button>
        <button
          className={`btn ${selectedView === 'coefficients' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedView('coefficients')}
        >
          <Sliders size={15} /> Production Lasso Weights
        </button>
      </div>

      {selectedView === 'comparison' ? (
        <>
          {/* Model Comparison Table */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">Empirical Model Comparison Matrix</h3>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Model Architecture</th>
                    <th>Test MAE (MT)</th>
                    <th>Test RMSE (MT)</th>
                    <th>Test MAPE (%)</th>
                    <th>Test R² Score</th>
                    <th>Governance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: row.status === 'Production' ? '#F0F9FF' : 'transparent' }}>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.name}</td>
                      <td style={{ fontWeight: 600 }}>{row.mae.toFixed(4)}</td>
                      <td>{row.rmse.toFixed(4)}</td>
                      <td>{row.mape.toFixed(2)}%</td>
                      <td style={{ fontWeight: 700, color: row.r2 > 0.9 ? 'var(--color-success)' : 'var(--color-danger)' }}>{row.r2.toFixed(4)}</td>
                      <td>
                        <span className={`badge ${row.status === 'Production' ? 'badge-production' : row.status === 'Secondary' ? 'badge-secondary' : row.status === 'Baseline' ? 'badge-baseline' : 'badge-experimental'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Bar Charts Grid */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Holdout MAE Comparison (Lower is Better)</h3>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} label={{ value: 'MAE (MT)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="mae" name="MAE (MT)">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'Production' ? 'var(--color-primary)' : entry.status === 'Secondary' ? 'var(--color-teal)' : entry.status === 'Baseline' ? '#94A3B8' : '#DC2626'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Holdout MAPE Comparison (Lower is Better)</h3>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={10} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} label={{ value: 'MAPE (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="mape" name="MAPE (%)">
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.status === 'Production' ? 'var(--color-primary)' : entry.status === 'Secondary' ? 'var(--color-teal)' : entry.status === 'Baseline' ? '#94A3B8' : '#DC2626'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Walk-Forward Validation Summary */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Multi-Period Walk-Forward Validation Stability</h3>
                <div className="card-subtitle">Expanding window protocol evaluated across 8 chronological forecasting origin folds</div>
              </div>
            </div>

            <div className="grid-3">
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>LASSO WALK-FORWARD MAE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>6.2633 MT</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>8-Fold Expanding Mean</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>RIDGE WALK-FORWARD MAE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>5.9236 MT</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>8-Fold Expanding Mean</div>
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>NAIVE BASELINE WF MAE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>6.7368 MT</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Benchmark Baseline</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Feature Coefficient View */}
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Production Fitted Lasso Coefficients (alpha = 0.0241)</h3>
                <div className="card-subtitle">Exact weights loaded from models/final_lasso_model.pkl and final_preprocessor.pkl</div>
              </div>
            </div>

            <div style={{ height: '380px', marginBottom: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionCoefficients} layout="vertical" margin={{ top: 10, right: 30, left: 160, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                  <XAxis type="number" stroke="var(--text-secondary)" fontSize={11} domain={[-4, 11]} />
                  <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={11} width={150} />
                  <Tooltip formatter={(val: number) => [`${val.toFixed(4)}`, 'Fitted Weight']} />
                  <Bar dataKey="coef" name="Coefficient Weight">
                    {productionCoefficients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.coef > 0 ? 'var(--color-primary)' : entry.coef < 0 ? 'var(--color-danger)' : '#94A3B8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Non-Causal Disclaimer Footnote */}
            <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <HelpCircle size={16} color="var(--color-primary)" />
              <span>Model coefficients indicate model associations/contributions within the multi-variable regularized framework and should not be interpreted as causal effects.</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Feature Name</th>
                  <th>Category</th>
                  <th>Coefficient Weight</th>
                  <th>Direction</th>
                  <th>Physical Meaning</th>
                </tr>
              </thead>
              <tbody>
                {productionCoefficients.map((f, i) => (
                  <tr key={i}>
                    <td>#{i + 1}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}><code>{f.name}</code></td>
                    <td><span className="badge badge-baseline">{f.category}</span></td>
                    <td style={{ fontWeight: 700, color: f.coef > 0 ? 'var(--color-success)' : f.coef < 0 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                      {f.coef > 0 ? `+${f.coef.toFixed(4)}` : f.coef.toFixed(4)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: f.dir === 'Positive' ? 'var(--color-success)' : f.dir === 'Negative' ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                        {f.dir}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {f.name === 'capacity_mt' && 'Primary physical scale indicator: berth capacity (MT).'}
                      {f.name === 'cargo_lag_1' && 'Baseline cargo momentum: prior year throughput.'}
                      {f.name === 'capacity_utilization_pct' && 'Operating intensity: current utilization level.'}
                      {f.name === 'port_Deendayal' && 'Fixed effect premium: West Coast dry/liquid bulk hub.'}
                      {f.name === 'port_Paradip' && 'Fixed effect premium: East Coast mineral/coal bulk hub.'}
                      {f.name === 'port_Kamarajar' && 'Fixed effect baseline adjustment for corporate energy port.'}
                      {f.name === 'port_Mormugao' && 'Fixed effect adjustment for iron ore export policy restrictions.'}
                      {f.name === 'port_Visakhapatnam' && 'Fixed effect premium for deepwater container/bulk hub.'}
                      {f.name === 'port_Cochin' && 'Fixed effect baseline adjustment for transshipment hub.'}
                      {f.name === 'port_JNPA' && 'Fixed effect premium for India\'s premier container port.'}
                      {f.name === 'avg_output_per_berth_day_tonnes' && 'Berth daily output productivity efficiency.'}
                      {f.name === 'port_V.O. Chidambaranar' && 'Fixed effect baseline adjustment for South East Coast hub.'}
                      {f.name === 'capacity_growth_pct' && 'Expansion rate contribution from new infrastructure.'}
                      {f.name === 'port_New Mangalore' && 'Fixed effect baseline adjustment for POL/bulk hub.'}
                      {f.name === 'port_Mumbai' && 'Fixed effect adjustment for general cargo port.'}
                      {f.name === 'output_change_pct' && 'Productivity growth rate adjustment.'}
                      {f.name === 'pre_berthing_detention_hr' && 'Operational delay penalty: vessel waiting time.'}
                      {f.name === 'turnaround_time_hr' && 'Zeroed out by L1 penalty (alpha = 0.0241).'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
