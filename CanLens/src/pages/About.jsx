import { motion } from 'motion/react';
import { Target, Eye, Award, Users } from 'lucide-react';
import { Card } from '../components/ui/card';
import '../styles/about.css';

export function About() {
  const team = [
    {
      name: 'Eric Mugabo',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      bio: '15+ years in photography and content creation',
    },
    {
      name: 'Grace Uwase',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      bio: 'Award-winning commercial photographer',
    },
    {
      name: 'Patrick Niyonzima',
      role: 'Technical Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      bio: 'Expert in studio equipment and technology',
    },
    {
      name: 'Diane Mutesi',
      role: 'Studio Coordinator',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
      bio: 'Ensures seamless studio operations',
    },
  ];

  return (
    <div className="about-page pt-20">
      {/* Hero */}
      <section className="about-hero py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="about-hero-content"
          >
            <h1 className="text-display about-hero-title">About CanLens Studio</h1>
            <p className="text-body-large about-hero-subtitle">
              Rwanda's premier destination for photography equipment and creative spaces
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container-premium">
          <div className="about-story-grid">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-display about-section-title">Our Story</h2>
              <div className="about-story-text">
                <p>
                  Founded in 2020, CanLens Studio was born from a simple vision: to empower creators across Rwanda with access to world-class equipment and professional studio spaces.
                </p>
                <p>
                  What started as a small equipment rental shop in Kigali has grown into a comprehensive creative hub, serving photographers, videographers, content creators, and production companies from across East Africa.
                </p>
                <p>
                  Today, we're proud to be Rwanda's most trusted partner for creative professionals, offering everything from the latest cameras and lenses to fully-equipped studios for every type of production.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="about-story-images"
            >
              <img
                src="https://images.unsplash.com/photo-1556910633-5099dc3971e8?w=800&q=80"
                alt="Studio"
                className="about-story-img1"
              />
              <img
                src="https://images.unsplash.com/photo-1606980598821-4f0c4cc1c9c9?w=800&q=80"
                alt="Equipment"
                className="about-story-img2"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="about-mission-section py-24">
        <div className="container-premium">
          <div className="about-mission-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card about-mission-card">
                <div className="about-mission-icon-wrapper">
                  <Target className="about-mission-icon" />
                </div>
                <h3 className="text-heading-1 about-mission-title">Our Mission</h3>
                <p className="about-mission-desc">
                  To democratize access to professional photography and videography equipment, 
                  empowering creators to bring their visions to life without compromise.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card about-mission-card">
                <div className="about-mission-icon-wrapper">
                  <Eye className="about-mission-icon" />
                </div>
                <h3 className="text-heading-1 about-mission-title">Our Vision</h3>
                <p className="about-mission-desc">
                  To be East Africa's leading creative hub, recognized for our commitment to 
                  quality, innovation, and supporting the next generation of visual storytellers.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-section-header"
          >
            <h2 className="text-display about-section-title text-center">Our Values</h2>
          </motion.div>

          <div className="about-values-grid">
            {[
              {
                icon: Award,
                title: 'Quality First',
                description: 'We only stock and maintain equipment from the most trusted brands in the industry.',
              },
              {
                icon: Users,
                title: 'Creator-Focused',
                description: 'Every decision we make is guided by what best serves our creative community.',
              },
              {
                icon: Target,
                title: 'Innovation',
                description: 'We continuously update our inventory and studios with the latest technology.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card about-value-card">
                  <value.icon className="about-value-icon" />
                  <h3 className="about-value-title">{value.title}</h3>
                  <p className="about-value-desc">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section py-24">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-section-header"
          >
            <h2 className="text-display about-section-title text-center">Meet Our Team</h2>
            <p className="text-body-large text-center about-team-subtitle">
              Passionate professionals dedicated to your success
            </p>
          </motion.div>

          <div className="about-team-grid">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card about-team-card group cursor-pointer">
                  <div className="about-team-img-wrapper">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="about-team-img"
                    />
                  </div>
                  <div className="about-team-content">
                    <h3 className="about-team-name">{member.name}</h3>
                    <p className="about-team-role">{member.role}</p>
                    <p className="about-team-bio">{member.bio}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
