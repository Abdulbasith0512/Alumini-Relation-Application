import React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate(); // ✅ You need to declare this inside the component

  return (
    <header>
      <div className="navbar">
        <h1>Logo</h1>
        <div className="user-menu">
          <button onClick={() => navigate("/signup")} className="register">SIGN UP</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
