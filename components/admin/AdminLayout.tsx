import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Outlet, useNavigate } = ReactRouterDOM;

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const operationsItems = [
    { name: 'Dashboard', path: '/admin', icon: '🏠' },
    { name: 'Manage Vehicles', path: '/admin/vehicles', icon: '🚘' },
    { name: 'Test Drive Bookings', path: '/admin/bookings', icon: '📅' },
    { name: 'Financing Requests', path: '/admin/financing', icon: '💳' },
  ];

  const settingsItems = [
    { name: 'Site Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900">
      {isMobileOpen && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`flex flex-col text-white z-50 transition-all duration-300 lg:static fixed inset-y-0 left-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/85" />

        <div className="relative p-6 border-b border-white/10 flex items-center justify-between">
          <h1 className={`text-xl font-extrabold tracking-tight flex items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <span className={isCollapsed ? '' : 'mr-2'}>🛡️</span>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>AutoElite Admin</span>
          </h1>
        </div>

        <nav className="relative flex-grow px-3 py-6 overflow-y-auto">
          <p className={`px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${isCollapsed ? 'hidden' : 'block'}`}>
            Operations
          </p>
          <div className="space-y-1.5 mb-6">
            {operationsItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-indigo-500/40 text-white shadow-lg shadow-indigo-900/40' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <p className={`px-4 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${isCollapsed ? 'hidden' : 'block'}`}>
            Settings
          </p>
          <div className="space-y-1.5">
            {settingsItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive ? 'bg-indigo-500/40 text-white shadow-lg shadow-indigo-900/40' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="relative p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-100 transition-all`}
          >
            <span>🚪</span>
            <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
          </button>
        </div>
      </aside>

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
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Control Center</p>
              <p className="text-sm font-semibold text-slate-700">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600">🔔</button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-indigo-200">
              AD
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;