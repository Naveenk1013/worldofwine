import React from 'react';
import GlobeComponent from '../components/3d/Globe/Globe';
import './Globe.css';

const Globe = () => {
  return (
    <div className="globe-page">
      <div className="globe-canvas-full">
        <GlobeComponent />
      </div>

      <div className="globe-ui">
        <div className="globe-header">
          <h1>World of  Wine</h1>
          <p>Explore wine regions around the globe • Click markers to learn more</p>
        </div>

        <div className="globe-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#722F37' }}></span>
            <span>Red Wine Regions</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#9CAF88' }}></span>
            <span>White Wine Regions</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#D4AF37' }}></span>
            <span>Sparkling Wine Regions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Globe;
