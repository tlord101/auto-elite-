import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Outlet, useNavigate } = ReactRouterDOM;
import { Bell, Calendar, Car, CreditCard, LayoutDashboard, LogOut, Menu, Settings, X } from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => Promise<void> | void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/vehicles', label: 'Vehicles', icon: Car },
    { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { path: '/admin/financing', label: 'Financing', icon: CreditCard },
    { path: '/admin/settings', label: 'Website Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await onLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#1A1A1A] font-sans">
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-full z-50`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          {isSidebarOpen ? (
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AutoElite Admin
            </span>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          )}
          <button onClick={() => setIsSidebarOpen((prev) => !prev)} className="p-1 hover:bg-gray-100 rounded-md">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center p-3 rounded-xl transition-all group ${
                  isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Control Panel</p>
            <p className="text-sm font-semibold text-gray-700">AutoElite Operations Center</p>
          </div>

          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
