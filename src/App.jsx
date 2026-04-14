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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RoomIcon from '@mui/icons-material/Room';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import SecurityIcon from '@mui/icons-material/Security';
import QrCodeIcon from '@mui/icons-material/QrCode';

const App = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [showSearch, setShowSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showFinalTicket, setShowFinalTicket] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [bookingTimer, setBookingTimer] = useState(300); // 5 minutes in seconds
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

  const handlePaymentStart = () => {
    setShowPaymentModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setShowFinalTicket(true);
      }, 2000);
    }, 3000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (showBooking && bookingTimer > 0) {
      interval = setInterval(() => {
        setBookingTimer(prev => prev - 1);
      }, 1000);
    } else if (!showBooking) {
      setBookingTimer(300); // Reset when closed
    }
    return () => clearInterval(interval);
  }, [showBooking, bookingTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      {showSplash && (
        <div className="splash-screen">
          <img src="/pmpml.png" alt="PMPML Logo" className="splash-logo" />
        </div>
      )}

      {activeTab === 'Home' ? (
        <>
          {/* Header */}
          <header className="header">
            <div className="logo-circle">
              <img src="/pmpml.png" alt="PMPML Logo" />
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
                  { time: '101', bus: '228A', from: 'Talegaon Railway Station', to: 'Indira College' },
                  { time: '104', bus: '152A', from: 'Wakadewadi', to: 'Mariaai Gate', alts: ['152D', '262A'] },
                  { time: '107', bus: '219', from: 'Kothrud', to: 'Deccan' },
                  { time: '118', bus: '87D', from: 'Pune Station', to: 'Katraj' }
                ].map((route, idx) => (
                  <div key={idx} className="result-card" onClick={() => setShowDetails(true)}>
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

          {/* Route Details Page */}
          {showDetails && (
            <div className="details-overlay">
              <div className="search-header-full">
                <button className="back-btn" onClick={() => setShowDetails(false)}>
                  <ArrowBackIcon />
                </button>
                <div className="details-header-text">
                  <div className="header-top-row">
                    <span className="total-time-large">101 min</span>
                    <span className="fare-label">Fare:</span>
                  </div>
                  <p className="route-path-text">Talegaon Railway Station - Indira College Of Arts, Comme...</p>
                </div>
              </div>

              <div className="itinerary-container">
                {/* Segment 1: Walk */}
                <div className="itinerary-item">
                  <div className="node-col">
                    <div className="node-icon grey"><DirectionsWalkIcon style={{ fontSize: '20px' }} /></div>
                    <div className="node-line"></div>
                  </div>
                  <div className="node-content">
                    <div className="node-header">
                      <span className="node-title">Talegaon Railway Station</span>
                      <span className="node-time">14:47</span>
                    </div>
                    <div className="node-sub">0m ● 2 min</div>
                  </div>
                </div>

                {/* Segment 2: Bus */}
                <div className="itinerary-item">
                  <div className="node-col">
                    <div className="node-icon green"><DirectionsBusIcon style={{ fontSize: '20px' }} /></div>
                    <div className="node-line"></div>
                  </div>
                  <div className="node-content">
                    <div className="node-header">
                      <span className="node-title">Talegaon Railway Station</span>
                      <span className="node-time">15:11</span>
                    </div>
                    <p className="node-desc">228a Towards Balewadi Depot</p>
                    <div className="alt-routes-small">
                      <span>Alternate routes</span>
                      <div className="alt-tags-mini">
                        <span className="tag green">228A</span>
                        <span className="tag green">228</span>
                      </div>
                    </div>

                    <div className="booking-card-inline">
                      <div className="frequency-pill">Every 10 min</div>
                      <button className="book-btn-main" onClick={() => setShowBooking(true)}>Book Ticket</button>
                      <p className="booking-note">Your ticket will be active immediately after purchase.</p>
                    </div>

                    <div className="stops-info-row">
                      <div className="stops-count">
                        <div className="dot-connector"></div>
                        <span>34 Stops ● 76 min</span>
                      </div>
                      <ExpandMoreIcon style={{ color: '#888' }} />
                    </div>
                  </div>
                </div>

                {/* Segment 3: Intermediate Stop */}
                <div className="itinerary-item">
                  <div className="node-col">
                    <div className="node-dot grey"></div>
                    <div className="node-line"></div>
                  </div>
                  <div className="node-content">
                    <span className="node-title normal">Indira collage Punavale</span>
                  </div>
                </div>

                {/* Segment 4: Walk */}
                <div className="itinerary-item">
                  <div className="node-col">
                    <div className="node-icon grey mini"><DirectionsWalkIcon style={{ fontSize: '20px' }} /></div>
                    <div className="node-line"></div>
                  </div>
                  <div className="node-content">
                    <div className="node-header">
                      <span className="node-title">Indira collage Punavale</span>
                      <span className="node-time">16:27</span>
                    </div>
                    <div className="node-sub">124m ● 1 min</div>
                  </div>
                </div>

                {/* Segment 5: Destination */}
                <div className="itinerary-item end">
                  <div className="node-col">
                    <div className="node-icon red"><RoomIcon style={{ fontSize: '20px' }} /></div>
                  </div>
                  <div className="node-content">
                    <div className="node-header">
                      <span className="node-title">Indira College of Arts, Com...</span>
                      <span className="node-time">16:28</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Details (Booking) Page */}
          {showBooking && (
            <div className="booking-overlay">
              <div className="search-header-full">
                <button className="back-btn" onClick={() => setShowBooking(false)}>
                  <ArrowBackIcon />
                </button>
                <h1 className="search-title-full">Ticket Details</h1>
                <span className="header-time-top">{formatTimer(bookingTimer)}</span>
              </div>

              <div className="booking-container">
                <div className="green-date-header">
                  14 Apr, 2026 | 03:07 PM
                </div>

                <div className="booking-card">
                  <div className="bus-route-row">
                    <div className="bus-avatar-circle green">
                      <DirectionsBusIcon style={{ color: 'white' }} />
                    </div>
                    <div className="route-info-main">
                      <span className="route-id">228A</span>
                      <span className="towards-text">towards Balewadi Depot</span>
                    </div>
                    <EditIcon style={{ color: '#555', fontSize: '20px' }} />
                  </div>

                  <div className="stops-itinerary">
                    <div className="stop-row">
                      <div className="stop-indicator">
                        <div className="stop-circle hollow"></div>
                        <div className="stop-line-dotted"></div>
                      </div>
                      <div className="stop-details">
                        <span className="stop-label">Starting stop</span>
                        <div className="stop-name-row">
                          <span className="stop-name-bold">Talegaon Railway Station</span>
                          <EditIcon style={{ color: '#555', fontSize: '20px' }} />
                        </div>
                      </div>
                    </div>
                    <div className="stop-row">
                      <div className="stop-indicator">
                        <div className="stop-circle hollow"></div>
                      </div>
                      <div className="stop-details">
                        <span className="stop-label">Ending stop</span>
                        <span className="stop-name-bold">Indira collage Punavale</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-divider-container">
                    <div className="cutout left"></div>
                    <hr className="divider-dashed" />
                    <div className="cutout right"></div>
                  </div>

                  <div className="booking-options">
                    <div className="segmented-control">
                      <div className="segment-btn active">By Fare</div>
                      <div className="segment-btn">By Ending stop</div>
                    </div>

                    <div className="price-picker">
                      <label>Ticket Price</label>
                      <div className="price-boxes">
                        {['10', '20', '30', '40', '50'].map(p => (
                          <div key={p} className={`price-box ${p === '40' ? 'active' : ''}`}>{p}</div>
                        ))}
                      </div>
                    </div>

                    <div className="ticket-counters">
                      <label>Select Tickets</label>
                      <div className="counter-row">
                        <div className="counter-label">
                          <span className="type">Full</span>
                          <span className="price">₹40.0</span>
                        </div>
                        <div className="counter-controls">
                          <button className="count-btn"><RemoveIcon style={{ fontSize: '18px' }} /></button>
                          <span className="count-val">1</span>
                          <button className="count-btn"><AddIcon style={{ fontSize: '18px' }} /></button>
                        </div>
                      </div>
                      <div className="counter-row">
                        <div className="counter-label">
                          <span className="type">Half</span>
                          <span className="price">₹20.0</span>
                        </div>
                        <div className="counter-controls">
                          <button className="count-btn"><RemoveIcon style={{ fontSize: '18px' }} /></button>
                          <span className="count-val">0</span>
                          <button className="count-btn"><AddIcon style={{ fontSize: '18px' }} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="booking-footer" onClick={() => setShowPaymentModal(true)}>
                <div className="payment-select-col">
                  <div className="pay-using-row">
                    <span>PAY USING</span>
                    <ExpandMoreIcon style={{ transform: 'rotate(180deg)' }} />
                  </div>
                  <div className="payment-method">
                    <PaymentIcon style={{ color: '#2e7d32' }} />
                    <span>Select</span>
                  </div>
                </div>
                <button className="final-pay-btn" onClick={(e) => {
                  e.stopPropagation();
                  setShowPaymentModal(true);
                }}>
                  Pay ₹40.0
                </button>
              </div>
            </div>
          )}

          {/* Payment Mode Modal */}
          {showPaymentModal && (
            <div className="modal-backdrop" onClick={() => setShowPaymentModal(false)}>
              <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Select Payment Mode</h2>
                <div className="payment-grid">
                  <div className="payment-option" onClick={handlePaymentStart}>
                    <div className="brand-icon-img">
                      <img src="/paytm.png" alt="Paytm" />
                    </div>
                    <span>Paytm</span>
                  </div>
                  <div className="payment-option" onClick={handlePaymentStart}>
                    <div className="brand-icon-img">
                      <img src="/phone-pe.jpg" alt="PhonePe" />
                    </div>
                    <span>PhonePe</span>
                  </div>
                  <div className="payment-option" onClick={handlePaymentStart}>
                    <div className="brand-icon-img">
                      <img src="/google-pay.png" alt="GPay" />
                    </div>
                    <span>GPay</span>
                  </div>
                  <div className="payment-option" onClick={handlePaymentStart}>
                    <div className="brand-icon-img">
                      <img src="/amazon.webp" alt="Amazon" />
                    </div>
                    <span>Amazon</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Screen */}
          {isProcessing && (
            <div className="processing-overlay">
              <div className="processing-logo-container">
                <div className="logo-circle-loader">
                  <div className="inner-logo">E</div>
                </div>
              </div>

              <div className="processing-steps">
                <div className="step-row-large">
                  <div className="step-icon-col">
                    <CheckCircleIcon style={{ color: '#2e7d32', fontSize: '28px' }} />
                    <div className="step-line-vertical dotted"></div>
                  </div>
                  <div className="step-text-col">
                    <span className="step-label-main green">Initialised</span>
                    <span className="step-subtitle">Payment is in progress...</span>
                  </div>
                </div>
                <div className="step-row-large">
                  <div className="step-icon-col">
                    <PendingIcon style={{ color: '#f57c00', fontSize: '28px' }} />
                  </div>
                  <div className="step-text-col">
                    <span className="step-label-main orange">Pending</span>
                    <span className="step-subtitle">Waiting for payment to get confirmed</span>
                    <p className="refund-text">If payment has been debited and app still showing unpaid, refund will be initiated in 24-48 hours.</p>
                  </div>
                </div>
              </div>

              <div className="processing-footer">
                <p>Do not press back or leave this screen</p>
                <div className="secured-row">
                  <SecurityIcon style={{ fontSize: '18px' }} />
                  <span>Secured Payment</span>
                </div>
              </div>
            </div>
          )}

          {/* Success Toast */}
          {showToast && (
            <div className="android-toast">
              Payment confirmed
            </div>
          )}

          {/* Final Ticket View */}
          {showFinalTicket && (
            <div className="final-ticket-overlay">
              <div className="final-header">
                <button className="close-final-btn" onClick={() => {
                  setShowFinalTicket(false);
                  setShowSearch(false);
                  setShowResults(false);
                  setShowDetails(false);
                  setShowBooking(false);
                  setActiveTab('Home');
                }}>
                  <CloseIcon />
                </button>
                <div className="header-links">
                  <span>Need Help?</span>
                  <span>All tickets</span>
                </div>
              </div>

              <div className="ticket-main-card">
                <div className="ticket-red-title">पुणे महानगर परिवहन महामंडळ लि.</div>
                
                <div className="ticket-grid-info">
                  <div className="grid-item">
                    <label>Route</label>
                    <span>306</span>
                  </div>
                  <div className="grid-item">
                    <label>Tickets count</label>
                    <span>1H</span>
                  </div>
                  <div className="grid-item">
                    <label>Fare</label>
                    <span>₹5</span>
                  </div>
                </div>

                <div className="path-display">
                  <span>Bhumkar Chowk</span>
                  <div className="arrow-right">→</div>
                  <span>Hinjawadigaon</span>
                </div>

                <div className="card-divider-container mini">
                  <div className="cutout left grey"></div>
                  <hr className="divider-dashed thin" />
                  <div className="cutout right grey"></div>
                </div>

                <div className="ticket-times">
                  <div className="time-col">
                    <label>Booking Time</label>
                    <span>14 Apr, 26 | 03:30 PM</span>
                  </div>
                  <div className="time-col">
                    <label>Valid Till</label>
                    <span>14 Apr, 26 | 04:00 PM</span>
                  </div>
                </div>

                <div className="ticket-id-center">2604141530P807MH</div>

                <hr className="divider-solid" />

                <div className="blinking-logo-container">
                  <img src="/pmpml.png" alt="PMPML Logo" className="pulse-logo" />
                </div>

                <div className="expiry-row">
                  Expires in 00:27:25
                </div>

                <button className="qr-button-bottom" onClick={() => setShowQRModal(true)}>
                  <QrCodeIcon />
                  Show QR code
                </button>
              </div>

              {showQRModal && (
                <div className="modal-backdrop qr-backdrop" onClick={() => setShowQRModal(false)}>
                  <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="qr-close-btn" onClick={() => setShowQRModal(false)}>
                      <CloseIcon style={{ fontSize: '20px' }} />
                    </button>
                    <div className="qr-img-container">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PMPML-TICKET-2604141530P807MH" 
                        alt="Ticket QR Code" 
                      />
                    </div>
                  </div>
                </div>
              )}
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
