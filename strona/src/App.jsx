import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <nav>
        <a href="#home">Start</a>
        <a href="#galeria">Galeria</a>
        <a href="#kontakt">Kontakt</a>
      </nav>

      <section id="home">
        <h1>Witaj na mojej stronie</h1>
      </section>

      <section id="galeria">
        <h2>Moja Galeria</h2>
        <div className="grid">
          {/* Tu w przyszłości wstawimy zdjęcia */}
          <div className="zdjecie">Zdjęcie 1</div>
          <div className="zdjecie">Zdjęcie 2</div>
        </div>
      </section>
    </div>
  );
}

export default App;