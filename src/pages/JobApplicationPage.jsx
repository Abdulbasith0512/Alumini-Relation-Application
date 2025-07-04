import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/user_navbar";
import "./JobApplicationPage.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function JobApplicationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!currentUser?._id;

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    resume: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // ------------------ Fetch job & applications ------------------
  useEffect(() => {
    axios
      .get(`${API}/jobs/${jobId}`)
      .then((res) => setJob(res.data))
      .catch(() => setError("Failed to load job"));

    fetchApplications();
  }, [jobId]);

  function fetchApplications() {
    axios
      .get(`${API}/jobs/${jobId}/applications`)
      .then((res) => setApplications(res.data))
      .catch(() => {}); // silently ignore
  }

  // ------------------ Form handlers ------------------
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setForm((f) => ({ ...f, resume: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    if (!form.resume) return setError("Please upload your résumé (PDF)");
    if (form.resume.type !== "application/pdf") {
      return setError("Only PDF files are allowed.");
    }

    setSubmitting(true);
    setError(null);

    try {
      const data = new FormData();
data.append("name", values.name);
data.append("email", values.email);
data.append("resume", file);
data.append("applicant", user._id);          // 👈 NEW LINE



      await axios.post(`${API}/jobs/${jobId}/apply`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      fetchApplications();
    } catch (err) {
      setError(err?.response?.data?.error || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const isOwner = job && currentUser && job.userId?._id === currentUser._id;

  // ------------------ UI ------------------
  if (error) return <p className="error-msg">{error}</p>;
  if (!job) return <p>Loading…</p>;

  return (
    <div>
      <Navbar />
    <div className="job-app-page">


      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1 className="job-title">{job.title}</h1>
      <p className="job-meta">
        {job.company} • {job.location}
      </p>
      <p className="job-desc">{job.description}</p>

      <div className="app-count">
        Applicants so far: <strong>{applications.length}</strong>
      </div>

      {/* ------------------ Apply Form ------------------ */}
      {!isLoggedIn ? (
        <p>Please log in to apply for this job.</p>
      ) : !success ? (
        <form className="apply-form" onSubmit={handleSubmit}>
          <h2>Apply Now</h2>

          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="file-label">
            Résumé (PDF)
            <input
              type="file"
              name="resume"
              accept="application/pdf"
              onChange={handleChange}
              required
            />
          </label>

          {submitting ? (
            <button disabled>Submitting…</button>
          ) : (
            <button className="jobapplication_submit" type="submit">Submit Application</button>
          )}
        </form>
      ) : (
        <p className="success-msg">✅ Application submitted!</p>
      )}

      {/* ------------------ Owner-only Applicants List ------------------ */}
      {isOwner && (
        <section className="apps-list">
          <h2>All Applicants</h2>
          {applications.length === 0 ? (
            <p>No one has applied yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Résumé</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app._id}>
                    <td>{idx + 1}</td>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>
                      <a
                        href={`${API}/uploads/${app.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
    </div>
  );
}
