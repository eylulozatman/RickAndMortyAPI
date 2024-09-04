import React, { useEffect, useState } from 'react';
import './Footer.css';

function Footer() {
  const [characterCount, setCharacterCount] = useState(0);
  const [locationCount, setLocationCount] = useState(0);
  const [episodeCount, setEpisodeCount] = useState(0);

  useEffect(() => {
    // Character count
    fetch('https://rickandmortyapi.com/api/character')
      .then(response => response.json())
      .then(data => setCharacterCount(data.info.count));

    // Location count
    fetch('https://rickandmortyapi.com/api/location')
      .then(response => response.json())
      .then(data => setLocationCount(data.info.count));

    // Episode count
    fetch('https://rickandmortyapi.com/api/episode')
      .then(response => response.json())
      .then(data => setEpisodeCount(data.info.count));
  }, []);

  return (
    <footer className="footer">
      <div className="footer-section api-list">
        <div onClick={() => window.location.href = 'https://rickandmortyapi.com/api/character'}>
          Characters: {characterCount}
        </div>
        <div onClick={() => window.location.href = 'https://rickandmortyapi.com/api/location'}>
          Locations: {locationCount}
        </div>
        <div onClick={() => window.location.href = 'https://rickandmortyapi.com/api/episode'}>
          Episodes: {episodeCount}
        </div>
      </div>
      <div className="footer-section server-stat" onClick={() => window.location.href = 'https://status.rickandmortyapi.com/'}>
        
        <p>Server Status</p>
       
        <span className="green-dot"> </span>
      </div>
      <div className="footer-section logos">
        <img src="https://iconape.com/wp-content/files/an/371180/svg/371180.svg" alt="Netlify Logo" />
        <img src="https://boldstart.vc/wp-content/uploads/2023/12/wordmark-stellate-invert.png" alt="Stellate Logo" />
      </div>
      <div className="footer-section social-media-logos">
        <i className="fab fa-github"></i>
        <i className="fab fa-twitter"></i>
        <i className="fas fa-heart"></i>
      </div>
      <div className="footer-section by-alex">
        <p>❮❯ by Axel Fuhrmann 2024</p>
      </div>
    </footer>
  );
}

export default Footer;
