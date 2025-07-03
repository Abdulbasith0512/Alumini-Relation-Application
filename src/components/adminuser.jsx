import "./admin_user_card.css";

export default function AdminUserCard({ user, onClick }) {
  return (
    <div className="admin-user-card" onClick={() => onClick(user)}>
      <img
        src={`http://localhost:3001/uploads/${user.profilePhoto || "default.png"}`}
        alt="profile"
        className="user-avatar"
      />
      <div className="user-info">
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user.jobTitle} at {user.company}</p>
      </div>
    </div>
  );
}
