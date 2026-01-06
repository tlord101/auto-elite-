import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { NavLink, Outlet, useNavigate } = ReactRouterDOM;

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 admin-sidebar-gradient flex flex-col text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">🛡️</span> AutoElite Admin
          </h1>
        </div>

        <nav className="flex-grow px-4 mt-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/10 text-red-200 hover:text-red-100 transition-all"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="text-slate-500 font-medium">Welcome back, Admin</div>
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