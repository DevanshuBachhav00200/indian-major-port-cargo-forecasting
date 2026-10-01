import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Award, TrendingUp, Sliders, CheckCircle2, FileText } from 'lucide-react';

interface ModelComparison {
  name: string;
  mae: number;
  rmse: number;
  mape: number;
  r2: number;
  wfMae: number;
  wfR2: number;
  status: 'Selected' | 'Secondary' | 'Baseline' | 'Rejected';
  notes: string;
}

const comparisonData: ModelComparison[] = [
  {
    name: 'Tuned Lasso (α=0.0241)',
    mae: 3.1463,
    rmse: 4.7013,
    mape: 5.2542,
    r2: 0.9867,
    wfMae: 6.2633,
    wfR2: 0.9129,
    status: 'Selected',
    notes: 'Primary Production Model: Optimal L1 regularization eliminates noise, highest holdout accuracy.'
  },
  {
    name: 'Tuned Ridge (α=1.6638)',
    mae: 3.5383,
    rmse: 5.0568,
    mape: 5.7140,
    r2: 0.9846,
    wfMae: 5.9236,
    wfR2: 0.9381,
    status: 'Secondary',
    notes: 'Secondary Backup Model: Smooth L2 weight shrinkage, robust multi-fold walk-forward stability.'
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
    notes: 'Baseline Benchmark: Assumes next-year traffic equals current year. Outperformed by tuned ML models.'
  },
  {
    name: 'LSTM Deep Learning (L=3)',
    mae: 14.5264,
    rmse: 19.8131,
    mape: 17.9401,
    r2: 0.7643,
    wfMae: 0,
    wfR2: 0,
    status: 'Rejected',
    notes: 'Rejected: High variance and severe overfitting due to small sample size (N=11 ports, 15 years).'
  }
];

