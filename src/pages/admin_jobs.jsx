// src/pages/AdminJobs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/admin_navbar";
import "./admin_jobs.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  // 🔽 NEW: state for applications
  const [applications, setApplications] = useState({}); // { jobId: [ …apps ] }
  const [expandedJobId, setExpandedJobId] = useState(null);

  /* ───────── FETCH JOBS ───────── */
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ───────── FETCH APPLICATIONS (per‑job) ───────── */
  const fetchApplications = async (jobId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/jobs/${jobId}/applications`);
      setApplications((prev) => ({ ...prev, [jobId]: res.data }));
    } catch (err) {
      console.error("Failed to load applications:", err);
      alert("Error loading applications.");
    }
  };

  const toggleApplications = (jobId) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null); // collapse
    } else {
      setExpandedJobId(jobId);
      if (!applications[jobId]) fetchApplications(jobId); // fetch once
    }
  };

  /* ───────── ADMIN ACTIONS ───────── */
  const handleDeleteJob = async (jobId, userId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    setActionLoadingId(jobId);
    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);

      // optional notice to employer
      if (userId) {
        await axios.post(`${API_BASE_URL}/notify`, {
          userId,
          message:
            "⚠️ Your job post was removed by admin due to policy violation.",
        });
      }

      alert("Job deleted.");
      fetchJobs();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete job.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleNotify = async (userId, jobId) => {
    const customMessage = prompt(
      "Enter message to notify the employer:",
      "Please review our job posting guidelines."
    );
    if (!customMessage) return;

    setActionLoadingId(jobId);
    try {
      await axios.post(`${API_BASE_URL}/notify`, {
        userId,
        message: customMessage,
        jobId,
      });
      alert("Notice sent to employer.");
    } catch (err) {
      console.error("Notify failed:", err);
      alert("Failed to send notice.");
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div>
      <Navbar />
      <h2>Admin Job Control Panel</h2>

      {loading ? (
        <p>Loading jobs…</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (
        <div className="admin-posts-grid">
          {jobs.map((job) => (
            <div key={job._id} className="admin-job-card">
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Description:</strong> {job.description}
              </p>
              <p>
                <strong>Posted by:</strong>{" "}
                {job.userId?.name || "Unknown Employer"}
              </p>

              {/* admin controls */}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => handleDeleteJob(job._id, job.userId?._id)}
                  disabled={actionLoadingId === job._id}
                  style={{
                    marginRight: "10px",
                    background: "red",
                    color: "white",
                  }}
                >
                  Delete Job
                </button>
                <button
                  onClick={() => handleNotify(job.userId?._id, job._id)}
                  disabled={actionLoadingId === job._id}
                  style={{ marginRight: "10px" }}
                >
                  Notify Employer
                </button>
                <button onClick={() => toggleApplications(job._id)}>
                  {expandedJobId === job._id
                    ? "Hide Applications"
                    : "View Applications"}
                </button>
              </div>

              {/* applications section */}
              {expandedJobId === job._id && (
                <div className="admin-applications">
                  {applications[job._id] ? (
                    applications[job._id].length > 0 ? (
                      <ul>
                        {applications[job._id].map((app) => (
                          <li key={app._id} className="admin-application">
                            <strong>{app.name}</strong> ({app.email}) –{" "}
                            <a
                              href={`/uploads/${app.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Resume
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No applications yet.</p>
                    )
                  ) : (
                    <p>Loading applications…</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
  