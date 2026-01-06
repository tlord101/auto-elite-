
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { HashRouter, Routes, Route } = ReactRouterDOM;
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Details from './pages/Details';
import About from './pages/About';
import Sell from './pages/Sell';
import Financing from './pages/Financing';
import TestDrive from './pages/TestDrive';
import Contact from './pages/Contact';
import { MOCK_VEHICLES } from './constants';
import { Vehicle } from './types';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const incrementViews = (id: string) => {
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, views: v.views + 1 } : v));
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<PublicLayout><Home vehicles={vehicles} /></PublicLayout>} />
          <Route path="/browse" element={<PublicLayout><Browse vehicles={vehicles} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
          <Route path="/vehicle/:id" element={<PublicLayout><Details vehicles={vehicles} incrementViews={incrementViews} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/sell" element={<PublicLayout><Sell /></PublicLayout>} />
          <Route path="/financing" element={<PublicLayout><Financing /></PublicLayout>} />
          <Route path="/test-drive" element={<PublicLayout><TestDrive vehicles={vehicles} /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        </Routes>
      </div>
    </HashRouter>
  );
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main className="flex-grow pt-16">
      {children}
    </main>
    <Footer />
  </>
);

export default App;
