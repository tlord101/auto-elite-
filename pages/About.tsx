import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;

const About: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Headquarters" 
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-3xl">
            <span className="text-indigo-500 font-black uppercase tracking-[0.3em] text-sm mb-4 block">Our Heritage</span>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
              Redefining the <br/><span className="text-indigo-600">Automotive Standard</span>
            </h1>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">The AutoElite Philosophy</h2>
            <p className="text-xl text-slate-500 leading-relaxed">
              Founded in 2008, AutoElite began with a simple yet ambitious goal: to strip away the complexities and frustrations of high-end vehicle acquisition. We believe that buying a premium machine should be as exhilarating as driving one.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <p className="text-4xl font-black text-indigo-600">15+</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Years of Excellence</p>
              </div>
              <div>
                <p className="text-4xl font-black text-indigo-600">12k+</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Global Deliveries</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200" 
              className="rounded-[3rem] shadow-2xl z-10 relative" 
              alt="Curation Process" 
            />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-indigo-600 rounded-[3rem] -z-10 opacity-20 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-white uppercase tracking-widest">Our Core Values</h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto mt-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Radical Transparency', desc: 'No hidden fees. No misleading descriptions. Every vehicle history is open-source and verified.', icon: '🛡️' },
              { title: 'Technical Mastery', desc: 'Our master technicians undergo 500+ hours of annual training to maintain the highest inspection standards.', icon: '⚙️' },
              { title: 'Bespoke Experience', desc: 'From custom financing to white-glove doorstep delivery, every journey is tailored to you.', icon: '💎' }
            ].map((v, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{v.icon}</div>
                <h3 className="text-xl font-black text-white uppercase mb-4 tracking-tight">{v.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-2 block">The Experts</span>
            <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">The Master Minds</h2>
          </div>
          <p className="max-w-md text-slate-500 font-medium">Meet the curators and engineers who ensure every vehicle in our showroom is nothing short of perfection.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Julian Vance', role: 'Chief Curator', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
            { name: 'Sarah Lennox', role: 'Head of Engineering', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
            { name: 'Marcus Thorne', role: 'Finance Director', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
            { name: 'Elena Rossi', role: 'Client Relations', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' }
          ].map((member, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-6 shadow-xl">
                <img src={member.img} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" alt={member.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{member.name}</h4>
              <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-indigo-600 rounded-[3rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">READY TO JOIN THE ELITE?</h2>
            <p className="text-xl text-indigo-100 mb-12 font-medium">Whether you're looking for your next masterpiece or just have a question, we are at your service.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/browse" className="px-10 py-5 bg-white text-indigo-600 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-tight text-lg shadow-xl shadow-indigo-900/10">
                Explore Inventory
              </Link>
              <Link to="/contact" className="px-10 py-5 bg-indigo-700 text-white font-black rounded-2xl hover:bg-indigo-800 transition-all uppercase tracking-tight text-lg border border-white/20">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;