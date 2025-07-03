import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar_login";
import "./admin_login.css";

export default function SuperAdminLogin() {
  const [loginID, setLoginID]       = useState("");   // state names are clear
  const [loginPass, setLoginPass]   = useState("");
  const [error, setError]           = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3001/superadminlogin",
        { ID: loginID, password: loginPass }
      );

      console.log("Login success:", data);
      navigate("/super-admin-dashboard");              // redirect

    } catch (err) {
      console.error("SuperAdmin login error:", err.response?.data || err);
      setError("Invalid ID or password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h1>Super Admin Login</h1>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="loginID">ID:</label>
              <input
                id="loginID"
                type="text"
                placeholder="SuperAdmin ID"
                value={loginID}
                onChange={(e) => setLoginID(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPass">Password:</label>
              <input
                id="loginPass"
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="button-container">
              <button type="submit" className="btn-login">
                Super Admin login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
