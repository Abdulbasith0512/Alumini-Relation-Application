import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/admin_navbar";
import "./AdminEvents.css";

/*
 * Flexible API base‑URL detection that works in Create‑React‑App, Vite, or
 * plain script tags without throwing a ReferenceError in the browser.
 *
 * 1. Vite:   define VITE_API_URL in your .env
 * 2. CRA:    define REACT_APP_API_URL in your .env
 * 3. Plain:  set <script>window.API_URL = "https://..."</script> before React
 *
 * Everything falls back to "http://localhost:3001" during development.
 */
const API =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  window.API_URL ||
  "http://localhost:3001";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });
  const [roster, setRoster] = useState({}); // { [eventId]: User[] }

  /* --------------------------------------------------
   * Helpers
   * --------------------------------------------------*/
  const load = async () => {
    try {
      const { data } = await axios.get(`${API}/events?includePast=true`);
      setEvents(data);
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const create = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) fd.append(k, v);
      });

      await axios.post(`${API}/events`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset form & refresh list
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        image: null,
      });
      load();
    } catch (err) {
      console.error("Failed to create event", err);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/events/${id}`);
      load();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const toggleRoster = async (id) => {
    // already open → hide
    if (roster[id]) {
      setRoster((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      return;
    }

    // otherwise fetch and show
    try {
      const { data } = await axios.get(`${API}/events/${id}/enrolled-users`);
      setRoster((prev) => ({ ...prev, [id]: data.users }));
    } catch (err) {
      console.error("Failed to fetch roster", err);
    }
  };

  /* --------------------------------------------------
   * Render
   * --------------------------------------------------*/
  return (
    <div>
      <Navbar />

      <div className="container">
        <h2>Create Event</h2>
        <form onSubmit={create}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <button className="admin-event-button" type="submit">Create</button>
        </form>

        <h2>All Events</h2>
        {events.map((ev) => (
          <div key={ev._id} className="eventCard">
            <h3>{ev.title}</h3>
            <p>
              {new Date(ev.date).toLocaleString()} — {ev.location} — {" "}
              <strong>{ev.status}</strong>
            </p>

            {ev.image && (
              <img
                src={`${API}/uploads/${ev.image}`}
                alt={ev.title}
                className="eventImage"
              />
            )}

            <button className="admin-event-button"onClick={() => toggleRoster(ev._id)}>
              {roster[ev._id] ? "Hide" : "View"} Enrollments ({
                ev.enrolledUsers.length
              })
            </button>
            <button className="admin-event-button"onClick={() => remove(ev._id)}>Delete</button>

            {roster[ev._id] && (
              <ul className="rosterList">
                {roster[ev._id].length === 0 && <li>No one enrolled yet</li>}
                {roster[ev._id].map((u) => (
                  <li key={u.email}>
                    {u.name} — {u.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}