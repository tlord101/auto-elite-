import React, { useEffect, useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useNavigate } = ReactRouterDOM;
import { getCurrentAdminUser, signInAdmin } from '../../api/endpoints';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getCurrentAdminUser()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signInAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials or access not granted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1800&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-950/80" />

      <div className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <div className="p-8 bg-gradient-to-r from-slate-900 to-indigo-900 text-white text-center">
          <h1 className="text-3xl font-black mb-2 tracking-tight">AutoElite Admin</h1>
          <p className="text-slate-200 text-sm">Sign in to manage inventory, bookings, and financing</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-slate-400">👤</span>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@autoelite.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-slate-400">🔑</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-rose-600 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/40 disabled:opacity-70"
          >
            {isSubmitting ? 'Signing In...' : 'Login to Dashboard'}
          </button>

          <p className="text-center text-sm text-slate-500">
            Access is restricted to authorized admins.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;