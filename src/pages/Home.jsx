import { useRef, useState, useEffect } from 'react';
import { bundles, INSTAGRAM_HANDLE } from '../data/config';
import BundleCard from '../components/BundleCard';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// â”€â”€ Animation helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 50, damping: 14, delay: i * 0.12 }
  })
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const letterAnim = {
  hidden: { opacity: 0, y: 30, rotateX: -40 },
  visible: (i) => ({
    opacity: 1, y: 0, rotateX: 0,
    transition: { type: 'spring', stiffness: 70, damping: 12, delay: i * 0.03 }
  })
};

function AnimatedText({ text, style, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const words = text.split(' ');

  return (
    <span ref={ref} style={{ display: 'inline-block', perspective: '600px', ...style }} className={className}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', marginRight: '0.3em' }}>
          {word.split('').map((char, ci) => {
            const idx = words.slice(0, wi).join(' ').length  ci;
            return (
              <motion.span
                key={ci}
                custom={idx}
                variants={letterAnim}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                style={{ display: 'inline-block', transformOrigin: 'bottom' }}
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

function Section({ children, id, style }) {
  return <section id={id} style={style}>{children}</section>;
}

function InViewWrap({ children, delay = 0, style }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 50, damping: 14, delay }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// â”€â”€ FAQ Accordion component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FAQAccordion({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: '#0e0e13', border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: '14px', marginBottom: '12px', overflow: 'hidden', cursor: 'pointer',
        transition: 'border-color 0.3s'
      }}
      onClick={() => setOpen(!open)}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
    >
      <div style={{ padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.95rem', margin: 0, color: '#fff' }}>{question}</h4>
        <span style={{ color: '#7C3AED', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', fontSize: '0.8rem' }}>▼</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div style={{ padding: '0 24px 20px', color: '#777', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════
export default function Home({ onCartClick, onSupportClick, onLegalClick, activeCategory, setActiveCategory }) {
  const dragRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Packs' },
    { id: 'ae', label: 'After Effects' },
    { id: 'pr', label: 'Premiere Pro' },
    { id: 'free', label: 'Free Assets' },
  ];

  const filteredBundles = activeCategory === 'all'
    ? bundles
    : bundles.filter(b => b.category === activeCategory);

  const dragConstraintLeft = -(filteredBundles.length * 332 - windowWidth  100);

  const reviews = [
    { name: "Suresh Kumar", date: "Today", rating: 5, comment: "The Transitions Pro pack completely saved my timeline speed. Clean rendering, lifetime support and no monthly subscription fees!", product: "Transitions Pro Pack" },
    { name: "Aishwarya R.", date: "Yesterday", rating: 5, comment: "I download the free Minimal Typography pack first to test and it was flawless. Ended up buying the Cinematic Titles bundle right after.", product: "Cinematic Titles Bundle" },
    { name: "Rohit Malhotra", date: "4 days ago", rating: 5, comment: "Outstanding Mogrt templates. Drag and drop, no keyframe complications. Highly recommended for creators.", product: "Motion Graphics Mega Kit" },
    { name: "Vivek S.", date: "Last week", rating: 5, comment: "Glitch presets are very responsive and modular. Excellent Customer support!", product: "Glitch & VHS Effects" }
  ];

  const faqs = [
    { q: "How do I receive my purchased template files?", a: "Once your transaction UTR ID is entered and verified, a direct download link is instantly dispatched to your registered Email address. If you specified an Instagram handle, we can also dispatch it via DM." },
    { q: "Which Adobe Creative Cloud versions are compatible?", a: "Each product detail card displays specifications. Transitions Pro & Motion Graphics kit require After Effects CC 2020. Cinematic Titles and Glitch preset packs are native Premiere Pro Mogrts compatible with CC 2019." },
    { q: "Do these presets require third-party plugins?", a: "No plugins are required. All assets are engineered using native controls, expressions, and vectors ensuring they run fast on standard devices." },
    { q: "What is included with standard commercial licensing?", a: "You pay once and get a lifetime royalty-free license. You can use these templates across personal channels, YouTube monetization, client projects, and commercials without limits." }
  ];

  return (
    <div style={{ background: '#08080A', fontFamily: 'Inter, sans-serif' }}>

      {/* ═══ HERO ═══════════════════════════════════════ */}
      <Section id="hero" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 5% 60px', position: 'relative' }}>

          {/* Animated orbs */}
          <motion.div
            animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.2, 0.85, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '15%', left: '3%', width: '45vw', height: '45vw', maxWidth: '450px', maxHeight: '450px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }}
          />
          <motion.div
            animate={{ x: [0, -30, 50, 0], y: [0, 40, -40, 0], scale: [1, 0.8, 1.15, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '10%', right: '3%', width: '35vw', height: '35vw', maxWidth: '350px', maxHeight: '350px', background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }}
          />

          <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: heroY, position: 'relative', zIndex: 1, width: '100%' }}>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ width: '100%' }}
            >
              <motion.div variants={fadeUp} className="section-label">
                ✓¦ PREMIUM AFTER EFFECTS & PREMIERE PRO BUNDLES
              </motion.div>

              <motion.h1 variants={fadeUp} style={{
                fontFamily: 'Outfit', fontSize: 'clamp(2.2rem, 7vw, 5.5rem)', fontWeight: 900, lineHeight: 1.05,
                margin: '0 0 20px', color: '#fff', letterSpacing: '-0.03em'
              }}>
                <AnimatedText text="Motion that makes" />
                <br />
                <span className="gradient-text">
                  <AnimatedText text="editors stop scrolling" />
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', color: '#555',
                maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.8
              }}>
                Hand-crafted After Effects packs & Premiere Pro presets. Transitions, titles, glitch FX — download instantly after UPI payment.
              </motion.p>

              <motion.div variants={fadeUp} style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary"
                  onClick={() => document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>Browse Bundles →</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-ghost"
                  onClick={onSupportClick}
                >
                  Contact Support
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', gap: '48px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '80px' }}
            >
              {[
                { label: 'Bundles', value: '5 Packs' },
                { label: 'Elements', value: '500 FX' },
                { label: 'Happy Buyers', value: '200 Editors' },
                { label: 'Compatibility', value: 'No Plugins' }
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i  4}
                  variants={fadeUp}
                  whileHover={{ scale: 1.1 }}
                  style={{ textAlign: 'center', cursor: 'default' }}
                >
                  <div style={{ fontFamily: 'Outfit', color: '#7C3AED', fontWeight: 900, fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>{s.value}</div>
                  <div style={{ color: '#555', fontSize: '0.78rem', letterSpacing: '0.08em', marginTop: '4px', textTransform: 'uppercase' }}>{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', bottom: '30px', color: '#333', fontSize: '0.75rem', letterSpacing: '0.1em', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1 }}
          >
            <span>SCROLL</span>
            <span style={{ fontSize: '1.2rem' }}>â†“</span>
          </motion.div>
        </div>
      </Section>

      {/* ═══ BUNDLES — 3D DRAG CAROUSEL ═══════════════ */}
      <Section id="bundles" style={{ padding: '80px 0 40px', position: 'relative' }}>
        <div style={{ padding: '0 5%', marginBottom: '32px' }}>
          <InViewWrap>
            <div className="section-label">✓¦ DIGITAL ASSETS CATALOG</div>
          </InViewWrap>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <InViewWrap delay={0.1}>
                <h2 className="section-heading" style={{ color: '#fff', margin: '0 0 8px' }}>
                  <AnimatedText text="Browse Assets" />
                </h2>
              </InViewWrap>
              <InViewWrap delay={0.2}>
                <p className="section-sub">Filter by software or download free items to build your timeline.</p>
              </InViewWrap>
            </div>

            {/* Filtering tabs */}
            <InViewWrap delay={0.3}>
              <div style={{
                display: 'flex', background: '#0e0e13', border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px', padding: '6px', gap: '4px'
              }}>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      background: activeCategory === cat.id ? 'linear-gradient(135deg,#d1d1d1,#828383)' : 'transparent',
                      border: 'none', color: activeCategory === cat.id ? '#fff' : '#666',
                      borderRadius: '8px', padding: '8px 16px', fontSize: '0.8rem',
                      fontWeight: 600, cursor: 'pointer', transition: 'color 0.2s, background 0.3s'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </InViewWrap>
          </div>
        </div>

        {/* Drag carousel */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '430px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              ref={dragRef}
              drag="x"
              dragConstraints={{ left: dragConstraintLeft < 0 ? dragConstraintLeft : 0, right: 0 }}
              dragElastic={0.08}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 30 }}
              className="drag-carousel"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {filteredBundles.map((b, i) => (
                <div key={b.id} style={{ perspective: '1200px' }}>
                  <BundleCard bundle={b} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="drag-hint">
            <span>â† DRAG CAROUSEL TO EXPLORE →</span>
          </div>
        </div>
      </Section>

      {/* ═══ JUDGE.ME STYLE REVIEWS ══════════════════ */}
      <Section id="reviews" style={{ padding: '80px 5%', borderTop: '1px solid #111' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <InViewWrap>
            <div className="section-label">✓¦ CUSTOMER REVIEWS</div>
          </InViewWrap>
          <InViewWrap delay={0.1}>
            <h2 className="section-heading" style={{ color: '#fff', margin: '0 0 10px' }}>
              <AnimatedText text="What Creators Say" />
            </h2>
          </InViewWrap>
          <InViewWrap delay={0.2}>
            <p className="section-sub" style={{ margin: '0 auto' }}>
              Verified editor testimonials powered by MotionVault quality checks.
            </p>
          </InViewWrap>
        </div>

        <div className="features-grid">
          {reviews.map((rev, i) => (
            <InViewWrap key={i} delay={i * 0.1}>
              <div className="feature-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(rev.rating)].map((_, starIdx) => (
                        <span key={starIdx} style={{ color: '#F59E0B', fontSize: '0.9rem' }}>â˜…</span>
                      ))}
                    </div>
                    <span style={{ color: '#434343', fontSize: '0.72rem' }}>{rev.date}</span>
                  </div>
                  <p style={{ color: '#ddd', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px', fontStyle: 'italic' }}>
                    "{rev.comment}"
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #111', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
                  <div>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', display: 'block' }}>{rev.name}</span>
                    <span style={{ color: '#555', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ fontSize: '0.8rem' }}>✓</span> Verified Buyer
                    </span>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <span style={{ color: '#434343', fontSize: '0.7rem', display: 'block' }}>Reviewed</span>
                    <span style={{ color: '#7C3AED', fontSize: '0.72rem', fontWeight: 600 }}>{rev.product}</span>
                  </div>
                </div>
              </div>
            </InViewWrap>
          ))}
        </div>
      </Section>

      {/* ═══ FAQ SECTION ══════════════════════════════ */}
      <Section id="faqs" style={{ padding: '80px 5%', borderTop: '1px solid #111' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '48px', maxWidth: '1000px', margin: '0 auto', alignItems: 'start' }}>
          <div>
            <div className="section-label">✓¦ HELP DESK</div>
            <h2 className="section-heading" style={{ color: '#fff', margin: '0 0 12px' }}>
              Frequently Asked Questions
            </h2>
            <p className="section-sub">
              Have questions regarding license scope, file delivery, or custom Mogrts? Check our standard solutions or contact support.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onSupportClick}
              className="btn-primary"
              style={{ marginTop: '24px' }}
            >
              <span>Ask A Question</span>
            </motion.button>
          </div>

          <div>
            {faqs.map((faq, i) => (
              <FAQAccordion key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ HOW IT WORKS ═════════════════════════════ */}
      <Section id="how" style={{ padding: '80px 5%', borderTop: '1px solid #111' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <InViewWrap>
            <div className="section-label">✓¦ SIMPLE PROCESS</div>
          </InViewWrap>
          <InViewWrap delay={0.1}>
            <h2 className="section-heading" style={{ color: '#fff', margin: '0 0 10px' }}>
              <AnimatedText text="How It Works" />
            </h2>
          </InViewWrap>
          <InViewWrap delay={0.2}>
            <p className="section-sub" style={{ margin: '0 auto' }}>Four simple steps to get your packs</p>
          </InViewWrap>
        </div>

        <div className="how-grid">
          {[
            { step: '01', icon: '›’', title: 'Pick Your Pack', desc: 'Browse and drag through our bundles, add what you want' },
            { step: '02', icon: '“‹', title: 'Fill Details', desc: 'Enter your name, email, and location' },
            { step: '03', icon: '“²', title: 'Pay via UPI', desc: 'Scan QR or send to our UPI ID, enter UTR' },
            { step: '04', icon: '“¦', title: 'Get Files', desc: 'Download link sent to your email/Instagram DM' },
          ].map((s, i) => (
            <InViewWrap key={s.step} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, borderColor: 'rgba(124,58,237,0.2)' }}
                className="feature-card"
                style={{ textAlign: 'center', height: '100%' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.12em', marginBottom: '8px' }}>
                  STEP {s.step}
                </div>
                <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ color: '#555', fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            </InViewWrap>
          ))}
        </div>
      </Section>

      {/* ═══ ABOUT ════════════════════════════════════ */}
      <Section id="about" style={{ padding: '80px 5%', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <InViewWrap>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                style={{
                  width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 20px',
                  background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem'
                }}>Ž¬</motion.div>
            </InViewWrap>
            <InViewWrap delay={0.1}>
              <h2 className="section-heading" style={{ color: '#fff', margin: '0 0 14px' }}>
                <AnimatedText text="About MotionVault" />
              </h2>
            </InViewWrap>
            <InViewWrap delay={0.2}>
              <p className="section-sub" style={{ margin: '0 auto' }}>
                Premium After Effects packs and Premiere Pro effects for editors, creators, and filmmakers across India and beyond.
              </p>
            </InViewWrap>
          </div>

          {/* Story card */}
          <InViewWrap delay={0.1}>
            <div style={{
              background: '#0e0e13', border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '20px', padding: 'clamp(24px, 5vw, 40px)', marginBottom: '28px',
              backdropFilter: 'blur(8px)'
            }}>
              <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 14px' }}>The Story</h3>
              <p style={{ color: '#555', lineHeight: 1.9, margin: '0 0 12px', fontSize: '0.92rem' }}>
                Every pack here is made from scratch — no reselling, no recycled assets. I spend hours perfecting every transition, every title animation, every glitch effect before it ships.
              </p>
              <p style={{ color: '#555', lineHeight: 1.9, margin: 0, fontSize: '0.92rem' }}>
                My goal is simple: give editors tools that actually look cinematic, not the generic stuff you find on stock sites.
              </p>
            </div>
          </InViewWrap>

          {/* Features */}
          <div className="about-grid" style={{ marginBottom: '32px' }}>
            {[
              { icon: 'Ž¨', title: '100% Original', desc: 'Every element is handcrafted, not copied or resold.' },
              { icon: 'âš¡', title: 'Instant Delivery', desc: 'Files sent to your email within hours of payment.' },
              { icon: '”’', title: 'Safe UPI Payment', desc: 'Pay directly to my UPI. No card data, no risk.' },
              { icon: '”„', title: 'Lifetime Updates', desc: 'Buy once, get all future versions free.' },
              { icon: '“±', title: 'Instagram Support', desc: 'DM me on Instagram — fastest way to reach me.' },
              { icon: '‡®‡³', title: 'Made in India', desc: 'Priced for Indian creators. Premium at honest prices.' },
            ].map((f, i) => (
              <InViewWrap key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4, borderColor: 'rgba(124,58,237,0.2)' }}
                  className="feature-card"
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{f.icon}</div>
                  <h4 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 5px' }}>{f.title}</h4>
                  <p style={{ color: '#555', fontSize: '0.78rem', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              </InViewWrap>
            ))}
          </div>

          {/* Instagram CTA */}
          <InViewWrap>
            <div className="ig-card">
              <div className="ig-header">
                <div className="ig-avatar-ring">
                  <div className="ig-avatar">Ž¬</div>
                </div>
                <div className="ig-info">
                  <div className="ig-username-row">
                    <span className="ig-username">motionvault.in</span>
                    <svg className="ig-verified" viewBox="0 0 24 24" style={{ fill: '#0095f6', width: '16px', height: '16px', display: 'inline-block' }}>
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <a href="https://instagram.com/motionvault.in" target="_blank" rel="noreferrer" className="ig-follow-btn">
                      Follow
                    </a>
                  </div>
                  <div className="ig-stats">
                    <div className="ig-stat-item"><span className="ig-stat-num">34</span>posts</div>
                    <div className="ig-stat-item"><span className="ig-stat-num">15.4k</span>followers</div>
                    <div className="ig-stat-item"><span className="ig-stat-num">182</span>following</div>
                  </div>
                  <div className="ig-bio">
                    <strong>MotionVault | Video Presets</strong><br />
                    âš¡ Crafting premium templates & presets for creators & filmmakers.<br />
                    Ž¥ Drag & drop After Effects packs & Premiere Pro assets.<br />
                    “© DM for immediate support & custom requests.
                  </div>
                </div>
              </div>

              {/* Instagram Reels Grid Preview */}
              <div className="ig-grid">
                {[
                  { img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80', views: '24.2k' },
                  { img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80', views: '18.5k' },
                  { img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80', views: '12.1k' },
                ].map((post, pi) => (
                  <a key={pi} href="https://instagram.com/motionvault.in" target="_blank" rel="noreferrer" className="ig-reel-thumb">
                    <img src={post.img} alt="Instagram Post Preview" />
                    <div className="ig-reel-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                    <span className="ig-reel-plays">
                      <span>â–¶</span> {post.views}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </InViewWrap>
        </div>
      </Section>

      {/* ═══ FOOTER ═══════════════════════════════════ */}
      <footer className="footer-main">
        <div className="footer-grid">
          {/* Column 1: Brand details */}
          <div className="footer-brand-col">
            <div className="footer-brand-logo">MotionVault</div>
            <p className="footer-brand-desc">
              Handcrafted digital presets and premium visual assets built from scratch for video editors, YouTube creators, and cinematic filmmakers.
            </p>
            {/* Social Icons */}
            <div className="footer-socials">
              <a href="https://instagram.com/motionvault.in" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4.000002 4.000002 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>

            {/* UPI Partners */}
            <div className="footer-payment-section">
              <div className="footer-payment-title">100% Secure Payments</div>
              <div className="footer-payment-badges">
                <span className="payment-badge">UPI</span>
                <span className="payment-badge">GPAY</span>
                <span className="payment-badge">PAYTM</span>
                <span className="payment-badge">PHONEPE</span>
                <span className="payment-badge">BHIM</span>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <div className="footer-col-title">Packs & Presets</div>
            <ul className="footer-links-list">
              <li className="footer-link-item" onClick={() => { setActiveCategory('all'); document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' }); }}>All Products</li>
              <li className="footer-link-item" onClick={() => { setActiveCategory('ae'); document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' }); }}>After Effects Presets</li>
              <li className="footer-link-item" onClick={() => { setActiveCategory('pr'); document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' }); }}>Premiere Pro Templates</li>
              <li className="footer-link-item" onClick={() => { setActiveCategory('free'); document.getElementById('bundles')?.scrollIntoView({ behavior: 'smooth' }); }}>Free Assets</li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div>
            <div className="footer-col-title">Help & Support</div>
            <ul className="footer-links-list">
              <li className="footer-link-item" onClick={onSupportClick}>Contact Support</li>
              <li className="footer-link-item" onClick={onSupportClick}>Track Order Status</li>
              <li className="footer-link-item" onClick={onSupportClick}>UTR Verification Help</li>
              <li>
                <a href="https://instagram.com/motionvault.in" target="_blank" rel="noreferrer" className="footer-link-item" style={{ textDecoration: 'none' }}>
                  Direct Instagram DM
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policy */}
          <div>
            <div className="footer-col-title">Legal & Company</div>
            <ul className="footer-links-list">
              <li className="footer-link-item" onClick={() => onLegalClick('terms')}>Terms of Service</li>
              <li className="footer-link-item" onClick={() => onLegalClick('privacy')}>Privacy Policy</li>
              <li className="footer-link-item" onClick={() => onLegalClick('refund')}>Refund & Delivery</li>
              <li className="footer-link-item" onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>About Us</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            Â© 2026 MotionVault Â· Handcrafted with passion in India.<br />
            Designed for professional video editors and creators.
          </div>
          <div className="footer-disclaimer">
            Disclaimer: Adobe After Effects and Adobe Premiere Pro are registered trademarks of Adobe Inc. MotionVault is an independent creator and is not affiliated with or endorsed by Adobe Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}

