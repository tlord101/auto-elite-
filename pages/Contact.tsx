
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
        <p className="text-slate-600">Have questions about a vehicle or our services? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
          <div className="text-4xl mb-4">📞</div>
          <h3 className="text-xl font-bold mb-2">Call Us</h3>
          <p className="text-slate-500 mb-4">Talk to our sales experts directly.</p>
          <p className="text-indigo-600 font-bold">+1 (234) 567-890</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="text-xl font-bold mb-2">Email Us</h3>
          <p className="text-slate-500 mb-4">We'll respond within 24 hours.</p>
          <p className="text-indigo-600 font-bold">hello@autoelite.com</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center">
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold mb-2">Visit Us</h3>
          <p className="text-slate-500 mb-4">Check our inventory in person.</p>
          <p className="text-indigo-600 font-bold">123 Auto Drive, Car City</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm flex flex-col md:flex-row">
        <div className="md:w-1/2 p-12 space-y-6">
          <h2 className="text-3xl font-bold">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 border rounded-xl" />
              <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border rounded-xl" />
            </div>
            <input type="text" placeholder="Subject" className="w-full p-4 bg-slate-50 border rounded-xl" />
            <textarea placeholder="Your Message" className="w-full p-4 bg-slate-50 border rounded-xl h-32"></textarea>
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Send Message
            </button>
          </form>
        </div>
        <div className="md:w-1/2 bg-slate-100 min-h-[400px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937611493!2d-73.98731968459391!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480293%3A0x51199441db569d39!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1652712345678!5m2!1sen!2sus" 
            className="w-full h-full grayscale opacity-80"
            style={{border: 0}}
            allowFullScreen={true}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
