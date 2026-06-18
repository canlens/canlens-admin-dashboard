import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import '../styles/portfolio.css';

const projects = [
  {
    id: 1,
    title: 'Luxury Fashion Campaign',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1587050265310-1a2d98ccce5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwcGhvdG9ncmFwaHklMjBwb3J0Zm9saW8lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMTQ1MzU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'High-end fashion photography for international brand',
  },
  {
    id: 2,
    title: 'Tech Product Launch',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1545242640-7c9e9cc07d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGhvdG9ncmFwaHklMjBzdHVkaW8lMjBjb21tZXJjaWFsfGVufDF8fHx8MTc4MDE0NTM1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Product photography and video for tech startup',
  },
  {
    id: 3,
    title: 'Wedding Celebration',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1714972383570-44ddc9738355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBob3RvZ3JhcGh5JTIwd2VkZGluZyUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc4MDE0NTM1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Full day wedding photography and videography',
  },
  {
    id: 4,
    title: 'Corporate Portraits',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0ZWFtJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgwMTQ1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Executive headshots for Fortune 500 company',
  },
  {
    id: 5,
    title: 'Documentary Series',
    category: 'Content Creation',
    image: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&q=80',
    description: 'Multi-episode documentary about Rwandan entrepreneurs',
  },
  {
    id: 6,
    title: 'Music Video Production',
    category: 'Content Creation',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
    description: 'Full production for emerging artist',
  },
  {
    id: 7,
    title: 'Restaurant Brand Shoot',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    description: 'Food photography and restaurant interior shots',
  },
  {
    id: 8,
    title: 'Conference Coverage',
    category: 'Events',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    description: 'Multi-day tech conference photo and video coverage',
  },
];

const categories = ['All', 'Commercial', 'Events', 'Content Creation'];

export function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="portfolio-page pt-20">
      {/* Hero */}
      <section className="portfolio-hero py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="portfolio-hero-content"
          >
            <h1 className="text-display portfolio-hero-title">Our Portfolio</h1>
            <p className="text-body-large portfolio-hero-subtitle">
              Showcasing our best work across commercial photography, events, and content creation
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-premium py-12">
        {/* Category Filter */}
        <div className="portfolio-filters">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={
                selectedCategory === category
                  ? 'portfolio-btn-active'
                  : 'portfolio-btn-inactive'
              }
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="premium-card portfolio-card group cursor-pointer">
                <div className="portfolio-image-wrapper">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="portfolio-image"
                  />
                  <div className="portfolio-overlay group-hover:opacity-100">
                    <div>
                      <Badge className="portfolio-badge">
                        {project.category}
                      </Badge>
                      <p className="portfolio-desc">{project.description}</p>
                    </div>
                  </div>
                </div>
                <div className="portfolio-content">
                  <h3 className="portfolio-title">
                    {project.title}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
