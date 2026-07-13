import React from 'react';
import './App.css';
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
function App() {
  return (
    <div className="profile-card">
      <img src={mojAvatar} alt="Avatar" className="avatar" />
      <h1>STOPA</h1>
<div className="socials">
  <a href="https://open.spotify.com/user/31o3vpjvf54nu3u7cbh4uftwslpa?si=d92c8c77521c4e9b" target="_blank">Spotify</a>
  <a href="https://www.youtube.com/@stopa4203" target="_blank">   YouTube</a>
  <a href="https://steamcommunity.com/profiles/76561198880818625/" target="_blank">   Steam</a>
  <a href="https://www.instagram.com/marcin_maziarz433/" target="_blank">   Instagram</a>
  <a href="https://www.facebook.com/marcin.maziarz.545?locale=pl_PL" target="_blank">   Facebook</a>
</div>
    </div>
  );
}

export default App;