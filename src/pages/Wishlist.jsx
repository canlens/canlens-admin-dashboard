import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp } from '../contexts/AppContext';
import { toast } from 'sonner';
import '../styles/wishlist.css';

export function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page wishlist-empty pt-20">
        <div className="container-premium py-24 wishlist-empty-content">
          <Heart className="wishlist-empty-icon" />
          <h2 className="text-heading-1 wishlist-empty-title">Your wishlist is empty</h2>
          <p className="wishlist-empty-subtitle">
            Save your favorite items for later
          </p>
          <Link to="/shop">
            <Button className="wishlist-browse-btn">
              Browse Equipment
              <ArrowRight className="icon-sm wishlist-btn-icon-ml" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page pt-20">
      <section className="wishlist-hero py-16">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-display wishlist-hero-title">My Wishlist</h1>
            <p className="wishlist-hero-subtitle">{wishlist.length} items saved</p>
          </motion.div>
        </div>
      </section>

      <div className="container-premium py-12">
        <div className="wishlist-grid">
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="premium-card wishlist-card group h-full">
                <div className="wishlist-image-wrapper">
                  <Link to={`/shop/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="wishlist-image"
                    />
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      removeFromWishlist(product.id);
                      toast.success('Removed from wishlist');
                    }}
                    className="wishlist-remove-btn"
                  >
                    <Trash2 className="icon-sm text-red-400" />
                  </Button>
                </div>
                <div className="wishlist-content">
                  <Badge variant="secondary" className="wishlist-brand-badge">
                    {product.brand}
                  </Badge>
                  <Link to={`/shop/${product.id}`}>
                    <h3 className="wishlist-product-title">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="wishlist-product-desc">{product.description}</p>
                  <div className="wishlist-product-footer">
                    <span className="wishlist-product-price">${product.price.toLocaleString()}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="wishlist-add-btn"
                    >
                      <ShoppingCart className="icon-sm wishlist-btn-icon-mr" />
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="wishlist-continue-wrapper"
        >
          <Link to="/shop">
            <Button
              variant="outline"
              size="lg"
              className="wishlist-continue-btn"
            >
              Continue Shopping
              <ArrowRight className="icon-sm wishlist-btn-icon-ml" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
