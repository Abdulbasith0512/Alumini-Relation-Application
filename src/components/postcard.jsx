    import React from 'react';
    import './postcard.css';

    function PostCard({
      name,
      imageSrc,
      content,
      likes = 0,
      comments = 0,
      onDelete,
      onNotify,
    }) {
      return (
        <div className="post-card-enhanced">
          <div className="author-badge">
            <span>{name}</span>
          </div>

          {imageSrc && (
            <div className="image-container">
              <img src={imageSrc} alt="Post visual" />
            </div>
          )}

          <div className="post-content">
            <p>{content}</p>
          </div>

          <div className="post-actions-frosted">
            <button className="reaction-btn" title="Like">
              ❤️ <span>{likes}</span>
            </button>
            <button className="reaction-btn" title="Comment">
              💬 <span>{comments}</span>
            </button>
          </div>

          {(onDelete || onNotify) && (
            <div className="admin-tools">
              {onNotify && (
                <button className="btn notify">📢 Notify</button>
              )}
              {onDelete && (
                <button className="btn delete">🗑️ Delete</button>
              )}
            </div>
          )}
        </div>
      );
    }

    export default PostCard;
  // PostCard component with enhanced styles and functionality