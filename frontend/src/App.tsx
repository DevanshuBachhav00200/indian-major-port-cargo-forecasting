import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navbar } from './components/Navbar';
import { ForecastDashboard } from './components/ForecastDashboard';
import { PortAnalytics } from './components/PortAnalytics';
import { ModelIntelligence } from './components/ModelIntelligence';
import { Methodology } from './components/Methodology';
import { About } from './components/About';
import { getApiUrl } from './api/client';
import { Anchor, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  const checkHealth = async () => {
    try {
      const response = await axios.get(getApiUrl('/health'));
      if (response.data && response.data.status === 'healthy') {
        setApiHealthy(true);
      } else {
        setApiHealthy(false);
      }
    } catch {
      setApiHealthy(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ForecastDashboard apiHealthy={apiHealthy} />;
      case 'analytics':
        return <PortAnalytics />;
      case 'intelligence':
        return <ModelIntelligence />;
      case 'methodology':
        return <Methodology />;
      case 'about':
        return <About />;
      default:
        return <ForecastDashboard apiHealthy={apiHealthy} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Cargo Forecast Dashboard', subtitle: 'Production Model Prediction & Sensitivity Tool' };
      case 'analytics':
        return { title: 'Port Analytics & Historical Performance', subtitle: 'Historical Operational Trends (2008 - 2025)' };
      case 'intelligence':
        return { title: 'Model Intelligence & Governance', subtitle: 'Lasso vs Ridge vs LSTM Comparison & Feature Weights' };
      case 'methodology':
        return { title: '12-Stage Empirical Methodology', subtitle: 'Temporal Non-Leakage Architecture & Walk-Forward Audit' };
      case 'about':
        return { title: 'About & System Coverage', subtitle: '11 Major Indian Public Port Authorities' };
      default:
        return { title: 'Cargo Forecast Dashboard', subtitle: 'Production Model Prediction Tool' };
    }
  };

  const pageMeta = getPageTitle();

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} apiHealthy={apiHealthy} />
      
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">{pageMeta.title}</h1>
            <p className="page-subtitle">{pageMeta.subtitle}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-outline" onClick={checkHealth} title="Refresh API Health">
              <RefreshCw size={14} /> Refresh Health
            </button>
          </div>
        </header>

        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
