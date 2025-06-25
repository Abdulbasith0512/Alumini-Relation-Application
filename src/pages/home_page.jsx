  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Glogout from "../components/glogout";
  



  function HomePageuser() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/"); // <-- Send back to HomePage
    }
  }, [navigate]);


    const handleLogout = () => {
      localStorage.removeItem("user");
      navigate("/login");
    };

    if (!user) {
      return null; // or a loading spinner
    }

    return (
      <div style={styles.container}>
        <h1>Welcome, {user.name || user.email}</h1>
        <img src={user.picture} alt="Profile" style={styles.avatar} />
        <p>Please Wait for the Admin to accept your Request</p>
        <p>Email: {user.email}</p>
          <Glogout />
      </div>
    );
  }

  const styles = {
    container: {
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial',
      color: '#333'
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      marginTop: '20px'
    },
    button: {
      marginTop: '30px',
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#4285f4',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer'
    }
  };

  export default HomePageuser;
