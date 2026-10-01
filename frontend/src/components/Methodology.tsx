import React from 'react';
import { GitBranch, ShieldCheck, Database, Cpu, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

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
    title: 'Official Data Ingestion',
    category: 'Data Acquisition',
    description: 'Collected annual operational statistics for 11 Indian Major Ports across 15+ fiscal years from Ministry of Ports, Shipping and Waterways research releases.',
    keyOutputs: ['Raw CSV datasets', '165 port-year rows', 'Unified port names']
  },
  {
    step: 2,
    title: 'Data Integration & Cleaning',
    category: 'Preprocessing',
    description: 'Audited 0 missing values, verified physical range constraints (turnaround time >= 0, capacity >= cargo), and enforced chronological sorting.',
    keyOutputs: ['Cleaned dataset', 'Zero null assertion', 'Physical boundary checks']
  },
  {
    step: 3,
    title: 'Feature Engineering',
    category: 'Feature Pipeline',
    description: 'Generated intra-port temporal lag features (cargo_lag_1, output_lag_1..3) and percentage changes (capacity_growth_pct, output_change_pct).',
    keyOutputs: ['Lagged feature matrix', 'Growth indicators', 'Intra-port scope']
  },
  {
    step: 4,
    title: 'Chronological Holdout Split',
    category: 'Evaluation Protocol',
    description: 'Partitioned data temporally into Training set (up to 2022-23) and an Untouched Holdout Test Set (2023-24 to 2024-25).',
    keyOutputs: ['Training Set (85%)', 'Holdout Test (15%)', 'Zero temporal overlap']
  },
  {
    step: 5,
    title: 'Baseline Construction',
    category: 'Benchmarking',
    description: 'Constructed Naive Persistence baseline model (Y_t = Y_t-1) as the minimal performance threshold all ML models must beat.',
    keyOutputs: ['Naive baseline metrics', 'Test MAE: 7.49 MT', 'Test MAPE: 10.19%']
  },
  {
    step: 6,
    title: 'Model Comparison',
    category: 'Model Benchmarking',
    description: 'Evaluated multiple candidate algorithms including Linear Regression, Ridge (L2), Lasso (L1), and PyTorch/Keras LSTM sequence architectures.',
    keyOutputs: ['Candidate models', 'Overfitting diagnosis', 'Regularization rationale']
  },
  {
    step: 7,
    title: 'Hyperparameter Tuning',
    category: 'Model Optimization',
    description: 'Executed 5-fold TimeSeriesSplit hyperparameter grid search over alpha range [0.001, 100.0] for Lasso and Ridge regression.',
    keyOutputs: ['Lasso alpha = 0.0241', 'Ridge alpha = 1.6638', 'Optimized weights']
  },
  {
    step: 8,
    title: 'Walk-Forward Validation',
    category: 'Multi-Period Audit',
    description: 'Evaluated expanding-window temporal walk-forward evaluation across 8 consecutive folds to measure stability over shifting trade cycles.',
    keyOutputs: ['WF Mean MAE: 6.26 MT', 'Multi-year stability', 'Generalization proof']
  },
  {
    step: 9,
    title: 'Final Model Governance',
    category: 'Governance',
    description: 'Selected Tuned Lasso (alpha=0.0241) based on lowest holdout error (MAE 3.15 MT, MAPE 5.25%), strong R² (0.9867), and clear weight interpretability.',
    keyOutputs: ['Final Selection Report', 'Governance audit log']
  },
  {
    step: 10,
    title: 'Production Packaging',
    category: 'Serialization',
    description: 'Serialized fitted Lasso model and StandardScaler preprocessor artifacts into models/, wrapped in FastAPI REST backend and React TypeScript UI.',
    keyOutputs: ['final_lasso_model.pkl', 'FastAPI REST API', 'React Dashboard UI']
  }
];

export const Methodology: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          PORT INTEL / METHODOLOGY
        </div>
        <h1 className="page-title">12-Stage Empirical Research Architecture</h1>
        <p className="page-subtitle">
          Rigorous 12-stage empirical framework designed specifically for macroeconomic maritime cargo forecasting with strict non-leakage guarantees.
        </p>
      </div>

      {/* Visual Pipeline Flow Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: '12px' }}>
          END-TO-END METHODOLOGICAL PIPELINE
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>OFFICIAL DATA</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>DATA INTEGRATION</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>FEATURE ENGINEERING</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>CHRONOLOGICAL SPLIT</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>MODEL COMPARISON</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>HYPERPARAMETER TUNING</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>WALK-FORWARD VALIDATION</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--color-primary-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-primary-border)', color: 'var(--color-primary)' }}>FINAL MODEL DEPLOYMENT</span>
        </div>
      </div>

      {/* Non-Leakage Guarantees Highlight Card */}
      <div className="card" style={{ borderLeft: '4px solid var(--color-success)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldCheck size={20} color="var(--color-success)" />
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>
            Strict Temporal Non-Leakage Protocol
          </h3>
        </div>
        <div className="grid-3">
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-success-text)', fontSize: '0.82rem' }}>1. Preprocessor Scaling Bounds</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
              StandardScaler mean and variance parameters are fitted strictly on training data folds and applied transitively to validation/test folds.
            </p>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-success-text)', fontSize: '0.82rem' }}>2. Intra-Port Lag Boundary</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
              Lags (cargo_lag_1, output_lag_1..3) are computed within each individual port chronologically, preventing cross-port or future-to-past spilling.
            </p>
          </div>
          <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-success-text)', fontSize: '0.82rem' }}>3. Untouched Holdout Test Set</div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.45 }}>
              The final 2 fiscal years (2023-24 to 2024-25) were completely isolated during model training, hyperparameter search, and feature selection.
            </p>
          </div>
        </div>
      </div>

      {/* 10 Pipeline Stages Grid */}
      <div className="grid-3" style={{ marginBottom: '24px' }}>
        {pipelineStages.map((stage) => (
          <div key={stage.step} className="card" style={{ borderTop: '3px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge badge-production" style={{ fontSize: '0.7rem' }}>
                Stage {stage.step}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stage.category}</span>
            </div>
            <h4 style={{ fontSize: '0.92rem', color: 'var(--text-primary)', margin: '0 0 6px 0', fontWeight: 700 }}>{stage.title}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 12px 0', lineHeight: 1.45 }}>{stage.description}</p>
            
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Key Artifacts:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {stage.keyOutputs.map((out, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', background: 'var(--bg-subtle)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                    {out}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Chronological Validation Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Why Chronological Expanding Window Validation?</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          Standard k-fold cross-validation randomly shuffles observations across years, which creates catastrophic temporal data leakage in time-series forecasting. Our framework uses an expanding window walk-forward validation across 8 consecutive forecasting origins. At each fold t, the model is trained exclusively on data available up to year t-1, ensuring the evaluation reflects real-world operational forecasting conditions.
        </p>
      </div>
    </div>
  );
};
