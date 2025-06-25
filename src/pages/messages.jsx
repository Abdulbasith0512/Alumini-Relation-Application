// File: src/pages/Feed.jsx
import React from "react";
import Navbar from "../components/user_navbar";
import "./B_home_page.css";
import homePerson from "../assets/home_person.png";

function Messages() {
  return (
    <div>
      <Navbar />
      <div className="profile-container">
        <div className="profile-text">
          <h1>Personal Messaging space</h1>
          <p>

          </p>
        </div>
        <div className="profile-image">
          <img src={homePerson} alt="Raj Sharma" />
        </div>
      </div>
    </div>
  );
}

export default Messages;
