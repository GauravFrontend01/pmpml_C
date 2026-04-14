import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-circle">
          <img src="/pmpml_logo_1776152853531.png" alt="PMPML Logo" />
        </div>
        <div className="profile-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="कुठे जायचे आहे ?" readOnly />
        </div>
      </section>

      {/* Main Actions */}
      <section className="actions-main">
        <div className="action-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
             <path d="M4 6V4h16v2H4zm0 14h16v-2H4v2zm0-4h16v-2H4v2zm0-4h16v-2H4v2z" opacity=".3"/>
             <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 6h16v3H4V6zm0 12v-7h16v7H4z"/>
          </svg>
          <span className="action-text">Bus Ticket</span>
        </div>
        <div className="action-card">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span className="action-text">Daily Pass</span>
        </div>
      </section>

      {/* Secondary Actions */}
      <section className="actions-secondary">
        <div className="action-card-small">
          <div style={{color: '#FFD700', fontSize: '24px'}}>🎫</div>
          <span className="action-text">View Ticket</span>
        </div>
        <div className="action-card-small">
          <div style={{color: '#FFD700', fontSize: '24px'}}>🎫</div>
          <span className="action-text">View Pass</span>
        </div>
        <div className="action-card-small">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
          <span className="action-text" style={{fontSize: '0.75rem'}}>Route Time Table</span>
        </div>
        <div className="action-card-small">
          <div className="metro-logo" style={{width: '24px', height: '24px', borderRadius: '50%', border: '2px solid #0056b3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#0056b3', fontWeight: 'bold'}}>M</div>
          <span className="action-text">Metro Ticket</span>
        </div>
      </section>

      {/* Near Me Section */}
      <section className="near-me">
        <div className="section-header">
          <h2 className="section-title">Near Me</h2>
          <span className="show-all">Show all</span>
        </div>
        <div className="near-me-card">
          <div className="stop-header">
            <div className="stop-info">
              <div className="bus-icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 11H6V6h12v5zM4 16c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-3.5c0-3.5-3.58-4.5-8-4.5s-8 1-8 4.5V16zm13.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-11 0c-.83 0-1.5.67-1.5 1.5S5.67 21 6.5 21 8 20.33 8 19.5 7.33 18 6.5 18z"/>
                </svg>
              </div>
              <span className="stop-name">Guru Krupa Hospital Bus Stop</span>
            </div>
            <span className="distance">659 m</span>
          </div>
          <div className="bus-item">
            <div className="bus-number-badge">313</div>
            <span className="bus-destination">Chinchwadgaon</span>
            <div className="bus-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2c-4 0-8 .5-8 4v9.5c0 .8.7 1.5 1.5 1.5h1c.8 0 1.5-.7 1.5-1.5V14h8v1.5c0 .8.7 1.5 1.5 1.5h1c.8 0 1.5-.7 1.5-1.5V6c0-3.5-3.58-4-8-4zM6.5 14c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm11 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM17 9H7V5h10v4z"/>
              </svg>
              <span className="status-now">Now</span>
            </div>
          </div>
          <div className="see-more">
            See more Buses
          </div>
        </div>
      </section>

      {/* Footer Nav */}
      <nav className="bottom-nav">
        <a href="#" className="nav-item active">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">📍</span>
          <span>Buses</span>
        </a>
        <a href="#" className="nav-item">
          <span className="nav-icon">❓</span>
          <span>Help</span>
        </a>
      </nav>
    </div>
  );
};

export default App;
