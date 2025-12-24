import React from 'react';
import DomeGallery from '../components/ui/DomeGallery/DomeGallery';
import grapeData from '../data/grape-varieties.json';
import './GrapeGallery.css';

const GrapeGallery = () => {
    return (
        <div className="grape-gallery-container">
            <div className="gallery-wrapper">
                <DomeGallery images={grapeData} />
            </div>

            <div className="gallery-instruction">
                Drag to explore • Click to expand
            </div>
        </div>
    );
};

export default GrapeGallery;
