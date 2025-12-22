import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ColorBends from '../ColorBends/ColorBends';
// asset import
import './StoryOfWine.css';

const FadeIn = ({ children, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
    >
        {children}
    </motion.div>
);

const StoryChapter = ({ title, subtitle, children, id, bgComponent }) => (
    <section className="story-section" id={id} style={{ isolation: 'isolate' }}>
        {bgComponent && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, opacity: 0.6, pointerEvents: 'none' }}>
                {bgComponent}
            </div>
        )}
        <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <FadeIn>
                <h2 className="story-chapter-title">{title}</h2>
                {subtitle && <p className="story-subheading">{subtitle}</p>}
            </FadeIn>
            <div className="story-content">
                {children}
            </div>
        </div>
    </section>
);

const Bubbles = () => {
    // Generate random bubbles - Memoized to prevent re-creation on every render
    const bubbles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 10 + 5,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 4,
        duration: Math.random() * 2 + 3
    })), []);

    return (
        <div className="interactive-canvas" style={{ background: 'linear-gradient(to top, #2b0a10, #000)' }}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                {bubbles.map(b => (
                    <div
                        key={b.id}
                        className="bubble"
                        style={{
                            width: b.size,
                            height: b.size,
                            left: b.left,
                            animationDuration: `${b.duration}s`,
                            animationDelay: `${b.delay}s`
                        }}
                    />
                ))}
            </div>
            <div style={{ position: 'absolute', color: 'rgba(255,255,255,0.5)', bottom: '10px' }}>Fermentation Active</div>
        </div>
    );
};

const SeasonWheel = () => (
    <div className="interactive-canvas">
        <div className="season-wheel">
            <div className="wheel-segment" style={{ transform: 'rotate(0deg) translateY(-50px)', height: '50px' }}></div>
            <div className="wheel-segment" style={{ transform: 'rotate(90deg) translateY(-50px)', height: '50px' }}></div>
            <div className="wheel-segment" style={{ transform: 'rotate(180deg) translateY(-50px)', height: '50px' }}></div>
            <div className="wheel-segment" style={{ transform: 'rotate(270deg) translateY(-50px)', height: '50px' }}></div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff' }}>CYCLE</div>
        </div>
    </div>
);

const ScrollRotatedColorBends = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", (latest) => {
            setRotation(latest * 360);
        });
    }, [scrollYProgress]);

    return (
        <div ref={ref} style={{ width: '100%', height: '100%' }}>
            <ColorBends
                colors={["#722F37", "#990011", "#4A0404"]} // Wine colors
                rotation={rotation}
                speed={0.3}
                scale={1.5}
                variation={0.5}
                transparent={false}
            />
        </div>
    );
};

const ScrollingBottleSection = ({ children }) => {
    const containerRef = useRef(null);
    // Removed scrollRef logic for cleaning up 3D model

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {/* The 3D Background - Sticky/Fixed relative to this container */}
            <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 0, opacity: 0.8 }}>
                {/* 3D Model Removed by request */}
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))' }}></div>
            </div>

            {/* Content overlaid on top */}
            <div style={{ position: 'relative', zIndex: 10, marginTop: '-100vh' }}>
                {children}
            </div>
        </div>
    );
};



