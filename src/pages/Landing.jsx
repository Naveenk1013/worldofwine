import React, { Suspense, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import Scene from '../components/3d/Scene';
import HeroBottle from '../components/3d/Landing/HeroBottle';
import LiquidSplash from '../components/ui/LiquidSplash';
// import StoryOfWine from '../components/ui/StoryOfWine/StoryOfWine'; // Legacy import
const StoryOfWine = React.lazy(() => import('../components/ui/StoryOfWine/StoryOfWine'));
import './Landing.css';

const Landing = () => {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Force a small delay to ensure smooth transition
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`landing-page ${isLoaded ? 'is-visible' : ''}`}>
            {/* Background Layer: Cinematic Gradient (via CSS) */}
            <div className="background-base"></div>

            {/* 3D Scene Layer */}
            <div className="canvas-container">
                <Scene enableControls={false}>
                    <color attach="background" args={['#000000']} />
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

                    {/* Professional Studio Lighting */}
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={2.5} color="#D4AF37" />
                    <pointLight position={[-10, 5, 5]} intensity={1.5} color="#722F37" />
                    <spotLight
                        position={[0, 10, 0]}
                        angle={0.3}
                        penumbra={1}
                        intensity={2}
                        castShadow
                    />

                    <Environment preset="night" />

                    <Suspense fallback={null}>
                        <HeroBottle />
                    </Suspense>

                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={1.5}
                    />
                </Scene>
            </div>

            {/* UI Content Layer */}
            <div className="landing-content">
                <header className="hero-header">
                    <h1 className="landing-title">
                        World <span className="title-accent">of </span> Wine
                    </h1>
                    <div className="title-underline"></div>
                    <p className="landing-tagline">
                        A cinematic odyssey through 8,000 years of viticulture,
                        where every bottle tells a story of earth, spirit, and time.
                    </p>
                </header>

                <div className="landing-cta">
                    <button
                        className="btn-premium primary"
                        onClick={() => navigate('/timeline')}
                    >
                        <span className="btn-inner">
                            <span className="btn-text">Begin Your Journey</span>
                            <span className="btn-icon">→</span>
                        </span>
                        <div className="btn-glimmer"></div>
                    </button>

                    <button
                        className="btn-premium secondary"
                        onClick={() => navigate('/globe')}
                    >
                        <span className="btn-inner">
                            <span className="btn-text">Explore the Globe</span>

                        </span>
                    </button>
                </div>

                <div className="scroll-invitation">
                    <div className="mouse-icon">
                        <div className="mouse-wheel"></div>
                    </div>

                </div>
            </div>

            {/* Cinematic Post-Processing Overlays */}
            <div className="vignette-overlay"></div>
            <div className="bottom-gradient-overlay"></div>

            {/* Story Section - Appended Below Fold */}
            <div style={{ position: 'relative', zIndex: 20 }}>
                <Suspense fallback={<div style={{ height: '100vh', background: '#000' }}></div>}>
                    <StoryOfWine />
                </Suspense>
            </div>
        </div>
    );
};

export default Landing;
