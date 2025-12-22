import React, { useEffect, useRef } from 'react';
import { Application, Graphics } from 'pixi.js';
import './LiquidSplash.css';

const LiquidSplash = () => {
    const canvasRef = useRef(null);
    const appRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        let app;
        let isDestroyed = false;

        const init = async () => {
            try {
                app = new Application();
                await app.init({
                    canvas: canvasRef.current,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    backgroundAlpha: 0,
                    antialias: true,
                    resolution: window.devicePixelRatio || 1,
                    autoDensity: true,
                });

                if (isDestroyed) {
                    app.destroy(true, { children: true, texture: true });
                    return;
                }

                appRef.current = app;

                // Simple particles
                const particles = [];
                for (let i = 0; i < 50; i++) {
                    const g = new Graphics();
                    g.beginFill(0xD4AF37, Math.random() * 0.3 + 0.1);
                    const r = Math.random() * 2 + 1;
                    g.drawCircle(0, 0, r);
                    g.endFill();

                    const p = {
                        graphic: g,
                        x: Math.random() * app.screen.width,
                        y: Math.random() * app.screen.height,
                        vx: (Math.random() - 0.5) * 1,
                        vy: (Math.random() - 0.5) * 1
                    };

                    app.stage.addChild(g);
                    particles.push(p);
                }

                app.ticker.add(() => {
                    particles.forEach(p => {
                        p.x += p.vx;
                        p.y += p.vy;

                        if (p.x < 0 || p.x > app.screen.width) p.vx *= -1;
                        if (p.y < 0 || p.y > app.screen.height) p.vy *= -1;

                        p.graphic.x = p.x;
                        p.graphic.y = p.y;
                    });
                });

                const onResize = () => {
                    if (app.renderer) {
                        app.renderer.resize(window.innerWidth, window.innerHeight);
                    }
                };
                window.addEventListener('resize', onResize);
                app._cleanup = () => window.removeEventListener('resize', onResize);

            } catch (error) {
                console.error('PIXI Init Error:', error);
            }
        };

        init();

        return () => {
            isDestroyed = true;
            if (app) {
                if (app._cleanup) app._cleanup();
                app.destroy(true, { children: true, texture: true });
            }
        };
    }, []);

    return <canvas ref={canvasRef} className="liquid-splash" />;
};

export default LiquidSplash;
