
import React, { useState } from 'react';
import './TastingLab.css';

const stages = [
    { id: 'sight', title: 'Sight', icon: '👁️' },
    { id: 'swirl', title: 'Swirl', icon: '🌪️' },
    { id: 'smell', title: 'Smell', icon: '👃' },
    { id: 'sip', title: 'Sip', icon: '👅' },
    { id: 'savor', title: 'Savor', icon: '🧠' }
];

const wineColors = [
    { name: 'Pale Lemon', color: '#fcfcd9', type: 'white' },
    { name: 'Deep Gold', color: '#dcf01f', type: 'white' },
    { name: 'Pale Pink', color: '#ffb6c1', type: 'rose' },
    { name: 'Deep Salmon', color: '#fa8072', type: 'rose' },
    { name: 'Ruby', color: '#900020', type: 'red' },
    { name: 'Deep Purple', color: '#4b0082', type: 'red' },
    { name: 'Tawny', color: '#cd5700', type: 'fortified' }
];

const aromas = [
    { cat: 'Fruit', icon: '🍒', tags: ['Citrus', 'Berry', 'Tropical', 'Dried'] },
    { cat: 'Floral', icon: '🌸', tags: ['Rose', 'Violet', 'Blossom'] },
    { cat: 'Spice', icon: '🌶️', tags: ['Pepper', 'Clove', 'Vanilla', 'Cinnamon'] },
    { cat: 'Vegetal', icon: '🌿', tags: ['Grass', 'Bell Pepper', 'Mint'] },
    { cat: 'Earth', icon: '🍄', tags: ['Mushroom', 'Soil', 'Mineral'] },
    { cat: 'Oak', icon: '🪵', tags: ['Toast', 'Smoke', 'Coconut', 'Coffee'] }
];

