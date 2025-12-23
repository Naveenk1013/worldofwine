import React, { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';

const Leaf = ({ position, color, scale }) => (
    <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.1, 7, 7]} />
        <meshStandardMaterial color={color} />
    </mesh>
);

const GrapeCluster = ({ position, color }) => (
    <group position={position}>
        <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.1, -0.1, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[-0.1, -0.1, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={color} />
        </mesh>
    </group>
);

const Vine = ({ position, season, isMobile }) => {
    // Determine vine properties based on season
    const properties = useMemo(() => {
        switch (season) {
            case 'winter':
                return { hasLeaves: false, hasGrapes: false, leafColor: '#4fab4f' };
            case 'spring':
                return { hasLeaves: true, hasGrapes: false, leafColor: '#90EE90', leafScale: 0.8 }; // LightGreen
            case 'summer':
                return { hasLeaves: true, hasGrapes: true, leafColor: '#228B22', grapeColor: '#9ACD32', leafScale: 1.2 }; // ForestGreen, YellowGreen (unripe)
            case 'autumn':
                return { hasLeaves: true, hasGrapes: true, leafColor: '#DAA520', grapeColor: '#800080', leafScale: 1.0 }; // GoldenRod, Purple (ripe)
            default:
                return { hasLeaves: true, hasGrapes: true, leafColor: 'green' };
        }
    }, [season]);

    return (
        <group position={position}>
            {/* Main Trunk */}
            <mesh position={[0, 0.75, 0]} castShadow={!isMobile}>
                <cylinderGeometry args={[0.05, 0.08, 1.5, 8]} />
                <meshStandardMaterial color="#5C4033" />
            </mesh>

            {/* Branches / Canes */}
            <mesh position={[0, 1.4, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
                <meshStandardMaterial color="#5C4033" />
            </mesh>
            <mesh position={[0, 1.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
                <meshStandardMaterial color="#5C4033" />
            </mesh>

            {/* Leaves */}
            {properties.hasLeaves && (
                <group position={[0, 1.5, 0]}>
                    <Leaf position={[0.3, 0.2, 0.2]} color={properties.leafColor} scale={properties.leafScale} />
                    <Leaf position={[-0.3, 0.1, -0.1]} color={properties.leafColor} scale={properties.leafScale} />
                    <Leaf position={[0, 0.4, 0]} color={properties.leafColor} scale={properties.leafScale} />
                    <Leaf position={[0.2, 0, -0.3]} color={properties.leafColor} scale={properties.leafScale} />
                    <Leaf position={[-0.2, 0.3, 0.2]} color={properties.leafColor} scale={properties.leafScale} />
                </group>
            )}

            {/* Grapes */}
            {properties.hasGrapes && (
                <group position={[0, 1.3, 0.1]}>
                    <GrapeCluster position={[0.2, -0.2, 0]} color={properties.grapeColor} />
                    <GrapeCluster position={[-0.2, -0.3, 0]} color={properties.grapeColor} />
                </group>
            )}
        </group>
    );
};

const VineRow = ({ position, length = 10, season, isMobile }) => {
    // Create an array of positions for vines in the row
    const vines = useMemo(() => {
        const arr = [];
        for (let i = 0; i < length; i++) {
            arr.push(i * 1.5 - (length * 1.5) / 2); // Center the row
        }
        return arr;
    }, [length]);

    return (
        <group position={position}>
            {vines.map((x, i) => (
                <Vine key={i} position={[x, 0, 0]} season={season} isMobile={isMobile} />
            ))}
        </group>
    );
};

export default VineRow;
