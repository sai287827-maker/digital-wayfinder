import React from 'react';
import './UserProfilePopover.css';

const UserProfilePopover = () => {
  return (
    <div className="user-profile-popover">
      <div className="user-profile-header">
        <div className="user-avatar">RM</div>
        <div>
          <div className="user-name">Rashmi Math</div>
          <div className="user-email">rashmi.k.g.math@email.com</div>
        </div>
      </div>
      <button className="logout-btn">Logout</button>
    </div>
  );
};

export default UserProfilePopover; 