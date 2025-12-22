import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-screen">
            <div className="wine-glass">
                <div className="glass-bowl">
                    <div className="wine-fill" style={{ height: `${progress}%` }}>
                        <div className="wine-surface"></div>
                    </div>
                </div>
                <div className="glass-stem"></div>
                <div className="glass-base"></div>
            </div>
            <h2 className="loading-text">World of Wine</h2>
            <p className="loading-percentage">{progress}%</p>
            <div className="loading-bar">
                <div className="loading-progress" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};

export default LoadingScreen;
