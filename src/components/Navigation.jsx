import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Menu, X, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../contexts/AppContext';
import '../styles/layout.css';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, wishlist } = useApp();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Studio Rental', path: '/studio-rental' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`nav-header ${isScrolled ? 'nav-scrolled' : 'nav-transparent'}`}
      >
        <div className="container-premium">
          <div className="nav-container">
            {/* Logo */}
            <Link to="/" className="nav-logo-group">
              <div className="nav-logo-wrapper">
                <img src="/images/canlensLogo.png" alt="Logo" className="logo-image" />
                <div className="nav-logo-glow" />
              </div>
              <div>
                <h1 className="nav-logo-title">CanLens Studio</h1>
                <p className="nav-logo-subtitle">Kigali, Rwanda</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-desktop-links">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="nav-link"
                >
                  <span
                    className={`nav-link-text ${
                      isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                  >
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="nav-link-indicator"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="nav-actions">
              <Link to="/wishlist" className="relative">
                <Button variant="ghost" size="icon" className="nav-action-btn">
                  <Heart className="icon-sm" />
                  {wishlist?.length > 0 && (
                    <span className="nav-badge">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="nav-action-btn">
                  <ShoppingCart className="icon-sm" />
                  {cartCount > 0 && (
                    <span className="nav-badge">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="icon-md" /> : <Menu className="icon-md" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="mobile-menu-wrapper"
          >
            <div
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="mobile-menu-drawer">
              <div className="mobile-menu-content">
                <nav className="mobile-nav">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`mobile-nav-link ${
                          isActive(link.path)
                            ? 'mobile-nav-link-active'
                            : 'mobile-nav-link-inactive'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
