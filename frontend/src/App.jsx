import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';
import logo from './assets/logo.jpg'; //  Импортируем логотип

function App() {
  return (
    <Router>
      <div className="app-wrapper">
      <header>
        <img src={logo} alt="Логотип" className="logo" /> {/* Используем импортированный логотип */}

        <nav>
          <Link to="/">Проверка текста</Link>
          <Link to="/about">О нас</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;
