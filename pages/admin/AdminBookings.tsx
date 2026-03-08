import React from 'react';
import { CheckCircle2, Mail, Phone, XCircle } from 'lucide-react';
import { Booking, Vehicle } from '../../types';

interface AdminBookingsProps {
  bookings: Booking[];
  vehicles: Vehicle[];
  onUpdateStatus: (id: string, status: Booking['status']) => Promise<void>;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ bookings, vehicles, onUpdateStatus }) => {
  const getVehicleName = (booking: Booking) => {
    if (booking.vehicleName) return booking.vehicleName;
    const match = vehicles.find((vehicle) => vehicle.id === booking.vehicleId);
    return match?.name || 'Unknown Vehicle';
  };

  const setStatus = async (id: string, status: Booking['status']) => {
    try {
      await onUpdateStatus(id, status);
    } catch (error) {
      console.error('Failed to update booking status', error);
      window.alert('Unable to update booking status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test Drive Bookings</h1>
        <p className="text-gray-500 mt-1">Manage customer appointments and booking statuses.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                      <div className="flex flex-col text-xs text-gray-500 mt-1 gap-1">
                        <span className="inline-flex items-center"><Mail size={12} className="mr-1" />{booking.email}</span>
                        <span className="inline-flex items-center"><Phone size={12} className="mr-1" />{booking.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{getVehicleName(booking)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p>{booking.date}</p>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          booking.status === 'approved'
                            ? 'bg-green-50 text-green-600'
                            : booking.status === 'rejected'
                              ? 'bg-red-50 text-red-600'
                              : booking.status === 'rescheduled'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStatus(booking.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          title="Approve"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          onClick={() => setStatus(booking.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Reject"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
