import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const App = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const [buses, setBuses] = useState([
    { id: 1, pos: [18.5204, 73.8567], vel: [0.000015, 0.00002], num: '43' },
    { id: 2, pos: [18.5304, 73.8667], vel: [-0.00002, 0.000015], num: '312' },
    { id: 3, pos: [18.5104, 73.8467], vel: [0.000025, -0.00001], num: '64' },
    { id: 4, pos: [18.5404, 73.8767], vel: [-0.000015, -0.000025], num: '102' },
    { id: 5, pos: [18.5254, 73.8627], vel: [0.00001, -0.00001], num: '313' },
  ]);
  const busMarkers = useRef({});
  const stopMarkers = useRef([]);

  useEffect(() => {
    if (activeTab === 'Buses' && mapRef.current && !leafletMap.current) {
        // Initialize Leaflet map
        const L = window.L;
        if (L) {
          leafletMap.current = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
          }).setView([18.5204, 73.8567], 14); // Slightly zoomed in

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© CartoDB'
          }).addTo(leafletMap.current);

          // Add static bus stops with larger spread
          const stops = [
            [18.5254, 73.8617], [18.5354, 73.8717], [18.5154, 73.8517],
            [18.5454, 73.8817], [18.5104, 73.8367], [18.5204, 73.8467],
            [18.5004, 73.8567], [18.5304, 73.8467], [18.5604, 73.8967],
            [18.4904, 73.8267], [18.5804, 73.8167], [18.5104, 73.9167],
            [18.4704, 73.8567], [18.5404, 73.7867], [18.5904, 73.8667]
          ];

          stops.forEach(stop => {
            const stopIcon = L.divIcon({
              className: 'custom-stop-icon',
              html: `<div class="stop-marker-red">B</div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            });
            const marker = L.marker(stop, { icon: stopIcon }).addTo(leafletMap.current);
            stopMarkers.current.push(marker);
          });

          // Add location marker
          const locationIcon = L.divIcon({
            className: 'location-marker-container',
            html: `<div class="location-pulse"></div><div class="location-center"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          L.marker([18.5224, 73.8587], { icon: locationIcon }).addTo(leafletMap.current);
        }
    }

    // Bus movement animation
    let interval;
    if (activeTab === 'Buses' && leafletMap.current) {
      interval = setInterval(() => {
        setBuses(prevBuses => prevBuses.map(bus => {
          const newLat = bus.pos[0] + bus.vel[0];
          const newLng = bus.pos[1] + bus.vel[1];
          
          // Update marker position directly for performance
          if (busMarkers.current[bus.id]) {
            busMarkers.current[bus.id].setLatLng([newLat, newLng]);
          } else if (leafletMap.current) {
            const L = window.L;
            const busIcon = L.divIcon({
              className: 'custom-bus-icon',
              html: `<div class="moving-bus-marker"><span>${bus.num}</span></div>`,
              iconSize: [40, 20],
              iconAnchor: [20, 10]
            });
            busMarkers.current[bus.id] = L.marker([newLat, newLng], { icon: busIcon }).addTo(leafletMap.current);
          }

          return { ...bus, pos: [newLat, newLng] };
        }));
      }, 100); // 10fps for smooth movement
    }

    return () => {
      if (interval) clearInterval(interval);
      if (activeTab !== 'Buses' && leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        busMarkers.current = {};
        stopMarkers.current = [];
      }
    };
  }, [activeTab]);
  return (
    <div className="app-container">
      {activeTab === 'Home' ? (
        <>
          {/* Header */}
          <header className="header">
            <div className="logo-circle">
              <img src="/pmpml_logo_1776152853531.png" alt="PMPML Logo" />
            </div>
            <div className="flex items-center" style={{ gap: '15px' }}>
              <NotificationsIcon style={{ fontSize: '28px', color: '#333' }} />
              <AccountCircleIcon style={{ fontSize: '40px', color: '#000' }} />
            </div>
          </header>

          {/* Search Section */}
          <section className="search-section">
            <div className="search-bar" onClick={() => setShowSearch(true)}>
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
                <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>
              </svg>
              <span className="action-text">Bus Ticket</span>
            </div>
            <div className="action-card">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
              </svg>
              <span className="action-text">Daily Pass</span>
            </div>
          </section>

          {/* Secondary Actions */}
          <section className="actions-secondary">
            <div className="action-card-small">
              <img src="/ticket.png" alt="Ticket" style={{ width: '30px', height: 'auto' }} />
              <span className="action-text">View Ticket</span>
            </div>
            <div className="action-card-small">
              <img src="/ticket.png" alt="Pass" style={{ width: '30px', height: 'auto' }} />
              <span className="action-text">View Pass</span>
            </div>
            <div className="action-card-small">
              <AltRouteIcon style={{ fontSize: '30px', color: '#333' }} />
              <span className="action-text" style={{fontSize: '0.75rem'}}>Route Time Table</span>
            </div>
            <div className="action-card-small">
              <img src="/logoMetro.png" alt="Metro Logo" style={{ width: '30px', height: 'auto' }} />
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
                <div className="flex items-center" style={{ gap: '5px' }}>
                  <span className="distance">680 m</span>
                  <div className="direction-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff4d4d">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="bus-item-extended">
                <div className="bus-number-badge-large">313</div>
                <span className="bus-destination-large">Chinchwadgaon</span>
                <div className="arrivals-container">
                  <div className="arrival-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 11H6V6h12v5zM4 16c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-3.5c0-3.5-3.58-4.5-8-4.5s-8 1-8 4.5V16zm13.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-11 0c-.83 0-1.5.67-1.5 1.5S5.67 21 6.5 21 8 20.33 8 19.5 7.33 18 6.5 18z"/>
                    </svg>
                    <div className="arrival-time green">
                      <span>23</span>
                      <span>min</span>
                    </div>
                  </div>
                  <div className="arrival-divider"></div>
                  <div className="arrival-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 11H6V6h12v5zM4 16c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h10v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-3.5c0-3.5-3.58-4.5-8-4.5s-8 1-8 4.5V16zm13.5 2c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm-11 0c-.83 0-1.5.67-1.5 1.5S5.67 21 6.5 21 8 20.33 8 19.5 7.33 18 6.5 18z"/>
                    </svg>
                    <div className="arrival-time green">
                      <span>26</span>
                      <span>min</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="see-more">
                See More Buses
              </div>
            </div>
          </section>

          {/* Footer Image Banner */}
          <div className="footer-image-container">
            <img src="/footer.png" alt="PMPML Footer" className="footer-image" />
          </div>
        </>
      ) : (
        /* Buses Tab (Map View) */
        <div className="map-page-container">
          <div className="map-header-overlay">
            <div className="map-search-bar">
              <SearchIcon style={{ color: '#666' }} />
              <input type="text" placeholder="Enter Route" />
            </div>
          </div>
          <div id="map" ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
          <button className="locate-btn">
            <MyLocationIcon />
          </button>
        </div>
      )}

      {/* Search Overlay Page */}
      {showSearch && (
        <div className="search-overlay">
          {!showResults ? (
            /* Initial Search Input View */
            <>
              <div className="search-header-full">
                <button className="back-btn" onClick={() => setShowSearch(false)}>
                  <ArrowBackIcon />
                </button>
                <h1 className="search-title-full">Search</h1>
              </div>

              <div className="search-inputs-container">
                <div className="inputs-group">
                  <div className="search-input-box grey-bg">
                    <FiberManualRecordIcon style={{ fontSize: '18px', color: '#000' }} />
                    <input 
                      type="text" 
                      placeholder="तुमचे ठिकाण" 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)}
                    />
                    {origin && <CloseIcon style={{ fontSize: '20px', color: '#666' }} onClick={() => setOrigin('')} />}
                  </div>
                  <div className="search-input-box grey-bg">
                    <LocationOnIcon style={{ fontSize: '20px', color: '#000' }} />
                    <input 
                      type="text" 
                      placeholder="कुठे जायचे आहे?" 
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setShowResults(true)}
                    />
                  </div>
                </div>
                <button className="swap-btn">
                  <SwapVertIcon />
                </button>
              </div>

              <div className="recent-searches-section">
                <h2 className="recent-title">Recent Searches</h2>
                <div className="recent-list">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="recent-item" onClick={() => {
                      setOrigin('Current Location');
                      setDestination('Guru Krupa Hospital');
                      setShowResults(true);
                    }}>
                      <DirectionsBusIcon style={{ color: '#888' }} />
                      <span className="recent-text">Guru Krupa Hospital</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Searched Results View */
            <div className="results-page">
              <div className="search-header-full">
                <button className="back-btn" onClick={() => setShowResults(false)}>
                  <ArrowBackIcon />
                </button>
                <h1 className="search-title-full">Searched Results</h1>
              </div>

              <div className="results-inputs-overlay">
                <div className="inputs-group">
                  <div className="search-input-box grey-bg-lite">
                    <FiberManualRecordIcon style={{ fontSize: '18px', color: '#000' }} />
                    <input type="text" value={origin || "New Wakadewadi MSRTC Bu"} readOnly />
                    <CloseIcon style={{ fontSize: '20px', color: '#666' }} />
                  </div>
                  <div className="search-input-box grey-bg-lite">
                    <LocationOnIcon style={{ fontSize: '20px', color: '#000' }} />
                    <input type="text" value={destination || "Baner Hill, Pune"} readOnly />
                  </div>
                </div>
                <div className="results-actions-right">
                  <button className="icon-btn-circle"><SwapVertIcon /></button>
                  <button className="icon-btn-circle"><AccessTimeIcon /></button>
                </div>
              </div>

              <div className="results-list">
                {[
                  { time: '97', bus: '37', board: 'Wakdewadi Navin ST Stand' },
                  { time: '104', bus: '152A', board: 'Mariaai Gate Navin St Stand', alts: ['152D', '262A'] },
                  { time: '107', bus: '219', board: 'Mariaai Gate Navin St Stand' },
                  { time: '118', bus: '87D', board: 'Pune Station' }
                ].map((route, idx) => (
                  <div key={idx} className="result-card">
                    <div className="card-top">
                      <span className="route-type">Alternate route</span>
                      <span className="total-time">{route.time}min</span>
                    </div>
                    
                    <div className="route-segments">
                      <div className="segment walk">
                        <DirectionsWalkIcon style={{ fontSize: '18px' }} />
                        <span>2</span>
                      </div>
                      <div className="segment bus">
                        <DirectionsBusIcon style={{ fontSize: '18px' }} />
                        <span>{route.bus}</span>
                      </div>
                      <div className="segment walk">
                        <DirectionsWalkIcon style={{ fontSize: '18px' }} />
                        <span>4</span>
                      </div>
                      <div className="segment bus-alt">
                        <DirectionsBusIcon style={{ fontSize: '18px' }} />
                        <span>87D</span>
                      </div>
                      <div className="segment walk">
                        <DirectionsWalkIcon style={{ fontSize: '18px' }} />
                        <span>27</span>
                      </div>
                    </div>

                    <div className="boarding-info">
                      <div className="bus-avatar green">
                        <DirectionsBusIcon style={{ color: '#000' }} />
                      </div>
                      <div className="boarding-details">
                        <div className="board-line">
                          <span className="board-text">BOARD {route.bus} ●</span>
                          <span className="arrival-text">Arrives by 15:00</span>
                        </div>
                        <div className="location-line">
                          <span className="station-name">{route.board}</span>
                          <span className="status-text">Scheduled</span>
                        </div>
                      </div>
                    </div>

                    {route.alts && (
                      <div className="card-footer">
                        <span className="alt-routes-label">Alternate routes</span>
                        <div className="alt-tags">
                          {route.alts.map(alt => <span key={alt} className="alt-tag">{alt}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Nav */}
      <nav className="bottom-nav">
        <div onClick={() => setActiveTab('Home')} className={`nav-item ${activeTab === 'Home' ? 'active' : ''}`}>
          <HomeIcon className="nav-icon-mui" />
          <span>Home</span>
        </div>
        <div onClick={() => setActiveTab('Buses')} className={`nav-item ${activeTab === 'Buses' ? 'active' : ''}`}>
          <LocationOnIcon className="nav-icon-mui" />
          <span>Buses</span>
        </div>
        <div onClick={() => setActiveTab('Help')} className={`nav-item ${activeTab === 'Help' ? 'active' : ''}`}>
          <HelpCenterIcon className="nav-icon-mui" />
          <span>Help</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
