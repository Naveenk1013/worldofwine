import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/ui/LoadingScreen';
import Navigation from './components/ui/Navigation';

import Footer from './components/ui/Footer/Footer';

// Lazy load pages
const Landing = React.lazy(() => import('./pages/Landing'));
const Globe = React.lazy(() => import('./pages/Globe'));
const Timeline = React.lazy(() => import('./pages/Timeline'));
const GrapeVarieties = React.lazy(() => import('./pages/GrapeVarieties'));
const Vineyard = React.lazy(() => import('./pages/Vineyard'));
const TastingLab = React.lazy(() => import('./pages/TastingLab'));
const PairingGame = React.lazy(() => import('./pages/PairingGame'));
const Cellar = React.lazy(() => import('./pages/Cellar'));
const GrapeGallery = React.lazy(() => import('./pages/GrapeGallery'));

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Navigation />
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/globe" element={<Globe />} />
                    <Route path="/timeline" element={<Timeline />} />
                    <Route path="/grapes" element={<GrapeVarieties />} />
                    <Route path="/vineyard" element={<Vineyard />} />
                    <Route path="/tasting" element={<TastingLab />} />

                    <Route path="/pairing" element={<PairingGame />} />
                    <Route path="/cellar" element={<Cellar />} />
                    <Route path="/gallery" element={<GrapeGallery />} />
                </Routes>
            </Suspense>
            <Footer />
        </Router>
    );
}

export default App;
