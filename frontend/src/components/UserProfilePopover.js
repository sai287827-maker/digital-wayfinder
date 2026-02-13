import React from 'react';
import './UserProfilePopover.css';
//import { useAuth } from '../contexts/AuthContext';

const UserProfilePopover = () => {
 // const { user, logout } = useAuth();

  return (
    <div className="user-profile-popover">
      <div className="user-profile-header">
        <div className="user-avatar">TU</div>
        <div>
          <div className="user-name">Test User</div>
          <div className="user-email">test@example.com</div>
        </div>
      </div>
      {/* <button className="logout-btn" onClick={logout}>
        Logout
      </button> */}
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default UserProfilePopover;