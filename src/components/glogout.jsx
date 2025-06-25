import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Glogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();         // Clear context + localStorage
    navigate('/');    // Redirect to HomePage
  };

  return (
    <button onClick={handleLogout} style={styles.button}>
      Logout
    </button>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#DB4437',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Glogout;
