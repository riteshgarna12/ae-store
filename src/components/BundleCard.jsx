import { useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BundleCard({ bundle }) {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const inCart = cart.find(i => i.id === bundle.id);
  const discount = Math.round((1 - bundle.price / bundle.originalPrice) * 100);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glossPos, setGlossPos] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left  rect.width / 2;
    const cy = rect.top  rect.height / 2;
    const px = (e.clientX - cx) / (rect.width / 2);
    const py = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -py * 12, y: px * 12 });
    setGlossPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovering(false);
  };

  return (
    <div
      className="card-3d-wrap"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      ref={cardRef}
    >
      <div
        className="card-3d"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Front face */}
        <div className="card-3d-face card-3d-front">
          {/* Badge */}
          {bundle.badge && (
            <div style={{
              position: 'absolute', top: '12px', right: '12px', zIndex: 10,
              background: bundle.color, color: '#fff', borderRadius: '6px',
              padding: '3px 10px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em'
            }}>{bundle.badge}</div>
          )}

          {/* Preview */}
          <div style={{ position: 'relative', overflow: 'hidden', height: '150px', flexShrink: 0 }}>
            <img src={bundle.preview} alt={bundle.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', background: 'linear-gradient(transparent, #0f0f14)' }} />
          </div>

          {/* Body */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', margin: '0 0 4px', color: '#fff' }}>
              {bundle.name}
            </h3>
            <p style={{ color: '#666', fontSize: '0.78rem', margin: '0 0 12px', lineHeight: 1.5 }}>
              {bundle.tagline}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              {bundle.includes.slice(0, 3).map((item, i) => (
                <li key={i} style={{ color: '#bbb', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: bundle.color, fontSize: '0.6rem' }}>✦</span> {item}
                </li>
              ))}
              {bundle.includes.length > 3 && (
                <li style={{ color: '#444', fontSize: '0.75rem' }}>{bundle.includes.length - 3} more...</li>
              )}
            </ul>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color: '#fff' }}>₹{bundle.price}</span>
              <span style={{ color: '#444', textDecoration: 'line-through', fontSize: '0.82rem' }}>₹{bundle.originalPrice}</span>
              <span style={{ background: '#22c55e18', color: '#22c55e', borderRadius: '4px', padding: '2px 7px', fontSize: '0.68rem', fontWeight: 700 }}>
                -{discount}%
              </span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '7px' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={(e) => { e.stopPropagation(); navigate(`/bundle/${bundle.id}`); }}
                style={{
                  flex: 1, background: 'transparent', border: `1px solid ${bundle.color}44`,
                  color: bundle.color, borderRadius: '8px', padding: '9px 4px',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = bundle.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${bundle.color}44`}
              >
                Details
              </motion.button>
              <motion.button
                whileHover={{ scale: inCart ? 1 : 1.04 }}
                whileTap={{ scale: inCart ? 1 : 0.96 }}
                onClick={(e) => { e.stopPropagation(); if (!inCart) addToCart(bundle); }}
                style={{
                  flex: 2,
                  background: inCart ? 'rgba(34,197,94,0.12)' : `linear-gradient(135deg, ${bundle.color}, #22D3EE)`,
                  border: inCart ? '1px solid rgba(34,197,94,0.3)' : 'none',
                  color: inCart ? '#22c55e' : '#fff', borderRadius: '8px', padding: '9px 4px',
                  cursor: inCart ? 'default' : 'pointer',
                  fontWeight: 700, fontSize: '0.78rem'
                }}
              >
                {inCart ? '✓ In Cart' : 'Add to Cart'}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Spine */}
        <div className="card-3d-spine" style={{ background: `linear-gradient(180deg, ${bundle.color}88, ${bundle.color}33)` }} />

        {/* Bottom edge */}
        <div className="card-3d-bottom" />

        {/* Gloss / sheen */}
        <div
          className="card-3d-gloss"
          style={{
            background: hovering
              ? `radial-gradient(circle at ${glossPos.x}% ${glossPos.y}%, rgba(255,255,255,0.12) 0%, transparent 60%)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Shadow */}
      <div className="card-3d-shadow" style={{ opacity: hovering ? 0.8 : 0.4, background: `radial-gradient(ellipse, ${bundle.color}33 0%, transparent 70%)` }} />
    </div>
  );
}
