// src/pages/GalleryGrid.jsx
import React, { useState } from "react";
import "./Gallery.css";

export function GalleryGrid({ items }) {
  const [selected, setSelected] = useState(null); // { media, title, description }

  return (
    <>
      <div className="gallery-grid">
        {items.map((item) =>
          item.media.map((media, i) => (
            <div
              key={`${item._id}-${i}`}
              className="gallery-card"
              onClick={() => setSelected({ media, title: item.title, description: item.description })}
            >
              {media.type === "image" ? (
                <img src={media.url} alt="media" className="gallery-thumb" />
              ) : (
                <video src={media.url} className="gallery-thumb" muted />
              )}
            </div>
          ))
        )}
      </div>

      {selected && (
        <div className="gallery-popup" onClick={() => setSelected(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="popup-close" onClick={() => setSelected(null)}>&times;</span>

            <div className="popup-caption">
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>

            {selected.media.type === "image" ? (
              <img src={selected.media.url} alt="enlarged" className="popup-media" />
            ) : (
              <video src={selected.media.url} className="popup-media" controls autoPlay />
            )}
          </div>
        </div>
      )}
    </>
  );
}
