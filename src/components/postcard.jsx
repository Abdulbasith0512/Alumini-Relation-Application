import React, { useState } from 'react';
import './postcard.css';

function PostCard({
  name,
  imageSrc,
  content,
  likes = 0,
  comments = [],
  onDelete,
  onNotify,
  onLike,
  onComment,
  postId,
}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

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
        <button
          className="reaction-btn"
          title="Like"
          onClick={() => onLike && onLike(postId)}
        >
          ❤️ <span>{likes}</span>
        </button>
        <button
          className="reaction-btn"
          title="Comment"
          onClick={() => setShowComments((prev) => !prev)}
        >
          💬 <span>{comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment">
                <strong>{c.user?.name || "Anonymous"}:</strong> {c.comment}
              </div>
            ))
          )}
        </div>
      )}

      <div className="comment-box">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button
          onClick={() => {
            if (onComment && commentText.trim()) {
              onComment(postId, commentText.trim());
              setCommentText("");
            }
          }}
        >
          Post
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
