import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './glogin.css'; // Assuming you have a CSS file for styling

function Glogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    login(decoded);
    navigate("/");
  };

  const handleLoginError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="google-login-container">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        text="continue_with"
        logo_alignment="center"
        
      />
    </div>
  );
}

export default Glogin;