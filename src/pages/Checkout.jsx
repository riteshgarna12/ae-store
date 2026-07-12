import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UPI_ID, UPI_NAME } from '../data/config';
import { motion } from 'framer-motion';

const STEPS = ['Details', 'Payment', 'Done'];

function upiUrl(amount) {
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('MotionVault Bundle Purchase')}`;
}

const inputStyle = (err) => ({
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-secondary)', border: `1px solid ${err ? '#EF4444' : 'var(--border-primary)'}`,
  borderRadius: '10px', padding: '12px 14px', color: 'var(--text-primary)',
  fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s'
});

export default function CheckoutModal({ onClose }) {
  const { cart, total, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState({});

  // Snapshot total/items at mount so they survive clearCart on step 2
  const [snapshot] = useState({ items: cart.map(i => ({ id: i.id, name: i.name, price: i.price })), total });

  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '', state: '', instagram: '', utrNumber: ''
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePayment = () => {
    const e = {};
    if (form.utrNumber.trim().length < 6) e.utrNumber = 'Enter a valid UTR / Transaction ID';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmitOrder = async () => {
    if (!validatePayment()) return;
    setLoading(true);
    try {
      const oid = 'MV-' + Date.now();
      await addDoc(collection(db, 'orders'), {
        orderId: oid,
        customer: form,
        items: snapshot.items,
        total: snapshot.total,
        utrNumber: form.utrNumber,
        status: 'pending_verification',
        createdAt: serverTimestamp()
      });
      setOrderId(oid);
      clearCart();
      setStep(2);
    } catch (err) {
      console.error(err);
      alert('Order failed — please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty and we haven't reached confirmation, close
  if (cart.length === 0 && step < 2 && snapshot.items.length === 0) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
        />
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 301,
          display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            style={{
              background: 'var(--bg-modal)', backdropFilter: 'blur(24px)',
              border: '1px solid var(--border-primary)', borderRadius: '24px',
              padding: '40px 32px', textAlign: 'center', pointerEvents: 'all'
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛒</div>
            <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)' }}>Cart is empty</h2>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 20px', fontSize: '0.88rem' }}>Add some bundles first</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                background: 'linear-gradient(135deg,#7C3AED,#22D3EE)', border: 'none',
                color: '#fff', borderRadius: '12px', padding: '12px 28px',
                cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.92rem'
              }}
            >Browse Bundles</motion.button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={step < 2 ? onClose : undefined}
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)'
        }}
      />

      {/* Modal — use a centering wrapper so framer-motion doesn't fight translate(-50%) */}
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 301,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                width: 'min(580px, 92vw)', maxHeight: '90vh', overflowY: 'auto',
                background: 'var(--bg-modal)', backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid var(--border-primary)', borderRadius: '24px', padding: '28px 24px',
                pointerEvents: 'all', position: 'relative', color: 'var(--text-primary)'
              }}
            >
              {/* Close */}
              {step < 2 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'var(--bg-social-icon)', border: '1px solid var(--border-primary)',
                    color: 'var(--text-muted)', borderRadius: '10px', width: '32px', height: '32px',
                    cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >✕</motion.button>
              )}

          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i <= step ? 'linear-gradient(135deg,#7C3AED,#22D3EE)' : 'var(--bg-primary)',
                  border: i <= step ? 'none' : '1px solid var(--border-primary)',
                  color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
                }}>{i < step ? '✓' : i + 1}</div>
                <span style={{
                  color: i === step ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: i === step ? 600 : 400,
                  marginLeft: '6px', fontSize: '0.82rem'
                }}>{s}</span>
                {i < STEPS.length - 1 && (
                  <div style={{ width: '28px', height: '1px', background: i < step ? '#7C3AED' : 'var(--border-primary)', margin: '0 8px' }} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 0: Details ── */}
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>Your Details</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: '0.85rem' }}>We'll send your files here after payment verification</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '0' }}>
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Rahul Sharma', type: 'text' },
                  { key: 'email', label: 'Email', placeholder: 'rahul@gmail.com', type: 'email' },
                  { key: 'phone', label: 'Phone Number', placeholder: '9876543210', type: 'tel' },
                  { key: 'city', label: 'City', placeholder: 'Mumbai', type: 'text' },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra', type: 'text' },
                  { key: 'instagram', label: 'Instagram (optional)', placeholder: '@yourhandle', type: 'text' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '2px' }}>
                    <label style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      style={inputStyle(errors[f.key])}
                      onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                      onBlur={e => { e.target.style.borderColor = errors[f.key] ? '#EF4444' : 'var(--border-primary)'; e.target.style.boxShadow = 'none'; }}
                    />
                    {errors[f.key] && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '3px 0 0' }}>{errors[f.key]}</p>}
                  </div>
                ))}
              </div>

              {/* Order mini — use snapshot for stable data */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '12px', padding: '12px 14px', margin: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>{snapshot.items.length} item(s)</span>
                  <span style={{ fontFamily: 'Outfit', fontWeight: 700 }}>₹{snapshot.total}</span>
                </div>
                {snapshot.items.map(i => <div key={i.id} style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '2px' }}>• {i.name}</div>)}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { if (validate()) setStep(1); }}
                style={{
                  width: '100%', background: 'linear-gradient(135deg,#7C3AED,#22D3EE)', border: 'none',
                  color: '#fff', borderRadius: '12px', padding: '14px',
                  cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem'
                }}
              >
                Continue to Payment →
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 1: UPI Payment ── */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>Pay via UPI</h2>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 20px', fontSize: '0.85rem' }}>Scan the QR or pay to our UPI ID, then enter your transaction ID</p>

              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)',
                borderRadius: '10px', padding: '10px 12px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span>🔒</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 500 }}>
                  Payment goes directly to our UPI — no middleman, no card data stored.
                </span>
              </div>

              {/* QR */}
              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '16px',
                padding: '24px 18px', textAlign: 'center', marginBottom: '16px'
              }}>
                <img
                  src={`https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=${encodeURIComponent(upiUrl(snapshot.total))}&choe=UTF-8`}
                  alt="UPI QR Code"
                  style={{ width: '160px', height: '160px', borderRadius: '10px', background: '#fff', padding: '6px', display: 'block', margin: '0 auto' }}
                />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '12px 0 4px' }}>Scan with any UPI app</p>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 4px', letterSpacing: '0.04em', wordBreak: 'break-all' }}>{UPI_ID}</p>
                <p style={{ color: '#7C3AED', fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', margin: 0 }}>₹{snapshot.total}</p>
                <a href={upiUrl(snapshot.total)} style={{
                  display: 'inline-block', marginTop: '12px',
                  background: 'var(--bg-social-icon)', border: '1px solid var(--border-primary)',
                  color: '#7C3AED', borderRadius: '8px', padding: '7px 18px',
                  textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600
                }}>
                  📱 Open UPI App
                </a>
              </div>

              {/* UPI apps */}
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: '0 0 6px', fontWeight: 600 }}>Works with:</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {['PhonePe', 'Google Pay', 'Paytm', 'BHIM', 'Amazon Pay'].map(app => (
                    <span key={app} style={{ color: 'var(--text-muted)', fontSize: '0.72rem', background: 'var(--bg-primary)', borderRadius: '5px', padding: '3px 8px' }}>{app}</span>
                  ))}
                </div>
              </div>

              {/* UTR */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>
                  UTR / Transaction ID *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 421345678912"
                  value={form.utrNumber}
                  onChange={e => set('utrNumber', e.target.value)}
                  style={inputStyle(errors.utrNumber)}
                  onFocus={e => { e.target.style.borderColor = '#7C3AED'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.utrNumber ? '#EF4444' : 'var(--border-primary)'; e.target.style.boxShadow = 'none'; }}
                />
                {errors.utrNumber && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '3px 0 0' }}>{errors.utrNumber}</p>}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', margin: '5px 0 0' }}>
                  Find this in your UPI app → Payment History → Transaction Details
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setStep(0)}
                  style={{
                    flex: 1, background: 'transparent', border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)', borderRadius: '12px', padding: '13px',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem'
                  }}
                >← Back</motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  style={{
                    flex: 2, background: loading ? 'var(--bg-secondary)' : 'linear-gradient(135deg,#7C3AED,#22D3EE)',
                    border: 'none', color: '#fff', borderRadius: '12px', padding: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem'
                  }}
                >
                  {loading ? 'Submitting…' : 'Confirm Order ✓'}
                </motion.button>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center', margin: '12px 0 0', lineHeight: 1.5 }}>
                ⚠ Orders are verified manually. Files delivered within 1–6 hrs.
              </p>
            </motion.div>
          )}

          {/* ── STEP 2: Confirmation ── */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} style={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  width: '72px', height: '72px', background: 'linear-gradient(135deg,#7C3AED,#22D3EE)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', margin: '0 auto 20px', color: '#fff'
                }}
              >✓</motion.div>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.5rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>Order Received!</h2>
              <p style={{ color: 'var(--text-secondary)', margin: '0 0 4px', fontSize: '0.85rem' }}>
                Order ID: <span style={{ color: '#7C3AED', fontWeight: 700 }}>{orderId}</span>
              </p>
              <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.7, fontSize: '0.85rem' }}>
                Files will be delivered to <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.email}</span>
                {form.instagram && <> or via <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{form.instagram}</span> DM</>} within 1–6 hours.
              </p>

              <div style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', borderRadius: '14px',
                padding: '18px', textAlign: 'left', marginBottom: '24px'
              }}>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, margin: '0 0 12px', fontSize: '0.9rem', color: 'var(--text-primary)' }}>What happens next?</h3>
                {[
                  '1. We receive your UTR and verify the payment',
                  '2. Files are packaged and sent to your email',
                  form.instagram ? `3. DM confirmation sent to ${form.instagram}` : '3. Check your spam folder if email is late',
                  '4. Enjoy your new After Effects packs! 🎬'
                ].map((s, i) => (
                  <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 6px', lineHeight: 1.5 }}>{s}</p>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg,#7C3AED,#22D3EE)', border: 'none',
                  color: '#fff', borderRadius: '12px', padding: '13px 32px',
                  cursor: 'pointer', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem'
                }}
              >Back to Home</motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}
