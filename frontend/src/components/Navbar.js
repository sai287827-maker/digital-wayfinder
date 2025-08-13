import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';
import UserProfilePopover from './UserProfilePopover';
import HelpDocPopover from './HelpDocPopover';
 
function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
 
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
 
  // Helper function to check if a nav item should be active
  const isNavItemActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
   
    // For digital-wayfinder, check if current path starts with /digital-wayfinder
    if (path === '/digital-wayfinder') {
      return location.pathname.startsWith('/digital-wayfinder');
    }
   
    // For decision-tree, check if current path starts with /decision-tree
    if (path === '/decision-tree') {
      return location.pathname.startsWith('/decision-tree');
    }
   
    // For report, check if current path starts with /report
    if (path === '/report') {
      return location.pathname.startsWith('/report');
    }
   
    return location.pathname === path;
  };
 
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="Digital Wayfinder logo" width="40" height="40" />
          <span>Digital Wayfinder</span>
        </Link>
 
        {/* Mobile Menu Toggle Button */}
        <button
          className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
 
        {/* Navigation Menu */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-item ${isNavItemActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/digital-wayfinder"
            className={`nav-item ${isNavItemActive('/digital-wayfinder') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Digital Wayfinder
          </Link>
          <Link
            to="/decision-tree"
            className={`nav-item ${isNavItemActive('/decision-tree') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Decision Tree
          </Link>
          <Link
            to="/report"
            className={`nav-item ${isNavItemActive('/report') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Report
          </Link>
        </div>
 
        {/* Icon Buttons */}
        <div className="nav-icons">
          <button className="icon-button" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div
            className="help-icon-wrapper"
            onMouseEnter={() => setShowHelp(true)}
            onMouseLeave={() => setShowHelp(false)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button className="icon-button" aria-label="Help">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 18.01L12.01 17.9989" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showHelp && <HelpDocPopover />}
          </div>
          <div
            className="profile-icon-wrapper"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <button className="icon-button" aria-label="User profile">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37 C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37 A7 7 0 0 0 8 1"/>
              </svg>
            </button>
            {showProfile && <UserProfilePopover />}
          </div>
        </div>
 
        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
}
 
export default Navbar;