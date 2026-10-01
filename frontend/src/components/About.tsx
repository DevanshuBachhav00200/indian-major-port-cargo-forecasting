import React from 'react';
import { Anchor, ShieldAlert, BookOpen, Layers, CheckCircle2, Server, Code, FileSpreadsheet, ArrowRight } from 'lucide-react';

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

  const techStack = [
    { name: 'Python 3.10+', category: 'Language' },
    { name: 'Scikit-learn', category: 'Machine Learning' },
    { name: 'Tuned Lasso (α=0.0241)', category: 'Core Algorithm' },
    { name: 'FastAPI', category: 'REST API Framework' },
    { name: 'React 18', category: 'Frontend UI' },
    { name: 'TypeScript', category: 'Type Safety' },
    { name: 'Vite 5', category: 'Build Tool' },
    { name: 'Recharts', category: 'Analytics Visualization' },
    { name: 'Render', category: 'API Cloud Hosting' },
    { name: 'Vercel', category: 'UI Cloud Hosting' }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
          PORT INTEL / ABOUT
        </div>
        <h1 className="page-title">PORT INTEL ML</h1>
        <p className="page-subtitle">
          Indian Major Port Cargo Forecasting & Performance Intelligence System
        </p>
      </div>

      {/* Hero Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div className="brand-icon-wrapper">
            <Anchor size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Research & Decision Intelligence Platform</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Data source: Ministry of Ports, Shipping & Waterways Transport Research
            </div>
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
          This decision-support platform leverages regularized machine learning (Tuned Lasso Regression, $\alpha=0.0241$) to deliver non-overfitted annual cargo traffic predictions for India’s major public port authorities. Developed to support evidence-based infrastructure planning and berth utilization optimization under frameworks like PM Gati Shakti and Maritime India Vision 2030.
        </p>
      </div>

      {/* Flow Diagram Section */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">System Architecture Flow</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', fontWeight: 700 }}>
          <span style={{ background: 'var(--bg-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>Official Ministry Data</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>Feature Engineering</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>ML Model (Lasso α=0.0241)</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>FastAPI (Render)</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--bg-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>React Dashboard (Vercel)</span>
          <ArrowRight size={14} color="var(--text-muted)" />
          <span style={{ background: 'var(--color-primary-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary-border)', color: 'var(--color-primary)' }}>Decision Support</span>
        </div>
      </div>

      {/* Technology Stack Badges */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Technology Stack & Platform Components</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {techStack.map((tech, idx) => (
            <div key={idx} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{tech.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '6px' }}>({tech.category})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Geographic Scope & Port Coverage (11 Major Ports)</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Port Authority</th>
                <th>State</th>
                <th>Maritime Coast</th>
                <th>Operational Profile</th>
              </tr>
            </thead>
            <tbody>
              {coveredPorts.map((port, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{port.name}</td>
                  <td>{port.state}</td>
                  <td>
                    <span className={`badge ${port.coast === 'West Coast' ? 'badge-production' : 'badge-secondary'}`}>
                      {port.coast}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{port.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Scope & Boundaries */}
      <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ color: 'var(--color-warning-text)' }}>
            <ShieldAlert size={18} /> Model Scope & Limitations
          </h3>
        </div>
        <div className="grid-2">
          <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.82rem' }}>Macro Annual Horizon</div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#78350F', lineHeight: 1.45 }}>
              Calibrated for strategic annual planning and capacity budgeting; not designed for high-frequency daily berth allocation.
            </p>
          </div>
          <div style={{ background: '#FFFBEB', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.82rem' }}>Structural Continuity</div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#78350F', lineHeight: 1.45 }}>
              Forecasts assume continuity in baseline maritime trade routes and port administrative policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
