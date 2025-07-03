import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/admin_navbar";
import PostCard from "../components/postcard";
// Adminfeed.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";


import "./feed.css";

function Adminfeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId, userId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/posts/${postId}`);
      await axios.post(`${API_BASE_URL}/notify`, {
        userId,
        message: "⚠️ Your post was removed due to guideline violations.",
      });
      alert("Post deleted and user notified.");
      fetchPosts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleNotify = async (userId, postId) => {
    const customMessage = prompt(
      "Enter message to notify the user:",
      "Please review the community guidelines for your recent post."
    );

    if (!customMessage) return;

    setActionLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/notify`, {
        userId,
        message: customMessage,
        postId,
      });
      alert("Notice sent to user.");
    } catch (err) {
      console.error("Notify failed:", err);
      alert("Failed to send notice.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Admin Feed Control</h2>

      <div className="posts-feed">
        {loading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                name={post.user?.name || "Unknown"}
                imageSrc={`${API_BASE_URL}/uploads/${post.photo}`}
                content={post.bio}
                likes={post.likes?.length || 0}
                comments={post.comments?.length || 0}
                onDelete={() => handleDelete(post._id, post.user?._id)}
                onNotify={() => handleNotify(post.user?._id, post._id)}
                actionDisabled={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Adminfeed;
