import React from 'react';
import { Anchor, ShieldAlert, BookOpen, Layers, CheckCircle2, Server, Code, FileSpreadsheet } from 'lucide-react';

export const About: React.FC = () => {
  const coveredPorts = [
    { name: 'Deendayal (Kandla)', state: 'Gujarat', coast: 'West Coast', type: 'Dry & Liquid Bulk Hub' },
    { name: 'JNPA (Jawaharlal Nehru)', state: 'Maharashtra', coast: 'West Coast', type: 'Premier Container Hub' },
    { name: 'Paradip', state: 'Odisha', coast: 'East Coast', type: 'Coal & Mineral Ore Hub' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', coast: 'East Coast', type: 'Deepwater Bulk & Container' },
    { name: 'Mumbai', state: 'Maharashtra', coast: 'West Coast', type: 'Historic General Cargo & Liquid' },
    { name: 'Chennai', state: 'Tamil Nadu', coast: 'East Coast', type: 'Automobile & Container Hub' },
    { name: 'SMP Kolkata / Haldia', state: 'West Bengal', coast: 'East Coast', type: 'Riverine Dual-Dock System' },
    { name: 'V.O. Chidambaranar (Tuticorin)', state: 'Tamil Nadu', coast: 'East Coast', type: 'Container & Power Coal' },
    { name: 'Cochin', state: 'Kerala', coast: 'West Coast', type: 'Transshipment & Liquid Bulk' },
    { name: 'Mormugao', state: 'Goa', coast: 'West Coast', type: 'Iron Ore Export Hub' },
    { name: 'Kamarajar (Ennore)', state: 'Tamil Nadu', coast: 'East Coast', type: 'Corporate Port (Energy & Cars)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
          <div style={{ background: '#1E40AF', padding: '10px', borderRadius: '10px', color: '#FFFFFF' }}>
            <Anchor size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Indian Major Port Cargo Forecasting System</h2>
            <div style={{ color: '#94A3B8', fontSize: '0.88rem', marginTop: '4px' }}>
              Academic & Operational Research Platform for Maritime Infrastructure Intelligence
            </div>
          </div>
        </div>
        <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
          This decision-support platform leverages regularized machine learning (Tuned Lasso Regression, $\alpha=0.0241$) to deliver accurate, non-overfitted annual cargo traffic predictions for India’s major public port authorities. Developed to support evidence-based infrastructure investment and berth utilization optimization under national frameworks like PM Gati Shakti and Maritime India Vision 2030.
        </p>
      </div>

      {/* Coverage Table & Geographic Scope */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <FileSpreadsheet size={20} color="#1E40AF" />
          <h3 style={{ fontSize: '1.1rem', color: '#0F172A', margin: 0, fontWeight: 700 }}>
            Geographic Scope & Port Coverage (11 Major Ports)
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px' }}>
          The machine learning pipeline covers 11 major public port authorities across India’s eastern and western maritime corridors.
        </p>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>Port Authority</th>
              <th>State</th>
              <th>Maritime Coast</th>
              <th>Primary Cargo / Operational Profile</th>
            </tr>
          </thead>
          <tbody>
            {coveredPorts.map((port, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#0F172A' }}>{port.name}</td>
                <td>{port.state}</td>
                <td>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', background: port.coast === 'West Coast' ? '#E0F2FE' : '#FEF3C7', color: port.coast === 'West Coast' ? '#0369A1' : '#B45309' }}>
                    {port.coast}
                  </span>
                </td>
                <td style={{ fontSize: '0.82rem', color: '#334155' }}>{port.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Operational Limitations & Boundaries */}
      <div className="card" style={{ borderLeft: '4px solid #D97706', background: '#FFFBEB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldAlert size={20} color="#D97706" />
          <h3 style={{ fontSize: '1.1rem', color: '#78350F', margin: 0, fontWeight: 700 }}>
            Explicit Model Scope & Academic Boundaries
          </h3>
        </div>
        <div className="grid grid-2" style={{ gap: '16px' }}>
          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>1. Macro-Level Annual Horizon</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#451A03', lineHeight: 1.45 }}>
              The model is calibrated for strategic annual planning and berth capacity budgeting. It is <strong>not</strong> designed for short-term daily berth allocation or real-time vessel dispatch scheduling.
            </p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>2. Structural Continuity Assumption</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#451A03', lineHeight: 1.45 }}>
              Forecasts assume continuity in baseline maritime trade routes and port administrative policies. Sudden structural regime shifts (e.g., brand-new major port openings) require baseline updating.
            </p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>3. Exogenous Shock Boundaries</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#451A03', lineHeight: 1.45 }}>
              Black swan macroeconomic events (unforeseen global pandemics, sudden trade embargos, natural disasters) fall outside historical lag patterns and require manual expert scenario overrides.
            </p>
          </div>
          <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#92400E', fontWeight: 700 }}>4. Non-Causal Coefficient Interpretation</h4>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#451A03', lineHeight: 1.45 }}>
              Fitted Lasso feature weights reflect statistical association and predictive power within the multi-variable regularized framework, not strict causal impact.
            </p>
          </div>
        </div>
      </div>

      {/* System Technical Stack */}
      <div className="card">
        <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '16px' }}>System Architecture & Production Artifacts</h3>
        <div className="grid grid-3">
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#1E40AF', fontWeight: 600, fontSize: '0.85rem' }}>
              <Server size={16} /> FastAPI Backend Engine
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              Python 3.10+, FastAPI REST service running on <code>127.0.0.1:8000</code>. Provides <code>/predict</code> and <code>/analytics</code> endpoints with automated validation via Pydantic.
            </div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#1E40AF', fontWeight: 600, fontSize: '0.85rem' }}>
              <Code size={16} /> React TypeScript Frontend
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              Vite-powered React + TypeScript single page application styled with modern maritime light design system and responsive Recharts analytics dashboards.
            </div>
          </div>
          <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: '#1E40AF', fontWeight: 600, fontSize: '0.85rem' }}>
              <Layers size={16} /> Frozen ML Pipeline Artifacts
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>
              Models serialized via Joblib in <code>models/</code>: <code>final_lasso_model.pkl</code>, <code>final_preprocessor.pkl</code>, and full audit metadata in <code>model_metadata.json</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
