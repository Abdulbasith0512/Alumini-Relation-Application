// HomePageuser.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Glogout from '../components/glogout';
import { GalleryGrid } from './GalleryPage_admin';   // reusable grid with Swiper
import './Gallery.css';                              // modern gallery styles

export default function HomePageuser() {
  const [user, setUser] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ---------------- check auth + load gallery ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/');          // not logged in → go home
      return;
    }

    setUser(JSON.parse(storedUser));

    (async () => {
      try {
        const res   = await fetch('http://localhost:3001/api/gallery');
        const posts = await res.json();
        setGallery(posts);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  /* ---------------- logout ---------------- */
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  /* ---------------- render ---------------- */
  if (!user) return null;                // nothing until redirect happens
  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Loading…</h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Welcome, {user.name || user.email}</h1>
      
      <p>Please wait for the admin to accept your request.</p>
      <p>Email: {user.email}</p>

      {/* If you want a manual logout button instead of Google logout:
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      */}
      <Glogout />

      {/* ---------- Gallery ---------- */}
      <h2 style={{ margin: '60px 0 24px' }}>Gallery</h2>
      <GalleryGrid items={gallery} />      {/* read-only grid */}
    </div>
  );
}

/* ---------- inline styles ---------- */
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '40px 24px',
    textAlign: 'center',
    fontFamily: `'Segoe UI', sans-serif`,
    color: '#333',
  },
  avatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    marginTop: '24px',
    objectFit: 'cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  logoutBtn: {
    marginTop: '24px',
    padding: '10px 22px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    background: '#dc3545',
    color: '#fff',
    cursor: 'pointer',
  },
};
