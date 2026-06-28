import { Outlet, ScrollRestoration } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { Toaster } from './ui/sonner';
import '../styles/layout.css';

export function Layout() {
  return (
    <div className="dark-theme layout-wrapper">
      <Navigation />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <Toaster position="top-right" />
    </div>
  );
}
