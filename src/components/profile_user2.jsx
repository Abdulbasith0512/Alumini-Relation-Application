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


      
    </div>
  );
}

export default ProfileUser;
