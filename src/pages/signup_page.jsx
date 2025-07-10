import Navbar from "../components/navbar_signup";
import './signup_page.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImage from '../assets/login-image.jpeg';

function SignupPage() {
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);
  const [coreFields, setCoreFields] = useState({
    name: '',
    enrollmentNumber: '',
    email: '',
    batchYear: '',
    degree: '',
    mobileNumber: '',
    otp: '',
    password: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/api/signup-config')
      .then(res => setConfig(res.data))
      .catch(err => {
        console.error("Error loading config", err);
        setErrorMsg("Could not load signup form configuration.");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("Profile photo must be under 5MB.");
      return;
    }

    const formData = new FormData();

    Object.entries(coreFields).forEach(([k, v]) => {
      formData.append(k, v);
    });

    if (selectedFile) {
      formData.append('Profile_photo', selectedFile);
    }

    Object.entries(customFields).forEach(([k, v]) => {
      if (v instanceof File) formData.append(k, v);
      else formData.append(k, String(v));
    });

    setLoading(true);
    axios.post('http://localhost:3001/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(result => {
        setSuccessMsg("Registration submitted successfully!");
        setTimeout(() => navigate('/login'), 1000);
      })
      .catch(error => {
        console.error('Registration Error:', error);
        setErrorMsg(error.response?.data?.error || 'Registration failed');
      })
      .finally(() => setLoading(false));
  };

  if (!config || !config.visibleFields || !config.customFields) return null;

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
            {/* Core Fields */}
            {config.visibleFields.name && (
              <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, name: e.target.value }))} />
              </div>
            )}

            {config.visibleFields.enrollmentNumber && (
              <div className="form-group">
                <label>Enrollment Number</label>
                <input name="enrollmentNumber" type="text" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, enrollmentNumber: e.target.value }))} />
              </div>
            )}

            {config.visibleFields.email && (
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, email: e.target.value }))} />
              </div>
            )}

            <div className="form-group-row">
              {config.visibleFields.batchYear && (
                <div className="form-group half-width">
                  <label>Batch Year</label>
                  <select required onChange={(e) => setCoreFields(prev => ({ ...prev, batchYear: e.target.value }))}>
                    <option value="">Select Year</option>
                    {Array.from({ length: 12 }, (_, i) => 2024 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {config.visibleFields.degree && (
                <div className="form-group half-width">
                  <label>Degree</label>
                  <select required onChange={(e) => setCoreFields(prev => ({ ...prev, degree: e.target.value }))}>
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
              )}
            </div>

            {config.visibleFields.mobileNumber && (
              <div className="form-group">
                <label>Mobile Number</label>
                <input name="mobileNumber" type="number" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, mobileNumber: e.target.value }))} />
              </div>
            )}

            {config.visibleFields.otp && (
              <div className="form-group">
                <label>OTP</label>
                <input name="otp" type="text" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, otp: e.target.value }))} />
              </div>
            )}

            {config.visibleFields.password && (
              <div className="form-group">
                <label>Password</label>
                <input name="password" type="password" required
                  onChange={(e) => setCoreFields(prev => ({ ...prev, password: e.target.value }))} />
              </div>
            )}

            {config.visibleFields.Profile_photo && (
              <div className="form-group">
                <label>Profile Photo</label>
                <input type="file"
                  accept="image/png, image/jpeg"
                  onChange={(e) => setSelectedFile(e.target.files[0])} />
              </div>
            )}

            {/* Dynamic Custom Fields */}
            {config.customFields.filter(f => f.visible).map(field => (
              <div className="form-group" key={field.key}>
                <label>{field.label || field.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                {field.type === 'file' ? (
                  <input
                    type="file"
                    required={field.required}
                    onChange={(e) => setCustomFields(prev => ({ ...prev, [field.key]: e.target.files[0] }))} />
                ) : (
                  <input
                    type={field.type}
                    required={field.required}
                    onChange={(e) => setCustomFields(prev => ({ ...prev, [field.key]: e.target.value }))} />
                )}
              </div>
            ))}

            {/* Feedback Messages */}
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            {successMsg && <p className="success-msg">{successMsg}</p>}

            <div className="button-container">
              <button type="submit" className="btn-user-login" disabled={loading}>
                {loading ? 'Submitting...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
