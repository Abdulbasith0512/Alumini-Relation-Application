import { useNavigate } from "react-router-dom";
import React from "react";
import "./eventcards.css"; // Assuming you have a CSS file for styling
function EventCard({ event, showEnroll = true }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/events/enroll/${event._id}`);
  };

  return (
    <div className="event-card">
      <div className="event-image-placeholder">
        <img src={`http://localhost:3001/uploads/${event.image}`} alt="Event" />
      </div>
      <div className="event-content">
        <h2 className="event-title">{event.title || "Untitled Event"}</h2>
        <p className="event-description">{event.description || "No description provided."}</p>
        <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
        <p className="event-location">{event.location || "Location not specified."}</p>
        <div className="event-footer">
          <span className="event-status active">ACTIVE</span>
          
          {showEnroll && (
            <button className="event-button" onClick={handleNavigate}>
              ENROLL NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default EventCard;