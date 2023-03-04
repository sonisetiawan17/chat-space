import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase';
import '../styles/Navbar.scss';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="logo">
        <h4>Chat Space</h4>
      </div>
      <div className="avatar">
        <img src={currentUser.photoURL} alt="User" />
        <button onClick={() => signOut(auth)}>
          <FiLogOut className="btnLogout" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
