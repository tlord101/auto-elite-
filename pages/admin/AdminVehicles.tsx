import React from 'react';
import { Car, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Vehicle } from '../../types';
import { deleteVehicle } from '../../api/endpoints';

interface AdminVehiclesProps {
  vehicles: Vehicle[];
}

const AdminVehicles: React.FC<AdminVehiclesProps> = ({ vehicles }) => {
  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm('Delete this vehicle listing?');
    if (!shouldDelete) return;

    try {
      await deleteVehicle(id);
    } catch (error) {
      console.error('Failed to delete vehicle', error);
      window.alert('Unable to delete vehicle.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vehicle Inventory</h1>
        <p className="text-gray-500 mt-1">Imported AutoElite admin design connected to live inventory endpoint.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No vehicles found.</td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-gray-300">
                          {vehicle.images?.[0] ? (
                            <img src={vehicle.images[0]} alt={vehicle.name} className="w-full h-full object-cover" />
                          ) : (
                            <Car size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{vehicle.name}</p>
                          <p className="text-xs text-gray-500">{vehicle.year} {vehicle.brand} {vehicle.model}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          vehicle.status === 'available'
                            ? 'bg-green-50 text-green-600'
                            : vehicle.status === 'sold'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-orange-50 text-orange-600'
                        }`}
                      >
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">${vehicle.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      <span className="inline-flex items-center"><MapPin size={12} className="mr-1" />{vehicle.location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit coming soon"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete vehicle"
                        >
                          <Trash2 size={16} />
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

export default AdminVehicles;
