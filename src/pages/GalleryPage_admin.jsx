// GalleryPage_admin.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/admin_navbar';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import './Gallery.css';          // ← keep all CSS in this file

export default function GalleryPageAdmin() {
  const [gallery, setGallery] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    files: null,
  });

  /* ---------------- fetch gallery ---------------- */
  const load = async () => {
    const res = await fetch('http://localhost:3001/api/gallery');
    setGallery(await res.json());
  };
  useEffect(() => { load(); }, []);

  /* ---------------- form handlers ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'files' ? files : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.files?.length) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    [...formData.files].forEach(f => data.append('files', f));

    await fetch('http://localhost:3001/api/gallery', { method: 'POST', body: data });
    setFormData({ title: '', description: '', files: null });
    e.target.reset();                // clear <input type="file" />
    await load();
  };

  /* ---------------- delete post ---------------- */
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`http://localhost:3001/api/gallery/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <>
      <Navbar />
      <div className="gallery-container">
        <h1>Admin Gallery</h1>

        {/* ---------- upload form ---------- */}
        <form className="gallery-form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Short description (2-3 lines)"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="files"
            accept="image/*,video/*"
            multiple
            onChange={handleChange}
            required
          />
          <button type="submit">Upload</button>
        </form>

        {/* ---------- gallery grid ---------- */}
        <GalleryGrid
          items={gallery}
          deletable
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable grid component (also import on user page)                */
/* ------------------------------------------------------------------ */
export function GalleryGrid({ items, deletable = false, handleDelete }) {
  return (
    <div className="gallery-grid">
      {items.map(item => (
        <div key={item._id} className="gallery-post">
          {/* swiper carousel */}
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={10}
            slidesPerView={1}
            className="media-swiper"
          >
            {item.media.map(m => (
              <SwiperSlide key={m.url}>
                <div className="media-item">
                  {m.type === 'video'
                    ? <video src={m.url} controls />
                    : <img src={m.url} alt={item.title} />}
                  <div className="media-desc">{item.description}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* title + optional delete */}
          <div className="post-footer">
            <h4>{item.title}</h4>
            {deletable && (
              <button
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
                title="Delete post"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
