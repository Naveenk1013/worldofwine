import React from 'react';
import { useLocation } from 'react-router-dom';
import PillNav from './PillNav/PillNav';
import './Navigation.css'; // Keeping this if there are global nav styles, though PillNav has its own.

const Navigation = () => {
    const location = useLocation();

    const navItems = [
        { href: '/', label: 'Home' },
        { href: '/globe', label: 'Globe' },
        { href: '/timeline', label: 'Timeline' },
        { href: '/grapes', label: 'Grapes' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/vineyard', label: 'Vineyard' },
        { href: '/tasting', label: 'Tasting' },
        // { href: '/pairing', label: 'Pairing' }, // Maybe too many for pill nav? let's keep them if fits.
        { href: '/cellar', label: 'Cellar' },
        { href: '/classification', label: 'Classification' },
    ];

    return (
        <div className="navigation-wrapper" style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, pointerEvents: 'none' }}>
            {/* Pointer events none on wrapper so clicks pass through, but PillNav has pointer-events auto on itself usually or needs it */}
            {/* PillNav CSS handles positioning usually, but let's check. 
               The provided CSS places it absolute top 1em.
               We can just render it.
           */}
            <PillNav

                items={navItems}
                activeHref={location.pathname}
                baseColor="rgba(10, 5, 5, 0.85)" // Specific deep dark background
                pillColor="#800020" // Burgundy accent
                pillTextColor="#e0e0e0"
                hoveredPillTextColor="#ffffff"
                className="world-of-wine-nav"
            />
        </div>
    );
};

export default Navigation;
