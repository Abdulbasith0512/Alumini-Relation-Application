import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/admin_navbar.jsx";
import Admin_registration_box from "../components/admin_registration_box.jsx";

function AdminNewRegistrations() {
  const [users, setUsers] = useState([]);

  const fetchRegistrations = async () => {
    const res = await axios.get("http://localhost:3001/pending-registrations");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div>
      <Navbar />
      <h3 style={{ textAlign: "center", fontSize: "2rem", marginTop: "1rem" }}>New Registrations</h3>
      {users.map(user => (
        <Admin_registration_box key={user._id} user={user} onAction={fetchRegistrations} />
      ))}
    </div>
  );
}

export default AdminNewRegistrations;
