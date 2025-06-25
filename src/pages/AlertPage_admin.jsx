import React, { useEffect, useState } from 'react';
import './AlertPage_admin.css';
import Navbar from '../components/admin_navbar';

function AlertPage() {
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const res = await fetch('http://localhost:3001/api/alerts');
    const data = await res.json();
    setAlerts(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('http://localhost:3001/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({ title: '', message: '' });
    fetchAlerts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/alerts/${id}`, { method: 'DELETE' });
    fetchAlerts();
  };

  return (
    <div>
      <Navbar />
      <div className="alert-container">
        <h1>Alert Center</h1>

        <form className="alert-form" onSubmit={handleSubmit}>
          <input
            name="title"
            type="text"
            placeholder="Alert Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Alert Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Create Alert</button>
        </form>

        <div className="alert-list">
          {alerts.map((alert) => (
            <div key={alert._id} className="alert-card">
              <h3>{alert.title}</h3>
              <p>{alert.message}</p>
              <button className="delete-btn" onClick={() => handleDelete(alert._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AlertPage;