// Exact production coefficients loaded directly from models/final_lasso_model.pkl and final_preprocessor.pkl
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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.2)', padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, color: '#93C5FD', marginBottom: '8px' }}>
              <Award size={14} /> Production Model Selection Audit
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Tuned Lasso Regression (alpha = 0.0241)</h2>
            <p style={{ color: '#94A3B8', marginTop: '4px', fontSize: '0.9rem' }}>
              Selected as primary model after 12-stage validation comparing Linear Baselines, Regularized ML, and Deep Learning (LSTM).
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38BDF8' }}>3.1463 MT</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test MAE</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#4ADE80' }}>5.2542%</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test MAPE</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 18px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#FACC15' }}>0.9867</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test R²</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation View Switcher */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
        <button
          className={`btn ${selectedView === 'comparison' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedView('comparison')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <TrendingUp size={16} /> Model Benchmark Matrix
        </button>
        <button
          className={`btn ${selectedView === 'coefficients' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedView('coefficients')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Sliders size={16} /> Production Model Coefficients
        </button>
      </div>

      {selectedView === 'comparison' ? (
        <>
          {/* Performance Comparison Cards */}
          <div className="grid grid-4">
            {comparisonData.map((m, idx) => (
              <div key={idx} className="card" style={{ borderTop: m.status === 'Selected' ? '4px solid #1E40AF' : m.status === 'Secondary' ? '4px solid #0D9488' : m.status === 'Baseline' ? '4px solid #64748B' : '4px solid #EF4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', background: m.status === 'Selected' ? '#DBEAFE' : m.status === 'Secondary' ? '#CCFBF1' : m.status === 'Baseline' ? '#F1F5F9' : '#FEE2E2', color: m.status === 'Selected' ? '#1E40AF' : m.status === 'Secondary' ? '#0D9488' : m.status === 'Baseline' ? '#475569' : '#DC2626' }}>
                    {m.status}
                  </span>
                  <span className="metric-unit">Test Holdout</span>
                </div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#0F172A', fontWeight: 700 }}>{m.name}</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>MAE</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{m.mae.toFixed(4)} MT</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>MAPE</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{m.mape.toFixed(2)}%</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>RMSE</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{m.rmse.toFixed(4)} MT</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px 8px', borderRadius: '4px' }}>
                    <div style={{ color: '#64748B', fontSize: '0.75rem' }}>R² Score</div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{m.r2.toFixed(4)}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                  {m.notes}
                </p>
              </div>
            ))}
          </div>

          {/* Model Error Bar Chart */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '16px' }}>Untouched Holdout Error Comparison (MAE & MAPE)</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis yAxisId="left" orientation="left" stroke="#1E40AF" label={{ value: 'MAE (MT)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#D97706" label={{ value: 'MAPE (%)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="mae" name="MAE (MT)" fill="#1E40AF" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="mape" name="MAPE (%)" fill="#D97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Matrix Table */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '16px' }}>Full Empirical Benchmark Matrix</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th>Test MAE (MT)</th>
                  <th>Test RMSE (MT)</th>
                  <th>Test MAPE (%)</th>
                  <th>Test R²</th>
                  <th>Walk-Forward Mean MAE</th>
                  <th>Walk-Forward Mean R²</th>
                  <th>Governance Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: row.status === 'Selected' ? '#F0F9FF' : 'transparent' }}>
                    <td style={{ fontWeight: 600, color: '#0F172A' }}>{row.name}</td>
                    <td>{row.mae.toFixed(4)}</td>
                    <td>{row.rmse.toFixed(4)}</td>
                    <td>{row.mape.toFixed(2)}%</td>
                    <td style={{ fontWeight: 600, color: row.r2 > 0.95 ? '#16A34A' : '#DC2626' }}>{row.r2.toFixed(4)}</td>
                    <td>{row.wfMae > 0 ? `${row.wfMae.toFixed(2)} MT` : 'N/A'}</td>
                    <td>{row.wfR2 > 0 ? row.wfR2.toFixed(4) : 'N/A'}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', background: row.status === 'Selected' ? '#DCFCE7' : row.status === 'Secondary' ? '#FEF08A' : row.status === 'Baseline' ? '#E2E8F0' : '#FEE2E2', color: row.status === 'Selected' ? '#15803D' : row.status === 'Secondary' ? '#854D0E' : row.status === 'Baseline' ? '#475569' : '#991B1B' }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Architectural Audit Insight */}
          <div className="grid grid-2">
            <div className="card" style={{ borderLeft: '4px solid #1E40AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle2 color="#1E40AF" size={20} />
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Why Tuned Lasso Outperformed LSTM</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                In annual macro-level maritime forecasting across 11 major ports (165 total observations), deep learning models like LSTM suffer from severe over-parameterization and sequence truncation. Tuned Lasso (L1 penalty) acts as an automatic feature selection mechanism, eliminating spurious noise while enforcing non-zero weights only on physically meaningful capacity, lag, and port fixed-effect features.
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid #0D9488' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <FileText color="#0D9488" size={20} />
                <h4 style={{ margin: 0, fontSize: '1rem', color: '#0F172A' }}>Multi-Period Walk-Forward Stability</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                Evaluating models across 8 expanding temporal folds demonstrated that both Lasso (WF Mean MAE: 6.26 MT) and Ridge (WF Mean MAE: 5.92 MT) consistently beat the Naive Persistence baseline. Lasso was selected as primary due to superior final holdout precision (3.15 MT vs 3.54 MT) and model interpretability.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Feature Coefficient View */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '8px' }}>Production Fitted Lasso Coefficients (alpha = 0.0241)</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Extracted directly from <code>models/final_lasso_model.pkl</code> and <code>models/final_preprocessor.pkl</code>. Weights reflect normalized feature contributions to next-year cargo traffic.
            </p>

            <div style={{ height: '420px', marginBottom: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionCoefficients} layout="vertical" margin={{ top: 10, right: 30, left: 160, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} domain={[-4, 11]} />
                  <YAxis dataKey="name" type="category" stroke="#0F172A" fontSize={11} width={150} />
                  <Tooltip formatter={(val: number) => [`${val.toFixed(4)}`, 'Fitted Weight']} />
                  <Bar dataKey="coef" name="Coefficient Value">
                    {productionCoefficients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.coef > 0 ? '#1E40AF' : entry.coef < 0 ? '#DC2626' : '#94A3B8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Production Feature Name</th>
                  <th>Category</th>
                  <th>Fitted Coefficient</th>
                  <th>Direction</th>
                  <th>Physical & Model Meaning</th>
                </tr>
              </thead>
              <tbody>
                {productionCoefficients.map((f, i) => (
                  <tr key={i}>
                    <td>#{i + 1}</td>
                    <td style={{ fontWeight: 600, color: '#0F172A' }}><code>{f.name}</code></td>
                    <td><span style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>{f.category}</span></td>
                    <td style={{ fontWeight: 700, color: f.coef > 0 ? '#15803D' : f.coef < 0 ? '#DC2626' : '#64748B' }}>
                      {f.coef > 0 ? `+${f.coef.toFixed(4)}` : f.coef.toFixed(4)}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: f.dir === 'Positive' ? '#16A34A' : f.dir === 'Negative' ? '#DC2626' : '#64748B' }}>
                        {f.dir}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {f.name === 'capacity_mt' && 'Primary scale indicator: total physical berth capacity (MT).'}
                      {f.name === 'cargo_lag_1' && 'Baseline cargo momentum: previous year cargo volume.'}
                      {f.name === 'capacity_utilization_pct' && 'Direct operating intensity: current port utilization rate.'}
                      {f.name === 'port_Deendayal' && 'Fixed effect adjustment: high-volume West Coast bulk cargo hub.'}
                      {f.name === 'port_Paradip' && 'Fixed effect adjustment: major East Coast mineral/coal bulk hub.'}
                      {f.name === 'port_Kamarajar' && 'Fixed effect baseline adjustment for corporate energy port.'}
                      {f.name === 'port_Mormugao' && 'Fixed effect adjustment for iron ore export trade restrictions.'}
                      {f.name === 'port_Visakhapatnam' && 'Fixed effect premium for deepwater container/bulk hub.'}
                      {f.name === 'port_Cochin' && 'Fixed effect baseline adjustment for transshipment hub.'}
                      {f.name === 'port_JNPA' && 'Fixed effect premium for India\'s premier container port.'}
                      {f.name === 'avg_output_per_berth_day_tonnes' && 'Berth daily output efficiency contribution.'}
                      {f.name === 'port_V.O. Chidambaranar' && 'Fixed effect baseline adjustment for South East Coast hub.'}
                      {f.name === 'capacity_growth_pct' && 'Expansion rate contribution from new infrastructure.'}
                      {f.name === 'port_New Mangalore' && 'Fixed effect baseline adjustment for West Coast POL hub.'}
                      {f.name === 'port_Mumbai' && 'Fixed effect adjustment for historic general cargo port.'}
                      {f.name === 'output_change_pct' && 'Productivity growth rate adjustment.'}
                      {f.name === 'pre_berthing_detention_hr' && 'Operational congestion penalty: vessel waiting time.'}
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
