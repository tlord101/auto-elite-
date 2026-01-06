
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useParams, Link } = ReactRouterDOM;
import { Vehicle } from '../types';
import VehicleCard from '../components/VehicleCard';

interface DetailsProps {
  vehicles: Vehicle[];
  incrementViews: (id: string) => void;
  wishlist: string[];
  toggleWishlist: (id: string) => void;
}

const Details: React.FC<DetailsProps> = ({ vehicles, incrementViews, wishlist, toggleWishlist }) => {
  const { id } = useParams();
  const vehicle = vehicles.find(v => v.id === id);
  const [activeImage, setActiveImage] = useState(0);

  // Financing State
  const [downPayment, setDownPayment] = useState(vehicle ? Math.round(vehicle.price * 0.2) : 0);
  const [term, setTerm] = useState(60);
  const [rate, setRate] = useState(4.5);
  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    if (id) incrementViews(id);
  }, [id]);

  useEffect(() => {
    if (vehicle) {
      const principal = vehicle.price - downPayment;
      const monthlyRate = rate / 100 / 12;
      const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
      setMonthly(isNaN(payment) ? 0 : payment);
    }
  }, [downPayment, term, rate, vehicle]);

  if (!vehicle) return <div className="py-40 text-center font-black uppercase">Asset Restricted or Not Found</div>;

  const similarCars = vehicles.filter(v => v.category === vehicle.category && v.id !== vehicle.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="lg:w-1/2 space-y-6">
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden bg-white shadow-2xl relative border-8 border-white">
            <img src={vehicle.images[activeImage]} className="w-full h-full object-cover" alt={vehicle.name} />
            <button 
                onClick={() => toggleWishlist(vehicle.id)}
                className={`absolute top-8 right-8 w-14 h-14 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    wishlist.includes(vehicle.id) ? 'bg-rose-500 text-white' : 'bg-white/50 text-slate-900 hover:bg-white'
                }`}
            >
                {wishlist.includes(vehicle.id) ? '♥' : '♡'}
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 px-2">
            {vehicle.images.map((img, idx) => (
              <button 
                key={idx} onClick={() => setActiveImage(idx)}
                className={`w-32 aspect-video rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 ${activeImage === idx ? 'border-indigo-600 scale-105 shadow-lg' : 'border-transparent opacity-60'}`}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Core Details */}
        <div className="lg:w-1/2 space-y-10">
          <div>
             <div className="flex items-center gap-3 mb-4">
               <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest">{vehicle.condition}</span>
               {vehicle.isVerified && <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Dealer Verified</span>}
             </div>
             <h1 className="text-5xl font-black text-slate-900 leading-none tracking-tighter mb-4">{vehicle.name}</h1>
             <p className="text-4xl font-black text-indigo-600 tracking-tighter">${vehicle.price.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-slate-100">
             {[
               { label: 'Transmission', value: vehicle.transmission },
               { label: 'Fuel Type', value: vehicle.fuelType },
               { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} mi` },
               { label: 'Location', value: vehicle.location }
             ].map((spec, i) => (
               <div key={i}>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{spec.label}</p>
                 <p className="font-bold text-slate-900">{spec.value}</p>
               </div>
             ))}
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Owner Perspective</h3>
            <p className="text-slate-600 leading-relaxed font-medium">{vehicle.description}</p>
          </div>

          {/* Quick Financing Add-on */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black uppercase">Investment Calculator</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Down Payment ($)</label>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">Interest Rate (%)</label>
                <input type="number" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-6 bg-slate-900 rounded-2xl text-white">
               <div>
                 <p className="text-[10px] font-black uppercase text-slate-400">Monthly Estimate</p>
                 <p className="text-3xl font-black">${Math.round(monthly).toLocaleString()}/mo</p>
               </div>
               <Link to="/financing" className="px-6 py-3 bg-white text-slate-900 text-xs font-black uppercase rounded-xl">Full App</Link>
            </div>
          </div>

          <div className="flex gap-4">
             <Link to={`/test-drive?id=${vehicle.id}`} className="flex-grow py-5 bg-indigo-600 text-white text-center font-black rounded-2xl uppercase tracking-widest text-sm shadow-xl shadow-indigo-600/20 active:scale-95">Book Test Drive</Link>
             <button className="px-8 py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-sm active:scale-95">Inquire</button>
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight">Similar Machines</h2>
            <Link to="/browse" className="text-xs font-black uppercase text-indigo-600 underline">View Full Inventory</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {similarCars.map(c => <VehicleCard key={c.id} vehicle={c} isSaved={wishlist.includes(c.id)} onToggleWishlist={() => toggleWishlist(c.id)} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Details;
