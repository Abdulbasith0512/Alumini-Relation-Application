import React, { useEffect, useState } from 'react';
import Navbar from '../components/user_navbar';
import { GalleryGrid } from './gallerygrid';   // Reuse Swiper grid
import './Gallery.css';                              // Shared styles

export default function GalleryPageUser() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/gallery');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      }
    };

    fetchGallery();
  }, []);

  return (
    <>
      <Navbar />
      <div className="gallery-container">
        <h1>Gallery</h1>
        <GalleryGrid items={items} />
      </div>
    </>
  );
}
