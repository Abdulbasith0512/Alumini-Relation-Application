import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/user_navbar';
import './eventenroll.css'; // Assuming you have a CSS file for styling
function EventEnrollPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3001/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleEnroll = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in");

    axios.post(`http://localhost:3001/events/${id}/enroll`, {
      userId: user._id,
    })
    .then(() => {
      setMessage("✅ Enrollment successful!");
      setTimeout(() => navigate("/events"), 2000);
    })
    .catch(err => {
      console.error(err);
      setMessage("❌ Already enrolled or error occurred.");
    });
  };

  return (
   <div>
  <Navbar />
  <div className="enroll-container">
    {event ? (
      <>
        <h2 className="enroll-title">{event.title}</h2>
        <p className="enroll-description">{event.description}</p>
        <p className="enroll-date"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <button className="enroll-button" onClick={handleEnroll}>Enroll</button>
        {message && <p className="enroll-message">{message}</p>}
      </>
    ) : (
      <p>Loading event...</p>
    )}
  </div>
</div>

  );
}

export default EventEnrollPage;
