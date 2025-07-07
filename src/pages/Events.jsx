import React, { useEffect, useState } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user_events";
import EventCard from "../components/eventscard";
import axios from "axios";
import "./events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* fetch events once */
  useEffect(() => {
    (async () => {
      const userId = JSON.parse(localStorage.getItem("user"))?._id;
      try {
        const { data } = await axios.get(
          `http://localhost:3001/events/not-enrolled/${userId}`
        );
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events", err);
      }
    })();
  }, []);

  /* helpers */
  const onSelect   = (id) => setSelectedId(id);
  const onCollapse = ()  => setSelectedId(null);

  /** ─────────────────────────────────────────────────────────────── render */
  return (
    <div className="events-page">
      <Navbar />
      <ProfileUser />

      {/* 2‑column layout only when a card is selected */}
      {selectedId ? (
        <div className="events-layout-expanded">
          {/* LEFT – big card */}
          <div className="events-main">
            {events
              .filter((ev) => ev._id === selectedId)
              .map((ev) => (
                <EventCard
                  key={ev._id}
                  event={ev}
                  isExpanded
                  onSelect={onSelect}     // allow re‑click (no‑op)
                  onCollapse={onCollapse}
                />
              ))}
          </div>

          {/* RIGHT – scroller */}
          <div className="events-sidebar">
            {events
              .filter((ev) => ev._id !== selectedId)
              .map((ev) => (
                <EventCard
                  key={ev._id}
                  event={ev}
                  isExpanded={false}
                  onSelect={(id) => {
                    /* clicking a sidebar card replaces the big one */
                    setSelectedId(id);
                  }}
                  onCollapse={() => {}}   // not needed in sidebar
                  showEnroll={false}      // tidy compact cards
                />
              ))}
          </div>
        </div>
      ) : (
        /* NORMAL LIST MODE */
        <div className="events-layout-list">
          {events.map((ev) => (
            <EventCard
              key={ev._id}
              event={ev}
              onSelect={onSelect}
              onCollapse={onCollapse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
