// File: src/pages/Feed.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user";
import PostCard from "../components/postcard";
import axios from "axios";
import "./feed.css"

function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
  name={post.user?.name || "Unknown"}
  imageSrc={`http://localhost:3001/uploads/${post.photo}`}
  content={post.bio}
  likes={post.likes?.length || 0}
  comments={post.comments?.length || 0}
/>

      ))}
    </div>
  )}
</div>

    </div>
  );
}

export default Feed;
