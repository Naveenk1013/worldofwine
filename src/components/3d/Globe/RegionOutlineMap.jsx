import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const RegionOutlineMap = ({ region, countryGeoJson, stateGeoJson }) => {
    const svgRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef(null);

    // Monitor container size
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        if (!region || !dimensions.width) return;

        // 1. Data Selection logic
        let feature = null;
        let isCountry = false;

        // Try to find state/province match first (if we have state data)
        // Note: Logic assumes basic name matching. Can be enhanced.
        // if (stateGeoJson && region.state) {
        //     feature = stateGeoJson.features.find(f => ...);
        // }

        // Fallback: Use Country Data
        if (!feature && countryGeoJson) {
            feature = countryGeoJson.features.find(f =>
                f.properties.ISO_A2 === region.countryCode ||
                f.properties.name === region.country ||
                f.properties.ADMIN === region.country
            );
            isCountry = true;
        }

        if (!feature) return;

        // 2. D3 Rendering
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous

        const { width, height } = dimensions;

        // Create projection fitted to the feature
        const projection = d3.geoMercator()
            .fitSize([width * 0.8, height * 0.8], feature) // 20% padding
            .translate([width / 2, height / 2]);

        const pathGenerator = d3.geoPath().projection(projection);

        // Draw the feature (Country/State Outline)
        svg.append("path")
            .datum(feature)
            .attr("d", pathGenerator)
            .attr("fill", "rgba(255, 255, 255, 0.05)")
            .attr("stroke", "#D4AF37")
            .attr("stroke-width", 2)
            .attr("vector-effect", "non-scaling-stroke");

        // Draw the specific region location point
        const [x, y] = projection([region.lon, region.lat]);

        // Ripple/marker group
        const markerGroup = svg.append("g")
            .attr("transform", `translate(${x}, ${y})`);

        // Pulse Animation
        markerGroup.append("circle")
            .attr("r", 5)
            .attr("fill", "none")
            .attr("stroke", "#D4AF37")
            .attr("stroke-width", 2)
            .append("animate")
            .attr("attributeName", "r")
            .attr("from", "5")
            .attr("to", "20")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");

        markerGroup.append("circle")
            .attr("r", 5)
            .attr("fill", "none")
            .attr("stroke", "#D4AF37")
            .attr("stroke-width", 1)
            .attr("opacity", 1)
            .append("animate")
            .attr("attributeName", "opacity")
            .attr("from", "1")
            .attr("to", "0")
            .attr("dur", "1.5s")
            .attr("repeatCount", "indefinite");

        // Center dot
        markerGroup.append("circle")
            .attr("r", 4)
            .attr("fill", "#D4AF37");

        // Label
        markerGroup.append("text")
            .attr("class", "map-label")
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .attr("fill", "#fff")
            .style("font-size", "14px")
            .style("font-family", "Arial, sans-serif")
            .style("text-shadow", "0 2px 4px rgba(0,0,0,0.8)")
            .text(region.name);

    }, [region, dimensions, countryGeoJson, stateGeoJson]);

    return (
        <div ref={containerRef} className="outline-map-container" style={{ width: '100%', height: '100%' }}>
            <svg ref={svgRef} width="100%" height="100%" style={{ overflow: 'visible' }}></svg>
        </div>
    );
};

export default RegionOutlineMap;
