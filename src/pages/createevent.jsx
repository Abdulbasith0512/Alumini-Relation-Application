// File: src/pages/CreateEvent.jsx
import React, { useState } from "react";
import axios from "axios";
import "./create-post.css"; // reuse styles or make create-event.css
import Navbar from "../components/user_navbar";
import "./create-event.css";

function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEventData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (let key in eventData) {
        formData.append(key, eventData[key]);
      }

      await axios.post("http://localhost:3001/api/events", formData);
      alert("Event created successfully!");
    } catch (err) {
      console.error("Event creation failed", err);
      alert("Event creation failed");
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="create-post-container">
        
      <h2>Create New Event</h2>
      <form className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={eventData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Event Description"
          value={eventData.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={eventData.location}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Create Event</button>
      </form>
    </div>
    </div>
  );
}

export default CreateEvent;
