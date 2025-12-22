
import React, { useState } from 'react';
import './Cellar.css';

const collectionData = [
    { id: 1, name: "Château Margaux", vintage: 2015, region: "Bordeaux, France", type: "Red", note: "Velvety tannin, notes of violet and blackcurrant." },
    { id: 2, name: "Opus One", vintage: 2018, region: "Napa Valley, USA", type: "Red", note: "Bold, dark fruit with hints of cocoa and espresso." },
    { id: 3, name: "Cloudy Bay Sauvignon Blanc", vintage: 2022, region: "Marlborough, NZ", type: "White", note: "Zesty lime, passionfruit, and fresh cut grass." },
    { id: 4, name: "Dom Pérignon", vintage: 2012, region: "Champagne, France", type: "Sparkling", note: "Brioche complexity with a crisp, saline finish." },
    { id: 5, name: "Penfolds Grange", vintage: 2016, region: "Barossa, Australia", type: "Red", note: "Powerhouse Shiraz, intense spice and dark plum." },
    { id: 6, name: "Dr. Loosen Riesling", vintage: 2020, region: "Mosel, Germany", type: "White", note: "Off-dry, slate minerality, honeysuckle." },
    { id: 7, name: "Sassicaia", vintage: 2017, region: "Tuscany, Italy", type: "Red", note: "Elegant Super Tuscan, cherry, herbs, and cedar." },
    { id: 8, name: "Krug Grande Cuvée", vintage: "MV", region: "Champagne, France", type: "Sparkling", note: "Rich, nutty, oxidative style with endless depth." },
];

