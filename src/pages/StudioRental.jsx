import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Users, MapPin, Check, Calendar, DollarSign, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { studios, timeSlots } from '../data/studios';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import '../styles/studio.css';

export function StudioRental() {
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    hours: '1',
    customerName: '',
    customerEmail: '',
  });
  const { createBooking } = useApp();

  const studio = studios.find((s) => s.id === selectedStudio);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!studio) return;

    const totalPrice = studio.hourlyRate * parseInt(bookingData.hours);
    
    createBooking({
      studioId: studio.id,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      hours: parseInt(bookingData.hours),
      totalPrice,
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
    });

    toast.success(`Booking confirmed for ${studio.name}!`);
    setIsBookingOpen(false);
    setBookingData({
      date: '',
      timeSlot: '',
      hours: '1',
      customerName: '',
      customerEmail: '',
    });
  };

  const openBooking = (studioId) => {
    setSelectedStudio(studioId);
    setIsBookingOpen(true);
  };

  return (
    <div className="studio-page pt-20">
      {/* Hero */}
      <section className="studio-hero py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="studio-hero-content"
          >
            <h1 className="text-display studio-hero-title">Professional Studio Spaces</h1>
            <p className="text-body-large studio-hero-subtitle">
              Fully-equipped studios for podcasts, photography, video production, and content creation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Studios */}
      <div className="container-premium py-12">
        <div className="studio-list-grid">
          {studios.map((studio, index) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card studio-card">
                <div className="studio-card-inner">
                  {/* Images */}
                  <div className="studio-images-wrapper">
                    <div className="studio-images-grid">
                      <img
                        src={studio.images[0]}
                        alt={studio.name}
                        className="studio-img-main"
                      />
                      {studio.images.slice(1, 3).map((image, i) => (
                        <img
                          key={i}
                          src={image}
                          alt={`${studio.name} ${i + 2}`}
                          className="studio-img-sub"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="studio-info">
                    <div className="studio-info-header">
                      <div>
                        <h2 className="text-heading-1 studio-title">{studio.name}</h2>
                        <div className="studio-meta">
                          <span className="studio-meta-item">
                            <Users className="icon-sm" />
                            Up to {studio.capacity} people
                          </span>
                          <span className="studio-meta-item">
                            <MapPin className="icon-sm" />
                            {studio.size}
                          </span>
                        </div>
                      </div>
                      <Badge className="studio-price-badge">
                        ${studio.hourlyRate}/hr
                      </Badge>
                    </div>

                    <p className="studio-desc">{studio.description}</p>

                    {/* Equipment */}
                    <div className="studio-equipment-section">
                      <h3 className="studio-equipment-title">Equipment Included</h3>
                      <div className="studio-equipment-grid">
                        {studio.equipment.map((item) => (
                          <div key={item} className="studio-equipment-item">
                            <Check className="studio-check-icon" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      onClick={() => openBooking(studio.id)}
                      className="studio-book-btn"
                    >
                      <Calendar className="icon-sm studio-btn-icon" />
                      Book This Studio
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="studio-faq-section"
        >
          <h2 className="text-heading-1 studio-faq-title">Frequently Asked Questions</h2>
          <div className="studio-faq-grid">
            {[
              {
                q: 'How far in advance should I book?',
                a: 'We recommend booking at least 48 hours in advance, but we can often accommodate same-day bookings based on availability.',
              },
              {
                q: 'What\'s included in the hourly rate?',
                a: 'All listed equipment, technical support, Wi-Fi, and basic amenities. Additional services like videographers or photographers can be arranged separately.',
              },
              {
                q: 'Can I bring my own equipment?',
                a: 'Absolutely! You\'re welcome to bring additional gear. Our team can help integrate it with the studio setup.',
              },
              {
                q: 'Is there a minimum booking time?',
                a: 'Most studios have a 1-hour minimum. For commercial productions, we offer half-day and full-day packages at discounted rates.',
              },
            ].map((faq, index) => (
              <Card key={index} className="glass-card studio-faq-card">
                <h3 className="studio-faq-q">{faq.q}</h3>
                <p className="studio-faq-a">{faq.a}</p>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="studio-dialog-content">
          <DialogHeader>
            <DialogTitle className="studio-dialog-title">Book {studio?.name}</DialogTitle>
            <DialogDescription className="studio-dialog-desc">
              Fill in your details to reserve this studio
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookingSubmit} className="studio-booking-form">
            <div className="form-group">
              <Label className="form-label">Your Name</Label>
              <Input
                required
                value={bookingData.customerName}
                onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                className="form-input"
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <Label className="form-label">Email</Label>
              <Input
                required
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                className="form-input"
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <Label className="form-label">Date</Label>
              <Input
                required
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <Label className="form-label">Time Slot</Label>
              <Select
                required
                value={bookingData.timeSlot}
                onValueChange={(value) => setBookingData({ ...bookingData, timeSlot: value })}
              >
                <SelectTrigger className="form-select-trigger">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="form-group">
              <Label className="form-label">Number of Hours</Label>
              <Select
                required
                value={bookingData.hours}
                onValueChange={(value) => setBookingData({ ...bookingData, hours: value })}
              >
                <SelectTrigger className="form-select-trigger">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {hour} {hour === 1 ? 'hour' : 'hours'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {studio && bookingData.hours && (
              <div className="studio-total-price-box">
                <div className="studio-total-flex">
                  <span className="studio-total-label">Total Price</span>
                  <span className="studio-total-value">
                    ${studio.hourlyRate * parseInt(bookingData.hours)}
                  </span>
                </div>
              </div>
            )}

            <div className="studio-form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBookingOpen(false)}
                className="studio-btn-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="studio-btn-confirm"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
