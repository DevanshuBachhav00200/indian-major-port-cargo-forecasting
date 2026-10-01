import React from 'react';
import { Anchor, BarChart2, Activity, GitBranch, Info, CheckCircle, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  apiHealthy: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, apiHealthy }) => {
  const navItems = [
    { id: 'dashboard', label: 'Forecast Dashboard', icon: Anchor },
    { id: 'analytics', label: 'Port Analytics', icon: BarChart2 },
    { id: 'intelligence', label: 'Model Intelligence', icon: Activity },
    { id: 'methodology', label: 'Methodology', icon: GitBranch },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <Anchor className="brand-icon" />
          <div>
            <div className="brand-title">PORT INTEL ML</div>
            <div className="brand-subtitle">Ministry Transport Research</div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="meta-label" style={{ color: '#94A3B8', marginBottom: '6px' }}>FastAPI Backend</div>
        {apiHealthy === true && (
          <div className="api-status-badge healthy">
            <CheckCircle size={14} />
            <span>API Connected (v1.0.0)</span>
          </div>
        )}
        {apiHealthy === false && (
          <div className="api-status-badge offline">
            <AlertTriangle size={14} />
            <span>API Offline (127.0.0.1:8000)</span>
          </div>
        )}
        {apiHealthy === null && (
          <div className="api-status-badge" style={{ backgroundColor: '#334155', color: '#94A3B8' }}>
            <span>Checking Health...</span>
          </div>
        )}
      </div>
    </aside>
  );
};
