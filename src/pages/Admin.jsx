import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

const STATUS_COLORS = {
  pending_verification: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: 'Pending' },
  completed: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: 'Completed' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'Rejected' }
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('orders');
  const [approveModal, setApproveModal] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, revenue: 0 });

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert('Incorrect password');
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setOrders(list);

      // Calc stats
      const pending = list.filter(o => o.status === 'pending_verification').length;
      const completed = list.filter(o => o.status === 'completed').length;
      const revenue = list.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total || 0), 0);
      setStats({ total: list.length, pending, completed, revenue });
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const q = query(collection(db, 'support_tickets'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setTickets(list);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    if (authed) {
      fetchOrders();
      fetchTickets();
    }
  }, [authed]);

  const handleApprove = async (order) => {
    if (!downloadUrl.trim()) {
      alert('Please enter a download link');
      return;
    }
    setSending(true);
    try {
      // Update Firestore
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'completed',
        downloadUrl: downloadUrl.trim()
      });

      // Send email via EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, {
          to_name: order.customer?.name || 'Customer',
          to_email: order.customer?.email,
          order_id: order.orderId,
          items: order.items?.map(i => i.name).join(', '),
          download_url: downloadUrl.trim(),
          total: `₹${order.total}`
        }, publicKey);
      }

      // Refresh orders
      await fetchOrders();
      setApproveModal(null);
      setDownloadUrl('');
      alert('✅ Order approved & email sent!');
    } catch (err) {
      console.error('Approve error:', err);
      alert('Error approving order. Check console.');
    } finally {
      setSending(false);
    }
  };

  const handleReject = async (order) => {
    if (!window.confirm(`Reject order ${order.orderId}?`)) return;
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: 'rejected' });
      await fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseTicket = async (ticket) => {
    try {
      await updateDoc(doc(db, 'support_tickets', ticket.id), { status: 'closed' });
      await fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', background: '#08080a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#111114', border: '1px solid #1e1e24',
            borderRadius: '20px', padding: '40px 36px', width: 'min(400px, 90vw)',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', fontSize: '1.5rem'
          }}>🔒</div>
          <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#fff', margin: '0 0 6px' }}>Admin Panel</h1>
          <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 28px' }}>Enter your admin password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: '#1a1a1f', border: '1px solid #2b2b32',
                borderRadius: '10px', padding: '14px 16px', color: '#fff',
                fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none',
                marginBottom: '16px'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{
                width: '100%', background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
                border: 'none', color: '#fff', borderRadius: '10px', padding: '14px',
                fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer'
              }}
            >Sign In</motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div style={{
      minHeight: '100vh', background: '#08080a', color: '#fff',
      fontFamily: 'Inter, sans-serif', paddingTop: '80px'
    }}>
      {/* Header */}
      <div style={{
        position: 'fixed', top: '64px', left: 0, right: 0, zIndex: 100,
        background: 'rgba(8,8,10,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #1e1e24', padding: '14px 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED, #22D3EE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem'
          }}>⚙️</div>
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem' }}>Admin Dashboard</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { fetchOrders(); fetchTickets(); }}
            style={{
              background: '#1a1a1f', border: '1px solid #2b2b32', color: '#888',
              borderRadius: '8px', padding: '8px 16px', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer'
            }}
          >🔄 Refresh</button>
          <button
            onClick={() => setAuthed(false)}
            style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', borderRadius: '8px', padding: '8px 16px', fontSize: '0.78rem',
              fontWeight: 600, cursor: 'pointer'
            }}
          >Logout</button>
        </div>
      </div>

      <div style={{ padding: '24px 5%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total Orders', value: stats.total, icon: '📦', color: '#7C3AED' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#F59E0B' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: '#10B981' },
            { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: '#22D3EE' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#111114', border: '1px solid #1e1e24',
                borderRadius: '14px', padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#666', fontSize: '0.78rem', fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              </div>
              <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.6rem', color: s.color }}>{s.value}</span>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '24px',
          background: '#111114', border: '1px solid #1e1e24',
          borderRadius: '12px', padding: '4px', width: 'fit-content'
        }}>
          {[
            { id: 'orders', label: `Orders (${orders.length})` },
            { id: 'tickets', label: `Support (${tickets.length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: tab === t.id ? 'linear-gradient(135deg,#7C3AED,#22D3EE)' : 'transparent',
                border: 'none', color: tab === t.id ? '#fff' : '#666',
                borderRadius: '8px', padding: '10px 20px', fontSize: '0.82rem',
                fontWeight: 600, cursor: 'pointer'
              }}
            >{t.label}</button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No orders yet</p>
            ) : (
              orders.map((order, i) => {
                const st = STATUS_COLORS[order.status] || STATUS_COLORS.pending_verification;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      background: '#111114', border: '1px solid #1e1e24',
                      borderRadius: '14px', padding: '20px', overflow: 'hidden'
                    }}
                  >
                    {/* Order header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#7C3AED', fontWeight: 700, fontSize: '0.85rem' }}>{order.orderId}</span>
                        <span style={{
                          background: st.bg, color: st.color,
                          borderRadius: '6px', padding: '3px 10px', fontSize: '0.65rem', fontWeight: 700
                        }}>{st.label}</span>
                      </div>
                      <span style={{ color: '#555', fontSize: '0.75rem' }}>
                        {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}
                      </span>
                    </div>

                    {/* Customer + Items grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                      {/* Customer Info */}
                      <div style={{ background: '#1a1a1f', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ color: '#555', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>CUSTOMER</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
                          <span style={{ color: '#fff' }}>👤 {order.customer?.name || '—'}</span>
                          <span style={{ color: '#aaa' }}>📧 {order.customer?.email || '—'}</span>
                          <span style={{ color: '#aaa' }}>📱 {order.customer?.phone || '—'}</span>
                          <span style={{ color: '#aaa' }}>📍 {order.customer?.city || '—'}{order.customer?.state ? `, ${order.customer.state}` : ''}</span>
                          {order.customer?.instagram && <span style={{ color: '#aaa' }}>📸 {order.customer.instagram}</span>}
                        </div>
                      </div>

                      {/* Items */}
                      <div style={{ background: '#1a1a1f', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ color: '#555', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>ITEMS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {order.items?.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                              <span style={{ color: '#ccc' }}>• {item.name}</span>
                              <span style={{ color: '#7C3AED', fontWeight: 600 }}>₹{item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div style={{ background: '#1a1a1f', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ color: '#555', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>PAYMENT</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>Total:</span>
                            <span style={{ color: '#22D3EE', fontWeight: 700, fontFamily: 'Outfit', fontSize: '1rem' }}>₹{order.total}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#888' }}>UTR:</span>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.78rem', wordBreak: 'break-all' }}>{order.utrNumber || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {order.status === 'pending_verification' && (
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #1e1e24', paddingTop: '14px' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { setApproveModal(order); setDownloadUrl(''); }}
                          style={{
                            flex: 2, background: 'linear-gradient(135deg, #10B981, #059669)',
                            border: 'none', color: '#fff', borderRadius: '8px', padding: '10px',
                            fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                          }}
                        >✓ Approve & Send Download</motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleReject(order)}
                          style={{
                            flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            color: '#EF4444', borderRadius: '8px', padding: '10px',
                            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                          }}
                        >✕ Reject</motion.button>
                      </div>
                    )}

                    {/* Download URL if already completed */}
                    {order.status === 'completed' && order.downloadUrl && (
                      <div style={{ borderTop: '1px solid #1e1e24', paddingTop: '10px', fontSize: '0.78rem' }}>
                        <span style={{ color: '#555' }}>Download link: </span>
                        <a href={order.downloadUrl} target="_blank" rel="noreferrer" style={{ color: '#22D3EE', wordBreak: 'break-all' }}>
                          {order.downloadUrl}
                        </a>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Support Tickets Tab */}
        {tab === 'tickets' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No support tickets</p>
            ) : (
              tickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    background: '#111114', border: '1px solid #1e1e24',
                    borderRadius: '14px', padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>{ticket.name}</span>
                      <span style={{
                        background: ticket.status === 'open' ? 'rgba(245,158,11,0.1)' : 'rgba(102,102,102,0.1)',
                        color: ticket.status === 'open' ? '#F59E0B' : '#666',
                        borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700
                      }}>{ticket.status === 'open' ? 'Open' : 'Closed'}</span>
                    </div>
                    <span style={{ color: '#555', fontSize: '0.75rem' }}>
                      {ticket.createdAt ? new Date(ticket.createdAt.seconds * 1000).toLocaleString() : ''}
                    </span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ color: '#888', fontSize: '0.78rem' }}>📧 {ticket.email}</span>
                    <span style={{ color: '#555', margin: '0 8px' }}>•</span>
                    <span style={{ color: '#7C3AED', fontSize: '0.78rem', fontWeight: 600 }}>{ticket.subject}</span>
                  </div>
                  <div style={{
                    background: '#1a1a1f', borderRadius: '10px', padding: '14px',
                    color: '#ccc', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px'
                  }}>
                    {ticket.message}
                  </div>
                  {ticket.status === 'open' && (
                    <button
                      onClick={() => handleCloseTicket(ticket)}
                      style={{
                        background: '#1a1a1f', border: '1px solid #2b2b32', color: '#888',
                        borderRadius: '8px', padding: '8px 16px', fontSize: '0.78rem',
                        fontWeight: 600, cursor: 'pointer'
                      }}
                    >Mark as Closed</button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── APPROVE MODAL ── */}
      <AnimatePresence>
        {approveModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApproveModal(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'
              }}
            />
            <div style={{
              position: 'fixed', inset: 0, zIndex: 401,
              display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
            }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  background: '#111114', border: '1px solid #1e1e24',
                  borderRadius: '20px', padding: '28px', width: 'min(480px, 92vw)',
                  pointerEvents: 'all'
                }}
              >
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 6px' }}>
                  Approve Order
                </h3>
                <p style={{ color: '#666', fontSize: '0.82rem', margin: '0 0 20px' }}>
                  Order <span style={{ color: '#7C3AED', fontWeight: 700 }}>{approveModal.orderId}</span> for <span style={{ color: '#fff' }}>{approveModal.customer?.name}</span>
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Download Link (Google Drive / Dropbox / Mega)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={downloadUrl}
                    onChange={e => setDownloadUrl(e.target.value)}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: '#1a1a1f', border: '1px solid #2b2b32',
                      borderRadius: '10px', padding: '12px 14px', color: '#fff',
                      fontFamily: 'Inter', fontSize: '0.88rem', outline: 'none'
                    }}
                  />
                </div>

                <div style={{
                  background: '#1a1a1f', borderRadius: '10px', padding: '14px',
                  marginBottom: '20px', fontSize: '0.82rem'
                }}>
                  <div style={{ color: '#555', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '8px' }}>
                    EMAIL WILL BE SENT TO
                  </div>
                  <span style={{ color: '#22D3EE' }}>{approveModal.customer?.email}</span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApprove(approveModal)}
                    disabled={sending}
                    style={{
                      flex: 2, background: 'linear-gradient(135deg, #10B981, #059669)',
                      border: 'none', color: '#fff', borderRadius: '10px', padding: '12px',
                      fontWeight: 700, fontSize: '0.88rem', cursor: sending ? 'default' : 'pointer',
                      opacity: sending ? 0.6 : 1
                    }}
                  >{sending ? 'Sending...' : '✓ Approve & Send Email'}</motion.button>
                  <button
                    onClick={() => setApproveModal(null)}
                    style={{
                      flex: 1, background: '#1a1a1f', border: '1px solid #2b2b32',
                      color: '#888', borderRadius: '10px', padding: '12px',
                      fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer'
                    }}
                  >Cancel</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
