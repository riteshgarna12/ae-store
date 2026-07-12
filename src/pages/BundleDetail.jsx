import { useParams, useNavigate } from 'react-router-dom';
import { bundles } from '../data/config';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: '#141414', border: '1px solid #2b2b2b',
      borderRadius: '12px', marginBottom: '10px', overflow: 'hidden'
    }}>
      <div
        style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>{title}</span>
        <span style={{ color: '#7C3AED', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', fontSize: '0.75rem' }}>▼</span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div style={{ padding: '0 20px 16px', color: '#777', fontSize: '0.8rem', lineHeight: 1.5 }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BundleDetail({ onCartClick }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const bundle = bundles.find(b => b.id === id);
  const inCart = cart.find(i => i.id === id);
  const discount = bundle ? Math.round((1 - bundle.price / bundle.originalPrice) * 100) : 0;

  if (!bundle) return (
    <div style={{ minHeight: '100vh', background: '#08080A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, marginBottom: '16px' }}>Bundle not found</h2>
        <button onClick={() => navigate('/')} style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>← Back Home</button>
      </div>
    </div>
  );

  const isFree = bundle.price === 0;

  return (
    <div style={{ minHeight: '100vh', background: '#08080A', padding: '84px 5% 72px', fontFamily: 'Inter, sans-serif' }}>
      <motion.button
        whileHover={{ x: -4 }}
        onClick={() => navigate('/')}
        style={{
          color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.88rem', marginBottom: '32px',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}
      >← Back Home</motion.button>

      <div className="detail-responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', maxWidth: '1100px', margin: '0 auto', alignItems: 'start' }}>
        
        {/* LEFT — Preview  Specs  FAQs */}
        <div>
          {/* Cover Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 50, damping: 14 }}
            style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', marginBottom: '24px' }}
          >
            <img src={bundle.preview} alt={bundle.name} style={{ width: '100%', display: 'block', borderRadius: '18px' }} />
            {bundle.badge && (
              <div style={{
                position: 'absolute', top: '14px', left: '14px', background: bundle.color,
                color: '#fff', borderRadius: '8px', padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700
              }}>{bundle.badge}</div>
            )}
          </motion.div>

          {/* Technical Specs Sheet */}
          {bundle.specs && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                background: '#141414', border: '1px solid #2b2b2b',
                borderRadius: '14px', padding: '24px', backdropFilter: 'blur(8px)', marginBottom: '24px'
              }}
            >
              <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '16px' }}>Technical Specifications</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {Object.entries(bundle.specs).map(([key, val]) => (
                  <div key={key} style={{ borderBottom: '1px solid #141418', paddingBottom: '8px' }}>
                    <span style={{ color: '#7C3AED', fontSize: '0.72rem', display: 'block', marginBottom: '2px', textTransform: 'uppercase' }}>{key}</span>
                    <span style={{ color: '#7C3AED', fontSize: '0.85rem', fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Dynamic FAQ Accordions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Accordion title="How do I import these templates?">
              {bundle.category === 'ae'
                ? "This pack comes with a .aep project file and presets. Open the project in After Effects CC 2020 or above. You can save the presets in your 'User Presets' folder to access them from the Effects & Presets panel."
                : "This pack includes Mogrt files. Install them in Premiere Pro's Essential Graphics panel by clicking the '' icon at the bottom of the panel and selecting the downloaded files."}
            </Accordion>
            <Accordion title="Are updates free?">
              Yes! All future updates, bug fixes, and additions to this pack are 100% free. You will receive direct update notifications and download links in your email.
            </Accordion>
            <Accordion title="What licensing rights are granted?">
              Your purchase covers a royalty-free license. You can use these resources across unlimited client deliveries, YouTube channels, broadcast commercials, and social media reels.
            </Accordion>
          </motion.div>
        </div>

        {/* RIGHT — Purchase & Reviews */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 50, damping: 14, delay: 0.1 }}
        >
          {/* Purchase Box */}
          <div style={{
            background: '#141414', border: '1px solid #2b2b2b',
            borderRadius: '18px', padding: '28px 24px', backdropFilter: 'blur(8px)', marginBottom: '24px'
          }}>
            <div style={{
              display: 'inline-block', background: `${bundle.color}18`, border: `1px solid ${bundle.color}33`,
              borderRadius: '100px', padding: '4px 16px', marginBottom: '14px',
              color: bundle.color, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em'
            }}>{bundle.badge || 'PACK'}</div>

            <h1 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', margin: '0 0 10px', lineHeight: 1.1 }}>
              {bundle.name}
            </h1>
            <p style={{ color: '#7C3AED', fontSize: '0.9rem', margin: '0 0 10px', lineHeight: 1.5 }}>{bundle.tagline}</p>
            <p style={{ color: '#434343', fontSize: '0.8rem', margin: '0 0 24px', fontStyle: 'italic' }}>{bundle.features}</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 900, fontSize: '2.2rem' }}>₹{bundle.price}</span>
              {bundle.originalPrice > bundle.price && (
                <>
                  <span style={{ color: '#434343', textDecoration: 'line-through', fontSize: '1rem' }}>₹{bundle.originalPrice}</span>
                  <span style={{ background: '#22c55e18', color: '#22c55e', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Purchase CTA */}
            {isFree ? (
              <motion.a
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}
                whileTap={{ scale: 0.98 }}
                href={bundle.downloadUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'block', textDecoration: 'none', textAlign: 'center',
                  background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none',
                  color: '#fff', borderRadius: '12px', padding: '15px',
                  fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
                }}
              >
                Download Assets (Free)
              </motion.a>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button
                  whileHover={{ scale: inCart ? 1 : 1.02, boxShadow: inCart ? 'none' : `0 0 40px ${bundle.color}44` }}
                  whileTap={{ scale: inCart ? 1 : 0.98 }}
                  onClick={() => { if (!inCart) { addToCart(bundle); if (onCartClick) onCartClick(); } }}
                  style={{
                    background: inCart ? 'rgba(34,197,94,0.12)' : `linear-gradient(135deg, ${bundle.color}, #22D3EE)`, border: inCart ? '1px solid rgba(34,197,94,0.3)' : 'none',
                    color: inCart ? '#22c55e' : '#fff', borderRadius: '12px', padding: '15px',
                    cursor: inCart ? 'default' : 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem'
                  }}
                >
                  {inCart ? '✓ In Cart — View Cart' : 'Buy Now — Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: inCart ? 1 : 1.02 }}
                  whileTap={{ scale: inCart ? 1 : 0.98 }}
                  onClick={() => { if (!inCart) addToCart(bundle); }}
                  style={{
                    background: 'transparent', border: `1px solid ${bundle.color}44`, color: bundle.color, borderRadius: '12px', padding: '14px',
                    cursor: inCart ? 'default' : 'pointer', fontFamily: 'Inter', fontWeight: 600, fontSize: '0.92rem'
                  }}
                >
                  {inCart ? '✓ Already in Cart' : 'Add to Cart'}
                </motion.button>
              </div>
            )}
          </div>

          {/* What's included checklist */}
          <div style={{ background: '#141414', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.1em', margin: '0 0 14px', textTransform: 'uppercase' }}>WHAT'S INCLUDED</h3>
            {bundle.includes.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0',
                borderBottom: i < bundle.includes.length - 1 ? '1px solid #141418' : 'none'
              }}>
                <span style={{ color: '#7C3AED', flexShrink: 0 }}>✓</span>
                <span style={{ color: '#7C3AED', fontSize: '0.82rem' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Bundle verified reviews block */}
          <div style={{ background: '#141414', border: '1px solid #2b2b2b', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '14px' }}>Verified Reviews</h3>
            {[
              { author: "Rahul P.", text: "Perfect templates, super smooth drag-and-drop. Best assets for video creators!" },
              { author: "Karan S.", text: "Clean project files, very easy to breakdown and learn. High-quality render speeds." }
            ].map((rev, i) => (
              <div key={i} style={{ borderBottom: i === 0 ? '1px solid #141418' : 'none', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem' }}>{rev.author}</span>
                  <span style={{ color: '#F59E0B', fontSize: '0.75rem' }}>★★★★★</span>
                </div>
                <p style={{ color: '#7C3AED', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>"{rev.text}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

