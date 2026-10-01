import React from 'react';
import { GitBranch, ShieldCheck, Database, Cpu, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface MethodStage {
  step: number;
  title: string;
  category: string;
  description: string;
  keyOutputs: string[];
}

const pipelineStages: MethodStage[] = [
  {
    step: 1,
    title: 'Data Acquisition & Harmonization',
    category: 'Data Ingestion',
    description: 'Collected annual operational statistics for 11 Indian Major Ports across 15+ fiscal years from Ministry of Ports, Shipping and Waterways releases.',
    keyOutputs: ['Raw CSV datasets', 'Unified port names', '165 port-year rows']
  },
  {
    step: 2,
    title: 'Data Integrity & Quality Audit',
    category: 'Preprocessing',
    description: 'Verified 0 missing values, checked physical boundary constraints (non-negative turnaround time, capacity >= cargo), and audited temporal continuity.',
    keyOutputs: ['Cleaned dataset', 'Zero null validation', 'Range assertion reports']
  },
  {
    step: 3,
    title: 'Exploratory Volatility Assessment',
    category: 'EDA',
    description: 'Analyzed port traffic scale distributions (Deendayal >130 MT vs Kamarajar ~30 MT) and temporal volatility (standard deviation across port size tiers).',
    keyOutputs: ['Port scale tiering', 'Volatility heatmaps', 'Outlier verification']
  },
  {
    step: 4,
    title: 'Feature Engineering & Lag Generation',
    category: 'Feature Pipeline',
    description: 'Constructed temporal lag features (cargo_lag_1, output_lag_1..3) and percentage changes (capacity_growth_pct, output_change_pct) strictly within port boundaries.',
    keyOutputs: ['Lagged feature matrix', 'Growth metrics', 'Zero temporal leakage']
  },
  {
    step: 5,
    title: 'Categorical Encoding & Fixed Effects',
    category: 'Feature Pipeline',
    description: 'Applied One-Hot Encoding to port names to capture unobserved port-specific structural characteristics (geography, hinterland connectivity, draft depth).',
    keyOutputs: ['11 One-hot port indicators', 'Fixed effect predictors']
  },
  {
    step: 6,
    title: 'Temporal Non-Overlapping Split',
    category: 'Evaluation Protocol',
    description: 'Divided historical data chronologically into Train (up to 2022-23) and an Untouched Holdout Test Set (2023-24 to 2024-25).',
    keyOutputs: ['Train dataset (85%)', 'Holdout test set (15%)', 'Strict temporal boundary']
  },
  {
    step: 7,
    title: 'Baseline Construction',
    category: 'Benchmarking',
    description: 'Implemented Naive Persistence baseline model (Y_t = Y_t-1) as the minimal performance threshold all machine learning models must beat.',
    keyOutputs: ['Naive baseline metrics', 'Test MAE: 7.49 MT', 'Test MAPE: 10.19%']
  },
  {
    step: 8,
    title: 'Classical ML Model Tuning',
    category: 'Model Training',
    description: 'Trained Lasso (L1) and Ridge (L2) regression models with 5-fold TimeSeriesSplit hyperparameter search over alpha range [0.001, 100.0].',
    keyOutputs: ['Best Lasso alpha = 0.0241', 'Best Ridge alpha = 1.6638', 'Optimized weights']
  },
  {
    step: 9,
    title: 'Deep Learning Feasibility & LSTM',
    category: 'Deep Learning',
    description: 'Evaluated PyTorch/Keras LSTM sequence architectures (sequence length L=3, 16 units, Dropout 0.2). Tested feasibility on small sample sizes.',
    keyOutputs: ['LSTM Test MAE: 14.53 MT', 'Overfitting diagnosis', 'Academic rejection rationale']
  },
  {
    step: 10,
    title: 'Expanding-Window Walk-Forward Audit',
    category: 'Validation',
    description: 'Executed 8-fold expanding window temporal walk-forward evaluation to measure multi-period stability and generalization across shifting trade cycles.',
    keyOutputs: ['WF Mean MAE: 6.26 MT', 'Multi-year variance logs', 'Temporal robustness proof']
  },
  {
    step: 11,
    title: 'Final Model Governance & Selection',
    category: 'Governance',
    description: 'Selected Tuned Lasso (alpha=0.0241) based on lowest holdout error (MAE 3.15 MT, MAPE 5.25%), strong R² (0.9867), and clear coefficient interpretability.',
    keyOutputs: ['Final selection report', 'Governance documentation']
  },
  {
    step: 12,
    title: 'Production Packaging & Deployment',
    category: 'Production',
    description: 'Serialized fitted Lasso model and StandardScaler preprocessor artifacts into models/, wrapped in FastAPI REST backend and React TypeScript dashboard.',
    keyOutputs: ['final_lasso_model.pkl', 'FastAPI endpoints', 'React dashboard']
  }
];

export const Methodology: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <GitBranch size={24} color="#93C5FD" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>End-to-End Methodological Architecture</h2>
        </div>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
          Our research methodology follows a rigorous 12-stage empirical framework designed specifically for macroeconomic maritime cargo forecasting with strict temporal non-leakage guarantees.
        </p>
      </div>

      {/* Non-Leakage Guarantees Highlight Card */}
      <div className="card" style={{ borderLeft: '4px solid #16A34A', background: '#F0FDF4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#16A34A" />
          <h3 style={{ fontSize: '1.05rem', color: '#14532D', margin: 0, fontWeight: 700 }}>
            Strict Temporal Non-Leakage Protocol
          </h3>
        </div>
        <div className="grid grid-3" style={{ marginTop: '12px' }}>
          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
            <div style={{ fontWeight: 600, color: '#166534', fontSize: '0.85rem' }}>1. Preprocessor Scaling Bounds</div>
            <p style={{ fontSize: '0.8rem', color: '#374151', margin: '4px 0 0 0' }}>
              StandardScaler mean and variance parameters are fitted strictly on training data folds and applied transitively to validation/test folds.
            </p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
            <div style={{ fontWeight: 600, color: '#166534', fontSize: '0.85rem' }}>2. Intra-Port Lag Boundary</div>
            <p style={{ fontSize: '0.8rem', color: '#374151', margin: '4px 0 0 0' }}>
              Lags (cargo_lag_1, output_lag_1..3) are computed within each individual port chronologically, preventing cross-port or future-to-past data spilling.
            </p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
            <div style={{ fontWeight: 600, color: '#166534', fontSize: '0.85rem' }}>3. Untouched Holdout Test Set</div>
            <p style={{ fontSize: '0.8rem', color: '#374151', margin: '4px 0 0 0' }}>
              The final 2 fiscal years (2023-24 to 2024-25) were completely isolated during model training, hyperparameter search, and feature selection.
            </p>
          </div>
        </div>
      </div>

      {/* 12-Stage Pipeline Cards Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', color: '#0F172A', marginBottom: '16px' }}>12-Stage Empirical Research Pipeline</h3>
        <div className="grid grid-3">
          {pipelineStages.map((stage) => (
            <div key={stage.step} className="card" style={{ position: 'relative', borderTop: '3px solid #1E40AF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '2px 8px', borderRadius: '12px' }}>
                  Stage {stage.step}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{stage.category}</span>
              </div>
              <h4 style={{ fontSize: '0.95rem', color: '#0F172A', margin: '0 0 8px 0', fontWeight: 700 }}>{stage.title}</h4>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.45 }}>{stage.description}</p>
              
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>Key Artifacts / Outputs:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {stage.keyOutputs.map((out, idx) => (
                    <span key={idx} style={{ fontSize: '0.72rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>
                      {out}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Walk-Forward Validation Section */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '12px' }}>Expanding Window Walk-Forward Validation Protocol</h3>
        <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
          Rather than relying solely on a single static train/test split, our evaluation pipeline performs an expanding-window walk-forward validation across 8 consecutive forecasting origins. At each fold t, the model is trained exclusively on all observations up to year t-1, and evaluated on year t.
        </p>
        
        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
              <span style={{ width: '80px', fontWeight: 600, color: '#64748B' }}>Fold 1 (2016-17):</span>
              <div style={{ flex: 1, background: '#DBEAFE', padding: '4px 8px', borderRadius: '4px', color: '#1E40AF' }}>Train: 2008-09 → 2015-16</div>
              <ArrowRight size={14} color="#64748B" />
              <div style={{ background: '#FEF08A', padding: '4px 8px', borderRadius: '4px', color: '#854D0E', fontWeight: 600 }}>Test: 2016-17</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
              <span style={{ width: '80px', fontWeight: 600, color: '#64748B' }}>Fold 4 (2019-20):</span>
              <div style={{ flex: 1, background: '#DBEAFE', padding: '4px 8px', borderRadius: '4px', color: '#1E40AF' }}>Train: 2008-09 → 2018-19 (Expanding)</div>
              <ArrowRight size={14} color="#64748B" />
              <div style={{ background: '#FEF08A', padding: '4px 8px', borderRadius: '4px', color: '#854D0E', fontWeight: 600 }}>Test: 2019-20</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
              <span style={{ width: '80px', fontWeight: 600, color: '#64748B' }}>Fold 8 (2023-24):</span>
              <div style={{ flex: 1, background: '#DBEAFE', padding: '4px 8px', borderRadius: '4px', color: '#1E40AF' }}>Train: 2008-09 → 2022-23 (Full Train)</div>
              <ArrowRight size={14} color="#64748B" />
              <div style={{ background: '#DCFCE7', padding: '4px 8px', borderRadius: '4px', color: '#15803D', fontWeight: 700 }}>Holdout Evaluation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