const TastingLab = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isSwirling, setIsSwirling] = useState(false);

    // Stage 4 State
    const [structure, setStructure] = useState({
        sweetness: 1,
        acidity: 3,
        tannin: 3,
        alcohol: 3,
        body: 3
    });

    const handleNext = () => {
        if (currentStage < stages.length - 1) {
            setCurrentStage(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStage > 0) {
            setCurrentStage(prev => prev - 1);
        }
    };

    const handleStructureChange = (key, value) => {
        setStructure(prev => ({ ...prev, [key]: parseInt(value) }));
    };

    return (
        <div className="tasting-page">
            <div className="tasting-container">
                <header className="tasting-header">
                    <h1>Tasting Laboratory</h1>
                    <p>Master the Art of Professional Wine Analysis (The 5 S's)</p>
                </header>

                {/* Progress Navigation */}
                <div className="tasting-nav">
                    {stages.map((stage, index) => (
                        <div
                            key={stage.id}
                            className={`nav-step ${index === currentStage ? 'active' : ''} ${index < currentStage ? 'completed' : ''}`}
                            onClick={() => setCurrentStage(index)}
                        >
                            <span>{stage.icon}</span>
                            <span>{stage.title}</span>
                        </div>
                    ))}
                </div>

                {/* Main 2-Column Layout */}
                <div className="lab-layout">

                    {/* LEFT COLUMN: Controls & Instructions */}
                    <div className="instruction-column">
                        <div className="tasting-stage">
                            {/* STAGE 1: SIGHT */}
                            {currentStage === 0 && (
                                <>
                                    <h2 className="stage-title">Step 1: Sight</h2>
                                    <p className="stage-desc">
                                        Tilt your glass 45° against a white background. Observe the color, clarity, and viscosity (legs).
                                        The color reveals the grape variety, age, and style.
                                    </p>

                                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Select Wine Color</h3>
                                    <div className="color-swatch-container">
                                        {wineColors.map((c) => (
                                            <button
                                                key={c.name}
                                                className={`color-btn ${selectedColor === c.color ? 'selected' : ''}`}
                                                style={{ backgroundColor: c.color }}
                                                title={c.name}
                                                onClick={() => setSelectedColor(c.color)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* STAGE 2: SWIRL */}
                            {currentStage === 1 && (
                                <>
                                    <h2 className="stage-title">Step 2: Swirl</h2>
                                    <p className="stage-desc">
                                        Swirling performs two vital functions: it aerates the wine to release volatile aromas ("opening up" the wine)
                                        and coats the glass to reveal "legs" or "tears", which indicate alcohol and sugar content.
                                    </p>

                                    <button
                                        className="swirl-btn"
                                        onMouseDown={() => setIsSwirling(true)}
                                        onMouseUp={() => setIsSwirling(false)}
                                        onMouseLeave={() => setIsSwirling(false)}
                                    >
                                        Click & Hold to Swirl 🌪️
                                    </button>
                                </>
                            )}

                            {/* STAGE 3: SMELL */}
                            {currentStage === 2 && (
                                <>
                                    <h2 className="stage-title">Step 3: Smell (The Nose)</h2>
                                    <p className="stage-desc">
                                        80% of taste is actually smell. Identify the primary aromas (fruit), secondary (fermentation), and tertiary (aging).
                                        Explore the Aroma Wheel categories below.
                                    </p>

                                    <div className="aroma-grid">
                                        {aromas.map((aroma) => (
                                            <div key={aroma.cat} className="aroma-category">
                                                <div className="aroma-icon">{aroma.icon}</div>
                                                <div className="aroma-name">{aroma.cat}</div>
                                                <div className="aroma-tags">
                                                    {aroma.tags.map(tag => (
                                                        <span key={tag} className="aroma-tag">{tag}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* STAGE 4: SIP */}
                            {currentStage === 3 && (
                                <>
                                    <h2 className="stage-title">Step 4: Sip (The Palate)</h2>
                                    <p className="stage-desc">
                                        Take a measured sip. Swish it around your mouth.
                                        Analyze the structural components: Sweetness (tip of tongue), Acidity (watering sides), Tannin (drying gums), and Body (weight).
                                    </p>

                                    <div className="structure-sliders">
                                        {[
                                            { id: 'sweetness', label: 'Sweetness (Sugar)', min: 'Dry', max: 'Sweet' },
                                            { id: 'acidity', label: 'Acidity (Tartness)', min: 'Low (Flat)', max: 'High (Crisp)' },
                                            { id: 'tannin', label: 'Tannin (Astringency)', min: 'Low (Smooth)', max: 'High (Chewy)' },
                                            { id: 'body', label: 'Body (Weight)', min: 'Light', max: 'Full' }
                                        ].map((s) => (
                                            <div key={s.id} className="slider-group">
                                                <div className="slider-label">
                                                    <span>{s.label}</span>
                                                    <span>{structure[s.id]}/5</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="5"
                                                    value={structure[s.id]}
                                                    onChange={(e) => handleStructureChange(s.id, e.target.value)}
                                                    className="slider-control"
                                                />
                                                <div className="slider-desc">
                                                    <span>{s.min}</span>
                                                    <span>{s.max}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* STAGE 5: SAVOR */}
                            {currentStage === 4 && (
                                <>
                                    <h2 className="stage-title">Step 5: Savor (The Finish)</h2>
                                    <p className="stage-desc">
                                        The finish is how long the flavor lasts after swallowing.
                                        A long, complex finish is the hallmark of fine wine. Determine the quality level.
                                    </p>

                                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                                        <h3>Rating</h3>
                                        <div style={{ fontSize: '3rem', margin: '1rem 0', color: '#ffd700' }}>★★★★☆</div>
                                        <p>Great complexity with a lingering spicy finish.</p>
                                        <button className="action-btn" onClick={() => setCurrentStage(0)}>Start New Tasting</button>
                                    </div>
                                </>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', justifyContent: 'center', width: '100%' }}>
                                {currentStage > 0 && (
                                    <button className="action-btn" style={{ background: 'transparent', border: '1px solid #d4af37', color: '#d4af37' }} onClick={handleBack}>
                                        Previous
                                    </button>
                                )}
                                {currentStage < 4 && (
                                    <button className="action-btn" style={{ margin: 0 }} onClick={handleNext}>
                                        Next Step {stages[currentStage + 1]?.icon}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Persistent Visuals */}
                    <div className="visual-column">
                        <div className="glass-container">
                            <div className="wine-glass-visual">
                                {/* Persistent Liquid visualization */}
                                <div
                                    className={`wine-liquid ${selectedColor ? 'filled' : ''} ${isSwirling ? 'swirl-animation' : ''}`}
                                    style={{
                                        backgroundColor: selectedColor || 'transparent',
                                        opacity: selectedColor ? 0.9 : 0
                                    }}
                                />
                            </div>
                            <div className="glass-stem"></div>
                            <div className="glass-base"></div>

                            {currentStage === 1 && (
                                <p className="swirl-helper-text">Hold button to Swirl</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TastingLab;
