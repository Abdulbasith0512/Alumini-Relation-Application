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
      <p>College Registration ID: {user.C_reg}</p>
      <p>Email ID: {user.email}</p>
      <p>Mobile Number: {user.M_number}</p>
      <p>College Certificate: {user.C_certificate}</p>
    </div>
  );
}

export default Admin_registration_box;
