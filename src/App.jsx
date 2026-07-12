import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BundleDetail from './pages/BundleDetail';
import CartDrawer from './pages/Cart';
import CheckoutModal from './pages/Checkout';
import SupportDrawer from './components/SupportDrawer';
import SearchDrawer from './components/SearchDrawer';
import AccountDrawer from './components/AccountDrawer';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LegalDrawer from './components/LegalDrawer';

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('terms');
  
  // Shared state to allow mega-menu filtering target
  const [activeCategory, setActiveCategory] = useState('all');

  const openCart = () => { closeAll(); setCartOpen(true); };
  const closeCart = () => setCartOpen(false);

  const openCheckout = () => { closeAll(); setCheckoutOpen(true); };
  const closeCheckout = () => setCheckoutOpen(false);

  const openSupport = () => { closeAll(); setSupportOpen(true); };
  const closeSupport = () => setSupportOpen(false);

  const openSearch = () => { closeAll(); setSearchOpen(true); };
  const closeSearch = () => setSearchOpen(false);

  const openAccount = () => { closeAll(); setAccountOpen(true); };
  const closeAccount = () => setAccountOpen(false);

  const openLegal = (tab = 'terms') => { closeAll(); setLegalOpen(true); setLegalTab(tab); };
  const closeLegal = () => setLegalOpen(false);

  const closeAll = () => {
    setCartOpen(false);
    setCheckoutOpen(false);
    setSupportOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
    setLegalOpen(false);
  };

  return (
    <>
      <Navbar 
        onCartClick={openCart} 
        onSupportClick={openSupport}
        onSearchClick={openSearch}
        onAccountClick={openAccount}
        onLegalClick={openLegal}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              onCartClick={openCart} 
              onSupportClick={openSupport} 
              onLegalClick={openLegal}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
          } 
        />
        <Route path="/bundle/:id" element={<BundleDetail onCartClick={openCart} />} />
      </Routes>

      <AnimatePresence>
        {cartOpen && <CartDrawer onClose={closeCart} onCheckout={openCheckout} />}
      </AnimatePresence>
      <AnimatePresence>
        {checkoutOpen && <CheckoutModal onClose={closeCheckout} />}
      </AnimatePresence>
      <AnimatePresence>
        {supportOpen && <SupportDrawer onClose={closeSupport} />}
      </AnimatePresence>
      <AnimatePresence>
        {searchOpen && <SearchDrawer onClose={closeSearch} />}
      </AnimatePresence>
      <AnimatePresence>
        {accountOpen && <AccountDrawer onClose={closeAccount} />}
      </AnimatePresence>
      <AnimatePresence>
        {legalOpen && <LegalDrawer onClose={closeLegal} initialTab={legalTab} />}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
