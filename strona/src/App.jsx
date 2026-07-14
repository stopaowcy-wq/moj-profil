import React, { useState } from 'react';
import './App.css';
import { FaSpotify, FaYoutube, FaSteam, FaInstagram, FaFacebook, FaVolumeUp, FaVolumeMute, FaDownload, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import CryptoJS from 'crypto-js'; 
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
import videoBg from './assets/background.mp4';

// ==========================================
// 1. STRUKTURA TWOICH ZDJĘĆ Z BACKBLAZE B2
// ==========================================
// Poniżej znajduje się główny adres URL do Twojego kubełka w chmurze
const BUCKET_URL = "https://f005.backblazeb2.com/file/galeria-marcina";

const GALERIA_DATA = [
  {
    id: "sojklub",
    nazwa: "Sojklub",
    // Link do zdjęcia na okładkę (wpisz nazwę jednego z plików w tym folderze, np. zdjecie1.jpg)
    okladka: `${BUCKET_URL}/sojklub/NAZWA_OKLADKI.jpg`, 
    zdjecia: [
      `${BUCKET_URL}/sojklub/ZDJECIE_1.jpg`,
      `${BUCKET_URL}/sojklub/ZDJECIE_2.jpg`,
      // Dopisz tutaj resztę nazw plików z tego folderu
    ]
  },
  {
    id: "sokolniki",
    nazwa: "Sokolniki",
    okladka: `${BUCKET_URL}/Sokolniki/NAZWA_OKLADKI.jpg`,
    zdjecia: [
      `${BUCKET_URL}/Sokolniki/ZDJECIE_1.jpg`,
      `${BUCKET_URL}/Sokolniki/ZDJECIE_2.jpg`,
      // Dopisz tutaj resztę nazw plików z tego folderu
    ]
  },
  {
    id: "solina",
    nazwa: "Solina",
    okladka: `${BUCKET_URL}/Solina/NAZWA_OKLADKI.jpg`,
    zdjecia: [
      `${BUCKET_URL}/Solina/ZDJECIE_1.jpg`,
      `${BUCKET_URL}/Solina/ZDJECIE_2.jpg`,
      // Dopisz tutaj resztę nazw plików z tego folderu
    ]
  },
  {
    id: "urodziny-joli",
    nazwa: "Urodziny Joli",
    okladka: `${BUCKET_URL}/urodziny%20joli/NAZWA_OKLADKI.jpg`, // Spacja zamieniona na %20, ponieważ linki URL nie mogą mieć spacji
    zdjecia: [
      `${BUCKET_URL}/urodziny%20joli/ZDJECIE_1.jpg`,
      `${BUCKET_URL}/urodziny%20joli/ZDJECIE_2.jpg`,
      // Dopisz tutaj resztę nazw plików z tego folderu
    ]
  },
  {
    id: "waldom-kompres",
    nazwa: "Waldom Kompres",
    okladka: `${BUCKET_URL}/Waldom%20Kompres/NAZWA_OKLADKI.jpg`, // Spacja zamieniona na %20
    zdjecia: [
      `${BUCKET_URL}/Waldom%20Kompres/ZDJECIE_1.jpg`,
      `${BUCKET_URL}/Waldom%20Kompres/ZDJECIE_2.jpg`,
      // Dopisz tutaj resztę nazw plików z tego folderu
    ]
  }
];

function App() {
  const [muted, setMuted] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [answer, setAnswer] = useState("");
  
  // Stany dla nawigacji w galerii
  const [activeFolder, setActiveFolder] = useState(null); // NULL = widok listy folderów
  const [lightboxIndex, setLightboxIndex] = useState(null); // NULL = zamknięty podgląd zdjęcia

  const CORRECT_HASH = "8dabc1bfc3c597297a39e3fe1bc9af39da048b9802bd995f43c46caa8381a715";

  const checkAnswer = () => {
    const preparedAnswer = answer.toLowerCase().replace(/\s/g, '');
    const inputHash = CryptoJS.SHA256(preparedAnswer).toString();
    
    console.log("Wpisana odpowiedź:", preparedAnswer);
    console.log("Wygenerowany hash:", inputHash);
    console.log("Czy hash pasuje?", inputHash === CORRECT_HASH);
    
    if (inputHash === CORRECT_HASH) {
      setShowGallery(true);
    } else {
      alert("Źle! Pomyśl jeszcze raz.");
    }
  };

  // Funkcja ułatwiająca pobieranie plików
  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    // Wyciąga oryginalną nazwę pliku z adresu URL
    link.download = url.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Obsługa przełączania zdjęć w Lightboxie
  const nextImage = (e) => {
    e.stopPropagation();
    if (activeFolder && lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev + 1) % activeFolder.zdjecia.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (activeFolder && lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev - 1 + activeFolder.zdjecia.length) % activeFolder.zdjecia.length);
    }
  };

  // ==========================================
  // WIDOK GALERII (PO ZALOGOWANIU)
  // ==========================================
  if (showGallery) {
    return (
      <div className="main-wrapper gallery-view">
        {/* Pasek nawigacji u góry */}
        <div className="gallery-header">
          {activeFolder ? (
            <button className="back-btn" onClick={() => { setActiveFolder(null); setLightboxIndex(null); }}>
              <FaArrowLeft /> Powrót do folderów
            </button>
          ) : (
            <button className="back-btn" onClick={() => setShowGallery(false)}>Wyjdź z Galerii</button>
          )}
          <h2>{activeFolder ? activeFolder.nazwa : "Galeria dla ziomków"}</h2>
        </div>

        <div className="gallery-content">
          {/* Sytuacja A: Widok listy folderów */}
          {!activeFolder && (
            <div className="folders-grid">
              {GALERIA_DATA.map((folder) => (
                <div key={folder.id} className="folder-card" onClick={() => setActiveFolder(folder)}>
                  <div className="folder-thumbnail">
                    <img src={folder.okladka} alt={folder.nazwa} loading="lazy" />
                    <span className="photos-count">{folder.zdjecia.length} zdjęć</span>
                  </div>
                  <h3>{folder.nazwa}</h3>
                </div>
              ))}
            </div>
          )}

          {/* Sytuacja B: Widok wnętrza konkretnego folderu */}
          {activeFolder && (
            <div className="photos-grid">
              {activeFolder.zdjecia.map((fotoUrl, index) => (
                <div key={index} className="photo-card" onClick={() => setLightboxIndex(index)}>
                  <img src={fotoUrl} alt={`Fotka ${index}`} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ==========================================
            LIGHTBOX - POWIĘKSZENIE I POBIERANIE ZDJĘCIA
            ========================================== */}
        {activeFolder && lightboxIndex !== null && (
          <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}><FaTimes /></button>
            
            <button className="lightbox-nav prev" onClick={prevImage}><FaArrowLeft /></button>
            
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={activeFolder.zdjecia[lightboxIndex]} alt="Powiększenie" />
              
              <div className="lightbox-toolbar">
                <span>Zdjęcie {lightboxIndex + 1} z {activeFolder.zdjecia.length}</span>
                <button className="download-btn" onClick={() => downloadImage(activeFolder.zdjecia[lightboxIndex])}>
                  <FaDownload /> Pobierz oryginalne
                </button>
              </div>
            </div>
            
            <button className="lightbox-nav next" onClick={nextImage}><FaArrowRight /></button>
          </div>
        )}
      </div>
    );
  }

  // Oryginalny ekran powitalny
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
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
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