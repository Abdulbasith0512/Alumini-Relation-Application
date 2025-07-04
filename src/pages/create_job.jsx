// File: src/pages/CreateJob.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/user_navbar";
import ProfileUser from "../components/profile_user";
import axios from "axios";
import "./create-post.css"; // reuse the same styling

function CreateJob() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    userId: "",
    logo: null
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setForm((f) => ({ ...f, userId: user._id }));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.userId) {
      alert("Login required to post a job.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.post("http://localhost:3001/create-job", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Job posted successfully!");
      setForm({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        userId: form.userId,
        logo: null,
      });
    } catch (err) {
      console.error("Job post failed:", err);
      alert("Failed to post job.");
    }
  };

  return (
    <div>
      <Navbar />
      <ProfileUser />
      <div className="create-post-container">
        <h2>Create a New Job Post</h2>
        <form onSubmit={handleSubmit} className="create-post-form">
          <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />
          <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
          />
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Post Job</button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
