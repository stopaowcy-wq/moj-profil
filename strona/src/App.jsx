import React from 'react';
import './App.css';
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
import { FaSpotify, FaYoutube, FaSteam, FaInstagram, FaFacebook } from 'react-icons/fa';
function App() {
  return (
    <div className="profile-card">
      <img src={mojAvatar} alt="Avatar" className="avatar" />
      <h1>Marcin</h1>
<div className="socials">
  <a href="TWÓJ_LINK_SPOTIFY" target="_blank"><FaSpotify /></a>
  <a href="https://www.youtube.com/@stopa4203" target="_blank"><FaYoutube /></a>
  <a href="https://steamcommunity.com/profiles/76561198880818625/" target="_blank"><FaSteam /></a>
  <a href="https://www.instagram.com/marcin_maziarz433/" target="_blank"><FaInstagram /></a>
  <a href="https://www.facebook.com/marcin.maziarz.545" target="_blank"><FaFacebook /></a>
</div>
    </div>
  );
}

export default App;