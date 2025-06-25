import React, { useEffect, useState } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user_events";
import EventCard from "../components/eventscard";
import axios from "axios";
import "./events.css"; // create this if not yet

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  const fetchEvents = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?._id;

    try {
      const res = await axios.get(`http://localhost:3001/events/not-enrolled/${userId}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  fetchEvents();
}, []);


  return (
    <div className="events-page">
      <Navbar />
      <ProfileUser />

      <div className="events-grid">
        {events.map((event, i) => (
          <EventCard key={i} event={event} />
        ))}
      </div>
    </div>
  );
}

export default Events;