const Cellar = () => {
    const [showGuide, setShowGuide] = useState(false);
    const [showCellarModal, setShowCellarModal] = useState(false);

    // Browse Collection State
    const [showCollection, setShowCollection] = useState(false);
    const [filter, setFilter] = useState('All');

    const filteredWines = filter === 'All'
        ? collectionData
        : collectionData.filter(wine => wine.type === filter);

    return (
        <div className="cellar-page">
            {/* 3D Background - User Provided Embed */}
            <div className="cellar-background">
                <iframe
                    src="https://3dwarehouse.sketchup.com/embed/bec7f1e7-00ff-4e16-ad2b-46d70ff4af37?token=BfzlN1mR-Rw=&binaryName=s21"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    title="Virtual Wine Cellar"
                    style={{ border: 'none' }}
                ></iframe>
            </div>

            {/* Foreground UI Overlay */}
            <div className="cellar-ui">
                <header className="cellar-header">
                    <h1>The Virtual Cellar</h1>
                    <p>Where Time Transforms Potential into Excellence</p>
                </header>

                <div className="cellar-controls">
                    <button className="cellar-btn" onClick={() => setShowGuide(true)}>
                        <span>📜</span> Cellar Master's Guide
                    </button>
                    <button className="cellar-btn" onClick={() => setShowCollection(true)}>
                        <span>🏷️</span> Browse Collection
                    </button>
                </div>
            </div>

            {/* Right Sidebar - Actual Cellar Specimen */}
            <div className="cellar-sidebar">
                <div className="model-card" onClick={() => setShowCellarModal(true)}>
                    <div className="model-preview">
                        <iframe
                            title="Cellar Preview"
                            frameBorder="0"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            src="https://sketchfab.com/models/818681dd3c024756a42f5ef634da0804/embed?autostart=0&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&transparent=1"
                            style={{ pointerEvents: 'none' }}
                        ></iframe>
                    </div>
                    <div className="model-label">
                        <span className="icon">🏺</span>
                        <span>Visit Actual Cellar</span>
                        <small>Interactive 3D Walkthrough</small>
                    </div>
                </div>
            </div>

            {/* Educational Modal */}
            {showGuide && (
                <div className="cellar-modal-overlay" onClick={() => setShowGuide(false)}>
                    <div className="cellar-modal-content guide-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowGuide(false)}>×</button>

                        <h2 style={{ fontFamily: 'serif', fontSize: '2.5rem', color: '#d4af37', marginBottom: '1rem', textAlign: 'center' }}>
                            The Art of Maturation
                        </h2>
                        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#aaa' }}>
                            Wine is one of the few foods that can improve with age. Understanding how storage and vessels affect the final liquid is key to mastery.
                        </p>

                        <div className="cellar-content-grid">

                            {/* Section 1: Oak Aging */}
                            <div className="cellar-section">
                                <h3>1. The Oak Influence</h3>
                                <p>
                                    Barrels do more than store wine; they are an active ingredient. The wood allows slow oxygenation and imparts distinct flavors.
                                </p>
                                <div className="oak-comparison">
                                    <div className="oak-card">
                                        <h4>🇫🇷 French Oak</h4>
                                        <ul>
                                            <li>Tighter grain</li>
                                            <li>Subtle aromatics</li>
                                            <li>Silkier tannins</li>
                                            <li>Notes: Vanilla, Clove, Spice</li>
                                        </ul>
                                    </div>
                                    <div className="oak-card">
                                        <h4>🇺🇸 American Oak</h4>
                                        <ul>
                                            <li>Wider grain</li>
                                            <li>Bolder flavors</li>
                                            <li>Creamier texture</li>
                                            <li>Notes: Coconut, Dill, Cream Soda</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Bottle Aging */}
                            <div className="cellar-section">
                                <h3>2. Evolution in Bottle</h3>
                                <p>
                                    Once bottled, wine is cut off from oxygen (mostly). The chemical reactions shift from oxidation to reduction.
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, color: '#ccc' }}>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong style={{ color: '#d4af37' }}>Young Wine:</strong> Dominated by primary fruit flavors (Fresh Berry, Citrus).
                                    </li>
                                    <li style={{ marginBottom: '1rem' }}>
                                        <strong style={{ color: '#d4af37' }}>Mature Wine:</strong> Primary fruit fades. Tertiary notes emerge: Leather, Mushroom, Tobacco, Forest Floor.
                                    </li>
                                    <li>
                                        <strong style={{ color: '#d4af37' }}>Texture:</strong> Tannins polymerize (form long chains) and precipitate out as sediment, making the wine taste smoother.
                                    </li>
                                </ul>
                            </div>

                            {/* Section 3: Storage Conditions */}
                            <div className="cellar-section" style={{ gridColumn: '1 / -1' }}>
                                <h3>3. The Golden Rules of Storage</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '1rem' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '2rem' }}>🌡️</span>
                                        <h4 style={{ color: '#fff', margin: '0.5rem 0' }}>Temperature</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Constant 10-15°C (50-59°F). Heat cooks wine; fluctuations cause oxidation.</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '2rem' }}>💧</span>
                                        <h4 style={{ color: '#fff', margin: '0.5rem 0' }}>Humidity</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>60-75%. Too dry = corks shrink & air enters. Too humid = labels rot.</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '2rem' }}>💡</span>
                                        <h4 style={{ color: '#fff', margin: '0.5rem 0' }}>Darkness</h4>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>UV light degrades wine (Light Strike). This is why bottles are tinted green or brown.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Actual Cellar Specimen Modal */}
            {showCellarModal && (
                <div className="cellar-modal-overlay" onClick={() => setShowCellarModal(false)}>
                    <div className="cellar-modal-content model-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowCellarModal(false)}>×</button>
                        <div className="sketchfab-embed-wrapper full-version">
                            <iframe
                                title="wine cellar"
                                frameBorder="0"
                                allowFullScreen
                                mozallowfullscreen="true"
                                webkitallowfullscreen="true"
                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                xr-spatial-tracking="true"
                                execution-while-out-of-viewport="true"
                                execution-while-not-rendered="true"
                                web-share="true"
                                src="https://sketchfab.com/models/818681dd3c024756a42f5ef634da0804/embed?autostart=1&dnt=1"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Collection Browser Modal */}
            {showCollection && (
                <div className="cellar-modal-overlay" onClick={() => setShowCollection(false)}>
                    <div className="cellar-modal-content guide-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowCollection(false)}>×</button>

                        <h2 style={{ fontFamily: 'serif', fontSize: '2.5rem', color: '#d4af37', marginBottom: '1rem', textAlign: 'center' }}>
                            Cellar Collection
                        </h2>

                        {/* Filters */}
                        <div className="collection-filters">
                            {['All', 'Red', 'White', 'Sparkling'].map(type => (
                                <button
                                    key={type}
                                    className={`filter-btn ${filter === type ? 'active' : ''}`}
                                    onClick={() => setFilter(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="collection-grid">
                            {filteredWines.map(wine => (
                                <div key={wine.id} className="wine-card">
                                    <span className={`wine-type ${wine.type}`}>{wine.type}</span>
                                    <h4>{wine.name}</h4>
                                    <small>{wine.region} | {wine.vintage}</small>
                                    <p>"{wine.note}"</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Cellar;
