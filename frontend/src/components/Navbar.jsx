// src/components/Navbar.jsx
// Responsive top navigation bar for the Pet Management app

import React from 'react';

function Navbar({ petCount }) {
  return (
    <nav className="navbar app-navbar">
      <div className="container">

        {/* Brand / App Name */}
        <a className="navbar-brand" href="#">
          <span className="brand-icon">🐾</span>
          Pet Management System
        </a>

        {/* Pet count badge — updates live */}
        <span className="nav-badge">
          {petCount} {petCount === 1 ? 'Pet' : 'Pets'} Registered
        </span>

      </div>
    </nav>
  );
}

export default Navbar;
