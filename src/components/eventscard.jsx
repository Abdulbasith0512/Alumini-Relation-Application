import React from "react";
import "./eventcards.css";

function EventCard({
  event,
  isExpanded = false,
  onSelect,      // <- new
  onCollapse,    // <- new
  showEnroll = true,
}) {
  const handleClick = () => {
    if (isExpanded) return;     // already large – ignore
    onSelect(event._id);        // tell parent which card was clicked
  };

  return (
    <div
      className={`event-card ${isExpanded ? "ec-expanded" : ""}`}
      onClick={handleClick}
    >
      {/* BACK BUTTON – only visible when expanded */}
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
            <button className="event-button">ENROLL NOW</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCard;
