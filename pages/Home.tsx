
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { Vehicle } from '../types';
import { CATEGORIES } from '../constants';
import VehicleCard from '../components/VehicleCard';

interface HomeProps {
  vehicles: Vehicle[];
}

const Home: React.FC<HomeProps> = ({ vehicles }) => {
  const featuredVehicles = vehicles.filter(v => v.isFeatured || v.status === 'available').slice(0, 3);

  const getCategoryCount = (catId: string) => {
    return vehicles.filter(v => v.category === catId).length;
  };

  return (
    <div className="space-y-0 pb-0">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Automotive Hero" 
            className="w-full h-full object-cover brightness-[0.35] scale-105"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
          <div className="inline-block px-4 py-1.5 bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-[0.2em] mb-8">
            Welcome to the Elite Circle
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            DRIVE THE <br/><span className="text-indigo-500">EXCEPTIONAL</span>
          </h1>
          <p className="text-lg md:text-2xl mb-12 text-slate-300 max-w-2xl mx-auto font-medium">
            Curated premium inventory for the modern connoisseur. Experience unparalleled quality and service.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/browse" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all text-lg shadow-2xl shadow-indigo-600/20 active:scale-95">
              Explore Inventory
            </Link>
            <Link to="/financing" className="px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 text-white rounded-2xl font-bold transition-all text-lg active:scale-95">
              Financing Options
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Re-styled as per video */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link 
              to={`/browse?category=${cat.id}`}
              key={cat.id} 
              className="group relative overflow-hidden rounded-[2rem] aspect-[4/3] bg-slate-900 shadow-xl transition-all duration-500 block"
            >
              <img 
                src={cat.image} 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.4] group-hover:scale-110 transition-all duration-700" 
                alt={cat.name}
              />
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                 <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                   {cat.id === 'CAR' ? '🚗' : cat.id === 'BIKE' ? '🏍️' : cat.id === 'TRUCK' ? '🚚' : '🚌'}
                   {getCategoryCount(cat.id)} Available
                 </span>
              </div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white bg-gradient-to-t from-slate-900 via-transparent to-transparent">
                <h3 className="text-2xl font-black mb-1 uppercase tracking-tight">{cat.name}</h3>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special Offers Section - New as per video */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3">Special Offers</p>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Limited Time Deals</h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">Take advantage of our exclusive offers and promotions. Save big on your next vehicle purchase!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Zero Down Payment', icon: '💰', desc: 'Get approved with no down payment on select vehicles. Limited time offer!', footer: 'Valid until end of month' },
              { title: '0% APR Financing', icon: '📈', desc: 'Enjoy 0% APR for up to 36 months on new vehicles. Save thousands!', footer: 'On approved credit' },
              { title: 'Trade-In Bonus', icon: '🔄', desc: 'Get up to $3,000 extra on your trade-in value this month.', footer: 'Expires in 10 days' }
            ].map((offer, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-xl transition-shadow group">
                <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">{offer.icon}</div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">{offer.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-10 flex-grow">{offer.desc}</p>
                <div className="pt-6 border-t border-slate-100 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>🕒</span> {offer.footer}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
             <Link to="/browse" className="inline-flex items-center gap-4 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
               View All Vehicles <span>&rarr;</span>
             </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - New as per video */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3">Why AutoElite</p>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Why Choose Us</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">We're committed to providing the best car buying experience with transparency, quality, and exceptional service.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Quality Guaranteed', icon: '🛡️', desc: 'Every vehicle undergoes a rigorous 150-point inspection before listing.' },
            { title: 'Flexible Financing', icon: '💳', desc: 'Multiple payment plans to fit your budget with competitive interest rates.' },
            { title: 'Fast Delivery', icon: '🚚', desc: 'We can deliver your new vehicle directly to your doorstep within 48 hours.' },
            { title: 'Simple Paperwork', icon: '📄', desc: 'Streamlined purchasing process with minimal paperwork and no hidden fees.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-8 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex-shrink-0 flex items-center justify-center text-3xl border border-slate-100">{item.icon}</div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles - Updated existing section */}
      <section className="bg-slate-900 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3">Featured Inventory</p>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">The Showcase</h2>
            </div>
            <Link to="/browse" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 text-xs uppercase tracking-widest">
              View All Inventory &rarr;
            </Link>
          </div>
          {featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVehicles.map(vehicle => (
                <div key={vehicle.id} className="transform hover:-translate-y-2 transition-transform duration-500">
                  <VehicleCard vehicle={vehicle} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 rounded-[4rem] border border-white/10">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-white/20 text-4xl">🏁</div>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Showroom currently being refreshed</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section - New as per video */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-3">Testimonials</p>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">What Our Customers Say</h2>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">Don't just take our word for it. Here's what our satisfied customers have to say about their experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'John Anderson', loc: 'New York, NY', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', quote: 'Exceptional service from start to finish! The team helped me find the perfect SUV for my family.', car: '2023 BMW X5' },
            { name: 'Sarah Mitchell', loc: 'Los Angeles, CA', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', quote: 'I was impressed by the no-pressure sales approach and the quality of vehicles. Highly recommended!', car: '2024 Audi R8' },
            { name: 'Michael Chen', loc: 'Chicago, IL', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', quote: 'Best car buying experience ever! The entire process was hassle-free, and the staff went above and beyond.', car: '2022 Ford F-150' },
            { name: 'Emily Rodriguez', loc: 'Miami, FL', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', quote: 'Outstanding customer service! They made trading in my old car and upgrading to a new one incredibly easy.', car: '2023 Porsche 911' }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full group hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center gap-4 mb-6">
                <img src={t.img} className="w-12 h-12 rounded-full object-cover shadow-lg" />
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{t.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.loc}</p>
                </div>
                <div className="ml-auto text-slate-200 group-hover:text-indigo-100 transition-colors">
                  <span className="text-4xl leading-none font-serif">"</span>
                </div>
              </div>
              <div className="flex text-amber-400 text-xs mb-4">★★★★★</div>
              <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 flex-grow">"{t.quote}"</p>
              <div className="pt-6 border-t border-slate-50">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Purchased</p>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{t.car}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ready to Find Your Dream Vehicle Banner - New as per video */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-900 rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter uppercase">Ready to Find <br/>Your Dream Vehicle?</h2>
            <p className="text-lg md:text-xl text-slate-400 mb-12 font-medium max-w-2xl mx-auto">Browse our inventory or get in touch with our sales team today. We're here to help you every step of the way.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <Link to="/browse" className="group px-10 py-5 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-tight text-lg shadow-xl flex items-center gap-3">
                Browse Inventory <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/contact" className="px-10 py-5 bg-indigo-600/10 hover:bg-indigo-600/20 text-white font-black rounded-2xl transition-all uppercase tracking-tight text-lg border border-white/10 flex items-center gap-3">
                <span className="text-xl">📞</span> Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
