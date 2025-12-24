import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import GrapeGraph from '../components/3d/Grapes/GrapeGraph';
import grapeData from '../data/grape-varieties.json';
import './GrapeVarieties.css';
import useIsMobile from '../hooks/useIsMobile';

const GrapeVarieties = () => {
    const isMobile = useIsMobile();
    const [selectedGrape, setSelectedGrape] = useState(null);
    const [filterType, setFilterType] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Name'); // Name, Origin, Type

    // Filter and Sort data
    const filteredData = useMemo(() => {
        let data = grapeData.filter(grape => {
            const matchesType = filterType === 'All' || grape.type === filterType;
            const term = searchTerm.toLowerCase();
            const matchesSearch = grape.name.toLowerCase().includes(term) ||
                grape.origin.toLowerCase().includes(term);
            return matchesType && matchesSearch;
        });

        console.log("Filtered Data Count:", data.length);

        // Apply Sorting
        return data.sort((a, b) => {
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'Origin') return a.origin.localeCompare(b.origin);
            if (sortBy === 'Type') return a.type.localeCompare(b.type);
            return 0;
        });
    }, [filterType, searchTerm, sortBy]);

    const handleNodeClick = (node) => {
        setSelectedGrape(node);
        // On mobile, maybe close sidebar if picking from there, but this is node click 
        // usually 3d click.
    };

    // Educational Data
    const wineTypeFacts = {
        'Red': {
            temp: '16-18°C (60-65°F)',
            glass: 'Bordeaux or Burgundy Glass (Large bowl)',
            desc: 'Fermented with skins, producing tannins and deeper colors. Typically richer and more complex.'
        },
        'White': {
            temp: '7-13°C (45-55°F)',
            glass: 'Standard White Wine Glass (Smaller bowl)',
            desc: 'Fermented after pressing juice from skins. Known for acidity, floral, and fruit aromas.'
        },
        'Rosé': {
            temp: '7-13°C (45-55°F)',
            glass: 'Standard White Wine Glass',
            desc: 'Skin contact is limited to a few hours. Combines the refreshing nature of white wine with red fruit flavors.'
        },
        'default': {
            temp: 'Varies',
            glass: 'Standard Glass',
            desc: 'Explore this unique wine style.'
        }
    };

    const getFact = (type) => wineTypeFacts[type] || wineTypeFacts['default'];

    return (
        <div className="grape-varieties-page">
            <Canvas dpr={isMobile ? [1, 1] : [1, 2]} gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 35]} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    maxDistance={100}
                    minDistance={5}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />

                {/* Professional Lighting Setup */}
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffecd1" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8a4f5f" />

                {/* Fog for depth and aesthetics */}
                <fog attach="fog" args={['#050505', 20, 90]} />

                <GrapeGraph data={filteredData} onNodeClick={handleNodeClick} />
            </Canvas>

            <div className="grape-ui-overlay">
                <header className="grape-header">
                    <div className="header-top-row">
                        <h1>Grape Universe</h1>
                    </div>

                    <div className="grape-search-container">
                        <input
                            type="text"
                            placeholder="Search grapes or regions (e.g., Merlot, Italy)..."
                            className="grape-search-input"
                            value={searchTerm}
                            onChange={(e) => {
                                console.log("Searching for:", e.target.value);
                                setSearchTerm(e.target.value);
                            }}
                        />
                        <span style={{ marginLeft: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
                            {filteredData.length} grapes found
                        </span>
                    </div>

                    <div className="controls-row">
                        <div className="grape-filters">
                            {['All', 'Red', 'White'].map(type => (
                                <button
                                    key={type}
                                    className={`filter-btn ${filterType === type ? 'active' : ''}`}
                                    onClick={() => setFilterType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="grape-sort">
                            <label>Sort by: </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="sort-select"
                            >
                                <option value="Name">Name (A-Z)</option>
                                <option value="Origin">Origin</option>
                                <option value="Type">Type</option>
                            </select>
                        </div>

                        <div className="view-toggles">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                title="Grid View"
                            >
                                ⊞
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                title="List View"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Directory Content */}
                <div className="grape-directory-container">
                    <div className="directory-header">
                        <h3>Grape Directory ({filteredData.length})</h3>
                        {/* Mobile toggle logic removed as this is now main content */}
                    </div>

                    {viewMode === 'grid' ? (
                        <div className="grape-grid">
                            {filteredData.map(grape => (
                                <div
                                    key={grape.id}
                                    className={`grape-card ${selectedGrape?.id === grape.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedGrape(grape);
                                    }}
                                >
                                    <div className="card-header">
                                        <span
                                            className="grape-dot"
                                            style={{
                                                backgroundColor:
                                                    grape.type === 'Red' ? '#58111A' :
                                                        grape.type === 'White' ? '#F2E6B6' :
                                                            grape.type === 'Rosé' ? '#F8B8B8' : '#ccc'
                                            }}
                                        ></span>
                                        <span className="grape-name">{grape.name}</span>
                                    </div>
                                    <span className="grape-origin">{grape.origin}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grape-list-layout">
                            {filteredData.map(grape => (
                                <div
                                    key={grape.id}
                                    className={`grape-directory-row ${selectedGrape?.id === grape.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedGrape(grape);
                                    }}
                                >
                                    <span
                                        className="row-dot"
                                        style={{
                                            backgroundColor:
                                                grape.type === 'Red' ? '#58111A' :
                                                    grape.type === 'White' ? '#F2E6B6' :
                                                        grape.type === 'Rosé' ? '#F8B8B8' : '#ccc',
                                            border: `1px solid ${grape.type === 'Red' ? '#722F37' : '#fff'}`
                                        }}
                                    ></span>
                                    <span className="row-name">{grape.name}</span>
                                    <span className="row-type">{grape.type}</span>
                                    <span className="row-origin">{grape.origin}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {filteredData.length === 0 && (
                        <div className="no-results">No grapes found matching "{searchTerm}"</div>
                    )}
                </div>

                {/* Legend */}
                <div className="grape-legend">
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#58111A', border: '1px solid #722F37' }}></span> Red
                    </div>
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#F2E6B6' }}></span> White
                    </div>
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#F8B8B8' }}></span> Rosé
                    </div>
                </div>

                {
                    selectedGrape && (
                        <div className="grape-info-panel">
                            <span className="panel-close" onClick={() => setSelectedGrape(null)}>×</span>
                            <h2 className="grape-name">{selectedGrape.name}</h2>
                            <span className="grape-origin">{selectedGrape.origin}</span>

                            <div className="grape-details">
                                <div className="detail-item">
                                    <strong>Type</strong>
                                    <p>{selectedGrape.type}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Flavor Profile</strong>
                                    <p>{selectedGrape.profile}</p>
                                </div>

                                <hr className="panel-divider" />

                                <div className="detail-item">
                                    <strong>Serving Temp</strong>
                                    <p>{getFact(selectedGrape.type).temp}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Glassware</strong>
                                    <p>{getFact(selectedGrape.type).glass}</p>
                                </div>
                                <div className="detail-item">
                                    <strong>Did you know?</strong>
                                    <p className="fact-text">{getFact(selectedGrape.type).desc}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default GrapeVarieties;
