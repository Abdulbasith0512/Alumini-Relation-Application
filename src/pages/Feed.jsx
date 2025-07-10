import React, { useEffect, useState } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user";
import PostCard from "../components/postcard";
import axios from "axios";
import "./feed.css";

function Feed() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserId(user._id);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };
const handleComment = async (postId, commentText) => {
  try {
    await axios.post(`http://localhost:3001/posts/${postId}/comment`, {
      userId,
      comment: commentText,
    });
    fetchPosts(); // Refresh after comment
  } catch (err) {
    console.error("Failed to comment:", err);
  }
};

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:3001/posts/${postId}/like`, {
        userId,
      });
      fetchPosts(); // Refresh post data after like
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <ProfileUser />

      <div className="posts-feed">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
<PostCard
  key={post._id}
  postId={post._id}
  name={post.user?.name || "Unknown"}
  imageSrc={post.photo ? `http://localhost:3001/uploads/${post.photo}` : null}
  content={post.bio}
  likes={post.likes?.length || 0}
  comments={post.comments || []} // Now full comments array
  onLike={handleLike}
  onComment={handleComment}
/>


            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
