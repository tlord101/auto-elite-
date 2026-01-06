
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Vehicle } from '../types';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSaved?: boolean;
  onToggleWishlist?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSaved, onToggleWishlist }) => {
  const placeholderImage = 'https://images.unsplash.com/photo-1486497395400-7ecb21335ad3?q=80&w=800&auto=format&fit=crop';

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group flex flex-col h-full relative">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={vehicle.images[0] || placeholderImage} 
          alt={vehicle.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
           {vehicle.isFeatured && (
             <div className="bg-indigo-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
               Featured
             </div>
           )}
           <div className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
             {vehicle.condition}
           </div>
        </div>

        {onToggleWishlist && (
           <button 
             onClick={(e) => { e.preventDefault(); onToggleWishlist(); }}
             className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
               isSaved ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/50 backdrop-blur-md text-slate-900 hover:bg-white'
             }`}
           >
             {isSaved ? '♥' : '♡'}
           </button>
        )}
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <div className="mb-6">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{vehicle.brand}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{vehicle.name}</h3>
          <p className="text-2xl font-black text-slate-900 mt-3 tracking-tighter">${vehicle.price.toLocaleString()}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛣️</span> {vehicle.mileage.toLocaleString()} mi
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span> {vehicle.transmission}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⛽</span> {vehicle.fuelType}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📍</span> {vehicle.location}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 mt-auto flex gap-3">
          <Link 
            to={`/vehicle/${vehicle.id}`} 
            className="flex-grow text-center py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-indigo-600 transition-all text-xs uppercase tracking-widest shadow-lg shadow-slate-900/10"
          >
            Details
          </Link>
          <Link 
            to={`/test-drive?id=${vehicle.id}`} 
            className="px-6 py-4 bg-slate-50 text-slate-900 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
