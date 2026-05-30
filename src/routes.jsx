import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { StudioRental } from './pages/StudioRental';
import { Portfolio } from './pages/Portfolio';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'studio-rental', element: <StudioRental /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'cart', element: <Cart /> },
      { path: 'wishlist', element: <Wishlist /> },
    ],
  },
]);
