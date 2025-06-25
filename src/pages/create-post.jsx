// File: src/pages/CreatePost.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user";
import axios from "axios";
import "./create-post.css"; // for styling

function CreatePost() {
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserId(user._id);
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("Login required to create a post.");
      return;
    }

    const formData = new FormData();
    formData.append("bio", bio);
    formData.append("userId", userId);
    if (photo) formData.append("photo", photo);

    try {
      await axios.post("http://localhost:3001/create-post", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Post created successfully!");
      setBio('');
      setPhoto(null);
    } catch (error) {
      console.error("Post creation failed:", error);
      alert("Error creating post.");
    }
  };

  return (
    <div>
      <Navbar />
      <ProfileUser />

      <div className="create-post-container">
        <h2>Create a New Post</h2>
        <form onSubmit={handlePostSubmit} className="create-post-form">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your caption..."
            required
          />
          <div className="file-upload">
  <input
    type="file"
    accept="image/*"
    onChange={(e) => setPhoto(e.target.files[0])}
  />
</div>

          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
