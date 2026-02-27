
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { useSearchParams, Link } = ReactRouterDOM;
import { Vehicle } from '../types';
import { submitBookingRequest } from '../api/endpoints';

interface TestDriveProps {
  vehicles: Vehicle[];
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  driversLicense?: string;
  vehicleId?: string;
  date?: string;
  time?: string;
  location?: string;
}

const TestDrive: React.FC<TestDriveProps> = ({ vehicles }) => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [formData, setFormData] = useState({
    vehicleId: initialId,
    fullName: '',
    email: '',
    phone: '',
    driversLicense: '',
    date: '',
    time: '',
    location: 'Main Showroom',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (formData.fullName.trim().length < 2) newErrors.fullName = "Full name must be at least 2 characters.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address.";
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) newErrors.phone = "Phone number must be at least 10 digits.";
    if (formData.driversLicense.trim().length < 5) newErrors.driversLicense = "Invalid driver's license format.";
    if (!formData.vehicleId) newErrors.vehicleId = "Please select a vehicle.";
    if (!formData.date) {
      newErrors.date = "Please select a date.";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.date = "Appointment date cannot be in the past.";
    }
    if (!formData.time) newErrors.time = "Please select a time slot.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitError('');
      try {
        const vehicle = vehicles.find((v) => v.id === formData.vehicleId);
        await submitBookingRequest({
          vehicleId: formData.vehicleId,
          vehicleName: vehicle?.name || '',
          customerName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          driversLicense: formData.driversLicense,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          notes: formData.notes,
        });
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Failed to submit booking', error);
        setSubmitError('Unable to submit your request right now. Please try again.');
      }
    }
  };

  const inputClass = (error?: string) => `
    w-full p-5 bg-slate-50 border rounded-2xl text-sm font-bold outline-none transition-all placeholder:font-medium
    ${error ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/30' : 'border-slate-100 focus:ring-indigo-500'}
  `;

  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block";

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-32 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="text-5xl">✓</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Request Received!</h1>
        <p className="text-lg text-slate-600 mb-10 font-medium">
          Thank you for choosing AutoElite. One of our experts will contact you within 24 hours to confirm your appointment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => setSubmitted(false)}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs shadow-lg shadow-indigo-200"
          >
            Book Another
          </button>
          <Link 
            to="/browse"
            className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs shadow-lg shadow-slate-200"
          >
            Return to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="bg-[#111827] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white text-4xl shadow-2xl">
            🚗
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            Experience The <br/><span className="text-indigo-500">Elite Performance</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Feel the raw power and precision firsthand. Schedule your private test drive session with our automotive experts.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🛣️', title: 'Curated Routes', desc: 'Experience the vehicle on specifically chosen urban and highway paths.' },
            { icon: '👨‍🔧', title: 'Product Specialists', desc: 'Our experts will walk you through every technical detail and feature.' },
            { icon: '🛡️', title: 'Full Coverage', desc: 'Peace of mind with comprehensive insurance coverage for every session.' }
          ].map((f, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-indigo-50 transition-colors">{f.icon}</div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Booking Content */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-12 bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 shadow-sm h-fit">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">Book Your Session</h2>
              <p className="text-slate-500 font-medium">Select your preferred vehicle and time slot</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-12">
              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-100">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClass}>Full Name *</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className={inputClass(errors.fullName)}
                    />
                    {errors.fullName && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Email Address *</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={inputClass(errors.email)}
                    />
                    {errors.email && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClass}>Phone Number *</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (234) 567-890"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Driver's License *</label>
                    <input 
                      type="text" 
                      placeholder="DL1234567"
                      value={formData.driversLicense}
                      onChange={(e) => setFormData({...formData, driversLicense: e.target.value})}
                      className={inputClass(errors.driversLicense)}
                    />
                    {errors.driversLicense && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.driversLicense}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-4 border-b border-slate-100">Session Details</h3>
                <div className="space-y-2">
                  <label className={labelClass}>Select Machine *</label>
                  <select 
                    value={formData.vehicleId}
                    onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                    className={inputClass(errors.vehicleId) + " appearance-none cursor-pointer"}
                  >
                    <option value="">Choose a vehicle from inventory</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                  {errors.vehicleId && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.vehicleId}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className={labelClass}>Preferred Date *</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className={inputClass(errors.date)}
                    />
                    {errors.date && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.date}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className={labelClass}>Preferred Time *</label>
                    <select 
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className={inputClass(errors.time) + " appearance-none cursor-pointer"}
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                    {errors.time && <p className="text-rose-500 text-[10px] font-black uppercase ml-2 mt-1">{errors.time}</p>}
                  </div>
                </div>

                <div>

                {submitError && (
                  <div className="text-rose-600 text-sm font-bold text-center">
                    {submitError}
                  </div>
                )}
                  <label className={labelClass}>Showroom Location *</label>
                  <select 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className={inputClass() + " appearance-none cursor-pointer"}
                  >
                    <option value="Main Showroom">Main Showroom (Downtown)</option>
                    <option value="North Elite Hub">North Elite Hub (Uptown)</option>
                    <option value="Beachside Experience Center">Beachside Experience Center</option>
                  </select>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  className="w-full py-6 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 active:scale-[0.98] uppercase tracking-widest text-sm flex items-center justify-center gap-3"
                >
                  <span>📅</span> Confirm My Test Drive
                </button>
                <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest mt-6">
                  Subject to vehicle availability and license verification.
                </p>
              </div>
            </form>
          </div>

          {/* Checklist Sidebar - Visually Separated */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-amber-50 rounded-[3rem] p-10 border border-amber-200 shadow-sm sticky top-24">
              <h4 className="text-lg font-black text-amber-900 uppercase tracking-tighter flex items-center gap-3 mb-8">
                <span className="text-2xl">💡</span> What Happens Next?
              </h4>
              <ul className="space-y-8">
                {[
                  { title: 'Concierge Review', text: 'Our team reviews your appointment request and confirms vehicle availability.' },
                  { title: 'Slot Confirmation', text: 'You will receive an email and call within 24 hours to finalize your session.' },
                  { title: 'Appointment Day', text: 'Arrive 15 minutes early at your selected showroom with your documents.' },
                  { title: 'Elite Experience', text: 'Enjoy a 45-minute private drive with a dedicated product specialist.' }
                ].map((step, i) => (
                  <li key={i} className="flex gap-5">
                    <span className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-amber-600 shadow-sm border border-amber-100">{i + 1}</span>
                    <div>
                      <h5 className="text-xs font-black text-amber-900 uppercase tracking-tight mb-1">{step.title}</h5>
                      <p className="text-xs font-medium text-amber-800/70 leading-relaxed">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-12 pt-10 border-t border-amber-200/50">
                <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em] mb-4">Mandatory Checklist</h4>
                <ul className="space-y-4">
                  {[
                    'Valid Driver\'s License',
                    'Proof of Insurance',
                    'Confirmation Email'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-black text-amber-900/60 uppercase">
                      <span className="text-amber-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default TestDrive;
