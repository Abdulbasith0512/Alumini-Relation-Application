import axios from 'axios';
import Navbar from "../components/navbar_login";
import './admin_login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminloginPage() {
  const [ID, setID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/adminlogin', { ID, password })
      .then((response) => {
        if (response.data.message === "Admin login successful") {
          alert("Welcome Admin!");
          navigate('/admin-dashboard', { replace: true });
        }
      })
      .catch((err) => {
        console.error("Admin login error:", err);
        alert("Invalid Admin ID or Password");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="ID">ID:</label>
              <input
                type="text"
                id="ID"
                name="ID"
                required
                value={ID}
                onChange={(e) => setID(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="button-container">
              <button type="submit" className="btn-login">Login</button>
              <button
                type="button"
                className="btn-superadmin"
                onClick={() => navigate('/super-admin-login')}
              >
                Super Admin Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminloginPage;
