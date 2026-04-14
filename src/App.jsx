import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="app-container">
      {/* Background Ambience */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Main Content Card */}
      <main className="glass-card" style={{ animationDelay: '0.2s' }}>
        <header className="card-header">
          <span className="badge">Vite + React</span>
          <h1 className="title">Next-Gen Web Apps</h1>
          <p className="subtitle">
            Experience blazing fast development with a premium, dynamic interface out of the box. 
            Built for modern aesthetics and high performance.
          </p>
        </header>

        <section className="features-grid">
          <div className="feature-item" style={{ animation: 'fadeIn 0.5s ease 0.4s both' }}>
            <div className="icon-wrapper icon-purple">⚡</div>
            <h3 className="feature-title">Instant Server Start</h3>
            <p className="feature-desc">On demand file serving over native ESM, no bundling required!</p>
          </div>
          
          <div className="feature-item" style={{ animation: 'fadeIn 0.5s ease 0.5s both' }}>
            <div className="icon-wrapper icon-blue">🔥</div>
            <h3 className="feature-title">Lightning HMR</h3>
            <p className="feature-desc">Hot Module Replacement (HMR) that stays fast regardless of app size.</p>
          </div>
          
          <div className="feature-item" style={{ animation: 'fadeIn 0.5s ease 0.6s both' }}>
            <div className="icon-wrapper icon-pink">🎨</div>
            <h3 className="feature-title">Premium Design</h3>
            <p className="feature-desc">Pre-configured with modern glassmorphism, gradients and smooth animations.</p>
          </div>
        </section>

        <footer className="card-actions" style={{ animation: 'fadeIn 0.5s ease 0.7s both' }}>
          <button className="btn btn-primary">
            Get Started
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            Documentation
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
