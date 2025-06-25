import React from "react";
import "./jobcard.css";

function JobCard() {
  return (
    <div className="job-card">
      <div className="job-card-left">
        <h2 className="job-title">JOB TITLE</h2>
        <p className="job-poster">Posted by XYZ Person</p>
        <p className="job-description">
          TechTalk 2025 was a one-day seminar held on June 10, 2025, bringing together students,
          developers, and industry experts to discuss the evolving landscape of artificial intelligence.
          The event featured keynote sessions by leading tech professionals, hands-on workshops,
          and a panel discussion on ethical AI practices. It concluded with a networking session,
          fostering collaboration and innovation among attendees.
        </p>
      </div>

      <div className="job-card-right">
        <div className="job-image-placeholder"></div>

        <div className="job-buttons">
          <button className="not-interested-button">NOT INTERESTED</button>
          <button className="apply-now-button">APPLY NOW</button>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
