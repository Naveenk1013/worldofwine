import React from 'react';
import { useTexture } from '@react-three/drei';

const Terrain = ({ soilType }) => {
    // Define colors for different soil types since we might not have textures ready
    const soilColors = {
        clay: '#8B4513',      // SaddleBrown
        limestone: '#F5DEB3', // Wheat
        sand: '#C2B280',      // Sand
        volcanic: '#3b3b3b'   // Dark Grey
    };

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial 
                color={soilColors[soilType] || soilColors.clay}
                roughness={1}
                metalness={0}
            />
        </mesh>
    );
};

export default Terrain;
