import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../api/client';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { BarChart2, Calendar, TrendingUp, Ship, Clock, AlertCircle } from 'lucide-react';

const VALID_PORTS = [
  'Deendayal', 'Mumbai', 'JNPA', 'Mormugao', 'New Mangalore',
  'Cochin', 'V.O. Chidambaranar', 'Chennai', 'Kamarajar',
  'Visakhapatnam', 'Paradip'
];

export const PortAnalytics: React.FC = () => {
  const [selectedPort, setSelectedPort] = useState<string>('JNPA');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics(selectedPort);
  }, [selectedPort]);

  const fetchAnalytics = async (port: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(getApiUrl(`/analytics/${port}`));
      setData(response.data);
    } catch (err: any) {
      setError(`Failed to fetch historical analytics data for ${port}. Ensure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  const history = data ? data.history : [];
  const latest = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div>
      {/* Page Header with Compact Selector */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            PORT INTEL / ANALYTICS
          </div>
          <h1 className="page-title">Port Performance Analytics</h1>
          <p className="page-subtitle">
            Historical operational performance from official Ministry transport research data.
          </p>
        </div>

        <div style={{ minWidth: '200px' }}>
          <label className="form-label">Select Port Authority</label>
          <select
            className="form-select"
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
          >
            {VALID_PORTS.map((p) => (
              <option key={p} value={p}>{p} Port Authority</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Fetching historical analytics for {selectedPort} Port...
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', padding: '12px 16px', borderRadius: 'var(--radius-md)', color: '#991B1B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {!loading && latest && (
        <>
          {/* 4 KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">LATEST CARGO</span>
                <Ship size={16} className="kpi-icon" />
              </div>
              <div className="kpi-value">{latest.cargo_traffic_mt.toFixed(3)}<span className="kpi-unit">MT</span></div>
              <div className="kpi-context">{latest.target_year} Total Cargo</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">CAPACITY UTILIZATION</span>
                <TrendingUp size={16} className="kpi-icon" />
              </div>
              <div className="kpi-value">{latest.capacity_utilization_pct.toFixed(2)}<span className="kpi-unit">%</span></div>
              <div className="kpi-context">Capacity: {latest.capacity_mt.toFixed(1)} MT</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">TURNAROUND TIME</span>
                <Clock size={16} className="kpi-icon" />
              </div>
              <div className="kpi-value">{latest.turnaround_time_hr.toFixed(2)}<span className="kpi-unit">hrs</span></div>
              <div className="kpi-context">Vessel Average Port Stay</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">PRE-BERTHING DETENTION</span>
                <Calendar size={16} className="kpi-icon" />
              </div>
              <div className="kpi-value">{latest.pre_berthing_detention_hr.toFixed(2)}<span className="kpi-unit">hrs</span></div>
              <div className="kpi-context">Average Vessel Waiting Delay</div>
            </div>
          </div>

          {/* 4-Chart Grid */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">1. Cargo Traffic vs Capacity (MT)</h3>
              </div>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="target_year" stroke="var(--text-secondary)" fontSize={11} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cargo_traffic_mt" name="Cargo (MT)" stroke="var(--color-primary)" strokeWidth={2} />
                    <Line type="monotone" dataKey="capacity_mt" name="Capacity (MT)" stroke="#94A3B8" strokeDasharray="5 5" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">2. Capacity Utilization Rate (%)</h3>
              </div>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="target_year" stroke="var(--text-secondary)" fontSize={11} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} domain={[0, 120]} />
                    <Tooltip />
                    <Bar dataKey="capacity_utilization_pct" name="Utilization (%)" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">3. Turnaround vs Pre-Berthing Detention (Hours)</h3>
              </div>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="target_year" stroke="var(--text-secondary)" fontSize={11} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                    <Line type="monotone" dataKey="turnaround_time_hr" name="Turnaround Time (hrs)" stroke="var(--color-teal)" strokeWidth={2} />
                    <Line type="monotone" dataKey="pre_berthing_detention_hr" name="Pre-Berthing Detention (hrs)" stroke="#DC2626" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">4. Average Output per Berth Day (Tonnes/Day)</h3>
              </div>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={history} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="target_year" stroke="var(--text-secondary)" fontSize={11} />
                    <YAxis stroke="var(--text-secondary)" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="avg_output_per_berth_day_tonnes" name="Berth Output (t/day)" fill="var(--color-teal)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Operational Snapshot Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Operational History Snapshot ({selectedPort} Port)</h3>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Cargo Traffic (MT)</th>
                    <th>Capacity (MT)</th>
                    <th>Utilization (%)</th>
                    <th>Turnaround (hrs)</th>
                    <th>Detention (hrs)</th>
                    <th>Berth Output (t/day)</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row: any, i: number) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{row.target_year}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.cargo_traffic_mt.toFixed(3)}</td>
                      <td>{row.capacity_mt.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${row.capacity_utilization_pct > 90 ? 'badge-production' : 'badge-baseline'}`}>
                          {row.capacity_utilization_pct.toFixed(2)}%
                        </span>
                      </td>
                      <td>{row.turnaround_time_hr.toFixed(2)}</td>
                      <td>{row.pre_berthing_detention_hr.toFixed(2)}</td>
                      <td>{row.avg_output_per_berth_day_tonnes.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
