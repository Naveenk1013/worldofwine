import React, { useState } from 'react';
import './Classification.css';
import Iridescence from '../components/Iridescence/Iridescence';
import ShinyText from '../components/ShinyText/ShinyText';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack/ScrollStack';
import MermaidChart from '../components/ui/MermaidChart';

const Classification = () => {
    // Stores the ID of the card to show in the overlay
    const [expandedData, setExpandedData] = useState(null);

    const handleCardClick = (id) => {
        setExpandedData(id);
    };

    const handleClose = () => {
        setExpandedData(null);
    };

    // Strictly formatted Mermaid string to avoid indentation errors
    // Using simple concatenation to ensure no hidden whitespace issues
    const classificationChart =
        `graph TD
    root[Wines]:::root
    root --> B(Color):::cat
    root --> C(Taste):::cat
    root --> D(Bubbles):::cat
    root --> E(Alcohol):::cat
    
    B --> B1[Red]
    B --> B2[White]
    B --> B3[Rosé]
    
    C --> C1[Dry]
    C --> C2[Sweet]
    
    D --> D1[Still]
    D --> D2[Sparkling]
    
    E --> E1[Table]
    E --> E2[Fortified]

    classDef root fill:#800020,stroke:#d4af37,stroke-width:2px,color:#fff;
    classDef cat fill:#1a1a1a,stroke:#d4af37,color:#d4af37;
    classDef default fill:#0a0a0a,stroke:#666,color:#e0e0e0;
`;

    return (
        <div className="classification-page">
            <div className="iridescence-wrapper">
                <Iridescence
                    color={[1, 1, 1]}
                    mouseReact={true}
                    amplitude={0.1}
                    speed={0.7}
                />
            </div>

            {/* EXPANDED OVERLAY - Rendered outside ScrollStack to avoid transform issues */}
            {expandedData && (
                <div className="expanded-overlay">
                    <button className="close-expanded-btn" onClick={handleClose} aria-label="Close">
                        ✕
                    </button>
                    <div className="expanded-content">
                        {expandedData === 1 && (
                            <>
                                <h2 style={{ color: '#ff6b6b' }}>1. Wines by Color</h2>
                                <h4 style={{ color: '#ffa5a5', marginBottom: '1rem' }}>Based on Skin Contact</h4>
                                <p>The color of wine is primarily determined by grape skin contact during fermentation.</p>
                                <details open>
                                    <summary><h3>A. Red Wines</h3></summary>
                                    <p>Fermented with skins, seeds, and stems. Contains anthocyanins and tannins.</p>
                                    <ul>
                                        <li><strong>Characteristics:</strong> Ruby/Purple, High Tannin, Age-worthy.</li>
                                        <li><strong>Varieties:</strong> Cabernet Sauvignon, Merlot, Pinot Noir.</li>
                                    </ul>
                                </details>
                                <details open>
                                    <summary><h3>B. White Wines</h3></summary>
                                    <p>Fermented without skins. Focus on acidity and freshness.</p>
                                    <ul>
                                        <li><strong>Characteristics:</strong> Pale Straw/Gold, High Acidity.</li>
                                        <li><strong>Varieties:</strong> Chardonnay, Sauvignon Blanc, Riesling.</li>
                                    </ul>
                                </details>
                                <details open>
                                    <summary><h3>C. Rosé Wines</h3></summary>
                                    <p>Limited skin contact (Pink hue).</p>
                                    <ul>
                                        <li><strong>Characteristics:</strong> Light body, fresh fruit, served chilled.</li>
                                        <li><strong>Examples:</strong> Provence Rosé, Rosado.</li>
                                    </ul>
                                </details>
                            </>
                        )}
                        {expandedData === 2 && (
                            <>
                                <h2 style={{ color: '#ffe66d' }}>2. Taste</h2>
                                <h4 style={{ color: '#fff3cd', marginBottom: '1rem' }}>Based on Residual Sugar</h4>
                                <p>Determined by residual sugar left after fermentation.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="info-box"><h3>Dry</h3><p>Little to no sugar. Crisp finish.</p></div>
                                    <div className="info-box"><h3>Off-Dry</h3><p>Slight sweetness to balance acidity.</p></div>
                                    <div className="info-box"><h3>Medium-Sweet</h3><p>Noticeable sweetness (e.g. Moscato).</p></div>
                                    <div className="info-box"><h3>Sweet</h3><p>High residual sugar (Dessert wines).</p></div>
                                </div>
                            </>
                        )}
                        {expandedData === 3 && (
                            <>
                                <h2 style={{ color: '#4ecdc4' }}>3. Carbonation & Production</h2>
                                <h4 style={{ color: '#a8e6cf', marginBottom: '1rem' }}>Based on Bubbles & Technique</h4>
                                <h3>Carbonation</h3>
                                <ul>
                                    <li><strong>Still Wines:</strong> No bubbles (Most wines).</li>
                                    <li><strong>Sparkling Wines:</strong> CO2 from secondary fermentation (Champagne, Prosecco).</li>
                                </ul>
                                <h3 style={{ marginTop: '2rem' }}>Production Methods</h3>
                                <p>Wines are also categorized by their winemaking technique:</p>
                                <ul>
                                    <li>Still, Sparkling, Aromatised, Fortified.</li>
                                </ul>
                            </>
                        )}
                        {expandedData === 4 && (
                            <>
                                <h2 style={{ color: '#ff8c42' }}>4. Alcohol (ABV)</h2>
                                <h4 style={{ color: '#ffd0a6', marginBottom: '1rem' }}>Based on Strength</h4>
                                <details open>
                                    <summary><h3>A. Table Wines (8%–14% ABV)</h3></summary>
                                    <p>Naturally fermented, suitable for everyday consumption.</p>
                                    <ul>
                                        <li>Examples: Bordeaux, Chianti, Riesling.</li>
                                    </ul>
                                </details>
                                <details open>
                                    <summary><h3>B. Fortified Wines (15%–22% ABV)</h3></summary>
                                    <p>Alcohol increased by adding grape spirit to stop fermentation or preserve sweetness.</p>
                                    <ul>
                                        <li>Examples: Port, Sherry, Madeira.</li>
                                    </ul>
                                </details>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Fixed Hero Section */}
            <div className="classification-hero">
                <h1>
                    <ShinyText
                        text="Classification of Wines"
                        disabled={false}
                        speed={3}
                        className="shiny-header"
                    />
                </h1>
                <p className="hero-subtitle">
                    The structured art of defining wine by style, taste, and power.
                </p>
                <div className="hero-chart">
                    <MermaidChart chart={classificationChart} />
                </div>
            </div>

            <ScrollStack className="classification-stack">
                {/* Intro Card - No Click Action */}
                <ScrollStackItem>
                    <div>
                        <h1>Intro</h1>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginTop: '1rem' }}>
                            Wines can be classified in several ways depending on their appearance, taste, alcohol
                            strength, and method of production.
                        </p>
                    </div>
                </ScrollStackItem>

                {/* Color Classification */}
                <ScrollStackItem>
                    <div onClick={() => handleCardClick(1)} style={{ height: '100%', cursor: 'pointer' }}>
                        <h2 style={{ color: '#ff6b6b' }}>1. Wines by Color</h2>
                        <h4 style={{ color: '#ffa5a5', marginBottom: '1rem' }}>Based on Skin Contact</h4>
                        <p>The color of wine is primarily determined by grape skin contact during fermentation.</p>

                        <details>
                            <summary><h3>A. Red Wines</h3></summary>
                            <p>Fermented with skins, seeds, and stems.</p>
                        </details>
                        <details>
                            <summary><h3>B. White Wines</h3></summary>
                            <p>Fermented without skins.</p>
                        </details>
                        <details>
                            <summary><h3>C. Rosé Wines</h3></summary>
                            <p>Limited skin contact (Pink hue).</p>
                        </details>
                        <small style={{ display: 'block', marginTop: '1rem', color: '#d4af37', opacity: 0.8 }}>(Click to expand)</small>
                    </div>
                </ScrollStackItem>

                {/* Sweetness Classification */}
                <ScrollStackItem>
                    <div onClick={() => handleCardClick(2)} style={{ height: '100%', cursor: 'pointer' }}>
                        <h2 style={{ color: '#ffe66d' }}>2. Taste</h2>
                        <h4 style={{ color: '#fff3cd', marginBottom: '1rem' }}>Based on Residual Sugar</h4>
                        <p>Determined by residual sugar left after fermentation.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                            <div className="info-box"><small>Dry</small></div>
                            <div className="info-box"><small>Off-Dry</small></div>
                            <div className="info-box"><small>Med-Sweet</small></div>
                            <div className="info-box"><small>Sweet</small></div>
                        </div>
                        <small style={{ display: 'block', marginTop: '1rem', color: '#d4af37', opacity: 0.8 }}>(Click to expand)</small>
                    </div>
                </ScrollStackItem>

                {/* Carbonation & Production */}
                <ScrollStackItem>
                    <div onClick={() => handleCardClick(3)} style={{ height: '100%', cursor: 'pointer' }}>
                        <h2 style={{ color: '#4ecdc4' }}>3. Carbonation & Production</h2>
                        <h4 style={{ color: '#a8e6cf', marginBottom: '1rem' }}>Based on Bubbles & Technique</h4>
                        <p>Still, Sparkling, Aromatised, and Fortified wines.</p>
                        <small style={{ display: 'block', marginTop: '1rem', color: '#d4af37', opacity: 0.8 }}>(Click to expand)</small>
                    </div>
                </ScrollStackItem>

                {/* Alcohol Content */}
                <ScrollStackItem>
                    <div onClick={() => handleCardClick(4)} style={{ height: '100%', cursor: 'pointer' }}>
                        <h2 style={{ color: '#ff8c42' }}>4. Alcohol (ABV)</h2>
                        <h4 style={{ color: '#ffd0a6', marginBottom: '1rem' }}>Based on Strength</h4>
                        <p>Table Wines (8-14%) vs Fortified Wines (15-22%)</p>
                        <small style={{ display: 'block', marginTop: '1rem', color: '#d4af37', opacity: 0.8 }}>(Click to expand)</small>
                    </div>
                </ScrollStackItem>

            </ScrollStack>
        </div>
    );
};

export default Classification;
