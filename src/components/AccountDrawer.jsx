import { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';

const inputStyle = () => ({
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
  borderRadius: '10px', padding: '12px 14px', color: 'var(--text-primary)',
  fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none'
});

export default function AccountDrawer({ onClose }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      // Query Firestore for orders matching customer email
      const q = query(
        collection(db, 'orders'),
        where('customer.email', '==', email.trim())
      );
      const snap = await getDocs(q);
      const ordersList = [];
      snap.forEach(doc => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });

      // Sort by date locally
      ordersList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

      setOrders(ordersList);
      setLoggedInUser(email);
    } catch (err) {
      console.error(err);
      alert('Error fetching purchases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setOrders(null);
    setEmail('');
  };

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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>
            👤 Editor Account
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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loggedInUser ? (
            <div>
              {/* Profile Card */}
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '24px'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#7C3AED,#22D3EE)', color: '#fff',
                  margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900
                }}>
                  {loggedInUser.substring(0, 2).toUpperCase()}
                </div>
                <h4 style={{ fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '0.95rem', margin: '0 0 4px' }}>Video Editor</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '14px' }}>{loggedInUser}</p>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    color: '#EF4444', padding: '6px 16px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '0.78rem', fontWeight: 600
                  }}
                >Log Out</button>
              </div>

              {/* Order History */}
              <h3 style={{ fontFamily: 'Outfit', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '14px' }}>Purchase History</h3>
              {orders === null ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading purchase history...</p>
              ) : orders.length === 0 ? (
                <div style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px',
                  padding: '24px', textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>No orders found under this email.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      style={{
                        background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                        borderRadius: '12px', padding: '14px 16px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.78rem' }}>{order.orderId || 'ORDER'}</span>
                        <span style={{
                          background: order.status === 'pending_verification' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                          color: order.status === 'pending_verification' ? '#F59E0B' : '#10B981',
                          borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700
                        }}>
                          {order.status === 'pending_verification' ? 'Pending' : 'Completed'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{ color: '#7C3AED', fontSize: '0.8rem' }}>• {item.name}</div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-secondary)', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>Total: ₹{order.total}</span>
                        <span>{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : ''}</span>
                      </div>
                      {order.status === 'completed' && order.downloadUrl && (
                        <motion.a 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          href={order.downloadUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          style={{
                            display: 'block', textDecoration: 'none', textAlign: 'center',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: '#fff', borderRadius: '8px', padding: '8px',
                            fontWeight: 700, fontSize: '0.8rem', marginTop: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          ⬇️ Download Assets
                        </motion.a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔒</div>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', marginBottom: '6px' }}>Access Purchases</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  Enter the email address you used during purchase to check your order verification status and retrieve your files.
                </p>
              </div>

              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle()}
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                <span>{loading ? 'Checking orders...' : 'Retrieve My Purchases'}</span>
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
