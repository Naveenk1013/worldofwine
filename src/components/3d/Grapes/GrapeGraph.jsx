import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';
import GrapeNode from './GrapeNode';

// Separate component for Links to optimize re-rendering

const GraphLinks = ({ links, activityRef }) => {
    const linesRef = useRef([]);

    // ... (unused previous code comments removed for brevity)

    // START OF ACTUAL COMPONENT
    // We will construct the geometry ONCE and update attributes.
    const geometryRef = useRef();

    useFrame(() => {
        // PERF: Only update if simulation is active (nodes are moving)
        if (activityRef && !activityRef.current) return;

        if (geometryRef.current && links.length > 0) {
            const positions = geometryRef.current.attributes.position.array;
            // Safety check for array size mismatch
            if (positions.length !== links.length * 6) return;

            let i = 0;
            links.forEach(link => {
                // Validate that source/target are objects within range
                if (link.source && link.target &&
                    Number.isFinite(link.source.x) && Number.isFinite(link.target.x)) {

                    positions[i++] = link.source.x;
                    positions[i++] = link.source.y;
                    positions[i++] = link.source.z;
                    positions[i++] = link.target.x;
                    positions[i++] = link.target.y;
                    positions[i++] = link.target.z;
                } else {
                    // Fallback for safety
                    for (let j = 0; j < 6; j++) positions[i++] = 0;
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
    const activityRef = useRef(true); // Tracks if simulation is active

    useEffect(() => {
        // Initialize simulation
        const sim = forceSimulation(graphicalData.nodes)
            .numDimensions(3)
            .force('link', forceLink(graphicalData.links).id(d => d.id).distance(5)) // Increased distance
            .force('charge', forceManyBody().strength(-60)) // Increased repulsion
            .force('center', forceCenter());

        // Set alphaMin to stop simulation when settled
        sim.alphaMin(0.01);

        simulationRef.current = sim;
        activityRef.current = true;

        // Re-heat simulation on data change with high alpha
        sim.alpha(1).restart();

        return () => sim.stop();
    }, [graphicalData]);

    useFrame(() => {
        if (simulationRef.current) {
            // Only tick if alpha is high enough
            if (simulationRef.current.alpha() > simulationRef.current.alphaMin()) {
                simulationRef.current.tick();
                activityRef.current = true;
            } else {
                activityRef.current = false;
            }
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
                activityRef={activityRef}
                key={graphicalData.links.length}
            />
        </group>
    );
};

export default GrapeGraph;
