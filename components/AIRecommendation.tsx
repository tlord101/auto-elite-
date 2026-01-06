
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Vehicle } from '../types';

interface AIRecommendationProps {
  vehicles: Vehicle[];
}

const AIRecommendation: React.FC<AIRecommendationProps> = ({ vehicles }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ budget: '', lifestyle: '', usage: '' });
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRecommendation = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inventory = vehicles.map(v => `${v.id}: ${v.name} ($${v.price})`).join(', ');
      
      const prompt = `Based on these vehicles: ${inventory || 'Empty'}.
      User has budget: ${answers.budget}, lifestyle: ${answers.lifestyle}, and usage: ${answers.usage}.
      Recommend one specific vehicle from our list if possible, or describe the perfect type for them.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setRecommendation(response.text || 'No matches found.');
    } catch (e) {
      setRecommendation("I encountered an issue processing your request.");
    } finally {
      setIsLoading(false);
      setStep(4);
    }
  };

  return (
    <div className="bg-indigo-600 rounded-[3rem] p-12 text-white overflow-hidden relative">
      <div className="relative z-10 max-w-lg">
        {step === 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase">Find Your Perfect Match</h2>
            <p className="text-indigo-100 font-medium">Let our AI analyze your lifestyle and recommend the ideal vehicle.</p>
            <button onClick={() => setStep(1)} className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-slate-50">Start Analysis</button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-black uppercase">Your Budget Range?</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Under $50k', '$50k - $150k', '$150k+', 'No Limit'].map(b => (
                <button key={b} onClick={() => { setAnswers({...answers, budget: b}); setStep(2); }} className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 text-xs font-black uppercase">{b}</button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-black uppercase">Your Lifestyle?</h3>
            <div className="grid grid-cols-2 gap-3">
              {['Adventure', 'Business', 'Family', 'Track/Sport'].map(l => (
                <button key={l} onClick={() => { setAnswers({...answers, lifestyle: l}); setStep(3); }} className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 text-xs font-black uppercase">{l}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h3 className="text-xl font-black uppercase">Primary Usage?</h3>
            <div className="grid grid-cols-2 gap-3">
              {['City Commute', 'Off-Road', 'Weekend Joy', 'Long Haul'].map(u => (
                <button key={u} onClick={() => { setAnswers({...answers, usage: u}); getRecommendation(); }} className="p-4 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 text-xs font-black uppercase">{u}</button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <h3 className="text-xl font-black uppercase">Our Recommendation</h3>
             {isLoading ? <div className="animate-pulse h-20 bg-white/10 rounded-2xl"></div> : (
               <div className="p-6 bg-white/10 border border-white/20 rounded-2xl italic text-sm leading-relaxed">
                 "{recommendation}"
               </div>
             )}
             <button onClick={() => setStep(0)} className="text-indigo-100 underline text-xs font-black uppercase">Restart Quiz</button>
          </div>
        )}
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
    </div>
  );
};

export default AIRecommendation;
