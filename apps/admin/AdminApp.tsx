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
import { AdminRole, Booking, SiteSettings, Vehicle } from '../../types';
import {
  observeAdminAuth,
  signOutAdmin,
  subscribeAdminBookings,
  subscribeSiteSettings,
  subscribeVehicles,
  verifyAdminAccess,
} from '../../api/endpoints';

const AdminApp: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<AdminRole>('editor');

  useEffect(() => subscribeVehicles(setVehicles), []);

  useEffect(() => subscribeSiteSettings(setSiteSettings), []);

  useEffect(() => subscribeAdminBookings(setBookings), []);

  useEffect(() => {
    return observeAdminAuth(async (user) => {
      if (!user) {
        setAdminUser(null);
        setIsAdmin(false);
        setAdminRole('editor');
        setAuthReady(true);
        return;
      }

      try {
        const access = await verifyAdminAccess(user.uid);
        if (!access.hasAccess) {
          await signOutAdmin();
          setAdminUser(null);
          setIsAdmin(false);
          setAdminRole('editor');
          return;
        }

        setAdminUser(user);
        setIsAdmin(true);
        setAdminRole(access.role);
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
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="login/" element={<Navigate to="/admin/login" replace />} />
      <Route path="login" element={<AdminLogin />} />
      <Route element={adminGate(<AdminLayout onLogout={signOutAdmin} />)}>
        <Route path="dashboard" element={<AdminDashboard vehicles={vehicles} bookings={bookings} />} />
        <Route path="vehicles" element={<AdminVehicles vehicles={vehicles} />} />
        <Route path="bookings" element={<AdminBookings vehicles={vehicles} />} />
        <Route path="financing" element={<AdminFinancing />} />
        <Route
          path="settings"
          element={
            adminRole === 'super_admin' || adminRole === 'manager' ? (
              <AdminSettings siteSettings={siteSettings} />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
