import { useState } from 'react'
import './App.css'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="app">
      {/* Кнопка меню (бургер) - видна только на мобильных */}
      <button 
        className={`mobile-menu-button ${isMenuOpen ? 'hidden' : ''}`}
        onClick={toggleMenu}
        aria-label="Открыть меню"
      >
        ☰
      </button>

      {/* Боковое меню */}
      <nav className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <button 
            className="menu-close-button"
            onClick={toggleMenu}
            aria-label="Закрыть меню"
          >
            &times;
          </button>
        </div>
        
        <button className="menu-item" onClick={() => alert('Переход на Склады')}>
          Склады
        </button>
        <button className="menu-item" onClick={() => alert('Переход на Статистику')}>
          Статистика
        </button>
        <button className="menu-item" onClick={() => alert('Переход на Историю')}>
          История
        </button>
      </nav>

      {/* Основное содержимое */}
      <main className="main-content" onClick={() => isMenuOpen && toggleMenu()}>
        <div className="logo-container">
          <div className="logo-placeholder">Лого</div>
          <p className="logo-subtitle">Система складского учёта</p>
        </div>
      </main>
      {isMenuOpen && (
  <div 
    className="menu-overlay"
    onClick={toggleMenu}
    aria-hidden="true"
  />
)}
    </div>
    
  )
}

export default App