import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from './api/client';
import { Sidebar } from './components/common/Sidebar';
import { TopHeader } from './components/common/TopHeader';
import { ForecastDashboard } from './components/ForecastDashboard';
import { PortAnalytics } from './components/PortAnalytics';
import { ModelIntelligence } from './components/ModelIntelligence';
import { Methodology } from './components/Methodology';
import { About } from './components/About';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const checkHealth = async () => {
    try {
      const response = await axios.get(getApiUrl('/health'), { timeout: 8000 });
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
    const interval = setInterval(checkHealth, 30000);
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

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiHealthy={apiHealthy}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="main-workspace">
        <TopHeader
          activeTab={activeTab}
          apiHealthy={apiHealthy}
          onRefreshHealth={checkHealth}
          setMobileOpen={setMobileOpen}
        />

        <main className="page-container">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
