import Navbar from "../components/navbar_signup";
import './signup_page.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login-image.jpeg';

function SignupPage() {
  const [name, setName] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [degree, setDegree] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
formData.append('name', name);
formData.append('enrollmentNumber', enrollmentNumber); // fixed
formData.append('email', email);
formData.append('batchYear', batchYear);               // fixed
formData.append('degree', degree);                     // fixed
formData.append('mobileNumber', mobileNumber);         // fixed
formData.append('otp', otp);                           // fixed
formData.append('password', password);
formData.append('Profile_photo', selectedFile); // match this to backend too


    axios.post('http://localhost:3001/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(result => {
      console.log(result.data);
      navigate('/login');
    })
    .catch(error => console.error('Registration Error:', error));
  };

  return (
    <div>
      <Navbar />
      <div className="signup-wrapper">
        <div
          className="signup-image"
          style={{ backgroundImage: `url(${loginImage})` }}
        ></div>

        <div className="signup-form-section">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" required onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Enrollment Number</label>
              <input name="enrollmentNumber" type="text" required onChange={(e) => setEnrollmentNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" required onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Batch Year and Degree side by side */}
            <div className="form-group-row">
              <div className="form-group half-width">
                <label>Batch Year</label>
                <select name="batchYear" required onChange={(e) => setBatchYear(e.target.value)} value={batchYear}>
                  <option value="">Select Year</option>
                  {Array.from({ length: 12 }, (_, i) => 2024 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="form-group half-width">
                <label>Degree</label>
                <select  name="degree"  required onChange={(e) => setDegree(e.target.value)} value={degree}>
                  <option value="">Select Degree</option>
                  <option value="B.Tech CSE">B.Tech CSE</option>
                  <option value="B.Tech ECE">B.Tech ECE</option>
                  <option value="B.Tech EEE">B.Tech EEE</option>
                  <option value="B.Tech Civil">B.Tech Civil</option>
                  <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                  <option value="BE">BE</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input type="number" name="mobileNumber" required onChange={(e) => setMobileNumber(e.target.value)} />
            </div>

            <div className="form-group">
              <label>OTP</label>
              <input name="otp"  type="text" required onChange={(e) => setOtp(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" required onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label>Profile Photo</label>
              <input name="Profile_photo"
                type="file"
                id="fileInput"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <label htmlFor="fileInput">
                Upload File
              </label>
            </div>

            <div className="button-container">
              <button type="submit" className="btn-user-login">Sign Up</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
