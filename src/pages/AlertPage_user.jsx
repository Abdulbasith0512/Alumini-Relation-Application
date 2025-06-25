import React, { useEffect, useState } from 'react';
import './AlertPage_user.css'; // You can reuse styles or separate if you want
import Navbar from '../components/user_navbar'; // Assuming a user-specific navbar

function UserAlertsPage() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const res = await fetch('http://localhost:3001/api/alerts');
    const data = await res.json();
    setAlerts(data);
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
                <h3>{alert.title}</h3>
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
