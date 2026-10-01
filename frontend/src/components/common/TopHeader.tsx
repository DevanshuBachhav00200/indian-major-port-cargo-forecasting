import React from 'react';
import { Menu, RefreshCw, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';

interface TopHeaderProps {
  activeTab: string;
  apiHealthy: boolean | null;
  onRefreshHealth: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  apiHealthy,
  onRefreshHealth,
  setMobileOpen
}) => {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'FORECAST';
      case 'analytics': return 'PORT ANALYTICS';
      case 'intelligence': return 'MODEL INTELLIGENCE';
      case 'methodology': return 'METHODOLOGY';
      case 'about': return 'ABOUT PROJECT';
      default: return 'FORECAST';
    }
  };

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu-toggle" onClick={() => setMobileOpen(true)}>
          <Menu size={20} />
        </button>

        <div className="header-breadcrumb">
          <span className="breadcrumb-root">PORT INTEL ML</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{getTabLabel()}</span>
        </div>
      </div>

      <div className="header-right">
        {apiHealthy === true && (
          <div className="badge-status healthy">
            <CheckCircle2 size={13} />
            <span>API Connected</span>
          </div>
        )}
        {apiHealthy === false && (
          <div className="badge-status offline">
            <AlertTriangle size={13} />
            <span>API Offline</span>
          </div>
        )}

        <div className="badge-version">
          <Cpu size={12} style={{ display: 'inline', marginRight: '4px' }} />
          <span>v1.0.0</span>
        </div>

        <button
          className="btn btn-outline btn-sm"
          onClick={onRefreshHealth}
          title="Refresh Backend API Health"
          style={{ padding: '4px 8px' }}
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
};
