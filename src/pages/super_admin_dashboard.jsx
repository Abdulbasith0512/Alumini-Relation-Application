import { useEffect, useState } from "react";
import Navbar from "../components/super_admin_navbar.jsx";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import "./admin_dashboard.css";

/* Chart.js global registration */
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function SuperAdminDashboard() {
  /* ---------- local state ---------- */
  const [stats, setStats] = useState({ accepted: 0, registered: 0, members: 0 });
  const [branchChartData, setBranchChartData] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- one‑time fetch ---------- */
  useEffect(() => {
    (async function fetchEverything() {
      try {
        /* ---- counts & branch data ----------------------------------- */
        const [approved, pending, events] = await Promise.all([
          fetch("http://localhost:3001/users").then((r) => r.json()),
          fetch("http://localhost:3001/pending-registrations").then((r) =>
            r.json()
          ),
          fetch("http://localhost:3001/events").then((r) => r.json()),
        ]);

        /* membership = unique userIds seen in events */
        const memberSet = new Set();
        events.forEach((ev) => ev.enrolledUsers?.forEach((u) => memberSet.add(u)));

        setStats({
          accepted: approved.length,
          registered: pending.length,
          members: memberSet.size,
        });

        /* ---- branch counts for bar chart ---------------------------- */
        const branchCounts = approved.reduce((acc, u) => {
          const branch = u.Branch_Location?.trim() || "Unspecified";
          acc[branch] = (acc[branch] || 0) + 1;
          return acc;
        }, {});

        setBranchChartData({
          labels: Object.keys(branchCounts),
          datasets: [
            {
              label: "Users per Branch",
              data: Object.values(branchCounts),
              backgroundColor: "#60a5fa",
              borderRadius: 6,
            },
          ],
        });

        /* ---- latest posts / events ---------------------------------- */
        const posts = await fetch("http://localhost:3001/posts").then((r) =>
          r.json()
        );
        setLatestPosts(posts.slice(0, 2));
        setLatestEvents(events.slice(0, 2));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- doughnut data ---------- */
  const doughnutData = {
    labels: ["Approved Users", "Pending Registrations", "Memberships"],
    datasets: [
      {
        data: [stats.accepted, stats.registered, stats.members],
        backgroundColor: ["#4ade80", "#fbbf24", "#60a5fa"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div className="admin-dashboard-container">
      <Navbar />

      <div className="admin-dashboard">
        <h1>Welcome to Super Admin Dashboard</h1>

        {/* ---------- charts row -------------------------------------- */}
        <div className="chart-row">
          {/* Pie */}
          <section className="stats-card">
            <h2>Members</h2>
            <Doughnut data={doughnutData} />
            <div className="legend">
              <span>
                <strong>{stats.accepted}</strong> approved
              </span>
              <span>
                <strong>{stats.registered}</strong> pending
              </span>
              <span>
                <strong>{stats.members}</strong> memberships
              </span>
            </div>
          </section>

          {/* Bar */}
          <section className="bar-card">
            <h2>Users by Branch</h2>
            {branchChartData ? (
              <Bar
                data={branchChartData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 } },
                  },
                }}
              />
            ) : (
              <p style={{ textAlign: "center" }}>No branch data</p>
            )}
          </section>
        </div>

        {/* ---------- posts ------------------------------------------ */}
        <section className="latest-section">
          <h2>Latest Posts</h2>
          {latestPosts.map((p) => (
            <article key={p._id} className="mini-card">
              {p.photo && (
                <img
                  src={`http://localhost:3001/uploads/${p.photo}`}
                  alt="post"
                />
              )}
              <div>
                <h3>{p.user?.name ?? "Unknown"}</h3>
                <p>{p.bio}</p>
                <time>{new Date(p.createdAt).toLocaleString()}</time>
              </div>
            </article>
          ))}
        </section>

        {/* ---------- events ------------------------------------------ */}
        <section className="latest-section">
          <h2>Latest Events</h2>
          {latestEvents.map((ev) => (
            <article key={ev._id} className="mini-card">
              {ev.image && (
                <img
                  src={`http://localhost:3001/uploads/${ev.image}`}
                  alt="event"
                />
              )}
              <div>
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <time>{new Date(ev.date).toLocaleDateString()}</time>
                <p>
                  <strong>{ev.enrolledUsers?.length || 0}</strong> enrolled
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
