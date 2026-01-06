import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM;

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-white text-2xl font-bold mb-4">AutoElite</h2>
            <p className="text-sm leading-relaxed">
              Your trusted destination for premium automobiles. We offer quality vehicles with transparent pricing and flexible payment options.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-white"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/browse" className="hover:text-white">Available Vehicles</Link></li>
              <li><Link to="/test-drive" className="hover:text-white">Test Drive</Link></li>
              <li><Link to="/sell" className="hover:text-white">Trade-In</Link></li>
              <li><Link to="/financing" className="hover:text-white">Financing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/test-drive" className="hover:text-white">Schedule Test Drive</Link></li>
              <li><Link to="/sell" className="hover:text-white">Value Your Trade-In</Link></li>
              <li><Link to="/financing" className="hover:text-white">Financing Calculator</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <span className="mr-3">📍</span>
                <span>123 Auto Drive, Car City, ST 12345</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">📞</span>
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3">✉️</span>
                <span>sales@autoelite.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2024 AutoElite. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;