import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import Terrain from './Terrain';
import VineRow from './VineRow';
import useIsMobile from '../../../hooks/useIsMobile';

const VineyardScene = ({ season, soilType }) => {
    const isMobile = useIsMobile();

    return (
        <Canvas camera={{ position: [5, 5, 10], fov: 50 }} shadows={!isMobile} dpr={isMobile ? [1, 1] : [1, 2]}>
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow={!isMobile}
                shadow-mapSize={[1024, 1024]}
            />
            <Sky sunPosition={[100, 20, 100]} />
            <Environment preset="park" />

            {/* Controls */}
            <OrbitControls
                maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below ground
                minDistance={2}
                maxDistance={20}
            />

            {/* Scene Objects */}
            <Terrain soilType={soilType} />

            {/* Rows of Vines */}
            {/* Rows of Vines */}
            <VineRow position={[0, 0, -3]} length={8} season={season} isMobile={isMobile} />
            <VineRow position={[0, 0, 0]} length={8} season={season} isMobile={isMobile} />
            <VineRow position={[0, 0, 3]} length={8} season={season} isMobile={isMobile} />

            {/* Fog for depth */}
            <fog attach="fog" args={['#d0e6f2', 10, 50]} />
        </Canvas>
    );
};

export default VineyardScene;
