import React from 'react';
import { Anchor, BarChart2, Activity, GitBranch, Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiHealthy: boolean | null;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  apiHealthy,
  mobileOpen,
  setMobileOpen
}) => {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Forecast', icon: Anchor }
      ]
    },
    {
      title: 'ANALYTICS',
      items: [
        { id: 'analytics', label: 'Port Analytics', icon: BarChart2 }
      ]
    },
    {
      title: 'MODEL',
      items: [
        { id: 'intelligence', label: 'Model Intelligence', icon: Activity }
      ]
    },
    {
      title: 'PROJECT',
      items: [
        { id: 'methodology', label: 'Methodology', icon: GitBranch },
        { id: 'about', label: 'About Project', icon: Info }
      ]
    }
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 35 }}
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <Anchor size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="brand-title">PORT INTEL ML</div>
            <div className="brand-subtitle">AI-POWERED PORT INTELLIGENCE</div>
          </div>
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navSections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: '14px' }}>
              <div className="nav-section-title">{sec.title}</div>
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => handleTabClick(item.id)}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
            System Status
          </div>
          <div className="status-indicator" style={{ color: apiHealthy === true ? '#22C55E' : apiHealthy === false ? '#EF4444' : '#F59E0B' }}>
            <span className={`dot ${apiHealthy === true ? 'green pulse' : apiHealthy === false ? 'red' : 'amber'}`} />
            <span>{apiHealthy === true ? 'API Connected' : apiHealthy === false ? 'API Offline' : 'Checking...'}</span>
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
            v1.0.0 (Lasso α=0.0241)
          </div>
        </div>
      </aside>
    </>
  );
};
