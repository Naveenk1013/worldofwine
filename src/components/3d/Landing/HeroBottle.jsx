import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, ContactShadows } from '@react-three/drei';

const HeroBottle = () => {
    const bottleRef = useRef();
    const liquidRef = useRef();

    // Create a realistic bottle profile using LatheGeometry
    const bottlePoints = useMemo(() => {
        const points = [];
        // Bottom chamfer
        points.push(new THREE.Vector2(0, -1.8));
        points.push(new THREE.Vector2(0.55, -1.8));
        points.push(new THREE.Vector2(0.6, -1.75));

        // Body (Main cylinder)
        points.push(new THREE.Vector2(0.6, 0.5));

        // Shoulder (Curve)
        for (let i = 0; i <= 10; i++) {
            const angle = (i / 10) * Math.PI * 0.5;
            const x = 0.6 - (0.4 * (1 - Math.cos(angle)));
            const y = 0.5 + (0.5 * Math.sin(angle));
            points.push(new THREE.Vector2(x, y));
        }

        // Neck
        points.push(new THREE.Vector2(0.18, 1.5));
        points.push(new THREE.Vector2(0.18, 1.8));

        // Lip
        points.push(new THREE.Vector2(0.22, 1.82));
        points.push(new THREE.Vector2(0.22, 1.9));
        points.push(new THREE.Vector2(0, 1.9));

        return points;
    }, []);

    // Create a liquid profile (slightly smaller and inside)
    const liquidPoints = useMemo(() => {
        const points = [];
        points.push(new THREE.Vector2(0, -1.75));
        points.push(new THREE.Vector2(0.55, -1.75));
        points.push(new THREE.Vector2(0.55, 0.5));
        points.push(new THREE.Vector2(0, 0.5));
        return points;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (bottleRef.current) {
            bottleRef.current.rotation.y = t * 0.15;
            bottleRef.current.position.y = Math.sin(t * 0.5) * 0.1;
        }
    });

    return (
        <group position={[0, 0, 0]}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Bottle Glass */}
                <mesh ref={bottleRef} castShadow receiveShadow>
                    <latheGeometry args={[bottlePoints, 128]} />
                    <meshPhysicalMaterial
                        color="#2a2a2a"
                        metalness={0.1}
                        roughness={0.05}
                        transmission={0.95}
                        thickness={0.5}
                        ior={1.5}
                        reflectivity={0.5}
                        clearcoat={1.0}
                        clearcoatRoughness={0.05}
                        transparent
                        opacity={1}
                        envMapIntensity={1.5}
                    />
                </mesh>

                {/* Wine Liquid inside */}
                <mesh ref={liquidRef} position={[0, -0.05, 0]}>
                    <latheGeometry args={[liquidPoints, 64]} />
                    <meshStandardMaterial
                        color="#722F37"
                        metalness={0}
                        roughness={0.2}
                        transparent
                        opacity={0.95}
                        emissive="#4a1f25"
                        emissiveIntensity={0.3}
                    />
                </mesh>
            </Float>
        </group>
    );
};

export default HeroBottle;
