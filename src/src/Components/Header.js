import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate(); 

  const handleLogoClick = () => {
    navigate('/'); // Ana sayfaya yönlendir
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-left">
          <div className="logo" onClick={handleLogoClick}></div>
        </div>
        <div className="navbar-right">
          <button className="nav-button">Docs</button>
          <button className="nav-button">About</button>
          <button className="nav-button support-button" id="support-us">Support Us</button>
        </div>
      </nav>
      <div className="title">The Rick and Morty API</div>
    </header>
  );
}

export default Header;
