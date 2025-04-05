import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Link, useLocation } from 'react-router-dom';
import './Sidebar.scss';
import SpotifyLogo from '../../assets/img/spotify.png';
import Profile from '../../assets/img/profile.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Auto close sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [location]);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>

      {/* Full-screen overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="logo">
          <img src={SpotifyLogo} alt="Spotify" />
        </Link>
        
        <Nav className="flex-column">
          <Nav.Item>
            <NavLink to="/" className="nav-link" end>
              <span>For You</span>
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/top-tracks" className="nav-link">
              <span>Top Tracks</span>
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/favorites" className="nav-link">
              <span>Favorites</span>
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/recently-played" className="nav-link">
              <span>Recently Played</span>
            </NavLink>
          </Nav.Item>
        </Nav>
        
        <div className="sidebar-footer">
          <img src={Profile} alt="profile" />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
