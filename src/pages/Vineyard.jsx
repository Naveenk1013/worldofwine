
import React, { useState } from 'react';
import './Vineyard.css';

const Vineyard = () => {
    // State for Disease Section
    const [showDiseases, setShowDiseases] = useState(false);
    const [expandedSteps, setExpandedSteps] = useState({});

    // State for Ecosystem Section
    const [showEcosystem, setShowEcosystem] = useState(false);

    // State for Grape Specimen
    const [showGrapeModal, setShowGrapeModal] = useState(false);

    const toggleStep = (stepIndex) => {
        setExpandedSteps(prev => ({
            ...prev,
            [stepIndex]: !prev[stepIndex]
        }));
    };

    // Disease Data Structure
    const diseaseData = [
        {
            title: "STEP 1: CLASSIFICATION OF VINEYARD DISEASES",
            content: (
                <div>
                    <p>Vineyard diseases are classified into four major categories:</p>
                    <ul>
                        <li><strong>Fungal Diseases</strong> (most common and destructive)</li>
                        <li><strong>Bacterial Diseases</strong></li>
                        <li><strong>Viral Diseases</strong></li>
                        <li><strong>Pest-Related Diseases</strong></li>
                    </ul>
                    <p>Each type requires different prevention strategies.</p>
                </div>
            )
        },
        {
            title: "STEP 2: FUNGAL DISEASES (Primary Threat)",
            content: (
                <div>
                    <p>Fungal diseases spread through air, water, and humidity.</p>

                    <div className="disease-type-block">
                        <h4>1. Powdery Mildew (Oidium)</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Type:</strong> Fungal (Most widespread)
                            </div>
                            <div className="detail-item">
                                <strong>Symptoms:</strong>
                                <ul>
                                    <li>White or gray powder on leaves/grapes</li>
                                    <li>Poor ripening</li>
                                    <li>Reduced sugar accumulation</li>
                                    <li>Off-flavors in wine</li>
                                </ul>
                            </div>
                            <div className="detail-item">
                                <strong>Favorable Conditions:</strong>
                                <ul>
                                    <li>Warm temperatures (20–30°C)</li>
                                    <li>High humidity</li>
                                    <li>Shaded, dense canopies</li>
                                </ul>
                            </div>
                            <div className="detail-item">
                                <strong>Prevention & Control:</strong>
                                <ul>
                                    <li>Proper pruning and airflow</li>
                                    <li>Sunlight exposure to clusters</li>
                                    <li>Sulfur sprays / Systemic fungicides</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="disease-type-block">
                        <h4>2. Downy Mildew</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Type:</strong> Fungal
                            </div>
                            <div className="detail-item">
                                <strong>Symptoms:</strong>
                                <ul>
                                    <li>Yellow oil-like spots on upper leaf</li>
                                    <li>White fungal growth underneath</li>
                                    <li>Premature leaf drop</li>
                                </ul>
                            </div>
                            <div className="detail-item">
                                <strong>Prevention:</strong>
                                <ul>
                                    <li>Well-drained soils</li>
                                    <li>Avoid overhead irrigation</li>
                                </ul>
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong>
                                <ul>
                                    <li>Copper-based fungicides</li>
                                    <li>Preventive spraying before rain</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="disease-type-block">
                        <h4>3. Botrytis Bunch Rot (Gray Rot)</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Symptoms:</strong> Gray mold, berry splitting, yield loss.
                            </div>
                            <div className="detail-item">
                                <strong>Special Case (Noble Rot):</strong> Controlled Botrytis used for sweet wines (requires misty mornings, dry afternoons).
                            </div>
                            <div className="detail-item">
                                <strong>Prevention:</strong> Loose cluster management, leaf removal.
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong> Fungicides before closure, sanitation.
                            </div>
                        </div>
                    </div>

                    <div className="disease-type-block">
                        <h4>4. Black Rot</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Symptoms:</strong> Brown leaf spots, grapes shrivel into black mummies.
                            </div>
                            <div className="detail-item">
                                <strong>Conditions:</strong> Warm, humid climates.
                            </div>
                            <div className="detail-item">
                                <strong>Prevention:</strong> Remove infected material, clean vineyard floor.
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong> Fungicide application early season.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "STEP 3: BACTERIAL DISEASES (Less Common, Serious)",
            content: (
                <div>
                    <div className="disease-type-block">
                        <h4>5. Pierce’s Disease</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Type:</strong> Bacterial (Spread by leafhoppers)
                            </div>
                            <div className="detail-item">
                                <strong>Symptoms:</strong> Leaf scorch, uneven ripening, vine death (1-2 years).
                            </div>
                            <div className="detail-item">
                                <strong>Conditions:</strong> Warm climates, insect vectors.
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong> No cure. Remove infected vines immediately.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "STEP 4: VIRAL DISEASES (Invisible Damage)",
            content: (
                <div>
                    <div className="disease-type-block">
                        <h4>6. Grapevine Leafroll Disease</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Symptoms:</strong> Downward curling leaves, delayed ripening, reduced sugar.
                            </div>
                            <div className="detail-item">
                                <strong>Spread:</strong> Infected material, mealybugs.
                            </div>
                            <div className="detail-item">
                                <strong>Strategy:</strong> Certified virus-free vines, hygiene. Rogue infected vines.
                            </div>
                        </div>
                    </div>
                    <div className="disease-type-block">
                        <h4>7. Fanleaf Virus</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Symptoms:</strong> Deformed fan-shaped leaves, poor fruit set.
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong> Clean planting material, nematode control.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "STEP 5: PEST-RELATED DISEASES",
            content: (
                <div>
                    <div className="disease-type-block">
                        <h4>8. Phylloxera</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Type:</strong> Insect pest (Root damage, vine death).
                            </div>
                            <div className="detail-item">
                                <strong>History:</strong> Destroyed European vineyards in 19th century.
                            </div>
                            <div className="detail-item">
                                <strong>Prevention:</strong> Grafting onto American rootstocks (Essential). Sandy soils reduce risk.
                            </div>
                        </div>
                    </div>
                    <div className="disease-type-block">
                        <h4>9. Nematodes</h4>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <strong>Type:</strong> Soil pests (Weak vines, poor nutrient uptake).
                            </div>
                            <div className="detail-item">
                                <strong>Control:</strong> Soil testing, crop rotation, resistant rootstocks.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: "STEP 6: INTEGRATED DISEASE MANAGEMENT",
            content: (
                <div>
                    <p>The best vineyards use Integrated Pest Management (IPM).</p>
                    <strong>Key IPM Principles:</strong>
                    <ul>
                        <li>Regular vineyard monitoring</li>
                        <li>Weather-based disease prediction</li>
                        <li>Minimal but timely spraying</li>
                        <li>Biological and mechanical controls first</li>
                    </ul>
                </div>
            )
        },
        {
            title: "STEP 7: PREVENTIVE PRACTICES",
            content: (
                <table className="prevention-table">
                    <thead>
                        <tr>
                            <th>Practice</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Pruning</td><td>Controls airflow and humidity</td></tr>
                        <tr><td>Canopy management</td><td>Reduces fungal pressure</td></tr>
                        <tr><td>Drainage</td><td>Prevents root diseases</td></tr>
                        <tr><td>Sanitation</td><td>Stops disease spread</td></tr>
                        <tr><td>Timely harvest</td><td>Avoids rot</td></tr>
                    </tbody>
                </table>
            )
        }
    ];

    // Ecosystem Data
    const ecosystemSections = [
        {
            title: "Soil Conditions for Vineyards",
            content: "Soil plays a critical role in vineyard performance, not by directly adding flavor to grapes, but by controlling water availability, root depth, and vine vigor. The best vineyard soils are typically well-drained and low in fertility, which forces the vine to grow deeper roots and focus its energy on fruit rather than excessive leaf growth. Soils such as limestone, gravel, clay, sandy, and volcanic soils are commonly found in great wine regions. Limestone soils help retain acidity in grapes, gravel soils provide excellent drainage and heat retention, clay soils store water and support steady ripening, sandy soils limit vine vigor and reduce pest pressure, and volcanic soils offer good drainage and mineral balance. Poor drainage and overly fertile soils often result in high yields but diluted fruit quality, which is undesirable for fine wine production."
        },
        {
            title: "Temperature Requirements in Vineyards",
            content: "Temperature is the primary driver of grapevine growth and fruit ripening. Grapevines require an average growing-season temperature between 10°C and 20°C to ripen grapes effectively. Below 10°C, vine activity slows or stops, while temperatures above 35°C can cause vine stress, sunburn on grapes, and loss of aroma compounds. Warm temperatures promote sugar accumulation, while cooler temperatures help preserve natural acidity. One of the most important factors in quality vineyards is diurnal temperature variation, meaning warm days and cool nights. This temperature difference allows grapes to ripen during the day while retaining freshness and acidity at night, leading to better balance and complexity in wine."
        },
        {
            title: "Climatic Conditions for Vineyards",
            content: "Climate refers to the long-term weather patterns of a region and determines which grape varieties can be grown successfully. Most wine regions are located between 30° and 50° latitude in both hemispheres, where seasonal temperature variation supports vine dormancy and growth cycles. Vineyards thrive in Mediterranean climates with warm, dry summers and mild winters, as well as in continental climates with warm summers and cold winters, and maritime climates influenced by nearby oceans. Excessive rainfall during the growing season increases disease pressure, while dry conditions near harvest are ideal for grape quality. A stable climate with predictable seasons allows growers to manage vines effectively and achieve consistent yields year after year."
        }
    ];

    return (
        <div className="vineyard-page">
            {/* Sketchfab Embed Integration - Visual Backbone */}
            <div className="sketchfab-embed-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <iframe
                    title="Vineyard Large"
                    frameBorder="0"
                    allowFullScreen
                    mozallowfullscreen="true"
                    webkitallowfullscreen="true"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    xr-spatial-tracking="true"
                    execution-while-out-of-viewport="true"
                    execution-while-not-rendered="true"
                    web-share="true"
                    src="https://sketchfab.com/models/3850183caa0c4cecb15331cdad4c8d2b/embed?autostart=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0"
                    style={{ width: '100%', height: '100%' }}
                >
                </iframe>
            </div>

            {/* Main UI */}
            <div className="vineyard-ui">
                <div className="control-panel" style={{ width: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {/* Disease Guide Trigger */}
                    <button className="menu-btn-large" onClick={() => setShowDiseases(true)} style={{ marginTop: 0 }}>
                        <span>🦠</span> Vineyard Diseases
                    </button>

                    {/* Ecosystem Guide Trigger */}
                    <button className="menu-btn-large" onClick={() => setShowEcosystem(true)}>
                        <span>🌱</span> Vineyard Ecosystem
                    </button>
                </div>
            </div>

            {/* Right Sidebar - Grape Specimen */}
            <div className="grape-model-sidebar">
                <div className="model-card" onClick={() => setShowGrapeModal(true)}>
                    <div className="model-preview">
                        <iframe
                            title="Green Grapes Preview"
                            frameBorder="0"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            src="https://sketchfab.com/models/1f54f3fe7ace4719951606663abbb357/embed?autostart=0&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&transparent=1"
                            style={{ pointerEvents: 'none' }}
                        ></iframe>
                    </div>
                    <div className="model-label">
                        <span className="icon">🍇</span>
                        <span>Inspect Specimen</span>
                        <small>Click for detailed view</small>
                    </div>
                </div>
            </div>

            {/* Diseases Guide Modal */}
            {showDiseases && (
                <div className="vineyard-modal-overlay" onClick={() => setShowDiseases(false)}>
                    <div className="disease-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowDiseases(false)}>×</button>

                        <div className="disease-header">
                            <h2>Vineyard Diseases</h2>
                            <p>Types, Symptoms, Prevention, and Control (A Systematic Guide)</p>
                        </div>

                        <div className="disease-scroll-area">
                            <i style={{ display: 'block', marginBottom: '1.5rem', color: '#888' }}>
                                "Healthy grapes begin with disease prevention, not treatment. Most vineyard diseases cannot be fully cured once established—they must be managed early and continuously."
                            </i>

                            {diseaseData.map((step, index) => (
                                <div key={index} className="disease-step">
                                    <div
                                        className="accordion-header"
                                        onClick={() => toggleStep(index)}
                                    >
                                        <span className="accordion-title">{step.title}</span>
                                        <span className={`accordion-icon ${expandedSteps[index] ? 'rotated' : ''}`}>
                                            ▼
                                        </span>
                                    </div>
                                    <div className={`accordion-content ${expandedSteps[index] ? 'expanded' : ''}`}>
                                        <div className="accordion-inner-padding">
                                            {step.content}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Ecosystem Guide Modal */}
            {showEcosystem && (
                <div className="vineyard-modal-overlay" onClick={() => setShowEcosystem(false)}>
                    <div className="disease-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowEcosystem(false)}>×</button>

                        <div className="disease-header">
                            <h2>Vineyard Ecosystem</h2>
                            <p>Soil, Temperature, and Climate Conditions</p>
                        </div>

                        <div className="disease-scroll-area">
                            {ecosystemSections.map((section, index) => (
                                <div key={index} className="disease-type-block" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                                    <h3 style={{ color: '#ffd700', fontSize: '1.4rem', marginBottom: '1rem', fontFamily: 'serif' }}>
                                        {section.title}
                                    </h3>
                                    <p style={{ lineHeight: '1.6', color: '#ddd' }}>
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Enlarged Grape Specimen View */}
            {showGrapeModal && (
                <div className="vineyard-modal-overlay" onClick={() => setShowGrapeModal(false)}>
                    <div className="vineyard-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowGrapeModal(false)}>×</button>
                        <div className="sketchfab-embed-wrapper full-version">
                            <iframe
                                title="Green Grapes Full"
                                frameBorder="0"
                                allowFullScreen
                                webkitallowfullscreen="true"
                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                src="https://sketchfab.com/models/1f54f3fe7ace4719951606663abbb357/embed?autostart=1&autospin=0.5&ui_theme=dark"
                            ></iframe>
                        </div>
                        <div className="modal-caption">
                            <h3>Magnified Grape Cluster</h3>
                            <p>Observe the detailed structure of the berries and stems.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Vineyard;
