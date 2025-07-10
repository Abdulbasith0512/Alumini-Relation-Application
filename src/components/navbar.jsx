import React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <header>
      <div className="navbar">
        <h1>Logo</h1>
        <nav>
          <ul>
           
          </ul>
        </nav>
        <div className="user-menu">
          <button onClick={() => navigate("/login")} className="login">LOGIN</button>
          <button onClick={() => navigate("/signup")} className="register">SIGN UP</button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
