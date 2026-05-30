import { Link } from 'react-router';
import { Camera, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import '../styles/layout.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container-premium footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo-group">
              <Camera className="footer-logo-icon" />
              <div>
                <h3 className="footer-brand-title">CanLens Studio</h3>
                <p className="footer-brand-subtitle">Kigali, Rwanda</p>
              </div>
            </div>
            <p className="footer-brand-desc">
              Premier photography equipment store and creative content studio. Empowering creators across Rwanda.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link">
                <Instagram className="icon-sm" />
              </a>
              <a href="#" className="footer-social-link">
                <Facebook className="icon-sm" />
              </a>
              <a href="#" className="footer-social-link">
                <Twitter className="icon-sm" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/shop" className="footer-link">Shop Equipment</Link>
              </li>
              <li>
                <Link to="/studio-rental" className="footer-link">Studio Rental</Link>
              </li>
              <li>
                <Link to="/portfolio" className="footer-link">Portfolio</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-links">
              <li className="footer-text">Equipment Sales</li>
              <li className="footer-text">Studio Rental</li>
              <li className="footer-text">Content Production</li>
              <li className="footer-text">Photography Services</li>
              <li className="footer-text">Video Production</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="footer-contact">
              <li className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span>KG 7 Ave, Kigali, Rwanda</span>
              </li>
              <li className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <a href="tel:+250788123456" className="footer-link">+250 788 123 456</a>
              </li>
              <li className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <a href="mailto:hello@canlensstudio.com" className="footer-link">hello@canlensstudio.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-flex">
            <p className="footer-copyright">
              © 2026 CanLens Studio. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#" className="footer-legal-link">Privacy Policy</a>
              <a href="#" className="footer-legal-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
