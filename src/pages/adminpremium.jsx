import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from '../components/admin_navbar';
import './admin-premium.css';
import Navbar from '../components/admin_navbar';
function AdminPremium() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/admin/users/premium-status');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <NavbarAdmin />

      <div className="admin-premium-container">
        <h2>Premium Membership Overview</h2>

        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Premium Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td className={user.premiumStatus === 'Active' ? 'premium' : 'non-premium'}>
                    {user.premiumStatus}
                  </td>
                  <td>{user.startDate ? new Date(user.startDate).toLocaleDateString() : '-'}</td>
                  <td>{user.endDate ? new Date(user.endDate).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPremium;
