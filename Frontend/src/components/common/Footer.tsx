import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, HeartHandshake, PhoneCall, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Brand & Affiliation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">SahakarGig</span>
                <span className="ml-2 text-[10px] uppercase font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded">
                  Cooperative Platform
                </span>
                <p className="text-xs text-slate-400">
                  Labour Cooperative Societies & Federations Platform
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              A national cooperative digital marketplace directly linking verified skilled workers from Labour Cooperative Societies & Federations with households, gated communities, and institutions.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Cooperative Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-teal-400" />
                <span>Zero Corporate Exploitation</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">For Households</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">
                  All Service Categories
                </Link>
              </li>
              <li>
                <Link to="/customer/emergency" className="hover:text-emerald-400 transition-colors text-amber-300 font-medium">
                  🚨 Request Emergency Service
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">
                  Standard Booking Guide
                </Link>
              </li>
              <li>
                <Link to="/customer/bookings" className="hover:text-emerald-400 transition-colors">
                  Track Existing Booking
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  Cooperative Price Assurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Workers & Cooperatives */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">For Workers & Societies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Join as Skilled Artisan
                </Link>
              </li>
              <li>
                <Link to="/worker/welfare" className="hover:text-emerald-400 transition-colors">
                  Shramik Suraksha Insurance
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
                  Labour Federation Portal
                </Link>
              </li>
              <li>
                <Link to="/worker/skills" className="hover:text-emerald-400 transition-colors">
                  Skill Certification
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Cooperative Society Affiliation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Nodal Office */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Cooperative Helpline</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Toll Free: 1800-11-SAHAKAR</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>support@sahakargig.com</span>
              </li>
              <li className="text-[11px] text-slate-400 leading-normal pt-1">
                Cooperative HQ: Siri Institutional Area, August Kranti Marg, New Delhi 110016
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 SahakarGig. Cooperative-Owned Digital Marketplace Platform.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300">Cooperative Bylaws</Link>
            <Link to="/about" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-slate-300">Grievance Officer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
