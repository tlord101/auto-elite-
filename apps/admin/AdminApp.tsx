import React, { useEffect, useMemo, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Navigate, Route, Routes } = ReactRouterDOM;
import { User } from 'firebase/auth';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminLogin from '../../pages/admin/AdminLogin';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminVehicles from '../../pages/admin/AdminVehicles';
import AdminBookings from '../../pages/admin/AdminBookings';
import AdminFinancing from '../../pages/admin/AdminFinancing';
import AdminSettings from '../../pages/admin/AdminSettings';
import { DEFAULT_SITE_SETTINGS } from '../../constants';
import { Booking, FinancingRequest, SiteSettings, Vehicle } from '../../types';
import {
  observeAdminAuth,
  queueEmailDispatch,
  saveSiteSettings,
  signOutAdmin,
  subscribeAdminBookings,
  subscribeAdminFinancing,
  subscribeSiteSettings,
  subscribeVehicles,
  updateBookingStatus,
  updateFinancingStatus,
  verifyAdminAccess,
} from '../../api/endpoints';

const AdminApp: React.FC = () => {
  const [authReady, setAuthReady] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [financing, setFinancing] = useState<FinancingRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    return observeAdminAuth(async (user) => {
      if (!user) {
        setAdminUser(null);
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      try {
        const access = await verifyAdminAccess(user.uid);
        if (!access.hasAccess) {
          await signOutAdmin();
          setAdminUser(null);
          setIsAdmin(false);
          setAuthReady(true);
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
    if (!authReady || !adminUser || !isAdmin) return;

    const unsubVehicles = subscribeVehicles(setVehicles);
    const unsubBookings = subscribeAdminBookings(setBookings);
    const unsubFinancing = subscribeAdminFinancing(setFinancing);
    const unsubSettings = subscribeSiteSettings(setSiteSettings);

    return () => {
      unsubVehicles();
      unsubBookings();
      unsubFinancing();
      unsubSettings();
    };
  }, [authReady, adminUser, isAdmin]);

  const stats = useMemo(() => {
    const totalInventory = vehicles.length;
    const availableInventory = vehicles.filter((vehicle) => vehicle.status === 'available').length;
    const soldInventory = vehicles.filter((vehicle) => vehicle.status === 'sold').length;
    const pendingBookings = bookings.filter((booking) => booking.status === 'pending').length;
    const pendingFinancing = financing.filter((request) => request.status === 'pending').length;
    const totalRevenue = vehicles
      .filter((vehicle) => vehicle.status === 'sold')
      .reduce((sum, vehicle) => sum + (vehicle.price || 0), 0);

    return {
      totalInventory,
      availableInventory,
      soldInventory,
      pendingBookings,
      pendingFinancing,
      totalRevenue,
    };
  }, [vehicles, bookings, financing]);

  const requireAdmin = (children: React.ReactNode) => {
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
      <Route path="login" element={<AdminLogin />} />

      <Route element={requireAdmin(<AdminLayout onLogout={signOutAdmin} />)}>
        <Route path="dashboard" element={<AdminDashboard stats={stats} />} />
        <Route path="vehicles" element={<AdminVehicles vehicles={vehicles} />} />
        <Route
          path="bookings"
          element={<AdminBookings bookings={bookings} onUpdateStatus={updateBookingStatus} vehicles={vehicles} />}
        />
        <Route
          path="financing"
          element={<AdminFinancing requests={financing} onUpdateStatus={updateFinancingStatus} />}
        />
        <Route
          path="settings"
          element={
            <AdminSettings
              siteSettings={siteSettings}
              onSaveSiteSettings={saveSiteSettings}
              onQueueTestEmail={queueEmailDispatch}
            />
          }
        />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminApp;
