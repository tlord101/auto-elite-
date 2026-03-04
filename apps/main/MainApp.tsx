import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Navigate, Routes, Route } = ReactRouterDOM;
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Home from '../../pages/Home';
import Browse from '../../pages/Browse';
import Details from '../../pages/Details';
import About from '../../pages/About';
import Sell from '../../pages/Sell';
import Financing from '../../pages/Financing';
import TestDrive from '../../pages/TestDrive';
import Contact from '../../pages/Contact';
import { DEFAULT_SITE_SETTINGS } from '../../constants';
import { SiteSettings, Vehicle } from '../../types';
import { incrementVehicleViews, subscribeSiteSettings, subscribeVehicles } from '../../api/endpoints';

const MainApp: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => subscribeVehicles(setVehicles), []);

  useEffect(() => subscribeSiteSettings(setSiteSettings), []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleIncrementViews = async (id: string) => {
    try {
      await incrementVehicleViews(id);
    } catch (error) {
      console.error('Failed to increment views', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<PublicLayout siteSettings={siteSettings}><Home vehicles={vehicles} siteSettings={siteSettings} /></PublicLayout>} />
        <Route path="/browse" element={<PublicLayout siteSettings={siteSettings}><Browse vehicles={vehicles} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
        <Route path="/vehicle/:id" element={<PublicLayout siteSettings={siteSettings}><Details vehicles={vehicles} incrementViews={handleIncrementViews} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout siteSettings={siteSettings}><About /></PublicLayout>} />
        <Route path="/sell" element={<PublicLayout siteSettings={siteSettings}><Sell /></PublicLayout>} />
        <Route path="/financing" element={<PublicLayout siteSettings={siteSettings}><Financing /></PublicLayout>} />
        <Route path="/test-drive" element={<PublicLayout siteSettings={siteSettings}><TestDrive vehicles={vehicles} /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout siteSettings={siteSettings}><Contact /></PublicLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const PublicLayout: React.FC<{ children: React.ReactNode; siteSettings: SiteSettings }> = ({ children, siteSettings }) => (
  <>
    <Navbar siteName={siteSettings.siteName} />
    <main className="flex-grow pt-16">{children}</main>
    <Footer siteName={siteSettings.siteName} />
  </>
);

export default MainApp;
