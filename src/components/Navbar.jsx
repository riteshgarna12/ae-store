import { useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bundles } from '../data/config';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ 
  onCartClick, 
  onSupportClick, 
  onSearchClick, 
  onAccountClick, 
  onLegalClick,
  activeCategory, 
  setActiveCategory 
}) {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const hoverTimeout = useRef(null);

  const closeMobile = () => setMobileOpen(false);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 200); // short delay to prevent flickering
  };

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setMegaMenuOpen(false);
    closeMobile();
    
    // Redirect to home if on detail page
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('bundles');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('bundles');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Nav categories mapped to actual categories
  const navCategories = [
    { label: 'Presets', catId: 'ae' },
    { label: 'Motion Graphics', catId: 'ae' },
    { label: 'Free Assets', catId: 'free' },
    { label: 'Tutorial Assets', catId: 'free' },
    { label: 'All Products', catId: 'all' },
  ];

  return (
    <>
      <nav 
        className="nav" 
        style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 200,
          background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-secondary)'
        }}
      >
        {/* Left: Logo */}
        <div 
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          {/* Custom logo mark reflecting the 3D visual mark */}
          <svg width="34" height="34" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15 L85 35 L85 75 L50 95 L15 75 L15 35 Z" fill="url(#logo-grad)" />
            <path d="M50 15 L50 95" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <path d="M15 35 L85 35" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <path d="M15 75 L85 75" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            <circle cx="50" cy="50" r="15" fill="#08080A" stroke="#7C3AED" strokeWidth="3" />
            <defs>
              <linearGradient id="logo-grad" x1="15" y1="15" x2="85" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" />
                <stop offset="0.5" stopColor="#EC4899" />
                <stop offset="1" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
          </svg>
          <span className="nav-logo" style={{ fontSize: '1.25rem', fontFamily: 'Outfit', fontWeight: 800 }}>MotionVault</span>
        </div>

        {/* Center Links */}
        <div className="nav-links">
          {/* Products Pill Button */}
          <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <button 
              style={{
                background: megaMenuOpen ? 'linear-gradient(135deg,#7C3AED,#22D3EE)' : 'transparent',
                border: 'none',
                color: megaMenuOpen ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '20px', 
                padding: '8px 18px', 
                fontSize: '0.85rem',
                fontWeight: 600, 
                cursor: 'pointer',
                transition: 'all 0.25s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Products {megaMenuOpen ? '▴' : '▾'}
            </button>
          </div>

          <span className="nav-link" onClick={() => handleCategoryClick('ae')} style={{ cursor: 'pointer' }}>Presets</span>
          <span className="nav-link" onClick={() => handleCategoryClick('ae')} style={{ cursor: 'pointer' }}>Motion Graphic Templates</span>
          <span className="nav-link" onClick={() => handleCategoryClick('free')} style={{ cursor: 'pointer' }}>Free Assets</span>
          <span className="nav-link" onClick={() => handleCategoryClick('free')} style={{ cursor: 'pointer' }}>Tutorial Assets</span>
          <span className="nav-link" onClick={onSupportClick} style={{ cursor: 'pointer' }}>Support</span>
          <span className="nav-link" onClick={() => onLegalClick('terms')} style={{ cursor: 'pointer' }}>Terms & Licensing</span>
        </div>

        {/* Right Icons: Search, Account, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Search Icon */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearchClick}
            aria-label="Search"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </motion.button>

          {/* Account Icon */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccountClick}
            aria-label="Account"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </motion.button>

          {/* Theme Toggle Icon */}
          <motion.button 
            whileHover={{ scale: 1.1, rotate: theme === 'dark' ? 45 : -45 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </motion.button>

          {/* Cart Icon */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCartClick}
            aria-label="Cart"
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', 
              padding: '4px', position: 'relative', display: 'flex', alignItems: 'center' 
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cart.length > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#EF4444', borderRadius: '50%', width: '15px', height: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.55rem', fontWeight: 800, color: '#fff'
              }}>{cart.length}</span>
            )}
          </motion.button>

          {/* Hamburger Menu (Mobile) */}
          <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menu" style={{ padding: '4px' }}>
            <span style={{ transform: mobileOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span style={{ transform: mobileOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      <div className={`nav-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <span className="nav-mobile-link" onClick={() => handleCategoryClick('all')} style={{ cursor: 'pointer' }}>Products</span>
        <span className="nav-mobile-link" onClick={() => handleCategoryClick('ae')} style={{ cursor: 'pointer' }}>Presets</span>
        <span className="nav-mobile-link" onClick={() => handleCategoryClick('ae')} style={{ cursor: 'pointer' }}>Motion Graphics</span>
        <span className="nav-mobile-link" onClick={() => handleCategoryClick('free')} style={{ cursor: 'pointer' }}>Free Assets</span>
        <span className="nav-mobile-link" onClick={onSupportClick} style={{ cursor: 'pointer' }}>Support</span>
        <span className="nav-mobile-link" onClick={() => { onLegalClick('terms'); closeMobile(); }} style={{ cursor: 'pointer' }}>Terms & Licensing</span>
        <div style={{ padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-primary)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Theme</span>
          <button onClick={toggleTheme} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', borderRadius: '8px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
             {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* ── Products MEGA MENU DROPDOWN ───────────────── */}
      <AnimatePresence>
        {megaMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'fixed', top: '64px', left: '5%', right: '5%',
              background: 'var(--bg-mega-menu)', border: '1px solid var(--border-secondary)',
              borderRadius: '0 0 16px 16px', zIndex: 199, padding: '32px 40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), 0 0 50px rgba(255,255,255,0.02)',
              display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px'
            }}
          >
            {/* Left Column - Sub Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderRight: '1px solid var(--border-secondary)' }}>
              <h3 style={{ fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>Products</h3>
              {navCategories.map((nc, idx) => (
                <span
                  key={idx}
                  onClick={() => handleCategoryClick(nc.catId)}
                  style={{
                    color: activeCategory === nc.catId ? '#22D3EE' : 'var(--text-muted)',
                    fontFamily: 'Inter', fontSize: '0.9rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'color 0.2s', display: 'block'
                  }}
                  onMouseEnter={e => e.target.style.color = '#22D3EE'}
                  onMouseLeave={e => e.target.style.color = activeCategory === nc.catId ? '#22D3EE' : 'var(--text-muted)'}
                >
                  {nc.label}
                </span>
              ))}
            </div>

            {/* Right Side - Most Popular Product Carousel */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ color: 'var(--text-placeholder)', fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em' }}>MOST POPULAR</span>
                <span 
                  onClick={() => handleCategoryClick('all')} 
                  style={{ color: '#22D3EE', fontFamily: 'Inter', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  All Presets ({bundles.length}) →
                </span>
              </div>

              {/* Product cards row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {bundles.slice(0, 4).map(b => {
                  const discount = Math.round((1 - b.price / b.originalPrice) * 100);
                  return (
                    <div 
                      key={b.id} 
                      onClick={() => { setMegaMenuOpen(false); navigate(`/bundle/${b.id}`); }}
                      style={{
                        background: 'var(--bg-mega-menu)', border: '1px solid var(--border-secondary)',
                        borderRadius: '14px', padding: '14px', cursor: 'pointer',
                        transition: 'transform 0.25s, border-color 0.25s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        textAlign: 'center'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.borderColor = b.color;
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = '#2b2b2b';
                      }}
                    >
                      {/* CSS 3D Box Mockup representation */}
                      <div style={{ 
                        perspective: '400px', width: '70px', height: '90px', 
                        marginBottom: '14px', position: 'relative' 
                      }}>
                        <div style={{
                          width: '100%', height: '100%', position: 'relative',
                          transformStyle: 'preserve-3d', transform: 'rotateY(-20deg) rotateX(10deg)',
                           background: `linear-gradient(135deg, ${b.color}, #1f1f2e)`,
                          borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '4px 8px 16px rgba(0,0,0,0.5)'
                        }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#fff' }}>
                            {b.id === 'free-titles' ? '15x' : b.id === 'transitions-pro' ? '120' : '80'}
                          </span>
                          <span style={{ fontSize: '0.45rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', marginTop: '2px' }}>
                            PACK
                          </span>
                          {/* Spine edge */}
                          <div style={{
                            position: 'absolute', top: 0, right: '-10px', width: '10px', height: '100%',
                            background: b.color, transform: 'rotateY(90deg)', transformOrigin: 'left center',
                            opacity: 0.8
                          }} />
                        </div>
                      </div>

                      {/* Product details */}
                      <h4 style={{ 
                        fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '0.82rem', 
                        fontWeight: 700, margin: '0 0 4px', lineHeight: 1.2,
                        minHeight: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {b.name}
                      </h4>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
                        {b.price === 0 ? 'Rs. 0.00' : `Rs. ${b.price.toLocaleString()}.00`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
