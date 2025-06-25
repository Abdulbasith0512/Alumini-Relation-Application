// File: src/pages/Feed.jsx
import React from "react";
import Navbar from "../components/user_navbar";
import "./B_home_page.css";
import homePerson from "../assets/home_person.png";
import ProfileUser from "../components/profile_user";
import JobCard from "../components/jobcard";

function Jobs() {
  return (
    <div>
      <Navbar />
      <ProfileUser/>
      <JobCard/>
    </div>
  );
}

export default Jobs;
