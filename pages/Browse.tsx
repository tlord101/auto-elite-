
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams } = ReactRouterDOM;
import { Vehicle, VehicleCategory } from '../types';
import VehicleCard from '../components/VehicleCard';

interface BrowseProps {
  vehicles: Vehicle[];
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const Browse: React.FC<BrowseProps> = ({ vehicles, wishlist, toggleWishlist }) => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') as VehicleCategory || 'ALL';

  const [filter, setFilter] = useState({
    category: initialCategory,
    brand: 'ALL',
    priceRange: 'ALL',
    condition: 'ALL',
    transmission: 'ALL',
    location: 'ALL'
  });

  const brands = Array.from(new Set(vehicles.map(v => v.brand))).sort();
  const locations = Array.from(new Set(vehicles.map(v => v.location))).sort();

  const filteredVehicles = vehicles.filter(v => {
    const categoryMatch = filter.category === 'ALL' || v.category === filter.category;
    const brandMatch = filter.brand === 'ALL' || v.brand === filter.brand;
    const conditionMatch = filter.condition === 'ALL' || v.condition === filter.condition;
    const transMatch = filter.transmission === 'ALL' || v.transmission === filter.transmission;
    const locMatch = filter.location === 'ALL' || v.location === filter.location;
    
    let priceMatch = true;
    if (filter.priceRange !== 'ALL') {
      const [min, max] = filter.priceRange.split('-').map(Number);
      priceMatch = max ? (v.price >= min && v.price <= max) : v.price >= min;
    }

    return categoryMatch && brandMatch && conditionMatch && priceMatch && transMatch && locMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">Inventory Showroom</h1>
          <p className="text-slate-500 font-medium">Displaying {filteredVehicles.length} precision-engineered assets</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-24 z-20 space-y-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Category</label>
              <select 
                value={filter.category}
                onChange={(e) => setFilter({...filter, category: e.target.value as any})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                <option value={VehicleCategory.CAR}>Luxury Cars</option>
                <option value={VehicleCategory.BIKE}>Performance Bikes</option>
                <option value={VehicleCategory.TRUCK}>Elite Trucks</option>
                <option value={VehicleCategory.BUS}>Mass Transit</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Transmission</label>
              <select 
                value={filter.transmission}
                onChange={(e) => setFilter({...filter, transmission: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Auto">Semi-Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Location</label>
              <select 
                value={filter.location}
                onChange={(e) => setFilter({...filter, location: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Global Locations</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Investment Range</label>
              <select 
                value={filter.priceRange}
                onChange={(e) => setFilter({...filter, priceRange: e.target.value})}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">Any Budget</option>
                <option value="0-50000">Under $50k</option>
                <option value="50000-150000">$50k - $150k</option>
                <option value="150000-500000">$150k - $500k</option>
                <option value="500000-99999999">Over $500k</option>
              </select>
            </div>

            <button 
              onClick={() => setFilter({category: 'ALL', brand: 'ALL', priceRange: 'ALL', condition: 'ALL', transmission: 'ALL', location: 'ALL'})}
              className="w-full py-4 text-[10px] font-black text-slate-400 border border-slate-100 rounded-2xl hover:bg-slate-50 uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="flex-grow">
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredVehicles.map(v => (
                <VehicleCard 
                    key={v.id} 
                    vehicle={v} 
                    isSaved={wishlist.includes(v.id)} 
                    onToggleWishlist={() => toggleWishlist(v.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <span className="text-5xl block mb-8">🏁</span>
              <h3 className="text-3xl font-black uppercase mb-3">No Units Found</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">Try adjusting your filters to discover other elite assets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;
