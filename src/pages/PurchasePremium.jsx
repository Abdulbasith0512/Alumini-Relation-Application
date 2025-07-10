// src/pages/PurchasePremium.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/user_navbar';
import './purchasepremium.css'; // Assuming you have a CSS file for styling
export default function PurchasePremium() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/plans', {
      headers: {
        'x-dev-role': 'user' // ✅ simulate auth as 'user'
      }
    })
    .then(r => setPlans(Array.isArray(r.data) ? r.data : []))
    .catch(() => setPlans([]))
    .finally(() => setLoading(false));
  }, []);

  const buy = async (id) => {
    try {
      const { data } = await axios.post(`/api/subscribe/${id}`, null, {
        headers: {
          'x-dev-role': 'user' // ✅ keep the role consistent here too
        }
      });
      alert(data.message || 'Subscription active');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Purchase failed');
    }
  };

  if (loading) return <p className="loading-text">Loading plans…</p>;

return (
  <div>
    <Navbar />
    <div className="purchase-container">
      <h2 className="purchase-title">Premium Plans</h2>
      {plans.length === 0 && <p>No plans available.</p>}
      {plans.map(p => (
        <div key={p._id} className="plan-card">
          <h3>{p.name}</h3>
          <p>Duration: {p.durationDays} days</p>
          <p>Price: ₹{p.price}</p>
          <button onClick={() => buy(p._id)} className="buy-button">Buy</button>
        </div>
      ))}
    </div>
  </div>
);
}

