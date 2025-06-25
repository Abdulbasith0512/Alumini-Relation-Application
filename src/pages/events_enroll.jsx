import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div style={{ padding: '2rem' }}>
      {event ? (
        <>
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <button onClick={handleEnroll}>Enroll</button>
          {message && <p>{message}</p>}
        </>
      ) : (
        <p>Loading event...</p>
      )}
    </div>
  );
}

export default EventEnrollPage;
