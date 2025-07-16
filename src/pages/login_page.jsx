import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login_page.css';
import loginImage from '../assets/login-image.jpeg';
import Navbar from '../components/navbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleUserLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Store both user and user ID
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("id", data.user._id); // ← this line is critical

      if (data.approved) {
        navigate("/home-user"); // ✅ Approved → User Dashboard
      } else {
        navigate("/home-register"); // 🚧 Pending → Register waiting screen
      }
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("An error occurred during login");
  }
};



  return (
    <div>
      <Navbar />
      <div className="login-wrapper">
        <div
          className="login-image"
          style={{ backgroundImage: `url(${loginImage})` }}
        ></div>

        <div className="login-form-section">
          <h2>Welcome</h2>
          <form onSubmit={handleUserLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div className="form-group">
              <a href="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <div className="button-container">
              <button type="submit" className="btn-user-login">User Login</button>
              <button
                type="button"
                className="btn-admin-login"
                onClick={() => navigate('/admin-login')}
              >
                Admin Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
