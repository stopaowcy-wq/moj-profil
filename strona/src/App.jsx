import React, { useState } from 'react';
import './App.css';
import { FaSpotify, FaYoutube, FaSteam, FaInstagram, FaFacebook, FaVolumeUp, FaVolumeMute, FaDownload, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import CryptoJS from 'crypto-js'; 
import mojAvatar from './assets/baf4e793-29af-44d1-9e44-1d8c27f6295b.jpg';
import videoBg from './assets/background.mp4';

const BUCKET_NAME = "galeria-marcina";
const BUCKET_URL = `https://f005.backblazeb2.com/file/${BUCKET_NAME}`;

// Twój poprawny, zahaszowany klucz (odpowiedź: "pandupa")
const EXPECTED_HASH = "8dabc1bfc3c597297a39e3fe1bc9af39da048b9802bd995f43c46caa8381a715";

function App() {
  const [muted, setMuted] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [answer, setAnswer] = useState("");
  
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [activeFolder, setActiveFolder] = useState(null); 
  const [lightboxIndex, setLightboxIndex] = useState(null); 

  // ==========================================
  // BEZPIECZNA WERYFIKACJA I POBIERANIE
  // ==========================================
  const checkAnswerAndFetch = async () => {
    const preparedAnswer = answer.toLowerCase().replace(/\s/g, '');
    
    if (!preparedAnswer) {
      alert("Wpisz odpowiedź!");
      return;
    }

    // Generujemy hash wpisanej odpowiedzi
    const inputHash = CryptoJS.SHA256(preparedAnswer).toString();

    // Jeśli hash się nie zgadza, natychmiast przerywamy i nie wysyłamy żadnych zapytań do API
    if (inputHash !== EXPECTED_HASH) {
      alert("Źle! Pomyśl jeszcze raz.");
      return;
    }

    setLoading(true);

    try {
      // Pobieramy listę plików dopiero PO pomyślnej weryfikacji hasła w przeglądarce
      const response = await fetch('/api/gallery');
      if (!response.ok) throw new Error("Problem z pobraniem danych z chmury");

      const text = await response.text();
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const keys = Array.from(xmlDoc.getElementsByTagName("Key")).map(el => el.textContent);

      const folderMap = {};

      keys.forEach(key => {
        if (key.endsWith('/') || key.startsWith('.') || key.includes('.bzEmpty')) return;

        const parts = key.split('/');
        if (parts.length > 1) {
          const rawFolderName = parts[0];
          const encodedKey = key.split('/').map(segment => encodeURIComponent(segment)).join('/');
          const fullUrl = `${BUCKET_URL}/${encodedKey}`;

          if (!folderMap[rawFolderName]) {
            const cleanName = rawFolderName
              .replace(/[-_]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            folderMap[rawFolderName] = {
              id: rawFolderName,
              nazwa: cleanName,
              okladka: fullUrl, 
              zdjecia: []
            };
          }
          folderMap[rawFolderName].zdjecia.push(fullUrl);
        }
      });

      setGalleryData(Object.values(folderMap));
      setShowGallery(true); // Pokazujemy galerię dopiero po poprawnym załadowaniu struktury plików

    } catch (error) {
      console.error("Błąd ładowania galerii:", error);
      alert("Wystąpił błąd podczas łączenia z chmurą. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async (e, url) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Problem z pobieraniem pliku");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = decodeURIComponent(url.split('/').pop());
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Błąd pobierania bezpośredniego, otwieranie w nowym oknie:", error);
      window.open(url, '_blank');
    }
  };

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

  if (showGallery) {
    return (
      <div className="gallery-view">
        <div className="gallery-header">
          {activeFolder ? (
            <button className="back-btn" onClick={() => { setActiveFolder(null); setLightboxIndex(null); }}>
              <FaArrowLeft /> Powrót do folderów
            </button>
          ) : (
            <button className="back-btn" onClick={() => { setShowGallery(false); setAnswer(""); }}>Wyjdź z Galerii</button>
          )}
          <h2>
            {activeFolder ? activeFolder.nazwa : "Galeria dla ziomków"}
          </h2>
        </div>

        <div className="gallery-content">
          {loading ? (
            <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Ładowanie zdjęć z chmury...</div>
          ) : (
            <>
              {!activeFolder && (
                <div className="folders-grid">
                  {galleryData.map((folder) => (
                    <div key={folder.id} className="folder-card" onClick={() => setActiveFolder(folder)}>
                      <div className="folder-thumbnail">
                        <img src={folder.okladka} alt={folder.nazwa} loading="lazy" />
                        <span className="photos-count">{folder.zdjecia.length} zdjęć</span>
                      </div>
                      <h3>{folder.nazwa}</h3>
                    </div>
                  ))}
                  {galleryData.length === 0 && (
                    <div style={{ color: 'gray', textAlign: 'center', gridColumn: '1/-1' }}>Brak folderów w chmurze.</div>
                  )}
                </div>
              )}

              {activeFolder && (
                <div className="photos-grid">
                  {activeFolder.zdjecia.map((fotoUrl, index) => (
                    <div key={index} className="photo-card" onClick={() => setLightboxIndex(index)}>
                      <img src={fotoUrl} alt={`Fotka ${index}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {activeFolder && lightboxIndex !== null && (
          <div className="lightbox-overlay" onClick={() => setLightboxIndex(null)}>
            <button className="lightbox-close" onClick={() => setLightboxIndex(null)}><FaTimes /></button>
            <button className="lightbox-nav prev" onClick={prevImage}><FaArrowLeft /></button>
            
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={activeFolder.zdjecia[lightboxIndex]} alt="Powiększenie" />
              <div className="lightbox-toolbar">
                <span>Zdjęcie {lightboxIndex + 1} z {activeFolder.zdjecia.length}</span>
                <button className="download-btn" onClick={(e) => downloadImage(e, activeFolder.zdjecia[lightboxIndex])}>
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
            <p style={{fontSize: '14px', marginBottom: '5px'}}>Aby przejść do Zdjęć, napisz <br /> Jak inaczej mówimy na Pana Maziarza?</p>
            <input 
              type="password" 
              placeholder={loading ? "Weryfikacja..." : "Odpowiedź..."}
              disabled={loading}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && !loading && checkAnswerAndFetch()}
            />
            <button onClick={checkAnswerAndFetch} disabled={loading}>
              {loading ? "Ładowanie..." : "Wejdź"}
            </button>
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