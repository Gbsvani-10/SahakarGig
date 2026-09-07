import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Menu, 
  X, 
  Globe, 
  Bell, 
  User, 
  LogOut, 
  LayoutDashboard,
  Zap
} from 'lucide-react';

export const Header: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { unreadNotificationCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const getPortalLink = () => {
    if (role === 'worker') return '/worker/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/customer/dashboard';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-emerald-800 transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-gray-900 tracking-tight">SahakarGig</span>
                  <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    NCCT
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 -mt-0.5 font-medium hidden sm:block">
                  Cooperative Gig Services Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <Link to="/services" className="hover:text-emerald-700 transition-colors">
              {t('nav.services', 'Services')}
            </Link>
            <Link to="/how-it-works" className="hover:text-emerald-700 transition-colors">
              {t('nav.howItWorks', 'How It Works')}
            </Link>
            <Link to="/about" className="hover:text-emerald-700 transition-colors">
              {t('nav.about', 'About')}
            </Link>
            <Link to="/contact" className="hover:text-emerald-700 transition-colors">
              {t('nav.contact', 'Contact')}
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-2.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-gray-500" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium ${language === 'en' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium ${language === 'hi' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => { setLanguage('te'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium ${language === 'te' ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    తెలుగు (Telugu)
                  </button>
                </div>
              )}
            </div>

            {/* Portal Action / User state */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getPortalLink()}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="capitalize">{role} Portal</span>
                </Link>

                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-gray-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-gray-700 hover:text-emerald-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-700"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-700"
          >
            Services Catalog
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-700"
          >
            How It Works
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-700"
          >
            About NCCT & Cooperatives
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-gray-700 hover:text-emerald-700"
          >
            Contact
          </Link>

          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link
              to={getPortalLink()}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-emerald-700 text-white py-2 rounded-lg text-sm font-semibold"
            >
              Open {role} Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
