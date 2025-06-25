import Navbar from "../components/admin_navbar.jsx";
import "./admin_dashboard.css"; // Ensure this file exists and is styled as needed
function AdminDashboard() {
  return (
    <div className="admin-dashboard-container">
      
    <Navbar />
    <div className="admin-dashboard">
      
      <h1>Welcome to Admin Dashboard</h1>
    </div>
    </div>
  );
}
export default AdminDashboard;
