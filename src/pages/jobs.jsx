import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user_job";
import JobCard from "../components/JobCard";

// Works with Vite, CRA, or plain build
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobs = async () => {
    try {
      const { data } = await axios.get(`${API}/jobs`);
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div>
      <Navbar />
      <ProfileUser />

      <div className="job-list">
        {loading && <p>Loading jobs…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && jobs.length === 0 && <p>No jobs posted yet.</p>}

        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}
