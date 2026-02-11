
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseClient';

interface FinancePlan {
  months: number;
  apr: number;
  label?: string;
  isPopular?: boolean;
}

const Financing: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(7000);
  const [selectedTerm, setSelectedTerm] = useState(36);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');

  const plans: FinancePlan[] = [
    { months: 36, apr: 7.9, label: 'Popular', isPopular: true },
    { months: 48, apr: 9.9 },
    { months: 60, apr: 11.9 },
    { months: 72, apr: 13.9, label: 'Lowest Monthly' }
  ];

  const calculateMonthly = (price: number, down: number, term: number, apr: number) => {
    const principal = price - down;
    const monthlyRate = apr / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
    return isNaN(payment) ? 0 : payment;
  };

  const activePlan = plans.find(p => p.months === selectedTerm) || plans[0];
  const monthlyPayment = calculateMonthly(vehiclePrice, downPayment, activePlan.months, activePlan.apr);
  const loanAmount = vehiclePrice - downPayment;

  const inputClass = "w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-black outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:font-medium";
  const labelClass = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block";

  const handleFinancingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('');

    try {
      await addDoc(collection(db, 'financingRequests'), {
        customerName,
        email: customerEmail,
        loanAmount,
        downPayment,
        term: activePlan.months,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitStatus('Request submitted. Our team will follow up shortly.');
      setCustomerName('');
      setCustomerEmail('');
    } catch (error) {
      console.error('Failed to submit financing request', error);
      setSubmitStatus('Unable to submit request right now. Please try again.');
    }
  };

  return (
    <div className="space-y-0 pb-0">
      {/* Hero Section */}
      <section className="py-24 text-center max-w-4xl mx-auto px-4">
        <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-6">
          Flexible Financing Options
        </h1>
        <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
          Calculate your monthly payments with our easy-to-use installment calculator. Choose a plan that fits your budget.
        </p>
      </section>

      {/* Main Calculator Card */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="bg-white p-10 md:p-16 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-16">
          <div className="flex items-center gap-4 text-slate-900">
            <span className="text-2xl">📄</span>
            <h2 className="text-xl font-black uppercase tracking-tight">Payment Calculator</h2>
          </div>

          <div className="space-y-12">
            {/* Price Input */}
            <div>
              <label className={labelClass}>Vehicle Price</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                <input 
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(Number(e.target.value))}
                  className={`${inputClass} pl-12`}
                />
              </div>
            </div>

            {/* Down Payment Slider Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <label className={labelClass}>Down Payment</label>
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  {Math.round((downPayment / vehiclePrice) * 100)}%
                </span>
              </div>
              <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                 <input 
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className={`${inputClass} pl-12`}
                />
              </div>
              <input 
                type="range"
                min="0"
                max={vehiclePrice}
                step="100"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Selected Summary */}
            <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-slate-100 gap-8">
              <div>
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">Loan Amount</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">${loanAmount.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100 flex-grow max-w-md w-full">
                 <div className="flex items-center gap-3 mb-3">
                   <span className="text-slate-400">ⓘ</span>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Plan</p>
                 </div>
                 <div className="flex items-end gap-2">
                   <p className="text-4xl font-black text-slate-900">${Math.round(monthlyPayment).toLocaleString()}<span className="text-sm text-slate-400 font-bold ml-1">/month</span></p>
                 </div>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-3">
                   {activePlan.months} months at {activePlan.apr}% APR
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Selection Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const planMonthly = calculateMonthly(vehiclePrice, downPayment, plan.months, plan.apr);
            const totalPayment = planMonthly * plan.months;
            const totalInterest = totalPayment - loanAmount;
            const isSelected = selectedTerm === plan.months;

            return (
              <button 
                key={plan.months}
                onClick={() => setSelectedTerm(plan.months)}
                className={`relative p-8 rounded-[2.5rem] border transition-all duration-300 text-left flex flex-col h-full group ${
                  isSelected 
                    ? 'bg-white border-indigo-600 shadow-2xl ring-4 ring-indigo-50 shadow-indigo-600/10' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {plan.label && (
                  <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    plan.isPopular ? 'bg-indigo-600 text-white' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {plan.label}
                    {plan.isPopular && <span className="ml-1 text-[10px]">✓</span>}
                  </span>
                )}
                
                <div className="mb-8">
                  <p className="text-4xl font-black text-slate-900 mb-1">{plan.months}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">months</p>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Payment</p>
                    <p className="text-lg font-black text-slate-900">${Math.round(planMonthly).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest Rate</p>
                    <p className="text-lg font-black text-slate-900">{plan.apr}% APR</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span>Total Interest</span>
                     <span>${Math.round(totalInterest).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span>Total Payment</span>
                     <span>${Math.round(totalPayment).toLocaleString()}</span>
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Benefits / Next Steps */}
      <section className="bg-indigo-50/50 py-24 border-y border-indigo-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
             {[
               "Quick approval process - get pre-approved in minutes",
               "Flexible down payment options starting from 10%",
               "No hidden fees - transparent pricing always",
               "Early payoff available with no penalties"
             ].map((text, i) => (
               <div key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-white border border-indigo-100 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <span className="text-indigo-600 text-[10px] font-black">✓</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{text}</p>
               </div>
             ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link to="/browse" className="group px-10 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-tight text-xs shadow-xl shadow-slate-900/10 flex items-center gap-3">
               Browse Vehicles <span className="group-hover:translate-x-1 transition-transform">→</span>
             </Link>
             <Link to="/contact" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-tight text-xs">
               Contact for Custom Plans
             </Link>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-white p-10 md:p-14 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Request Pre-Approval</h2>
            <p className="text-slate-500 font-medium">Send your details to start the financing process.</p>
          </div>

          <form onSubmit={handleFinancingRequest} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {submitStatus && (
              <div className={`text-sm font-bold text-center ${submitStatus.includes('submitted') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {submitStatus}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-indigo-200"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Financing;
