import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: true,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'Inter',
});

const MermaidChart = ({ chart }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            mermaid.contentLoaded();
            // Manual render for dynamic updates if needed, but simple init often works.
            // For React, explicit render is safer:
            containerRef.current.removeAttribute('data-processed');

            try {
                mermaid.run({
                    nodes: [containerRef.current],
                });
            } catch (e) {
                console.error('Mermaid render error:', e);
            }
        }
    }, [chart]);

    return (
        <div className="mermaid" ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {chart}
        </div>
    );
};

export default MermaidChart;
