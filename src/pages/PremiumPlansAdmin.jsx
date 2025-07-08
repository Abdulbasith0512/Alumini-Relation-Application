// src/pages/PremiumPlansAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/super_admin_navbar";

/* ------------------------------------------------------------------
   Axios instance:
   – baseURL is `/api` so every call → /api/...
   – header x-dev-role: superadmin lets the stub middleware pass
------------------------------------------------------------------ */
const api = axios.create({
  baseURL: "http://localhost:3001/api", // 🔥 Hardcoded backend port
  headers: { "x-dev-role": "superadmin" }
});

export default function PremiumPlansAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", durationDays: "", price: "" });

  /* fetch once */
  useEffect(() => { loadPlans(); }, []);

  async function loadPlans() {
    try {
      const { data } = await api.get("/plans");
      setPlans(Array.isArray(data) ? data : Array.isArray(data.plans) ? data.plans : []);
    } catch (err) {
      console.error("Failed to fetch plans", err);
      setPlans([]);
    } finally { setLoading(false); }
  }

  async function createPlan() {
    try {
      await api.post("/admin/plans", form);
      setForm({ name: "", durationDays: "", price: "" });
      loadPlans();
    } catch (err) {
      alert(err.response?.data?.error || "Create failed");
    }
  }

  async function deletePlan(id) {
    if (!window.confirm("Delete this plan?")) return;
    await api.delete(`/plans/${id}`);
    loadPlans();
  }

  return (
    <div>
      <Navbar />

      <div style={styles.wrap}>
        <h2>Premium Plan Manager</h2>

        {/* Create form */}
        <input
          style={styles.input}
          placeholder="Plan name"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Duration (days)"
          value={form.durationDays}
          onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))}
        />
        <input
          style={styles.input}
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
        />
        <button style={styles.createBtn} onClick={createPlan}>Create Plan</button>

        {/* List */}
        <h3 style={{ marginTop: 30 }}>Existing Plans</h3>
        {loading && <p>Loading…</p>}
        {!loading && plans.length === 0 && <p>No plans yet.</p>}
        {plans.map(p => (
          <div key={p._id} style={styles.card}>
            <span>
              <strong>{p.name}</strong> — {p.durationDays} days — ₹{p.price}
            </span>
            <button style={styles.delBtn} onClick={() => deletePlan(p._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Inline styles */
const styles = {
  wrap:   { padding: 20, maxWidth: 500, margin: "auto", fontFamily: "sans-serif" },
  input:  { display: "block", width: "100%", padding: 8, marginBottom: 10 },
  createBtn:{ padding: "8px 16px", background: "#007bff", color: "#fff", border: "none", cursor: "pointer" },
  card:   { border: "1px solid #ccc", padding: 10, margin: "8px 0",
            display: "flex", justifyContent: "space-between", alignItems: "center" },
  delBtn: { background: "red", color: "#fff", border: "none", padding: "4px 10px", cursor: "pointer" }
};
