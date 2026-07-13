import React from 'react';
import './App.css';

function App() {
  return (
    <div className="profile-card">
      <img src="https://via.placeholder.com/100" alt="Avatar" className="avatar" />
      <h1>Navi</h1>
      <p>If I were you, you would be mine</p>
      <div className="socials">
        <a href="https://spotify.com">Spotify</a> | 
        <a href="https://twitch.tv"> Twitch</a> | 
        <a href="https://steam.com"> Steam</a>
      </div>
    </div>
  );
}

export default App;