
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { BrowserRouter, Routes, Route, Navigate } = ReactRouterDOM;
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, doc, getDoc, increment, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
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
import AIChatAssistant from './components/AIChatAssistant';
import { DEFAULT_SITE_SETTINGS } from './constants';
import { SiteSettings, Vehicle } from './types';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminBookings from './pages/admin/AdminBookings';
import AdminFinancing from './pages/admin/AdminFinancing';
import AdminSettings from './pages/admin/AdminSettings';
import { auth, db } from './firebaseClient';
import { mapSiteSettingsDoc, mapVehicleDoc } from './firebaseData';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminUser(null);
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const adminRef = doc(db, 'admins', user.uid);
        const adminSnap = await getDoc(adminRef);
        if (!adminSnap.exists()) {
          await signOut(auth);
          setAdminUser(null);
          setIsAdmin(false);
          return;
        }

        setAdminUser(user);
        setIsAdmin(true);
      } catch (error) {
        console.error('Failed to verify admin access', error);
        setAdminUser(null);
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });
  }, []);

  useEffect(() => {
    const vehicleQuery = query(collection(db, 'vehicles'), orderBy('createdAt', 'desc'));
    return onSnapshot(vehicleQuery, (snapshot) => {
      setVehicles(snapshot.docs.map(mapVehicleDoc));
    });
  }, []);

  useEffect(() => {
    const settingsRef = doc(db, 'siteSettings', 'global');
    return onSnapshot(settingsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSiteSettings(DEFAULT_SITE_SETTINGS);
        return;
      }
      setSiteSettings(mapSiteSettingsDoc(snapshot.data()));
    });
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const incrementViews = async (id: string) => {
    try {
      const ref = doc(db, 'vehicles', id);
      await updateDoc(ref, { views: increment(1) });
    } catch (error) {
      console.error('Failed to increment views', error);
    }
  };

  const handleAdminLogout = async () => {
    await signOut(auth);
  };

  const adminGate = (children: React.ReactNode) => {
    if (!authReady) {
      return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
    }
    if (!adminUser || !isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Home vehicles={vehicles} siteSettings={siteSettings} /></PublicLayout>} />
          <Route path="/browse" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Browse vehicles={vehicles} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
          <Route path="/vehicle/:id" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Details vehicles={vehicles} incrementViews={incrementViews} wishlist={wishlist} toggleWishlist={toggleWishlist} /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><About /></PublicLayout>} />
          <Route path="/sell" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Sell /></PublicLayout>} />
          <Route path="/financing" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Financing /></PublicLayout>} />
          <Route path="/test-drive" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><TestDrive vehicles={vehicles} /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout vehicles={vehicles} siteSettings={siteSettings}><Contact /></PublicLayout>} />
          <Route path="/admin/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin/login/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={adminGate(<AdminLayout onLogout={handleAdminLogout} />)}
          >
            <Route index element={<AdminDashboard vehicles={vehicles} />} />
            <Route path="vehicles" element={<AdminVehicles vehicles={vehicles} />} />
            <Route path="bookings" element={<AdminBookings vehicles={vehicles} />} />
            <Route path="financing" element={<AdminFinancing />} />
            <Route path="settings" element={<AdminSettings siteSettings={siteSettings} />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const PublicLayout: React.FC<{ children: React.ReactNode; vehicles: Vehicle[]; siteSettings: SiteSettings }> = ({ children, vehicles, siteSettings }) => (
  <>
    <Navbar siteName={siteSettings.siteName} />
    <main className="flex-grow pt-16">
      {children}
    </main>
    <AIChatAssistant vehicles={vehicles} />
    <Footer siteName={siteSettings.siteName} />
  </>
);

export default App;
