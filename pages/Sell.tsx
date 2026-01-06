
import React, { useState } from 'react';
import { VehicleCondition } from '../types';

const Sell: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    year: '',
    brand: '',
    model: '',
    mileage: '',
    vin: '',
    askingPrice: '',
    condition: '',
    additionalInfo: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="text-5xl">✓</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Valuation Sent!</h1>
        <p className="text-lg text-slate-600 mb-10 font-medium">
          We've received your vehicle details. Our appraisers will analyze the data and contact you with a competitive offer within 24 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-10 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-emerald-200"
        >
          Submit Another Vehicle
        </button>
      </div>
    );
  }

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:font-medium";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block";

  return (
    <div className="space-y-0 pb-0">
      {/* Hero Section - Matching Video/Images */}
      <section className="bg-[#1a2e2a] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white text-4xl shadow-2xl">
            $
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Get Top Dollar <br/><span className="text-emerald-500">For Your Trade-In</span>
          </h1>
          <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Trading in your vehicle is easy! Get a fair, competitive offer and use it toward your next purchase.
          </p>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📈', title: 'Top Dollar Offers', desc: 'Get the best value for your trade-in based on real-time market data.' },
            { icon: '🕒', title: 'Quick Process', desc: 'Get an offer within 24 hours after submitting your details.' },
            { icon: '🛡️', title: 'No Obligation', desc: 'Free valuation with no commitment to sell or buy.' }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-emerald-100 transition-colors">{f.icon}</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valuation Form */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Get Your Free Valuation</h2>
            <p className="text-slate-500 font-medium">Provide your vehicle details and we'll send you a competitive offer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section: Your Information */}
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-100">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input 
                    type="text" required
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input 
                    type="email" required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input 
                  type="tel" required
                  placeholder="+1 (234) 567-890"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Section: Vehicle Details */}
            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-100">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Year *</label>
                  <input 
                    type="number" required
                    placeholder="2020"
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Make / Brand *</label>
                  <input 
                    type="text" required
                    placeholder="Toyota"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Model *</label>
                  <input 
                    type="text" required
                    placeholder="Camry"
                    value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mileage *</label>
                  <input 
                    type="number" required
                    placeholder="50000"
                    value={formData.mileage}
                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>VIN (Vehicle Identification Number)</label>
                  <input 
                    type="text"
                    placeholder="1HGCM82633A123456"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Your Asking Price (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number"
                      placeholder="25000"
                      value={formData.askingPrice}
                      onChange={(e) => setFormData({...formData, askingPrice: e.target.value})}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Vehicle Condition *</label>
                <select 
                  required
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="">Select condition</option>
                  <option value="Excellent">Excellent - Like new, no issues</option>
                  <option value="Good">Good - Minor wear, well maintained</option>
                  <option value="Fair">Fair - Some mechanical or cosmetic issues</option>
                  <option value="Poor">Poor - Significant issues, needs repair</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Additional Information</label>
                <textarea 
                  placeholder="Tell us about any modifications, service history, accidents, or special features..."
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  className={`${inputClass} h-32 resize-none`}
                />
              </div>
            </div>

            {/* Instruction Block: What Happens Next? */}
            <div className="bg-amber-50 rounded-3xl p-10 border border-amber-100 space-y-6">
              <h4 className="text-sm font-black text-amber-800 uppercase tracking-widest flex items-center gap-3">
                <span className="text-xl">💡</span> What Happens Next?
              </h4>
              <ul className="space-y-4">
                {[
                  'We\'ll review your vehicle details within 24 hours',
                  'You\'ll receive a competitive trade-in offer via email and phone',
                  'If you accept, we\'ll schedule an inspection and finalize the deal',
                  'Use your trade-in value toward your next vehicle purchase'
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 text-sm font-medium text-amber-900/70">
                    <span className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-amber-600 shadow-sm border border-amber-100">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <button 
                type="submit"
                className="w-full py-6 bg-emerald-600 text-white font-black rounded-[2rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20 active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                <span>📤</span> Submit for Valuation
              </button>
              <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest mt-6">
                By submitting this form, you agree to be contacted by our team with a trade-in offer.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Sell;
