import React, { useState, useEffect } from "react";
import Navbar from "../components/user_navbar.jsx";
import PostCard from "../components/postcard.jsx";
import EventCard from "../components/eventscard.jsx";
import "./home_user_final.css";
import axios from "axios";

function HomeUserDashboard() {
  const [user, setUser] = useState(null);
  const [editableInfo, setEditableInfo] = useState({});
  const [editing, setEditing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchUserDetails(parsedUser._id);
      fetchUserPosts(parsedUser._id);
      fetchEnrolledEvents(parsedUser._id);
      fetchAppliedJobs(parsedUser._id);
    }
  }, []);

  const fetchUserDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/users/${id}`);
      setEditableInfo(res.data);
    } catch (err) {
      console.error("Error fetching user info", err);
    }
  };

  const fetchUserPosts = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts", err);
    }
  };

  const fetchEnrolledEvents = async (id) => {
    try {
      const res = await axios.get(`http://localhost:3001/events/enrolled/${id}`);
      setEnrolledEvents(res.data);
    } catch (err) {
      console.error("Error fetching enrolled events", err);
    }
  };

  const fetchAppliedJobs = async (idOrEmail) => {
    try {
      const res = await axios.get(`http://localhost:3001/applications/user/${idOrEmail}`);
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("Error fetching applied jobs", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditableInfo((prev) => ({
        ...prev,
        profilePhotoFile: file,
        profilePhotoPreview: previewUrl,
      }));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(editableInfo).forEach(([key, value]) => {
        if (key !== "profilePhotoFile" && key !== "profilePhotoPreview") {
          formData.append(key, value);
        }
      });

      if (editableInfo.profilePhotoFile) {
        formData.append("profilePhoto", editableInfo.profilePhotoFile);
      }

      const response = await axios.put(
        `http://localhost:3001/users/${user._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated!");
      setEditing(false);

      const updatedUser = {
        ...user,
        profilePhoto: response.data.user.profilePhoto || editableInfo.profilePhoto,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      fetchUserDetails(user._id);
    } catch (err) {
      console.error("Failed to update user", err);
      alert("Update failed!");
    }
  };

  return (
    <div className="user-dashboard-container">
      <Navbar />

  <div className="hero-section">
  <div className="hero-text">
    <h2>
      Welcome Back, <span className="highlight">{user?.name || "User"}</span>
    </h2>
    <p>{editableInfo.bio || "Add a bio to personalize your profile."}</p>
    <button className="btn primary-btn" onClick={() => setEditing(!editing)}>
      {editing ? "Cancel" : "Edit your Profile"}
    </button>
  </div>

  <div className="hero-image-container right-aligned">
    <img
      className="profile-photo"
      src={
        editableInfo?.profilePhoto
          ? `http://localhost:3001/uploads/${editableInfo.profilePhoto}`
          : "/default-profile.png"
      }
      alt="Profile"
    />
  </div>
</div>

      <section className="info-card">
        <header className="info-header">
          <h3>Personal Information</h3>
          <button className="btn outline-btn" onClick={() => setEditing(!editing)}>
            {editing ? "Cancel" : "Edit"}
          </button>
        </header>

        <div className="info-grid">
          {[
            { name: "name", label: "Name" },
            { name: "C_reg", label: "College Reg. ID" },
            { name: "email", label: "Email" },
            { name: "M_number", label: "Mobile" },
            { name: "address", label: "Address" },
            { name: "batchYear", label: "Batch Year" },
            { name: "department", label: "Department" },
            { name: "jobTitle", label: "Job Title" },
            { name: "company", label: "Company" },
            { name: "linkedin", label: "LinkedIn" },
            { name: "github", label: "GitHub" },
            { name: "bio", label: "Bio", textarea: true },
          ].map((field) => (
            <div key={field.name} className="info-field">
              <label>{field.label}</label>
              {editing ? (
                field.textarea ? (
                  <textarea
                    name={field.name}
                    value={editableInfo[field.name] || ""}
                    onChange={handleChange}
                    rows={3}
                  />
                ) : (
                  <input
                    name={field.name}
                    value={editableInfo[field.name] || ""}
                    onChange={handleChange}
                  />
                )
              ) : (
                <span className="info-value">{editableInfo[field.name] || "—"}</span>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <>
            <div className="upload-row">
              <label htmlFor="profile-upload" className="styled-upload-label">
                Upload new profile photo
              </label>
              <input
                type="file"
                id="profile-upload"
                className="hidden-file-input"
                onChange={handleFileChange}
                accept="image/*"
              />
              {editableInfo?.profilePhotoPreview && (
                <img src={editableInfo.profilePhotoPreview} className="profile-preview" alt="Preview" />
              )}
            </div>

            <div className="action-row">
              <button onClick={handleSave} className="btn green-btn">Save Changes</button>
              <button onClick={() => setEditing(false)} className="btn cancel-btn">Cancel</button>
            </div>
          </>
        )}
      </section>

<div className="user-posts-section">
  <h3 className="user-section-title">Your Posts</h3>
  <div className="posts-grid">
    {posts.length > 0 ? (
      posts.map((post, i) => (
        <PostCard
          key={i}
          name={user.name}
          imageSrc={`http://localhost:3001/uploads/${post.photo}`}
          content={post.bio}
        />
      ))
    ) : (
      <p className="placeholder">No posts yet.</p>
    )}
  </div>
</div>


      <div className="personal-info-section">
        <h3>Enrolled Events:</h3>
        <div className="posts-grid">
          {enrolledEvents.length > 0 ? (
            enrolledEvents.map((event) => (
              <EventCard key={event._id} event={event} showEnroll={false} />
            ))
          ) : (
            <p className="placeholder">No enrolled events yet.</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default HomeUserDashboard;
