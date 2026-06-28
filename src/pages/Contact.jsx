import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import '../styles/contact.css';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page pt-20">
      {/* Hero */}
      <section className="contact-hero py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-hero-content"
          >
            <h1 className="text-display contact-hero-title">Get in Touch</h1>
            <p className="text-body-large contact-hero-subtitle">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-premium py-12">
        <div className="contact-grid">
          {/* Contact Info */}
          <div className="contact-info-list">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card contact-info-card">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <MapPin className="contact-icon" />
                  </div>
                  <div>
                    <h3 className="contact-info-title">Visit Us</h3>
                    <p className="contact-info-text">
                      KG 7 Avenue, Kigali<br />
                      Rwanda
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card contact-info-card">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Phone className="contact-icon" />
                  </div>
                  <div>
                    <h3 className="contact-info-title">Call Us</h3>
                    <p className="contact-info-text">
                      +250 788 123 456<br />
                      +250 788 654 321
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card contact-info-card">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Mail className="contact-icon" />
                  </div>
                  <div>
                    <h3 className="contact-info-title">Email Us</h3>
                    <p className="contact-info-text">
                      hello@canlensstudio.com<br />
                      support@canlensstudio.com
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card contact-info-card">
                <div className="contact-info-item">
                  <div className="contact-icon-wrapper">
                    <Clock className="contact-icon" />
                  </div>
                  <div>
                    <h3 className="contact-info-title">Business Hours</h3>
                    <p className="contact-info-text">
                      Mon - Fri: 9:00 AM - 8:00 PM<br />
                      Sat: 10:00 AM - 6:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <a
                href="https://wa.me/250788123456"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-whatsapp-link"
              >
                <Button className="contact-whatsapp-btn">
                  <Phone className="icon-sm contact-btn-icon-mr" />
                  WhatsApp Us
                </Button>
              </a>
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="glass-card contact-form-card">
                <h2 className="text-heading-1 contact-form-title">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <Label htmlFor="name" className="contact-label">Your Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="contact-input"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="contact-form-group">
                      <Label htmlFor="email" className="contact-label">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="contact-input"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="contact-form-group">
                      <Label htmlFor="phone" className="contact-label">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="contact-input"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                    <div className="contact-form-group">
                      <Label htmlFor="subject" className="contact-label">Subject *</Label>
                      <Input
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="contact-input"
                        placeholder="Equipment inquiry"
                      />
                    </div>
                  </div>

                  <div className="contact-form-group">
                    <Label htmlFor="message" className="contact-label">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="contact-textarea"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="contact-submit-btn"
                  >
                    <Send className="icon-sm contact-btn-icon-mr" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="contact-map-wrapper"
        >
          <Card className="glass-card contact-map-card">
            <div className="contact-map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d996.8664101838018!2d30.1026782!3d-1.9677223!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca7005651cf5f%3A0xf2a0d696d6a9cfd9!2sCanLens%20Studio!5e0!3m2!1sen!2srw!4v1780247405530!5m2!1sen!2srw"
                className="contact-map-iframe"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
