import React from 'react';
import './navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar(props){
    const navigate = useNavigate();
    return(
        <header>
            <div className="navbar">
            <h1>Logo</h1>

            <div className="user-menu">
                <button onClick={() => navigate("/login")} className='login'>LOGIN</button>

            </div>
            </div>
        </header>
    )
}
export default Navbar;