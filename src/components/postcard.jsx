import React from 'react';
import './postcard.css';

function PostCard({ name, imageSrc, content, likes = 0, comments = 0 }) {
  return (
    <div className="post-card">
      <h2 className="post-author">{name}</h2>

      {imageSrc && (
        <div className="post-image">
          <img
            src={imageSrc}
            alt="Post"
            style={{ width: '100%', borderRadius: '10px' }}
          />
        </div>
      )}

      <div className="post-actions">
        <span role="img" aria-label="like">👍 {likes}</span>
        <span role="img" aria-label="comment">💬 {comments}</span>
      </div>

      <p className="post-content">{content}</p>
    </div>
  );
}

export default PostCard;
