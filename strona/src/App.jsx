import React, { useState } from 'react';
import './App.css';
import { FaSpotify, FaYoutube, FaSteam, FaInstagram, FaFacebook, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import CryptoJS from 'crypto-js'; 
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
import videoBg from './assets/background.mp4';

function App() {
  const [muted, setMuted] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [answer, setAnswer] = useState("");

  // To jest hash dla słowa "pandupa"
  const CORRECT_HASH = "8dabc1bfc3c597297a39e3fe1bc9af39da048b9802bd995f43c46caa8381a715";

  const checkAnswer = () => {
    // Przygotowanie wartości
    const preparedAnswer = answer.toLowerCase().replace(/\s/g, '');
    const inputHash = CryptoJS.SHA256(preparedAnswer).toString();
    
    // Dodane logowanie do konsoli dla łatwiejszego debugowania
    console.log("Wpisana odpowiedź:", preparedAnswer);
    console.log("Wygenerowany hash:", inputHash);
    console.log("Czy hash pasuje?", inputHash === CORRECT_HASH);
    
    if (inputHash === CORRECT_HASH) {
      setShowGallery(true);
    } else {
      alert("Źle! Pomyśl jeszcze raz.");
    }
  };

  if (showGallery) {
    return (
      <div className="main-wrapper gallery-view">
        <button className="back-btn" onClick={() => setShowGallery(false)}>Powrót</button>
        <h2>Galeria dla ziomków</h2>
        <p>Tu w przyszloci gowno</p>
      </div>
    );
  }

  return (
    <>
      <button className="sound-toggle" onClick={() => setMuted(!muted)} title={muted ? "Włącz dźwięk" : "Wycisz"}>
        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>

      <div className="main-wrapper">
        <video autoPlay loop muted={muted} playsInline className="video-bg">
          <source src={videoBg} type="video/mp4" />
        </video>

        <div className="profile-card">
          <img src={mojAvatar} alt="Avatar" className="avatar" />
          <h1>Marcin</h1>
          
          <div className="gallery-login">
            <p style={{fontSize: '14px', marginBottom: '5px'}}>Jak inaczej mówimy na Pana Maziarza?</p>
            <input 
              type="text" 
              placeholder="Odpowiedź..." 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)} 
            />
            <button onClick={checkAnswer}>Wejdź</button>
          </div>

          <div className="socials">
            <a href="https://open.spotify.com/user/31o3vpjvf54nu3u7cbh4uftwslpa" target="_blank" rel="noreferrer"><FaSpotify /></a>
            <a href="https://www.youtube.com/@stopa4203" target="_blank" rel="noreferrer"><FaYoutube /></a>
            <a href="https://steamcommunity.com/profiles/76561198880818625/" target="_blank" rel="noreferrer"><FaSteam /></a>
            <a href="https://www.instagram.com/marcin_maziarz433/" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com/marcin.maziarz.545" target="_blank" rel="noreferrer"><FaFacebook /></a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;