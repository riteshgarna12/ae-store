import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function CartDrawer({ onClose, onCheckout }) {
  const { cart, removeFromCart, total } = useCart();

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)'
        }}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(460px, 92vw)', zIndex: 301,
          background: 'var(--bg-modal)', backdropFilter: 'blur(24px) saturate(180%)',
          borderLeft: '1px solid var(--border-drawer)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--border-secondary)',
          display: 'flex', alignItems: 'center', justifyBetween: 'space-between',
          color: 'var(--text-primary)'
        }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>
            🛒 Your Cart
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: 'var(--bg-social-icon)', border: '1px solid var(--border-primary)',
              color: 'var(--text-muted)', borderRadius: '10px', width: '36px', height: '36px',
              cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >✕</motion.button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🛒</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 6px' }}>Your cart is empty</p>
              <p style={{ color: 'var(--text-muted)', opacity: 0.8, fontSize: '0.82rem', margin: 0 }}>Add some bundles first</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                    borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '14px',
                    color: 'var(--text-primary)'
                  }}
                >
                  <img src={item.preview} alt={item.name} style={{
                    width: '70px', height: '45px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{item.name}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>{item.tagline}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1rem' }}>₹{item.price}</div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{
                        color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.72rem', marginTop: '2px', padding: 0, fontWeight: 500
                      }}
                    >Remove</button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-secondary)' }}>
            <div style={{
              background: 'rgba(34,211,238,0.05)', border: '1px solid rgba(34,211,238,0.1)',
              borderRadius: '10px', padding: '10px 13px', marginBottom: '16px'
            }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0, lineHeight: 1.5 }}>
                🔒 Payment via UPI QR scan — 100% safe. Files delivered after verification.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total</span>
              <span style={{ fontFamily: 'Outfit', color: '#7C3AED', fontWeight: 900, fontSize: '1.5rem' }}>₹{total}</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={onCheckout}
              style={{
                width: '100%', background: 'linear-gradient(135deg,#7C3AED,#22D3EE)', color: '#fff', border: 'none',
                borderRadius: '12px', padding: '15px',
                cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem'
              }}
            >
              Proceed to Checkout →
            </motion.button>
          </div>
        )}
      </motion.div>
    </>
  );
}
