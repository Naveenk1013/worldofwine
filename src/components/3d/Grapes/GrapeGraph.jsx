import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
import GrapeNode from './GrapeNode';

// Separate component for Links to optimize re-rendering
const GraphLinks = ({ links }) => {
    const linesRef = useRef([]);

    useFrame(() => {
        // Imperatively update line positions
        links.forEach((link, i) => {
            if (linesRef.current[i]) {
                const line = linesRef.current[i];
                // Update the geometry points
                // Note: zwei Line uses setPoints internally if we had access, but prop update is easier here
                // However, to avoid react render, we might need a custom line or just let it be.
                // For now, let's keep it simple. If we want 60fps links we need a different approach.
                // But updating props will cause re-render of THIS component.

                // Better approach with standard Line:
                // We actually can't easily update declarative Line without re-rendering.
                // But since we are okay with *some* overhead, let's try to update the geometry directly if possible.
                // OR just accept that links might lag or we trigger a re-render.

                // OPTIMIZATION: Use a single buffer geometry with segments.
            }
        });
    });

    // For this version, we will use a naive approach: Force re-render of lines is too heavy.
    // Let's use a simpler custom Line implementation or just use segments.
    // To keep it safe and working, we will stick to React updates for Links but optimize Nodes first.
    // Re-rendering Lines 60fps is bad.

    // START OF ACTUAL COMPONENT
    // We will construct the geometry ONCE and update attributes.
    const geometryRef = useRef();

    useFrame(() => {
        if (geometryRef.current && links.length > 0) {
            const positions = geometryRef.current.attributes.position.array;
            // Safety check for array size mismatch
            if (positions.length !== links.length * 6) return;

            let i = 0;
            links.forEach(link => {
                // Validate that source/target are objects with coordinates (d3 has processed them)
                // and that coordinates are actual numbers
                if (link.source && typeof link.source === 'object' &&
                    link.target && typeof link.target === 'object' &&
                    Number.isFinite(link.source.x) && Number.isFinite(link.target.x)) {

                    positions[i++] = link.source.x;
                    positions[i++] = link.source.y;
                    positions[i++] = link.source.z;
                    positions[i++] = link.target.x;
                    positions[i++] = link.target.y;
                    positions[i++] = link.target.z;
                } else {
                    // If invalid, zero out or keep previous (keeps buffer cursor consistent)
                    // If we skip, we get misalignment. Better to fill with 0 or last known.
                    // But simplest is to just ensure we don't write NaNs.
                    // If we don't increment i, we might break the buffer structure if we have fixed size.
                    // Actually, if we skip 'i' increment, we leave gaps.
                    // The buffer expects a fixed number of segments.
                    // Best fallback: Set to 0 if invalid to avoid crash, effectively hiding the link at origin.
                    positions[i++] = 0;
                    positions[i++] = 0;
                    positions[i++] = 0;
                    positions[i++] = 0;
                    positions[i++] = 0;
                    positions[i++] = 0;
                }
            });
            geometryRef.current.attributes.position.needsUpdate = true;
        }
    });

    // Create segments: 2 points per link
    const initialPositions = useMemo(() => {
        const pos = new Float32Array(links.length * 2 * 3);
        return pos;
    }, [links.length]);

    return (
        <lineSegments>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute
                    attach="attributes-position"
                    count={links.length * 2}
                    array={initialPositions}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color="white" opacity={0.15} transparent linewidth={1} />
        </lineSegments>
    );
}


const GrapeGraph = ({ data, onNodeClick }) => {
    // Transform raw data into graph format
    const graphicalData = useMemo(() => {
        const nodes = data.map(d => ({ ...d })); // Clone
        const links = [];

        data.forEach(sourceNode => {
            if (sourceNode.links) {
                sourceNode.links.forEach(targetId => {
                    // Check if target exists in our dataset
                    if (data.find(d => d.id === targetId)) {
                        links.push({
                            source: sourceNode.id,
                            target: targetId,
                            value: 1
                        });
                    }
                });
            }
        });

        return { nodes, links };
    }, [data]);

    const simulationRef = useRef(null);

    useEffect(() => {
        // Initialize simulation
        const sim = forceSimulation(graphicalData.nodes)
            .numDimensions(3)
            .force('link', forceLink(graphicalData.links).id(d => d.id).distance(5)) // Increased distance
            .force('charge', forceManyBody().strength(-60)) // Increased repulsion
            .force('center', forceCenter());

        simulationRef.current = sim;

        // Re-heat simulation on data change with high alpha
        sim.alpha(1).restart();

        return () => sim.stop();
    }, [graphicalData]);

    useFrame(() => {
        if (simulationRef.current) {
            simulationRef.current.tick();
        }
    });

    return (
        <group>
            {/* Render Nodes */}
            {graphicalData.nodes.map((node) => (
                <GrapeNode
                    key={node.id}
                    node={node}
                    onNodeClick={onNodeClick}
                />
            ))}

            {/* Render Links Optimized */}
            {/* key is essential to force re-creation of buffer geometry when link count changes, preventing WebGL buffer resize errors */}
            <GraphLinks
                links={graphicalData.links}
                key={graphicalData.links.length}
            />
        </group>
    );
};

export default GrapeGraph;
