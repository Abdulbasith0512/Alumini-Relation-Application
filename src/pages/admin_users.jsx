import { useState, useEffect, useRef } from "react";
import axios from "axios";

import Navbar from "../components/admin_navbar.jsx";
import AdminUserCard from "../components/adminuser.jsx";
import AdminUserModal from "../components/adminusermodel.jsx";

import "./admin_users.css";

/* -------------------- Excel Upload Component -------------------- */
function ExcelUploader({ onUploadDone }) {
  const fileRef = useRef(null);
  const [sending, setSending] = useState(false);

  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return alert("Please select an Excel file.");

    const form = new FormData();
    form.append("file", file);

    try {
      setSending(true);
      const res = await axios.post("http://localhost:3001/import-users", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(`✅ Successfully imported ${res.data.inserted} users.`);
      fileRef.current.value = "";
      onUploadDone(); // refresh list
    } catch (err) {
      console.error("Import failed:", err);
      alert(err.response?.data?.error || "Failed to import.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="excel-upload">
      <input type="file" accept=".xlsx,.xls" ref={fileRef} disabled={sending} />
      <button onClick={handleUpload} disabled={sending}>
        {sending ? "Uploading…" : "Upload Excel"}
      </button>
    </div>
  );
}

/* ------------------------ Main Component ------------------------ */
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  const branchOptions = ["Hyderabad", "Bangalore", "Mumbai", "Chennai"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3001/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error refreshing users:", err);
    }
  };

  const handleRestrict = async (user) => {
    if (!window.confirm(`Restrict / deactivate ${user.name}?`)) return;
    try {
      await axios.put(`http://localhost:3001/users/${user._id}`, {
        ...user,
        Membership_status: "restricted",
      });
      await refreshUsers();
    } catch (err) {
      console.error("Restrict failed:", err);
      alert("Failed to restrict user.");
    } finally {
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase();
    const nameMatch = (user.name ?? "").toLowerCase().includes(search);
    const emailMatch = (user.email ?? "").toLowerCase().includes(search);
    const matchesSearch = !search || nameMatch || emailMatch;

    const userBranch = (user.Branch_Location ?? "").trim().toLowerCase();
    const selectedBranch = branchFilter.trim().toLowerCase();
    const matchesBranch = !selectedBranch || userBranch === selectedBranch;

    return matchesSearch && matchesBranch;
  });

  return (
    <div>
      <Navbar />
      <h3 className="admin-heading">Users</h3>

      {/* Compact Search + Filter + Upload */}
      <div className="top-controls">
  <div className="left-controls">
    <input
      type="text"
      placeholder="Search by name or email"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <select
      value={branchFilter}
      onChange={(e) => setBranchFilter(e.target.value)}
    >
      <option value="">All Branches</option>
      {branchOptions.map((branch) => (
        <option key={branch} value={branch}>
          {branch}
        </option>
      ))}
    </select>
  </div>

  <div className="right-controls">
    <ExcelUploader onUploadDone={refreshUsers} />
  </div>
</div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading…</p>
      ) : (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <AdminUserCard
              key={user._id}
              user={user}
              onClick={setSelectedUser}
            />
          ))}
        </div>
      )}

      <AdminUserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onAfterSave={refreshUsers}
        onRestrict={handleRestrict}
      />
    </div>
  );
}

export default AdminUsers;
