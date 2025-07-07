// src/pages/PremiumPlansAdmin.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/super_admin_navbar';

/* ────────────────────────────────────────────── */
/*  Super‑admin page: create / list / delete plans */
/* ────────────────────────────────────────────── */
export default function PremiumPlansAdmin() {
  const [plans, setPlans]   = useState([]);            // ALWAYS start as array
  const [form,  setForm]    = useState({
    name: '', durationDays: '', price: ''
  });
  const [loading, setLoading] = useState(true);

  /* ---- fetch plans once ---- */
  useEffect(() => { loadPlans(); }, []);

  async function loadPlans() {
    try {
      const { data } = await axios.get('/api/plans');
      console.log('DEBUG /api/plans response →', data);
      // accept `[ ... ]` or `{ plans:[ ... ] }`
      const arr = Array.isArray(data)      ? data
                : Array.isArray(data.plans)? data.plans
                : [];
      setPlans(arr);
    } catch (err) {
      console.error('Failed to fetch plans', err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }

  /* ---- create new plan ---- */
  async function createPlan() {
    try {
      await axios.post('/api/plans', form);
      setForm({ name:'', durationDays:'', price:'' });
      loadPlans();
    } catch (err) {
      alert(err.response?.data?.error || 'Create failed');
    }
  }

  /* ---- delete plan ---- */
  async function deletePlan(id) {
    if (!window.confirm('Delete this plan?')) return;
    await axios.delete(`/api/plans/${id}`);
    loadPlans();
  }

  /* ---- render ---- */
  return (
    <div>
        <Navbar />
    
    <div style={styles.wrap}>
      <h2>Premium Plan Manager</h2>

      {/* CREATE FORM */}
      <input
        style={styles.input}
        placeholder="Plan name"
        value={form.name}
        onChange={e=>setForm(f=>({...f, name:e.target.value}))}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Duration (days)"
        value={form.durationDays}
        onChange={e=>setForm(f=>({...f, durationDays:e.target.value}))}
      />
      <input
        style={styles.input}
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={e=>setForm(f=>({...f, price:e.target.value}))}
      />
      <button style={styles.createBtn} onClick={createPlan}>Create Plan</button>

      {/* LIST */}
      <h3 style={{marginTop:30}}>Existing Plans</h3>

      {loading && <p>Loading…</p>}
      {!loading && plans.length === 0 && <p>No plans yet.</p>}

      {Array.isArray(plans) && plans.map(p=>(
        <div key={p._id} style={styles.card}>
          <span>
            <strong>{p.name}</strong> — {p.durationDays} days — ₹{p.price}
          </span>
          <button style={styles.delBtn} onClick={()=>deletePlan(p._id)}>Delete</button>
        </div>
      ))}
    </div>
    </div>
  );
}

/* ---- simple inline styles ---- */
const styles = {
  wrap:{padding:20,maxWidth:500,margin:'auto',fontFamily:'sans-serif'},
  input:{display:'block',width:'100%',padding:8,marginBottom:10},
  createBtn:{padding:'8px 16px',background:'#007bff',color:'#fff',border:'none',cursor:'pointer'},
  card:{border:'1px solid #ccc',padding:10,margin:'8px 0',display:'flex',justifyContent:'space-between',alignItems:'center'},
  delBtn:{background:'red',color:'#fff',border:'none',padding:'4px 10px',cursor:'pointer'}
};
