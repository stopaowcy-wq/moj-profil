import React, { useState } from 'react';
import './App.css';
import { FaSpotify, FaYoutube, FaSteam, FaInstagram, FaFacebook } from 'react-icons/fa';
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
import videoBg from './assets/background.mp4';

function App() {
  const [muted, setMuted] = useState(true);

  return (
    <div className="main-wrapper">
      <video autoPlay loop muted={muted} playsInline className="video-bg">
        <source src={videoBg} type="video/mp4" />
      </video>

      <button className="sound-toggle" onClick={() => setMuted(!muted)}>
        {muted ? "Włącz dźwięk" : "Wycisz"}
      </button>

      <div className="profile-card">
        <img src={mojAvatar} alt="Avatar" className="avatar" />
        <h1>STOPA</h1>
        <div className="socials">
          <a href="https://open.spotify.com/user/31o3vpjvf54nu3u7cbh4uftwslpa" target="_blank"><FaSpotify /></a>
          <a href="https://www.youtube.com/@stopa4203" target="_blank"><FaYoutube /></a>
          <a href="https://steamcommunity.com/profiles/76561198880818625/" target="_blank"><FaSteam /></a>
          <a href="https://www.instagram.com/marcin_maziarz433/" target="_blank"><FaInstagram /></a>
          <a href="https://www.facebook.com/marcin.maziarz.545" target="_blank"><FaFacebook /></a>
        </div>
      </div>
    </div>
  );
}

export default App;