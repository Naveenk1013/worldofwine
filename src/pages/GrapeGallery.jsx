import React from 'react';
import DomeGallery from '../components/ui/DomeGallery/DomeGallery';

const GrapeGallery = () => {
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
            <DomeGallery />
            {/* Optional: Add a subtle overlay or title if needed, but Dome is immersive */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.3)',
                pointerEvents: 'none',
                fontFamily: 'sans-serif',
                zIndex: 5
            }}>
                Drag to explore • Click to expand
            </div>
        </div>
    );
};

export default GrapeGallery;
