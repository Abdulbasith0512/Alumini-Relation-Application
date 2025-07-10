import { useState, useEffect, useRef } from "react";
import axios from "axios";
import React from "react";
import Navbar from "../components/admin_navbar.jsx";
import AdminUserCard from "../components/adminuser.jsx";
import AdminUserModal from "../components/adminusermodel.jsx";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "./admin_users.css";

/* ---------- Excel Upload ------------- */
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
      onUploadDone();
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

/* ---------- Main Admin Users Page ------------- */
function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* filters & export */
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [exportFields, setExportFields] = useState([
    "name",
    "email",
    "M_number",
    "department",
    "Branch_Location",
  ]);

  const branchOptions = ["Hyderabad", "Bangalore", "Mumbai", "Chennai"];

  /* ---------- fetch users ---------- */
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

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------- restrict user ---------- */
  const handleRestrict = async (user) => {
    if (!window.confirm(`Restrict / deactivate ${user.name}?`)) return;
    try {
      await axios.put(`http://localhost:3001/users/${user._id}`, {
        ...user,
        Membership_status: "restricted",
      });
      await fetchUsers();
    } catch (err) {
      console.error("Restrict failed:", err);
      alert("Failed to restrict user.");
    } finally {
      setSelectedUser(null);
    }
  };

  /* ---------- filtering ---------- */
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      (user.name ?? "").toLowerCase().includes(search) ||
      (user.email ?? "").toLowerCase().includes(search);

    const matchesBranch =
      !branchFilter ||
      (user.Branch_Location ?? "").trim().toLowerCase() ===
        branchFilter.trim().toLowerCase();

    return matchesSearch && matchesBranch;
  });

  /* ---------- export ---------- */
  const exportUsersToExcel = () => {
    if (!exportFields.length) {
      alert("Please select at least one column to export.");
      return;
    }

    const data = filteredUsers.map((u) => {
      const row = {};
      exportFields.forEach((field) => (row[field] = u[field] ?? ""));
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "filtered_users.xlsx");
  };

  /* ---------- render ---------- */
  return (
    <div>
      <Navbar />
      <h3 className="admin-heading">Users</h3>

      {/* ------ Top Controls (cards layout) ------ */}
      <div className="top-controls">
        {/* Search & Branch card */}
        <div className="control-card">
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
            {branchOptions.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Excel upload card */}
        <div className="control-card">
          <ExcelUploader onUploadDone={fetchUsers} />
        </div>

        {/* Export card */}
{/* Export card */}
<div className="control-card export-panel">
  <label><strong>Export Fields:</strong></label>
  <div className="export-panel-options">
    {[
      "name",
      "email",
      "M_number",
      "department",
      "Branch_Location",
      "company",
      "jobTitle",
    ].map((field) => (
      <label key={field}>
        <input
          type="checkbox"
          checked={exportFields.includes(field)}
          onChange={(e) => {
            setExportFields((prev) =>
              e.target.checked
                ? [...prev, field]
                : prev.filter((f) => f !== field)
            );
          }}
        />
        {field}
      </label>
    ))}
  </div>
  <button onClick={exportUsersToExcel}>Download Excel</button>
</div>
      </div>
      {/* ------ User Cards ------ */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading…</p>
      ) : (
        <div className="user-grid">
          {filteredUsers.map((u) => (
            <AdminUserCard key={u._id} user={u} onClick={setSelectedUser} />
          ))}
        </div>
      )}

      {/* ------ Modal ------ */}
      <AdminUserModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onAfterSave={fetchUsers}
        onRestrict={handleRestrict}
      />
    </div>
  );
}

export default AdminUsers;
