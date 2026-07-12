import { useState } from 'react';
import { bundles } from '../data/config';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const inputStyle = () => ({
  width: '100%', boxSizing: 'border-box',
  background: '#0c0c10', border: '1px solid #1e1e24',
  borderRadius: '12px', padding: '14px 16px', color: '#fff',
  fontFamily: 'Inter', fontSize: '0.95rem', outline: 'none'
});

export default function SearchDrawer({ onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filtered = bundles.filter(b => 
    b.name.toLowerCase().includes(query.toLowerCase()) ||
    b.tagline.toLowerCase().includes(query.toLowerCase()) ||
    b.includes.some(inc => inc.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)'
        }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          maxHeight: '75vh', minHeight: '300px', zIndex: 301,
          background: 'rgba(10,10,14,0.97)', backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(124,58,237,0.1)',
          display: 'flex', flexDirection: 'column', padding: '32px 5% 40px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.4rem' }}>🔍 Search Catalog</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid #1e1e24',
              color: '#888', borderRadius: '10px', width: '36px', height: '36px',
              cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >✕</motion.button>
        </div>

        <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <input
            type="text"
            placeholder="Type search terms... e.g. transitions, glitch, titles"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={inputStyle()}
            autoFocus
          />

          <div style={{ marginTop: '24px', maxHeight: '40vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {query.trim() !== '' && filtered.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', fontSize: '0.9rem', padding: '20px 0' }}>No packs matching your search</p>
            ) : (
              (query.trim() === '' ? bundles : filtered).map(b => (
                <div
                  key={b.id}
                  onClick={() => { navigate(`/bundle/${b.id}`); onClose(); }}
                  style={{
                    background: '#0c0c10', border: '1px solid #1e1e24',
                    borderRadius: '12px', padding: '14px 18px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = `${b.color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.02)'}
                >
                  <div>
                    <h4 style={{ fontFamily: 'Outfit', fontSize: '0.95rem', color: '#fff', marginBottom: '2px' }}>{b.name}</h4>
                    <p style={{ color: '#888', fontSize: '0.78rem' }}>{b.tagline}</p>
                  </div>
                  <span style={{ color: b.color, fontWeight: 700, fontSize: '0.9rem' }}>
                    {b.price === 0 ? 'FREE' : `₹${b.price}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
