import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Navigate, Route, Routes } = ReactRouterDOM;
import { User } from 'firebase/auth';
import { DEFAULT_SITE_SETTINGS } from '../../constants';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminVehicles from '../../pages/admin/AdminVehicles';
import AdminBookings from '../../pages/admin/AdminBookings';
import AdminFinancing from '../../pages/admin/AdminFinancing';
import AdminSettings from '../../pages/admin/AdminSettings';
import { SiteSettings, Vehicle } from '../../types';
import { observeAdminAuth, signOutAdmin, subscribeSiteSettings, subscribeVehicles, verifyAdminAccess } from '../../api/endpoints';

const AdminApp: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => subscribeVehicles(setVehicles), []);

  useEffect(() => subscribeSiteSettings(setSiteSettings), []);

  useEffect(() => {
    return observeAdminAuth(async (user) => {
      if (!user) {
        setAdminUser(null);
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const hasAccess = await verifyAdminAccess(user.uid);
        if (!hasAccess) {
          await signOutAdmin();
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
    <Routes>
      <Route path="login/" element={<Navigate to="/admin/login" replace />} />
      <Route path="login" element={<AdminLogin />} />
      <Route element={adminGate(<AdminLayout onLogout={signOutAdmin} />)}>
        <Route index element={<AdminDashboard vehicles={vehicles} />} />
        <Route path="vehicles" element={<AdminVehicles vehicles={vehicles} />} />
        <Route path="bookings" element={<AdminBookings vehicles={vehicles} />} />
        <Route path="financing" element={<AdminFinancing />} />
        <Route path="settings" element={<AdminSettings siteSettings={siteSettings} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminApp;
