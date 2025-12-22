import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const GrapeNode = ({ node, onNodeClick }) => {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Reusable vector to avoid GC
    const vec = new THREE.Vector3();

    // Determine color based on grape type
    const getColor = (type) => {
        switch (type) {
            case 'Red': return '#58111A'; // Deep Ruby
            case 'White': return '#F2E6B6'; // Pale Straw
            case 'Rosé': return '#F8B8B8'; // Salmon Pink
            default: return '#888888';
        }
    };

    const color = getColor(node.type);

    useFrame((state) => {
        if (groupRef.current) {
            // Update position from D3 simulation data directly
            // This avoids React re-renders for position updates
            groupRef.current.position.set(node.x, node.y, node.z);
        }

        if (meshRef.current) {
            // Subtle floating animation added to the mesh (relative to group)
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime + node.id.length) * 0.002;

            // Scale up on hover
            const targetScale = hovered ? 1.5 : 1;
            vec.set(targetScale, targetScale, targetScale);
            meshRef.current.scale.lerp(vec, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onNodeClick(node);
                }}
                onPointerOver={() => {
                    document.body.style.cursor = 'pointer';
                    setHovered(true);
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'auto';
                    setHovered(false);
                }}
            >
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.5 : 0.1}
                    roughness={0.2}
                    metalness={0.5}
                />
            </mesh>

            {/* Label always visible but opacity changes */}
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
                fillOpacity={hovered ? 1 : 0.6}
                renderOrder={1} // Ensure text renders on top
                depthTest={false} // Disable depth testing to always show on top of sphere
            >
                {node.name}
            </Text>

            {/* Hover Tooltip (HTML overlay) */}
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="grape-tooltip">
                        <strong>{node.name}</strong>
                        <br />
                        <span style={{ fontSize: '0.8em', opacity: 0.8 }}>{node.origin}</span>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default GrapeNode;
