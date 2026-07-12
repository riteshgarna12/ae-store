import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LegalDrawer({ onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [
    { id: 'terms', label: 'Terms of Service' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'refund', label: 'Refund Policy' },
  ];

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
          width: 'min(520px, 92vw)', zIndex: 301,
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
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.3rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚖️</span> Legal & Licensing
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

        {/* Tab Buttons */}
        <div style={{
          display: 'flex', borderBottom: '1px solid #151518', background: 'rgba(8,8,10,0.3)', padding: '6px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 6px', background: activeTab === tab.id ? 'rgba(124,58,237,0.1)' : 'transparent',
                border: 'none', borderBottom: activeTab === tab.id ? '2px solid #7C3AED' : '2px solid transparent',
                color: activeTab === tab.id ? '#fff' : '#777', fontWeight: 600, fontSize: '0.85rem',
                fontFamily: 'Inter', cursor: 'pointer', transition: 'all 0.3s', borderRadius: '6px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', fontFamily: 'Inter', fontSize: '0.88rem', lineHeight: 1.7, color: '#ccc' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Terms & Licensing Agreement</h3>
                
                <p style={{ marginBottom: '14px' }}>
                  Welcome to MotionVault. By purchasing or downloading any assets from our store, you agree to comply with and be bound by the following licensing terms and conditions.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>1. Grant of License</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Upon successful payment or download, MotionVault grants you a non-exclusive, non-transferable, worldwide, royalty-free license to use the downloaded video assets, templates, and presets in your personal and commercial video editing projects.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>2. Permitted Uses</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '14px', color: '#aaa' }}>
                  <li>Use in YouTube videos, social media reels, shorts, and TikToks.</li>
                  <li>Use in client video productions, commercials, broadcasts, and corporate presentations.</li>
                  <li>Modify and adapt the presets to match your custom aesthetic or creative requirements.</li>
                </ul>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>3. Prohibited Uses</h4>
                <ul style={{ paddingLeft: '20px', marginBottom: '14px', color: '#aaa' }}>
                  <li>You may not resell, redistribute, sub-license, copy, or share the project files, presets, or assets in their original or modified form.</li>
                  <li>You may not upload these assets to stock platforms, file-sharing services, or template websites.</li>
                  <li>You may not claim ownership or original authorship of the assets.</li>
                </ul>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>4. Intellectual Property</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  All presets, graphic assets, animations, and source files remain the intellectual property of MotionVault. Any unauthorized distribution will result in immediate termination of license and legal action under intellectual property laws.
                </p>
              </motion.div>
            )}

            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Privacy Policy</h3>
                
                <p style={{ marginBottom: '14px' }}>
                  At MotionVault, we value your privacy. This policy describes how we collect, use, and protect your information when you shop with us.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>1. Information We Collect</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  We collect only the essential details needed to process and deliver your digital order: your name, email address, phone number (for billing verification), and transaction reference (like UPI UTR number).
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>2. How We Use Your Data</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Your email is used to automatically deliver the download links, send billing invoices, and notify you when lifetime free pack updates are released. We do not sell or trade your data to third parties.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>3. Secure Payments</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Payments are made securely via UPI or direct bank transfers. We never see or store your bank accounts, card numbers, or secure pins. All verification is handled via secure manual verification of the UTR number.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>4. Data Security</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Your order information is stored on secure servers protected by Firebase Security Rules. You can request deletion of your order records at any time by raising a ticket through our Support Drawer.
                </p>
              </motion.div>
            )}

            {activeTab === 'refund' && (
              <motion.div
                key="refund"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>Refund & Delivery Policy</h3>
                
                <p style={{ marginBottom: '14px' }}>
                  Since our products are digital assets delivered instantly via email, they cannot be physically "returned". Therefore, we operate under a strict refund policy.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>1. Digital Product Nature</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Once the download links are generated and sent, they remain accessible. Because of this, general refund requests based on "accidental purchases" or "change of mind" are not accepted.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>2. Technical Defect Policy</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  We stand by the quality of our templates. If you experience a verified technical issue, file corruption, or error in using the assets, please contact our support team. If we are unable to resolve the issue within 48 hours, we will issue a full 100% refund.
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>3. How to Request Help</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  To report a defect or inquire about your order:
                  <ul style={{ paddingLeft: '20px', marginTop: '8px', color: '#aaa' }}>
                    <li>Open the **Contact Support** drawer on our website.</li>
                    <li>Submit your payment detail and email address.</li>
                    <li>Or DM us on Instagram (**@motionvault.in**) for immediate, 1-on-1 developer support.</li>
                  </ul>
                </p>

                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginTop: '20px', marginBottom: '8px' }}>4. Delivery Time</h4>
                <p style={{ marginBottom: '14px', color: '#aaa' }}>
                  Upon payment verification, download links are sent to your email address within 5 minutes to 2 hours depending on transaction verification speeds.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
