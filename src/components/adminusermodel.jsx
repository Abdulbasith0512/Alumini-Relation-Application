import { useState, useEffect } from "react";
import axios from "axios";
import "./admin_user_modal.css";
import React from "react";
export default function AdminUserModal({ user, onClose, onAfterSave, onRestrict }) {
  const [formData, setFormData] = useState(null);

  // Sync formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData(null);
    }
  }, [user]);

  // Prevent rendering if no user is selected
  if (!formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/users/${formData._id}`, formData);
      alert("User updated successfully.");
      onAfterSave?.();
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to update user.");
    }
  };

  const branchOptions = ["Hyderabad", "Bangalore", "Mumbai", "Chennai"];
  const membershipOptions = ["active", "pending", "restricted", "expired"];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Edit User Info</h2>

        <div className="modal-form">
          {[
            "name",
            "C_reg",
            "email",
            "M_number",
            "address",
            "batchYear",
            "department",
            "jobTitle",
            "company",
            "linkedin",
            "github",
          ].map((field) => (
            <div key={field} className="form-group">
              <label>{field.replace(/_/g, " ")}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Branch</label>
            <select
              name="Branch_Location"
              value={formData.branch || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Membership status</label>
            <select
              name="Membership_status"
              value={formData.Membership_status || ""}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              {membershipOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
          <button className="restrict-btn" onClick={() => onRestrict(formData)}>
            Restrict User
          </button>
        </div>
      </div>
    </div>
  );
}
