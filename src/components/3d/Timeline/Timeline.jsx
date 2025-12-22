import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Text, Environment } from '@react-three/drei';
import timelineData from '../../../data/wine-timeline.json';
import './Timeline.css';

// Time Portal Component
const TimePortal = ({ event, index }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime + index) * 0.2;
        }
    });

    const zPosition = -index * 15;

    return (
        <group position={[0, 0, zPosition]}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <torusGeometry args={[3, 0.3, 16, 50]} />
                <meshStandardMaterial
                    color={event.color}
                    emissive={event.color}
                    emissiveIntensity={hovered ? 0.8 : 0.3}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            <Text position={[0, 0, 0]} fontSize={1.5} color="#FFD700" anchorX="center" anchorY="middle">
                {event.icon}
            </Text>

            <Text position={[0, 4, 0]} fontSize={0.8} color={event.color} anchorX="center" anchorY="middle" fontWeight="bold">
                {event.year}
            </Text>

            <Text position={[0, 3, 0]} fontSize={0.5} color="#D4AF37" anchorX="center" anchorY="middle">
                {event.era}
            </Text>
        </group>
    );
};

// Tunnel walls
const TunnelWalls = () => {
    const tunnelLength = timelineData.length * 15 + 20;

    return (
        <>
            <mesh position={[-8, 0, -tunnelLength / 2]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.5, 10, tunnelLength]} />
                <meshStandardMaterial color="#1a1a1d" metalness={0.9} roughness={0.1} emissive="#722F37" emissiveIntensity={0.1} />
            </mesh>

            <mesh position={[8, 0, -tunnelLength / 2]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.5, 10, tunnelLength]} />
                <meshStandardMaterial color="#1a1a1d" metalness={0.9} roughness={0.1} emissive="#722F37" emissiveIntensity={0.1} />
            </mesh>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -tunnelLength / 2]}>
                <planeGeometry args={[16, tunnelLength]} />
                <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
            </mesh>
        </>
    );
};

// Main Timeline Scene
const TimelineScene = ({ scrollProgress }) => {
    const cameraRef = useRef();

    useFrame(() => {
        if (cameraRef.current) {
            const maxDistance = timelineData.length * 15;
            cameraRef.current.position.z = -scrollProgress * maxDistance;
        }
    });

    return (
        <>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 5]} fov={75} />
            <Environment preset="night" />
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 10, 0]} intensity={1} color="#D4AF37" />
            <TunnelWalls />
            {timelineData.map((event, index) => (
                <TimePortal key={event.id} event={event} index={index} />
            ))}
        </>
    );
};

// Main Timeline Component
const TimelinePage = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const accumulatorRef = useRef(0);
    const indexRef = useRef(0);

    const jumpToEra = (index) => {
        const targetProgress = index / (timelineData.length - 1);

        // Smoothly update accumulator over a short duration
        accumulatorRef.current = targetProgress;
        setScrollProgress(targetProgress);
        setCurrentEventIndex(index);
        indexRef.current = index;

        setIsTransitioning(true);
        setTimeout(() => {
            setIsTransitioning(false);
        }, 600);
    };

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();

            // Accumulate scroll delta
            accumulatorRef.current += e.deltaY * 0.0015;
            accumulatorRef.current = Math.max(0, Math.min(1, accumulatorRef.current));

            setScrollProgress(accumulatorRef.current);

            // Calculate current event index
            const newIndex = Math.floor(accumulatorRef.current * (timelineData.length - 1));

            // Only trigger transition if index changed
            if (newIndex !== indexRef.current) {
                setIsTransitioning(true);
                indexRef.current = newIndex;
                setCurrentEventIndex(newIndex);

                // Reset transition state after a short delay
                setTimeout(() => {
                    setIsTransitioning(false);
                }, 300);
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, []); // Empty dependency array means this only runs once

    const currentEvent = timelineData[currentEventIndex];

    return (
        <div className="timeline-page-wrapper">
            <div className="timeline-canvas-fixed">
                <Canvas>
                    <TimelineScene scrollProgress={scrollProgress} />
                </Canvas>
            </div>

            <div key={currentEventIndex} className={`timeline-info-animated ${isTransitioning ? 'vanish' : 'appear'}`}>
                <div className="timeline-icon">{currentEvent.icon}</div>
                <h2 className="timeline-year">{currentEvent.year}</h2>
                <h3 className="timeline-era">{currentEvent.era}</h3>
                <h4 className="timeline-title">{currentEvent.title}</h4>
                <p className="timeline-description">{currentEvent.description}</p>
                <div className="scroll-progress-bar">
                    <div className="scroll-progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
                </div>
                <p className="scroll-hint">🖱️ Scroll or click below ({currentEventIndex + 1}/{timelineData.length})</p>
            </div>

            {/* Horizontal Era Navigator */}
            <div className="era-navigator-container">
                <div className="era-navigator-track">
                    {timelineData.map((event, index) => (
                        <div
                            key={event.id}
                            className={`era-point ${index === currentEventIndex ? 'active' : ''}`}
                            onClick={() => jumpToEra(index)}
                            title={`${event.year}: ${event.title}`}
                        >
                            <div className="era-dot" />
                            <div className="era-label">
                                <span className="era-label-year">{event.year}</span>
                                <span className="era-label-title">{event.title}</span>
                            </div>
                        </div>
                    ))}
                    <div
                        className="era-navigator-progress"
                        style={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TimelinePage;
