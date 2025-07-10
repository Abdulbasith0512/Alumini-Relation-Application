import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Step 1
import "./eventcards.css";

function EventCard({
  event,
  isExpanded = false,
  onSelect,
  onCollapse,
  showEnroll = true,
}) {
  const navigate = useNavigate(); // ✅ Step 2

  const handleClick = () => {
    if (isExpanded) return;
    onSelect(event._id);
  };

  const handleEnrollClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    navigate(`/events/enroll/${event._id}`); // ✅ Navigate to enroll page
  };

  return (
    <div
      className={`event-card ${isExpanded ? "ec-expanded" : ""}`}
      onClick={handleClick}
    >
      {isExpanded && (
        <button className="ec-back-btn" onClick={onCollapse}>
          ← All events
        </button>
      )}

      <div className="event-image-placeholder">
        <img
          src={`http://localhost:3001/uploads/${event.image}`}
          alt="Event"
        />
      </div>

      <div className="event-content">
        <h2 className="event-title">{event.title || "Untitled Event"}</h2>
        <p className="event-description">
          {event.description || "No description provided."}
        </p>
        <p className="event-date">
          {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="event-location">
          {event.location || "Location not specified."}
        </p>

        <div className="event-footer">
          <span className="event-status active">ACTIVE</span>
          {showEnroll && (
            <button onClick={handleEnrollClick} className="event-button">
              ENROLL NOW
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
