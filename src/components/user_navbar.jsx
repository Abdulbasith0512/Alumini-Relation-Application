import React, { useEffect, useState } from 'react';
import './user_navbar.css';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
    }
  }, []);

  const handleMouseMove = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    button.style.setProperty('--x', `${x}%`);
    button.style.setProperty('--y', `${y}%`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header>
      <div className="navbar">
        <div className="brand">
          <h1>Logo</h1>
        </div>

        <nav>
          <ul>
            <li><Link to="/home-user"><button className="nav-libtn" onMouseMove={handleMouseMove}>DASHBOARD</button></Link></li>
            <li><Link to="/feed"><button className="nav-libtn" onMouseMove={handleMouseMove}>FEED</button></Link></li>
            <li><Link to="/events"><button className="nav-libtn" onMouseMove={handleMouseMove}>EVENTS</button></Link></li>
            <li><Link to="/jobs"><button className="nav-libtn" onMouseMove={handleMouseMove}>JOBS</button></Link></li>
            <li><Link to="/messages"><button className="nav-libtn" onMouseMove={handleMouseMove}>MESSAGES</button></Link></li>
            <li><Link to="/alert-page-user"><button className="nav-libtn" onMouseMove={handleMouseMove}>ALERTS</button></Link></li>
            <li><Link to="/gallery-page-user"><button className="nav-libtn" onMouseMove={handleMouseMove}>GALLERY</button></Link></li>
            <li><Link to="/membership"><button className="nav-libtn" onMouseMove={handleMouseMove}>MEMBERSHIP</button></Link></li>
          </ul>
        </nav>

<div className="user-profile-section">
  <div className="user-profile-box">
    <div className="user-profile">
      <div className="user-avatar">
        <img
          src={
            userData.profilePhoto
              ? `http://localhost:3001/uploads/${userData.profilePhoto}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="nav-profile-photo"
        />
      </div>
      <span className="user-name">{userData.name || "User"}</span>
    </div>
  </div>

  <button
    className="login-user-logout"
    onClick={handleLogout}
    onMouseMove={handleMouseMove}
  >
    LOGOUT
  </button>
</div>
      </div>
    </header>
  );
}
export default Navbar;
