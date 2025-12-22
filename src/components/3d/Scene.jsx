import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';

const Scene = React.memo(({ children, cameraPosition = [0, 0, 5], enableControls = true }) => {
    // Memoize GL configuration to prevent recreation on every render
    const glConfig = useMemo(() => ({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false, // Better performance
        stencil: false // Disable if not needed
    }), []);

    return (
        <Canvas
            shadows
            gl={glConfig}
            dpr={[1, 2]}
            performance={{ min: 0.5 }} // Auto-adjust quality on slow devices
        >
            <PerspectiveCamera makeDefault position={cameraPosition} />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[1024, 1024]} // Optimized shadow resolution
                shadow-camera-near={0.5}
                shadow-camera-far={50}
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#D4AF37" />

            {/* Background Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

            {/* Controls */}
            {enableControls && (
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxDistance={20}
                    minDistance={2}
                    enableDamping={true} // Smooth camera movement
                    dampingFactor={0.05}
                    rotateSpeed={0.5}
                    zoomSpeed={0.8}
                />
            )}

            {/* Scene Content */}
            {children}
        </Canvas>
    );
});

Scene.displayName = 'Scene';

export default Scene;
