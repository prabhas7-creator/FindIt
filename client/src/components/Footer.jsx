import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Mail, ExternalLink } from 'lucide-react';
import { BRAND } from '../utils/constants';

export const Footer = () => {
  return (
    <footer className="bg-findit-navy text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-findit-teal p-0.5">
                <img
                  src="/logo.svg"
                  alt="FindIt Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                {BRAND.name}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              {BRAND.tagline} A centralized portal for reporting and recovering lost belongings across college campuses and local communities.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-findit-teal bg-findit-teal/10 px-3 py-1.5 rounded-full border border-findit-teal/20">
              <ShieldCheck className="w-4 h-4" />
              <span>Campus Community Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/items" className="hover:text-findit-teal transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/items/lost" className="hover:text-findit-teal transition-colors">
                  Lost Belongings
                </Link>
              </li>
              <li>
                <Link to="/items/found" className="hover:text-findit-teal transition-colors">
                  Found Items
                </Link>
              </li>
              <li>
                <Link to="/report/lost" className="hover:text-findit-teal transition-colors">
                  File a Lost Report
                </Link>
              </li>
              <li>
                <Link to="/report/found" className="hover:text-findit-teal transition-colors">
                  File a Found Report
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Item Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/items?category=Electronics" className="hover:text-findit-teal transition-colors">
                  Electronics & Gadgets
                </Link>
              </li>
              <li>
                <Link to="/items?category=Documents+and+ID+Cards" className="hover:text-findit-teal transition-colors">
                  Documents & ID Cards
                </Link>
              </li>
              <li>
                <Link to="/items?category=Wallets+and+Money" className="hover:text-findit-teal transition-colors">
                  Wallets & Purses
                </Link>
              </li>
              <li>
                <Link to="/items?category=Keys" className="hover:text-findit-teal transition-colors">
                  Keys & Keychains
                </Link>
              </li>
              <li>
                <Link to="/items?category=Bags+and+Backpacks" className="hover:text-findit-teal transition-colors">
                  Bags & Backpacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety & Academic Project Details */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Safety & Project
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Always arrange item handovers in well-lit public campus areas like the college security desk or library foyer.
            </p>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-1">
                College Mini Project
              </span>
              Built with React, Express, MongoDB Atlas & Tailwind CSS. Ready for GitHub and cloud hosting.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} FindIt — Lost & Found Portal. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for college campus safety & recovery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
