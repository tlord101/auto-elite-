
import React from 'react';
import { Vehicle } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface AdminDashboardProps {
  vehicles: Vehicle[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ vehicles }) => {
  const topVehicles = [...vehicles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  
  const stats = [
    { title: 'Fleet Velocity', value: vehicles.length, color: 'bg-indigo-600', trend: 'Active' },
    { title: 'Market Reach', value: vehicles.reduce((acc, v) => acc + (v.views || 0), 0).toLocaleString(), color: 'bg-emerald-600', trend: 'Total Views' },
    { title: 'Lead Conv.', value: '14.2%', color: 'bg-amber-600', trend: '+2.1% week' },
    { title: 'Projected ARR', value: '$8.4M', color: 'bg-rose-600', trend: 'Qualified' },
  ];

  const viewData = topVehicles.map(v => ({ name: v.model, views: v.views || 0 }));

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Intelligence Center</h1>
        <p className="text-slate-500 font-medium">Real-time engagement and conversion analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className={`${stat.color} w-12 h-12 rounded-2xl mb-6 shadow-lg`}></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.title}</p>
            <div className="flex items-end gap-3">
               <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
               <span className="text-[10px] font-black text-emerald-500 pb-1">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100">
          <h3 className="text-xl font-black uppercase mb-8">Asset Popularity (Views)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={viewData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <YAxis axisLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} />
                <Tooltip />
                <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white">
           <h3 className="text-xl font-black uppercase mb-8">Conversion Funnel</h3>
           <div className="space-y-10">
              {[
                { label: 'Viewed Listing', count: '100%', color: 'bg-indigo-500' },
                { label: 'Inquired / Chat', count: '45%', color: 'bg-indigo-400' },
                { label: 'Booked Test Drive', count: '12%', color: 'bg-indigo-300' },
                { label: 'Purchased', count: '3%', color: 'bg-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: item.count }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
