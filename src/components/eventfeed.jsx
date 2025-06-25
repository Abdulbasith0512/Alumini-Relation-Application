// EventFeed.jsx
import React from "react";
import EventCard from "../components/eventscard";

import "./eventfeed.css";

function EventFeed() {
  return (
    <div className="event-feed-container">
      <EventCard />
      <EventCard />
      <EventCard />
    </div>
  );
}

export default EventFeed;
