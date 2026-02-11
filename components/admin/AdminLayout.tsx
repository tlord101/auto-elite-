import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Outlet, useNavigate } = ReactRouterDOM;

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Vehicles', path: '/admin/vehicles', icon: '🚗' },
    { name: 'Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Financing', path: '/admin/financing', icon: '💰' },
    { name: 'Site Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-900 flex flex-col text-white z-50 transition-all duration-300 lg:static fixed inset-y-0 left-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <h1 className={`text-2xl font-bold flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            <span className={isCollapsed ? '' : 'mr-2'}>🛡️</span>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>AutoElite Admin</span>
          </h1>
        </div>

        <nav className="flex-grow px-3 mt-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl hover:bg-white/10 text-red-200 hover:text-red-100 transition-all`}
          >
            <span>🚪</span>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <button
              type="button"
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="p-2 text-slate-500 hover:text-indigo-600 hidden lg:inline-flex"
              aria-label="Toggle sidebar"
            >
              {isCollapsed ? '→' : '←'}
            </button>
            <div className="text-slate-500 font-medium">Welcome back, Admin</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600">🔔</button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              AD
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;