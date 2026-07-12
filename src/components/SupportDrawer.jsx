import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';

const inputStyle = (err) => ({
  width: '100%', boxSizing: 'border-box',
  background: '#0c0c10', border: `1px solid ${err ? '#EF4444' : '#1e1e24'}`,
  borderRadius: '10px', padding: '12px 14px', color: '#fff',
  fontFamily: 'Inter', fontSize: '0.9rem', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s'
});

export default function SupportDrawer({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', subject: 'preset-help', message: ''
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Please provide more details (min 10 chars)';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'support_tickets'), {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
        status: 'open',
        createdAt: serverTimestamp()
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to send query. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

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
          background: 'rgba(10,10,14,0.97)', backdropFilter: 'blur(24px) saturate(180%)',
          borderLeft: '1px solid rgba(124,58,237,0.1)',
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #151518',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: 0 }}>
            💬 Contact Support
          </h2>
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

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{
                width: '64px', height: '64px', background: 'linear-gradient(135deg,#7C3AED,#22D3EE)',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', margin: '0 auto 20px', color: '#fff'
              }}>✓</div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>Message Sent!</h3>
              <p style={{ color: '#888', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '24px' }}>
                We have received your ticket. Our support team will reach out to <span style={{ color: '#ccc' }}>{form.email}</span> within 12–24 hours.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                <span>Close Support Drawer</span>
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  style={inputStyle(errors.name)}
                />
                {errors.name && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.name}</p>}
              </div>

              <div>
                <label style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  style={inputStyle(errors.email)}
                />
                {errors.email && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.email}</p>}
              </div>

              <div>
                <label style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Topic / Issue</label>
                <select
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                  style={{
                    ...inputStyle(false),
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svgxml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888888\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="preset-help" style={{ background: '#0a0a0e' }}>Preset Installation Help</option>
                  <option value="payment-issue" style={{ background: '#0a0a0e' }}>UTR Verification / Payment Issue</option>
                  <option value="refund-request" style={{ background: '#0a0a0e' }}>Refund / Order Status</option>
                  <option value="general" style={{ background: '#0a0a0e' }}>General Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ color: '#888', fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '5px' }}>Your Message</label>
                <textarea
                  rows={6}
                  placeholder="Explain your problem or inquiry in detail..."
                  value={form.message}
                  onChange={e => set('message', e.target.value)}
                  style={{
                    ...inputStyle(errors.message),
                    resize: 'none',
                    lineHeight: '1.5'
                  }}
                />
                {errors.message && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.message}</p>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '10px' }}
              >
                <span>{loading ? 'Submitting query...' : 'Submit Support Ticket'}</span>
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </>
  );
}
