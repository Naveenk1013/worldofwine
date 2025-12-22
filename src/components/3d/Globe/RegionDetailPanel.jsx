import React from 'react';
import './GlobeEnhanced.css'; // Share styles for now, or split later

const RegionDetailPanel = ({ region, onClose }) => {
    if (!region) return null;

    return (
        <div className="region-detail-panel">
            <button className="panel-close-btn" onClick={onClose}>×</button>

            <div className="panel-header">
                <div className="panel-flag">{region.flag}</div>
                <h1 className="panel-title">{region.name}</h1>
                <div className="panel-subtitle">
                    📍 {region.country}
                </div>
            </div>

            <div className="panel-content">
                <section className="panel-section">
                    <h3>About the Region</h3>
                    <p>{region.description}</p>
                </section>

                <div className="panel-grid">
                    <div className="panel-stat">
                        <span className="stat-label">Lat</span>
                        <span className="stat-value">{region.lat.toFixed(2)}°</span>
                    </div>
                    <div className="panel-stat">
                        <span className="stat-label">Lon</span>
                        <span className="stat-value">{region.lon.toFixed(2)}°</span>
                    </div>
                    <div className="panel-stat">
                        <span className="stat-label">Code</span>
                        <span className="stat-value">{region.countryCode}</span>
                    </div>
                </div>

                {region.grapes && region.grapes.length > 0 && (
                    <section className="panel-section">
                        <h3>🍇 Key Grape Varieties</h3>
                        <div className="tag-cloud">
                            {region.grapes.map((grape, i) => (
                                <span key={i} className="grape-tag">{grape}</span>
                            ))}
                        </div>
                    </section>
                )}

                {region.famous_wines && region.famous_wines.length > 0 && (
                    <section className="panel-section">
                        <h3>🍷 Famous Wines</h3>
                        <ul className="wine-list">
                            {region.famous_wines.map((wine, i) => (
                                <li key={i}>{wine}</li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* Future: Terroir Data Placeholders */}
                {/* 
                <section className="panel-section">
                    <h3>☀️ Terroir Profile</h3>
                    <div className="terroir-bars">
                         ...
                    </div>
                </section> 
                */}
            </div>
        </div>
    );
};

export default RegionDetailPanel;
