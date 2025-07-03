import React, { useEffect, useState } from 'react';
import './AlertPage_user.css';
import Navbar from '../components/user_navbar';

function UserAlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return;

    try {
      const res = await fetch(`http://localhost:3001/api/alerts?userId=${currentUserId}`);
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="alert-container">
        <h1>Latest Alerts</h1>
        <div className="alert-list">
          {alerts.length === 0 ? (
            <p>No alerts available.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert._id} className="alert-card">
                <h3>{alert.title || "Notice"}</h3>
                <p>{alert.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserAlertsPage;
