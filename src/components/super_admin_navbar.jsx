import React from 'react';
import './admin_navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");

    // Prevent back navigation
    window.history.pushState(null, '', location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };

    navigate("/", { replace: true });
  };

  return (
    <header>
      <div className="navbar">
        <h1>Logo</h1>
        <nav>
          <ul>
            <li><button className="nav-libtn" onClick={() => navigate("/super-admin-dashboard")} >DASHBOARD</button></li>
            <li><button className="nav-libtn" >FEED</button></li>
            <li><button className="nav-libtn">EVENTS</button></li>
            <li><button className="nav-libtn"onClick={() => navigate("/super-admin-signup")} >SIGNUP</button></li>
            <li><button className="nav-libtn" >GALLERY</button></li>
           <li><button className="nav-libtn" >USERS</button></li> 
            <li><button className="nav-libtn">PREMIUM PLANS</button></li>
          </ul>
        </nav>
        <div className="user-menu">
          <button onClick={handleLogout} className="admin-logout">LOGOUT</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
