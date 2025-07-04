import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./profile_user.css";

function ProfileUser() {
  return (
    <div className="top-bar-container">
      <div className="search-bar-custom">
        <FaSearch className="search-icon-custom" />
        <input type="text" placeholder="Search..." className="search-input-custom" />
      </div>

      <Link to="/create-post">
        <button className="post-btn">Create New +</button>
      </Link>

      <Link to="/membership">
        <button className="membership-btn-custom">PREMIUM</button>
      </Link>
    </div>
  );
}

export default ProfileUser;
