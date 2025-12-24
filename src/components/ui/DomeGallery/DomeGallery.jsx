
import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import grapeData from '../../../data/grape-varieties.json'; // Import Data
import './DomeGallery.css';

const DEFAULTS = {
    maxVerticalRotationDeg: 15,
    dragSensitivity: 20,
    enlargeTransitionMs: 300,
    segments: 36 // Use even number for cleaner division
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};
const getDataNumber = (el, name, fallback) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

// Start modification: Custom Colors based on type
const getTypeColor = (type) => {
    switch (type) {
        case 'Red': return 'linear-gradient(135deg, #58111A, #2E0B0E)';
        case 'White': return 'linear-gradient(135deg, #F2E6B6, #D4C485)';
        case 'Rosé': return 'linear-gradient(135deg, #F8B8B8, #D48888)';
        default: return '#333';
    }
};

function buildItems(pool, seg) {
    // Calculate columns: Item width is 2 units.
    // To fit 360 degrees (seg units), we can have seg/2 columns.
    const cols = Math.floor(seg / 2);

    // Generate x offsets centered around the sphere
    // Range roughly [-seg/2, seg/2]
    const xCols = Array.from({ length: cols }, (_, i) => {
        return (-seg / 2) + (i * 2);
    });

    const evenYs = [-4, -2, 0, 2, 4]; // Vertical spread
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;

    // Use Grape Data
    // Shuffle pool to make it random
    const shuffled = [...pool].sort(() => 0.5 - Math.random());

    // Create circular buffer of data if we have fewer grapes than slots (unlikely with 1000 grapes but safe)
    const usedImages = Array.from({ length: totalSlots }, (_, i) => shuffled[i % shuffled.length]);

    return coords.map((c, i) => ({
        ...c,
        data: usedImages[i] // Attach full grape object
    }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
}

export default function DomeGallery({
    images = (grapeData || []), // Safely fallback to empty array
    fit = 0.5,
    fitBasis = 'auto',
    minRadius = 600,
    maxRadius = Infinity,
    padFactor = 0.25,
    overlayBlurColor = '#060010',
    maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
    dragSensitivity = DEFAULTS.dragSensitivity,
    enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
    segments = DEFAULTS.segments,
    dragDampening = 2,
    openedImageWidth = '400px', // Larger open view
    openedImageHeight = '400px',
    imageBorderRadius = '30px',
    openedImageBorderRadius = '30px',
    grayscale = false // No grayscale, we want colors
}) {
    const rootRef = useRef(null);
    const mainRef = useRef(null);
    const sphereRef = useRef(null);
    const frameRef = useRef(null);
    const viewerRef = useRef(null);
    const scrimRef = useRef(null);
    const focusedElRef = useRef(null);
    const originalTilePositionRef = useRef(null);

    const rotationRef = useRef({ x: 0, y: 0 });
    const startRotRef = useRef({ x: 0, y: 0 });
    const startPosRef = useRef(null);
    const draggingRef = useRef(false);
    const movedRef = useRef(false);
    const inertiaRAF = useRef(null);
    const openingRef = useRef(false);
    const openStartedAtRef = useRef(0);
    const lastDragEndAt = useRef(0);

    const scrollLockedRef = useRef(false);
    const lockScroll = useCallback(() => {
        if (scrollLockedRef.current) return;
        scrollLockedRef.current = true;
        document.body.classList.add('dg-scroll-lock');
    }, []);
    const unlockScroll = useCallback(() => {
        if (!scrollLockedRef.current) return;
        if (rootRef.current?.getAttribute('data-enlarging') === 'true') return;
        scrollLockedRef.current = false;
        document.body.classList.remove('dg-scroll-lock');
    }, []);

    const items = useMemo(() => buildItems(images, segments), [images, segments]);

    const applyTransform = (xDeg, yDeg) => {
        const el = sphereRef.current;
        if (el) {
            el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    };

    const lockedRadiusRef = useRef(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const ro = new ResizeObserver(entries => {
            const cr = entries[0].contentRect;
            const w = Math.max(1, cr.width),
                h = Math.max(1, cr.height);
            const minDim = Math.min(w, h),
                maxDim = Math.max(w, h),
                aspect = w / h;
            let basis;
            switch (fitBasis) {
                case 'min': basis = minDim; break;
                case 'max': basis = maxDim; break;
                case 'width': basis = w; break;
                case 'height': basis = h; break;
                default: basis = aspect >= 1.3 ? w : minDim;
            }
            let radius = basis * fit;
            const heightGuard = h * 1.35;
            radius = Math.min(radius, heightGuard);
            radius = clamp(radius, minRadius, maxRadius);
            lockedRadiusRef.current = Math.round(radius);

            const viewerPad = Math.max(8, Math.round(minDim * padFactor));
            root.style.setProperty('--radius', `${lockedRadiusRef.current}px`);
            root.style.setProperty('--viewer-pad', `${viewerPad}px`);
            root.style.setProperty('--overlay-blur-color', overlayBlurColor);
            root.style.setProperty('--tile-radius', imageBorderRadius);
            root.style.setProperty('--enlarge-radius', openedImageBorderRadius);
            root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
            applyTransform(rotationRef.current.x, rotationRef.current.y);

            // Handle resizing of open overlay if needed
            // ... (omitted for brevity, assume standard resize logic)
        });
        ro.observe(root);
        return () => ro.disconnect();
    }, [fit, fitBasis, minRadius, maxRadius, padFactor, overlayBlurColor, grayscale, imageBorderRadius, openedImageBorderRadius, openedImageWidth, openedImageHeight]);

    useEffect(() => { applyTransform(rotationRef.current.x, rotationRef.current.y); }, []);

    // Inertia & Drag Implementation (Standard from snippet)
    const stopInertia = useCallback(() => {
        if (inertiaRAF.current) {
            cancelAnimationFrame(inertiaRAF.current);
            inertiaRAF.current = null;
        }
    }, []);

    const startInertia = useCallback((vx, vy) => {
        const MAX_V = 1.4;
        let vX = clamp(vx, -MAX_V, MAX_V) * 80;
        let vY = clamp(vy, -MAX_V, MAX_V) * 80;
        let frames = 0;
        const d = clamp(dragDampening ?? 0.6, 0, 1);
        const frictionMul = 0.94 + 0.055 * d;
        const stopThreshold = 0.015 - 0.01 * d;
        const maxFrames = Math.round(90 + 270 * d);
        const step = () => {
            vX *= frictionMul;
            vY *= frictionMul;
            if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
                inertiaRAF.current = null;
                return;
            }
            if (++frames > maxFrames) {
                inertiaRAF.current = null;
                return;
            }
            const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg);
            const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
            rotationRef.current = { x: nextX, y: nextY };
            applyTransform(nextX, nextY);
            inertiaRAF.current = requestAnimationFrame(step);
        };
        stopInertia();
        inertiaRAF.current = requestAnimationFrame(step);
    }, [dragDampening, maxVerticalRotationDeg, stopInertia]);

    useGesture(
        {
            onDragStart: ({ event }) => {
                if (focusedElRef.current) return;
                stopInertia();
                const evt = event;
                draggingRef.current = true;
                movedRef.current = false;
                startRotRef.current = { ...rotationRef.current };
                startPosRef.current = { x: evt.clientX, y: evt.clientY };
            },
            onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
                if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return;
                const evt = event;
                const dxTotal = evt.clientX - startPosRef.current.x;
                const dyTotal = evt.clientY - startPosRef.current.y;
                if (!movedRef.current) {
                    const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
                    if (dist2 > 16) movedRef.current = true;
                }
                const nextX = clamp(startRotRef.current.x - dyTotal / dragSensitivity, -maxVerticalRotationDeg, maxVerticalRotationDeg);
                const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity);
                rotationRef.current = { x: nextX, y: nextY };
                applyTransform(nextX, nextY);

                if (last) {
                    draggingRef.current = false;
                    let [vMagX, vMagY] = velocity;
                    const [dirX, dirY] = direction;
                    let vx = vMagX * dirX;
                    let vy = vMagY * dirY;
                    if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy);
                    if (movedRef.current) lastDragEndAt.current = performance.now();
                    movedRef.current = false;
                }
            }
        },
        { target: mainRef, eventOptions: { passive: true } }
    );

    // Opening / Closing Handling
    useEffect(() => {
        const scrim = scrimRef.current;
        if (!scrim) return;
        const close = () => {
            // ... (Close logic from snippet, largely same but handling non-img)
            if (performance.now() - openStartedAtRef.current < 250) return;
            const el = focusedElRef.current;
            if (!el) return;
            const parent = el.parentElement;
            const overlay = viewerRef.current?.querySelector('.enlarge');
            if (!overlay) return;

            const refDiv = parent.querySelector('.item__image--reference');
            // ... (restoration logic)
            if (refDiv) refDiv.remove(); // Simplified restoration

            // Animate closing
            const currentRect = overlay.getBoundingClientRect();
            const rootRect = rootRef.current.getBoundingClientRect();
            const originalPos = originalTilePositionRef.current; // Assume it exists

            if (!originalPos) { overlay.remove(); unlockScroll(); return; } // Safety

            const overlayRelativeToRoot = {
                left: currentRect.left - rootRect.left,
                top: currentRect.top - rootRect.top,
                width: currentRect.width,
                height: currentRect.height
            };

            const animatingOverlay = document.createElement('div');
            animatingOverlay.className = 'enlarge-closing';
            animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;`;

            // Clone content
            const innerContent = overlay.firstChild?.cloneNode(true);
            if (innerContent) animatingOverlay.appendChild(innerContent);

            overlay.remove();
            rootRef.current.appendChild(animatingOverlay);

            requestAnimationFrame(() => {
                const originalPosRelativeToRoot = {
                    left: originalPos.left - rootRect.left,
                    top: originalPos.top - rootRect.top,
                    width: originalPos.width,
                    height: originalPos.height
                };
                animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
                animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
                animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
                animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
                animatingOverlay.style.opacity = '0';
            });

            animatingOverlay.addEventListener('transitionend', () => {
                animatingOverlay.remove();
                originalTilePositionRef.current = null;
                el.style.visibility = '';
                el.style.zIndex = 0;
                focusedElRef.current = null;
                rootRef.current?.removeAttribute('data-enlarging');
                openingRef.current = false;
                unlockScroll();
            }, { once: true });
        };
        scrim.addEventListener('click', close);
        // ...
        return () => scrim.removeEventListener('click', close);
    }, [enlargeTransitionMs, unlockScroll]);

    const openItemFromElement = useCallback(el => {
        // ... (Open logic)
        if (openingRef.current) return;
        openingRef.current = true;
        openStartedAtRef.current = performance.now();
        lockScroll();
        const parent = el.parentElement;
        focusedElRef.current = el;
        // ... Calculate offsets (same as snippet) ...
        const offsetX = getDataNumber(parent, 'offsetX', 0);
        const offsetY = getDataNumber(parent, 'offsetY', 0);
        const sizeX = getDataNumber(parent, 'sizeX', 2);
        const sizeY = getDataNumber(parent, 'sizeY', 2);
        const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments);

        const parentY = normalizeAngle(parentRot.rotateY);
        const globalY = normalizeAngle(rotationRef.current.y);
        let rotY = -(parentY + globalY) % 360;
        if (rotY < -180) rotY += 360;
        const rotX = -parentRot.rotateX - rotationRef.current.x;

        parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
        parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

        // Ref div for 3D preservation
        const refDiv = document.createElement('div');
        refDiv.className = 'item__image item__image--reference';
        refDiv.style.opacity = '0';
        refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
        parent.appendChild(refDiv);

        const tileR = refDiv.getBoundingClientRect();
        const mainR = mainRef.current?.getBoundingClientRect();
        const frameR = frameRef.current?.getBoundingClientRect();

        originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
        el.style.visibility = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'enlarge';
        overlay.style.cssText = `position:absolute;left:${frameR.left - mainR.left}px;top:${frameR.top - mainR.top}px;width:${frameR.width}px;height:${frameR.height}px;opacity:0;z-index:30;transform-origin:top left;transition: all ${enlargeTransitionMs}ms ease;`;

        // Clone Content Logic
        const cardContent = el.querySelector('.grape-card-dome')?.cloneNode(true);
        if (cardContent) {
            // Enhance card for Detail View if needed, or just show bigger
            cardContent.style.width = '100%';
            cardContent.style.height = '100%';
            cardContent.style.fontSize = '1.5rem'; // Bigger text
            overlay.appendChild(cardContent);
        }

        viewerRef.current.appendChild(overlay);

        // Animation start
        const tx0 = tileR.left - frameR.left;
        const ty0 = tileR.top - frameR.top;
        const sx0 = tileR.width / frameR.width;
        const sy0 = tileR.height / frameR.height;

        overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
            rootRef.current?.setAttribute('data-enlarging', 'true');
        });

    }, [enlargeTransitionMs, lockScroll, segments]);

    const onTileClick = useCallback(e => {
        if (draggingRef.current || movedRef.current || openingRef.current) return;
        openItemFromElement(e.currentTarget);
    }, [openItemFromElement]);

    const onTilePointerUp = useCallback(e => {
        if (e.pointerType !== 'touch' || draggingRef.current || movedRef.current || openingRef.current) return;
        openItemFromElement(e.currentTarget);
    }, [openItemFromElement]);

    return (
        <div ref={rootRef} className="sphere-root" style={{
            ['--segments-x']: segments,
            ['--segments-y']: segments,
            ['--overlay-blur-color']: overlayBlurColor,
            ['--tile-radius']: imageBorderRadius,
            ['--enlarge-radius']: openedImageBorderRadius,
            ['--image-filter']: grayscale ? 'grayscale(1)' : 'none'
        }}>
            <main ref={mainRef} className="sphere-main">
                <div className="stage">
                    <div ref={sphereRef} className="sphere">
                        {items.map((it, i) => (
                            <div key={i} className="item"
                                data-offset-x={it.x} data-offset-y={it.y} data-size-x={2} data-size-y={2}
                                style={{
                                    ['--offset-x']: it.x, ['--offset-y']: it.y,
                                    ['--item-size-x']: 2, ['--item-size-y']: 2
                                }}>
                                <div className="item__image" role="button" onClick={onTileClick} onPointerUp={onTilePointerUp}>
                                    {/* Custom Grape Card Content */}
                                    <div className="grape-card-dome" style={{ background: getTypeColor(it.data.type) }}>
                                        <h4>{it.data.name}</h4>
                                        <span className="dome-region">{it.data.origin}</span>

                                        <div className="dome-card-details">
                                            <div className="dome-detail-row">
                                                <strong>Type:</strong> {it.data.type}
                                            </div>
                                            <div className="dome-detail-row">
                                                <strong>Profile:</strong> {it.data.profile}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="viewer" ref={viewerRef}><div ref={scrimRef} className="scrim" /><div ref={frameRef} className="frame" /></div>
            </main >
        </div >
    );
}
