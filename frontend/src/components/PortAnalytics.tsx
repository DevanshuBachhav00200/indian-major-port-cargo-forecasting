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

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
              Port Performance Analytics & Historical Trends
            </h1>
            <p style={{ color: '#475569', fontSize: '0.88rem', marginTop: '4px' }}>
              Historical operational data from official Ministry transport research dataset.
            </p>
          </div>

          <div style={{ minWidth: '220px' }}>
            <label className="form-label" style={{ fontSize: '0.78rem', color: '#64748B' }}>Select Port:</label>
            <select
              className="form-select"
              value={selectedPort}
              onChange={(e) => setSelectedPort(e.target.value)}
              style={{ fontWeight: 700, padding: '8px 12px' }}
            >
              {VALID_PORTS.map((p) => (
                <option key={p} value={p}>{p} Port</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
            Loading historical data for {selectedPort}...
          </div>
        ) : data ? (
          <div>
            {/* Quick Summary Cards */}
            <div className="grid-4" style={{ marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Observations</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>{data.total_observations} Years</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>2007-08 to 2024-25</div>
              </div>

              <div style={{ backgroundColor: '#F0F9FF', padding: '16px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369A1', textTransform: 'uppercase' }}>Latest Cargo</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284C7', marginTop: '4px' }}>
                  {data.history[data.history.length - 1]?.cargo_traffic_mt} <span style={{ fontSize: '0.9rem' }}>MT</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#0369A1', marginTop: '2px' }}>Fiscal {data.history[data.history.length - 1]?.target_year}</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Capacity Utilization</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                  {data.history[data.history.length - 1]?.capacity_utilization_pct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>Capacity: {data.history[data.history.length - 1]?.capacity_mt} MT</div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>Turnaround Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                  {data.history[data.history.length - 1]?.turnaround_time_hr} <span style={{ fontSize: '0.9rem' }}>hrs</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>Detention: {data.history[data.history.length - 1]?.pre_berthing_detention_hr} hrs</div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid-2">
              {/* Chart 1: Cargo Traffic Trend */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', color: '#0F172A' }}>
                  Cargo Traffic Throughput (Million Tonnes, MT)
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="target_year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`${val} MT`, 'Cargo Traffic']} />
                    <Line type="monotone" dataKey="cargo_traffic_mt" stroke="#1E40AF" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 2: Capacity vs Utilization */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', color: '#0F172A' }}>
                  Capacity Utilization Rate (%)
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="target_year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip formatter={(val: any) => [`${val}%`, 'Utilization']} />
                    <Bar dataKey="capacity_utilization_pct" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 3: Turnaround Time & Detention */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', color: '#0F172A' }}>
                  Vessel Turnaround Time & Detention (Hours)
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="target_year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="turnaround_time_hr" name="Turnaround Time (hr)" stroke="#0284C7" strokeWidth={2} />
                    <Line type="monotone" dataKey="pre_berthing_detention_hr" name="Pre-Berthing Detention (hr)" stroke="#E11D48" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart 4: Berth Output per Day */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '6px', padding: '16px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px', color: '#0F172A' }}>
                  Average Output per Berth Day (Tonnes)
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="target_year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`${val.toLocaleString()} tonnes`, 'Berth Output']} />
                    <Bar dataKey="avg_output_per_berth_day_tonnes" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
