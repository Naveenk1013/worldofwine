
import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import wineRegions from '../../../data/wine-regions.json';
import RegionOutlineMap from './RegionOutlineMap';
import RegionDetailPanel from './RegionDetailPanel';
import './GlobeEnhanced.css';

const GlobeComponent = () => {
    const globeEl = useRef();
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [hoveredRegion, setHoveredRegion] = useState(null);
    const [isRotating, setIsRotating] = useState(true);
    const [isZooming, setIsZooming] = useState(false);

    // GeoJSON Data
    const [countryGeoJson, setCountryGeoJson] = useState({ features: [] });

    // Tour State
    const [tourActive, setTourActive] = useState(false);
    const [currentTour, setCurrentTour] = useState(null); // 'oldWorld' or 'newWorld'
    const [tourIndex, setTourIndex] = useState(0);

    const tourPaths = {
        oldWorld: ['bordeaux', 'tuscany', 'rioja', 'champagne', 'mosel', 'douro'],
        newWorld: ['napa', 'mendoza', 'barossa', 'marlborough']
    };

    // Transform data for react-globe.gl with labels
    const markerData = wineRegions.map(region => ({
        ...region,
        lat: region.lat,
        lng: region.lon,
        size: 0.8,
        color: region.color,
        label: region.flag
    }));

    useEffect(() => {
        // Fetch country borders GeoJSON for both Globe and 2D Map
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => {
                setCountryGeoJson(data);
            })
            .catch(err => console.error("Failed to load country data", err));
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            // Set initial auto-rotate
            globeEl.current.controls().autoRotate = isRotating;
            globeEl.current.controls().autoRotateSpeed = 0.5;

            // Point camera to start position
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
        }
    }, []);

    // Toggle rotation
    const toggleRotation = () => {
        if (tourActive) return; // Disable rotation toggle during tour
        setIsRotating(!isRotating);
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = !isRotating;
        }
    };

    const flyToRegion = (marker) => {
        if (!marker || !globeEl.current) return;

        setIsZooming(true);
        setSelectedRegion(marker);
        setHoveredRegion(null);

        // Stop auto-rotation
        setIsRotating(false);
        globeEl.current.controls().autoRotate = false;

        // Smooth zoom to region with animation
        globeEl.current.pointOfView({
            lat: marker.lat,
            lng: marker.lng,
            altitude: 1.2
        }, 1500);

        setTimeout(() => setIsZooming(false), 1500);
    };

    const handleMarkerClick = (marker) => {
        // If tour is active, clicking a marker breaks the tour flow but keeps the info open
        // Optionally, we could end the tour here. Let's keep the tour active if they just clicked something else,
        // but it might be confusing. For now, let's just fly there.
        flyToRegion(marker);
    };

    // --- Hover Logic with Grace Period ---
    const hoverTimeoutRef = useRef(null);

    const handleMarkerHover = (marker) => {
        if (selectedRegion || tourActive) return; // Don't show if modal open or tour active

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setHoveredRegion(marker);
    };

    const handleMarkerLeave = () => {
        // Delay hiding to allow moving mouse to the card
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredRegion(null);
        }, 300); // 300ms gracetime
    };

    const handleCardEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleCardLeave = () => {
        setHoveredRegion(null);
    };

    const manuallyCloseHover = (e) => {
        e.stopPropagation();
        setHoveredRegion(null);
    };

    const closeModal = () => {
        setSelectedRegion(null);
        setIsZooming(true);

        if (globeEl.current) {
            // Zoom back out with animation
            globeEl.current.pointOfView({
                lat: 20,
                lng: 0,
                altitude: 2.5
            }, 1500);

            setTimeout(() => {
                setIsZooming(false);
                // Resume rotation only if tour is NOT active
                if (!tourActive) {
                    setIsRotating(true);
                    globeEl.current.controls().autoRotate = true;
                }
            }, 1500);
        }
    };

    // --- Tour Logic ---

    const startTour = (tourType) => {
        setTourActive(true);
        setCurrentTour(tourType);
        setTourIndex(0);

        const firstRegionId = tourPaths[tourType][0];
        const region = wineRegions.find(r => r.id === firstRegionId);

        if (region) {
            flyToRegion(region);
        }
    };

    const nextStop = () => {
        if (!currentTour) return;

        const nextIndex = tourIndex + 1;
        if (nextIndex < tourPaths[currentTour].length) {
            setTourIndex(nextIndex);
            const regionId = tourPaths[currentTour][nextIndex];
            const region = wineRegions.find(r => r.id === regionId);
            if (region) {
                flyToRegion(region);
            }
        } else {
            endTour();
        }
    };

    const prevStop = () => {
        if (!currentTour) return;

        const prevIndex = tourIndex - 1;
        if (prevIndex >= 0) {
            setTourIndex(prevIndex);
            const regionId = tourPaths[currentTour][prevIndex];
            const region = wineRegions.find(r => r.id === regionId);
            if (region) {
                flyToRegion(region);
            }
        }
    };

    const endTour = () => {
        setTourActive(false);
        setCurrentTour(null);
        setTourIndex(0);
        closeModal(); // Zoom out
    };

    // --- Search Logic ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = wineRegions.filter(region =>
            (region.name && region.name.toLowerCase().includes(query)) ||
            (region.country && region.country.toLowerCase().includes(query))
        ).slice(0, 5);

        setSearchResults(results);
    }, [searchQuery]);

    const handleSearchSelect = (region) => {
        const marker = markerData.find(m => m.id === region.id);
        if (marker) {
            flyToRegion(marker);
            setSearchQuery('');
            setSearchResults([]);
        }
    };

    return (
        <>
            {/* Search Bar */}
            <div className="globe-search-container">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search regions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
                    )}
                </div>
                {searchResults.length > 0 && (
                    <ul className="search-results-list">
                        {searchResults.map(result => (
                            <li key={result.id} onClick={() => handleSearchSelect(result)}>
                                <span className="result-flag">{result.flag}</span>
                                <div>
                                    <span className="result-name">{result.name}</span>
                                    <small style={{ color: '#aaa', marginLeft: '5px' }}>{result.country}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={`globe-background ${selectedRegion ? 'dimmed' : ''}`}>
                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                    // Country Outlines
                    polygonsData={countryGeoJson.features || []}
                    polygonCapColor={() => 'rgba(0, 0, 0, 0)'} // Transparent face
                    polygonSideColor={() => 'rgba(0,0,0,0)'}    // Transparent side
                    polygonStrokeColor={() => 'rgba(255, 255, 255, 0.2)'} // Subtle border
                    polygonAltitude={0.01} // Slight elevation to avoid z-fighting

                    // HTML Markers (Flags)
                    htmlElementsData={markerData}
                    htmlElement={d => {
                        const el = document.createElement('div');
                        el.innerHTML = `
                            <div class="flag-marker" style="
                              font-size: 24px;
                              cursor: pointer;
                              filter: drop-shadow(0 0 4px ${d.color});
                              transition: transform 0.3s ease, filter 0.3s ease;
                            ">
                              ${d.flag}
                            </div>
                          `;

                        el.style.pointerEvents = 'auto';
                        el.style.cursor = 'pointer';

                        el.addEventListener('mouseenter', () => {
                            el.querySelector('.flag-marker').style.transform = 'scale(1.4)';
                            el.querySelector('.flag-marker').style.filter = `drop-shadow(0 0 12px ${d.color})`;
                            handleMarkerHover(d);
                        });

                        el.addEventListener('mouseleave', () => {
                            el.querySelector('.flag-marker').style.transform = 'scale(1)';
                            el.querySelector('.flag-marker').style.filter = `drop-shadow(0 0 4px ${d.color})`;
                            handleMarkerLeave();
                        });

                        el.addEventListener('click', () => handleMarkerClick(d));

                        return el;
                    }}

                    atmosphereColor="#D4AF37"
                    atmosphereAltitude={0.15}
                    animateIn={true}
                    waitForGlobeReady={true}
                />
            </div>

            {/* Split View Overlay - Shows when a region is selected during EXPLORATION */}
            {selectedRegion && !tourActive && (
                <div className="split-view-container">
                    <div className="left-panel-map">
                        <RegionOutlineMap
                            region={selectedRegion}
                            countryGeoJson={countryGeoJson}
                        />
                    </div>
                    <div className="right-panel-details">
                        <RegionDetailPanel
                            region={selectedRegion}
                            onClose={closeModal}
                        />
                    </div>
                </div>
            )}

            {/* Tour Controls Panel */}
            <div className="tour-controls">
                {!tourActive ? (
                    <div className="tour-selection">
                        <button className="tour-btn old-world" onClick={() => startTour('oldWorld')}>
                            Old World
                        </button>
                        <button className="tour-btn new-world" onClick={() => startTour('newWorld')}>
                            New World
                        </button>
                    </div>
                ) : (
                    <div className="tour-navigation">
                        <span className="tour-status">
                            {currentTour === 'oldWorld' ? 'Old' : 'New'}: Stop {tourIndex + 1}/{tourPaths[currentTour].length}
                        </span>
                        <div className="tour-nav-buttons">
                            <button className="nav-btn" onClick={prevStop} disabled={tourIndex === 0}>⬅ Prev</button>
                            <button className="nav-btn end-tour" onClick={endTour}>Ext Tour</button>
                            <button className="nav-btn accent" onClick={nextStop}>
                                {tourIndex === tourPaths[currentTour].length - 1 ? 'Finish 🏁' : 'Next ➡'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Rotation Control Button (Hide during tour) */}
            {!tourActive && (
                <button
                    className={`rotation-toggle ${isRotating ? 'rotating' : 'paused'}`}
                    onClick={toggleRotation}
                    title={isRotating ? 'Pause Rotation' : 'Resume Rotation'}
                >
                    {isRotating ? '⏸️' : '▶️'}
                    <span>{isRotating ? 'Pause' : 'Play'}</span>
                </button>
            )}

            {/* Hover Card */}
            {hoveredRegion && !selectedRegion && (
                <div
                    className="hover-card"
                    onMouseEnter={handleCardEnter}
                    onMouseLeave={handleCardLeave}
                    onClick={(e) => {
                        // Allow clicking the card itself to zoom
                        e.stopPropagation();
                        handleMarkerClick(hoveredRegion);
                    }}
                >
                    <button
                        className="hover-close-btn"
                        onClick={manuallyCloseHover}
                        title="Close"
                    >
                        ×
                    </button>

                    <div className="hover-card-flag">{hoveredRegion.flag}</div>
                    <h3 className="hover-card-title">{hoveredRegion.name}</h3>
                    <div className="hover-card-country">
                        <span className="country-icon">📍</span>
                        <span>{hoveredRegion.country}</span>
                    </div>
                    <p className="hover-card-preview">
                        {hoveredRegion.description.substring(0, 100)}...
                    </p>
                    <div className="hover-card-hint">
                        👆 Click to explore
                    </div>
                </div>
            )}

            {/* Region Info Modal - Shows ONLY during TOUR (Split view handles exploration) */}
            {selectedRegion && tourActive && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className={`region-modal ${isZooming ? 'zooming' : 'visible'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="close-button" onClick={closeModal}>×</button>

                        <div className="modal-flag">{selectedRegion.flag}</div>
                        <h2 className="modal-title">{selectedRegion.name}</h2>
                        <p className="modal-country">📍 {selectedRegion.country}</p>

                        <div className="region-details">
                            <div className="detail-item">
                                <strong>🌐 Country Code:</strong> {selectedRegion.countryCode}
                            </div>
                            <div className="detail-item">
                                <strong>📊 Coordinates:</strong> {selectedRegion.lat.toFixed(4)}°, {selectedRegion.lon.toFixed(4)}°
                            </div>
                        </div>

                        <p className="modal-description">{selectedRegion.description}</p>

                        <div className="modal-wines">
                            <h3>Famous Wines:</h3>
                            <ul>
                                {selectedRegion.famous_wines.map((wine, index) => (
                                    <li key={index} className="wine-item">
                                        🍷 {wine}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* In-Modal Tour Control */}
                        <div className="modal-tour-action">
                            <button className="tour-next-btn" onClick={(e) => {
                                e.stopPropagation();
                                nextStop();
                            }}>
                                {tourIndex === tourPaths[currentTour].length - 1 ? 'Finish Tour 🏁' : 'Next Stop ➡'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobeComponent;
