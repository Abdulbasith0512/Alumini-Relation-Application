// JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./jobcard.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function JobCard({ job }) {
  return (
    <div className="job-card">
      {/* left column */}
      <div className="job-card-left">
        <h2 className="job-title">{job.title}</h2>
        <p className="job-poster">Posted by {job.userId?.name || "Unknown"}</p>
        <p className="job-company">{job.company}</p>
        <p className="job-location">{job.location}</p>
        {job.salary && <p className="job-salary">Salary: {job.salary}</p>}
        <p className="job-description">{job.description}</p>
      </div>

      {/* right column */}
      <div className="job-card-right">
        {job.logo ? (
          <img
            className="job-logo"
            src={`${API}/uploads/${job.logo}`}
            alt={`${job.company} logo`}
          />
        ) : (
          <div className="job-image-placeholder" />
        )}

        <div className="job-buttons">
          {/* Use React‑Router <Link> instead of navigate() handler */}
          <Link to={`/job-apply/${job._id}`} className="apply-now-button">
  APPLY NOW
</Link>

        </div>
      </div>
    </div>
  );
}

export default JobCard;