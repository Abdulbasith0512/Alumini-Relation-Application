import "./admin_registration_box.css";
import axios from "axios";

function Admin_registration_box({ user, onAction }) {
  const handleApprove = async () => {
    await axios.post(`http://localhost:3001/approve/${user._id}`);
    onAction();
  };

  const handleReject = async () => {
    await axios.delete(`http://localhost:3001/reject/${user._id}`);
    onAction();
  };

  return (
    <div className="admin-box">
      <div className="button-group">
        <button className="approve-btn" onClick={handleApprove}>Approve</button>
        <button className="reject-btn" onClick={handleReject}>Reject</button>
      </div>
      <h2>Name: {user.name}</h2>
      <p><strong>Enrollment Number:</strong> {user.enrollmentNumber}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
      <p><strong>Degree:</strong> {user.degree}</p>
      <p><strong>Batch Year:</strong> {user.batchYear}</p>

    </div>
  );
}

export default Admin_registration_box;
