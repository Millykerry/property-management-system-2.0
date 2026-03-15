import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { authFetch, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{user?.username}</strong>. Here is your property overview.</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Properties" value={stats?.total_properties ?? 0} subtitle="Under management" accent="blue" />
        <StatCard title="Total Tenants" value={stats?.total_tenants ?? 0} subtitle="Registered tenants" accent="green" />
        <StatCard title="Total Revenue" value={`KES ${(stats?.total_revenue ?? 0).toLocaleString()}`} subtitle="From paid rent" accent="amber" />
        <StatCard title="Overdue Payments" value={stats?.overdue ?? 0} subtitle="Require attention" accent="red" />
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Payment Status Overview</h3>
          <div className="status-breakdown">
            <div className="status-item paid">
              <span className="status-dot"></span>
              <span>Paid</span>
              <strong>{stats?.paid ?? 0}</strong>
            </div>
            <div className="status-item pending">
              <span className="status-dot"></span>
              <span>Pending</span>
              <strong>{stats?.pending ?? 0}</strong>
            </div>
            <div className="status-item overdue">
              <span className="status-dot"></span>
              <span>Overdue</span>
              <strong>{stats?.overdue ?? 0}</strong>
            </div>
          </div>
        </div>
        <div className="summary-card">
          <h3>Quick Summary</h3>
          <ul className="summary-list">
            <li><span>Total Payments Recorded</span><strong>{stats?.total_payments ?? 0}</strong></li>
            <li><span>Paid Payments</span><strong>{stats?.paid ?? 0}</strong></li>
            <li><span>Pending Payments</span><strong>{stats?.pending ?? 0}</strong></li>
            <li><span>Overdue Payments</span><strong>{stats?.overdue ?? 0}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}