const StoryOfWine = () => {
    const containerRef = useRef(null);
    return (
        <div className="story-container" ref={containerRef}>

            <ScrollingBottleSection>
                {/* Prologue */}
                <StoryChapter title="Prologue" subtitle="Wine Before Civilization" id="prologue">
                    <FadeIn>
                        <p>
                            Wine did not appear suddenly, nor was it invented in a single moment of human brilliance.
                            It emerged slowly, alongside the earliest attempts of humans to understand nature, seasons, and transformation.
                        </p>
                        <p>
                            Long before cities, currencies, or written language, humans noticed something remarkable:
                            when crushed grapes were left alone, they changed.
                        </p>
                        <p><strong>They bubbled. They warmed. They transformed into something stronger, longer-lasting, and deeply symbolic.</strong></p>
                    </FadeIn>

                    <Bubbles />

                    <FadeIn delay={0.2}>
                        <p>
                            Archaeological evidence places the earliest intentional winemaking between 6000 and 5800 BCE in the South Caucasus, particularly in present-day Georgia.
                            Clay vessels known as <em>qvevri</em>, buried underground, were found to contain tartaric acid and calcium tartrate crystals, chemical fingerprints unique to grapes.
                            This confirms that fermentation was not accidental—it was repeated, observed, and understood.
                        </p>
                        <p>By 3000 BCE, wine had become embedded in major civilizations:</p>
                        <ul className="story-list-ul">
                            <li>In <strong>Mesopotamia</strong>, wine was traded and taxed.</li>
                            <li>In <strong>Ancient Egypt</strong>, wine was placed in tombs for the afterlife, labeled by vintage and origin.</li>
                            <li>In the <strong>Levant</strong>, wine became part of ritual and religion.</li>
                        </ul>
                        <p>
                            Wine existed before coined money, before formal law codes, and before scientific agriculture.
                            This matters because wine is not merely an alcoholic drink.
                            It is a cultural artifact, shaped by land, time, belief systems, and two disciplines that guide its existence: <strong>viticulture</strong> and <strong>vinification</strong>.
                        </p>
                    </FadeIn>
                </StoryChapter>

                {/* Part I: Viticulture */}
                <StoryChapter title="Part I: Viticulture" subtitle="The Science and Philosophy of Growing Wine Grapes" id="viticulture">
                    <FadeIn>
                        <p>
                            Viticulture is the controlled cultivation of grapevines for wine production.
                            It is not simply farming—it is <strong>intentional limitation</strong>, guided by science and experience.
                        </p>
                        <p>
                            The primary species used is <em>Vitis vinifera</em>, native to Eurasia.
                            Today, over 95% of the world’s fine wine is made from this single species.
                        </p>
                    </FadeIn>

                    <FadeIn>
                        <h3 className="story-heading">1: Domestication of the Vine</h3>
                        <p>
                            Wild grapevines existed long before humans learned to ferment them. However, wild grapes were unsuitable for consistent winemaking.
                            They ripened unevenly, contained low sugar and high acidity, and produced unpredictable fermentations.
                        </p>
                        <p>
                            Early humans began selecting vines that behaved differently, favoring grapes with higher sugar levels, thinner skins, and more uniform ripening.
                            This selective propagation marked the birth of domesticated viticulture.
                        </p>
                        <p>
                            Over thousands of years, this slow human intervention resulted in approximately 1,300–1,400 genetically distinct wine grape varieties
                            and thousands of regional clones shaped by local conditions. Each variety is not just a plant, but a historical record of adaptation.
                        </p>
                    </FadeIn>

                    <FadeIn>
                        <h3 className="story-heading">2: Terroir – A Measurable Reality</h3>
                        <p>
                            Terroir is often spoken of poetically, but it is grounded in measurable environmental factors.
                            It is the total environmental context in which a vine grows: Climate, Soil, Topography, and Human tradition.
                            Terroir does not guarantee quality, but it defines identity.
                        </p>
                        <div className="story-list">
                            <div className="story-item">
                                <h4>Climate</h4>
                                <p>Controls the pace of ripening. Cool climates (Burgundy) yield acid and finesse (Pinot Noir); warm climates (Barossa) yield sugar and power (Shiraz).</p>
                            </div>
                            <div className="story-item">
                                <h4>Soil</h4>
                                <p>Regulates water and stress. Limestone retains moisture; Gravel drains water. The world’s greatest vineyards are often low in fertility, forcing vines to struggle.</p>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <h3 className="story-heading">3: Vine Biology and Human Control</h3>
                        <p>
                            A grapevine is a perennial plant capable of living well over 100 years. Left unrestrained, it prioritizes survival over quality (high yields, diluted fruit).
                            Viticulture exists to counteract the vine’s natural instincts.
                        </p>
                        <div className="story-item">
                            <h4>Pruning: The Mathematics of Quality</h4>
                            <p>
                                Pruning is the most critical decision. Lower yields result in higher skin-to-juice ratios, increased phenolic concentration, and greater aromatic intensity.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <h3 className="story-heading">4: The Annual Vine Cycle</h3>
                        <SeasonWheel />
                        <ul className="story-list-ul">
                            <li><strong>Budburst (March–April):</strong> New growth begins. Extreme frost risk.</li>
                            <li><strong>Flowering (May–June):</strong> Sensitive to rain and temperature.</li>
                            <li><strong>Veraison (July–August):</strong> Berries soften and change color. Sugar accumulation begins.</li>
                            <li><strong>Harvest (September–October):</strong> A human judgment based on Brix, pH, and Phenolic maturity.</li>
                        </ul>
                        <p>There is no perfect harvest date—only informed compromise.</p>
                    </FadeIn>
                </StoryChapter>
            </ScrollingBottleSection>

            {/* Part II: Vinification */}
            <StoryChapter
                title="Part II: Vinification"
                subtitle="Transforming Grapes into Wine"
                id="vinification"
                bgComponent={<ScrollRotatedColorBends />}
            >
                <FadeIn>
                    <p>
                        If viticulture creates raw potential, vinification interprets it.
                        Vinification is the biochemical transformation of grape juice into wine, guided by human intention.
                    </p>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">5: Crushing and Pressing</h3>
                    <div className="story-list">
                        <div className="story-item">
                            <h4>Red Wine</h4>
                            <p>Juice ferments with skins and seeds. Color and tannins are extracted.</p>
                        </div>
                        <div className="story-item">
                            <h4>White Wine</h4>
                            <p>Grapes are pressed immediately. No skin contact. Focus on freshness and aroma.</p>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">6: Alcoholic Fermentation</h3>
                    <div className="interactive-canvas" style={{ flexDirection: 'column', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
                        <div style={{ color: '#aaa', fontSize: '0.9rem' }}>Glucose → Ethanol + Carbon Dioxide + Heat</div>
                    </div>
                    <p>
                        Yeast (<em>Saccharomyces cerevisiae</em>) converts sugar into alcohol. Temperature control is essential:
                        12–18°C for whites (aromatics) and 22–30°C for reds (structure).
                    </p>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">7: Maceration</h3>
                    <p>
                        Maceration determines the wine’s shape and longevity.
                        Short maceration leads to lighter wines (e.g., Pinot Noir), while long maceration creates structured, age-worthy wines (e.g., Nebbiolo).
                    </p>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">8: Malolactic Fermentation (MLF)</h3>
                    <p>
                        Bacteria convert sharp malic acid into softer lactic acid. This reduces acidity, increases mouthfeel, and adds microbiological stability.
                        Common in reds and some whites like Chardonnay.
                    </p>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">9 & 10: Aging and Bottling</h3>
                    <p>
                        <strong>Aging:</strong> Stainless steel preserves purity; Oak barrels add flavor and texture via controlled oxygen ingress.
                    </p>
                    <p>
                        <strong>Bottling:</strong> Once bottled, oxygen exposure is minimal. Only wines with high acidity, tannin, and balance can age for decades.
                    </p>
                </FadeIn>

                <FadeIn>
                    <h3 className="story-heading">Final Understanding</h3>
                    <p style={{ fontSize: '1.25rem', textAlign: 'center', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                        Wine is simultaneously Agricultural, Chemical, Cultural, and Historical.<br /><br />
                        <strong>Viticulture creates potential. Vinification defines expression.</strong><br />
                        Neither exists meaningfully without the other.
                    </p>
                </FadeIn>
            </StoryChapter>

            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
                <p style={{ color: '#555' }}>End of Story</p>
            </div>
        </div>
    );
};

export default StoryOfWine;
