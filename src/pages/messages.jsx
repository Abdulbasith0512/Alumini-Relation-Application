import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Navbar from '../components/user_navbar';
import './B_home_page.css';
import './Messages.css';

const API = 'http://localhost:3001';

export default function Messages() {
  const myId = localStorage.getItem('id');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [peer, setPeer] = useState(null); // { _id, name }
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  /* 🔍 Search users by name */
  const searchUsers = async () => {
    const q = query.trim();
    if (!q) return;
    try {
      const { data } = await axios.get(`${API}/users/search?q=${q}`);
      setResults(data.filter(u => u._id !== myId));
    } catch (err) {
      console.error(err);
    }
  };

  /* 💬 Fetch messages every 3s */
  useEffect(() => {
    if (!peer || !myId) return;

    const load = async () => {
      try {
        const { data } = await axios.get(`${API}/messages/convo/${myId}/${peer._id}`);
        setMsgs(data);
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };

    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [peer, myId]);

  /* 📨 Send message */
  const send = async () => {
    const msg = text.trim();
    if (!msg || !peer || !myId || myId.length !== 24 || peer._id.length !== 24) {
      console.warn('Invalid message payload:', { myId, peer, msg });
      setError('Invalid message input');
      return;
    }

    console.log("Sending message:", {
      senderId: myId,
      receiverId: peer._id,
      message: msg
    });

    setLoading(true);
    setError('');

    try {
      await axios.post(`${API}/messages`, {
        senderId: myId,
        receiverId: peer._id,
        message: msg,
      });
      setText('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.error || 'Failed to send');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="msg-wrapper">
      <Navbar />

      <div className="msg-container">
        {/* ─── LEFT ─── */}
        <aside className="msg-sidebar">
          <input
            className="msg-search"
            placeholder="Search name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && searchUsers()}
          />
          <div className="msg-userlist">
            {results.map(u => (
              <div
                key={u._id}
                className={`msg-user ${peer?._id === u._id ? 'active' : ''}`}
                onClick={() => setPeer(u)}
              >
                {u.name}
              </div>
            ))}
          </div>
        </aside>

        {/* ─── CHAT ─── */}
        <section className="msg-chat">
          {peer ? (
            <>
              <header className="msg-header">Chat with {peer.name}</header>

              <div className="msg-messages">
                {msgs.map(m => (
                  <div
                    key={m._id}
                    className={`msg-bubble ${m.senderId === myId ? 'me' : 'them'}`}
                  >
                    {m.message}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="msg-inputbox">
                <input
                  placeholder="Type…"
                  value={text}
                  disabled={loading}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                />
                <button onClick={send} disabled={loading || !text.trim()}>
                  {loading ? '...' : 'Send'}
                </button>
              </div>
              {error && <div className="msg-error">{error}</div>}
            </>
          ) : (
            <div className="msg-placeholder">
              Search a name, pick a user, and start chatting!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
