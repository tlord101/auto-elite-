import React from 'react';
import { ArrowUpRight, Calendar, Car, CreditCard, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalInventory: number;
  availableInventory: number;
  soldInventory: number;
  pendingBookings: number;
  pendingFinancing: number;
  totalRevenue: number;
}

interface AdminDashboardProps {
  stats: DashboardStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  const cards = [
    { label: 'Total Inventory', value: stats.totalInventory, icon: Car },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar },
    { label: 'Pending Financing', value: stats.pendingFinancing, icon: CreditCard },
    { label: 'Revenue (Sold)', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Summary of inventory, bookings, and financing activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <card.icon size={22} />
              </div>
              <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-1" /> Live
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-5">Inventory Status</h3>
          <div className="space-y-4">
            <MetricBar
              label="Available"
              value={stats.availableInventory}
              total={Math.max(stats.totalInventory, 1)}
              color="bg-green-500"
            />
            <MetricBar
              label="Sold"
              value={stats.soldInventory}
              total={Math.max(stats.totalInventory, 1)}
              color="bg-blue-500"
            />
            <MetricBar
              label="Other"
              value={Math.max(stats.totalInventory - stats.availableInventory - stats.soldInventory, 0)}
              total={Math.max(stats.totalInventory, 1)}
              color="bg-orange-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-5">Quick Snapshot</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Available Vehicles</span>
              <span className="font-bold text-gray-900">{stats.availableInventory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Bookings</span>
              <span className="font-bold text-gray-900">{stats.pendingBookings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pending Financing</span>
              <span className="font-bold text-gray-900">{stats.pendingFinancing}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${Math.min((value / total) * 100, 100)}%` }}></div>
    </div>
  </div>
);

export default AdminDashboard;
