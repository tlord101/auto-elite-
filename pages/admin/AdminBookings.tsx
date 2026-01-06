
import React, { useState } from 'react';
import { Booking } from '../../types';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    { 
        id: 'b1', 
        vehicleId: 'v1', 
        vehicleName: '2024 Audi R8 V10',
        customerName: 'James Wilson', 
        email: 'james@example.com', 
        phone: '+123456789', 
        driversLicense: 'DL9988221',
        date: '2024-05-20', 
        time: '14:00', 
        location: 'Downtown Showroom',
        status: 'pending' 
    }
  ]);

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase text-slate-900">Appointment Ledger</h1>
        <p className="text-slate-500 text-sm font-medium">Manage logistics and customer engagements</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client & ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-900 uppercase text-xs">{b.customerName}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{b.email}</p>
                  <p className="text-[10px] text-indigo-600 font-black uppercase mt-1">ID: {b.driversLicense}</p>
                </td>
                <td className="px-8 py-6 font-bold text-slate-700 text-xs uppercase">{b.vehicleName}</td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-900 text-xs">{b.date} • {b.time}</p>
                  <p className="text-[10px] text-slate-500 font-black uppercase">{b.location}</p>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                     b.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 
                     b.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                   }`}>
                     {b.status}
                   </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                   <button onClick={() => updateStatus(b.id, 'approved')} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg hover:bg-emerald-100">Approve</button>
                   <button onClick={() => updateStatus(b.id, 'rejected')} className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-100">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
