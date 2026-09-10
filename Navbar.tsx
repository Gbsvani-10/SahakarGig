import React from 'react';
import { 
  Compass, 
  AlertCircle, 
  ShieldCheck, 
  Languages, 
  MapPin, 
  Menu, 
  X,
  User,
  Wrench
} from 'lucide-react';
import { AppLanguage, ViewMode } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  currentLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  viewMode: ViewMode;
  onViewModeToggle: (mode: ViewMode) => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  viewMode,
  onViewModeToggle,
  onOpenEmergency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const t = TRANSLATIONS[currentLanguage];

  const languages: { code: AppLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-100 shadow-xs">
      {/* Top Cooperative Gov Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-indigo-950 text-purple-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded font-mono font-medium text-[11px] border border-purple-700/50">
              SIH Problem #26089
            </span>
            <span className="hidden sm:inline text-purple-200/90 font-medium">
              National Cooperative Gig Services Federation • Ministry of Cooperation
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-purple-200">
            <span className="hidden md:inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Certified Cooperative Workers
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Geo-Spatial Grid Live
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20 font-bold text-xl border border-purple-400/30">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                  SahakarGig
                </span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider border border-purple-200">
                  Geo-Spatial
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none hidden sm:block">
                Cooperative Household & Community Gig Services
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a href="#home" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors">
              Home
            </a>
            <a href="#services" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors">
              Services
            </a>
            <a href="#find-workers" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors">
              Find Workers
            </a>
            <a href="#bookings" className="px-3 py-1.5 rounded-lg hover:text-purple-700 hover:bg-purple-50 transition-colors">
              Bookings
            </a>
            <a 
              href="#map" 
              className="px-3 py-1.5 rounded-lg bg-purple-700 text-white font-semibold shadow-xs shadow-purple-700/20 flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              Map
            </a>
          </nav>

          {/* Right Actions: Language + Role View Selector + Emergency button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium border border-slate-200 cursor-pointer">
                <Languages className="w-3.5 h-3.5 text-purple-700" />
                <span className="font-semibold">{languages.find(l => l.code === currentLanguage)?.native}</span>
              </div>
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-purple-100 py-1 hidden group-hover:block z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      currentLanguage === lang.code ? 'text-purple-700 font-bold bg-purple-50/70' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[11px] text-slate-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Role View Selector (Customer | Worker | Admin) placed directly beside Emergency */}
            <div className="flex items-center bg-purple-100/70 p-1 rounded-xl border border-purple-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeToggle('customer')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'customer'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-purple-900 hover:bg-purple-200/60'
                }`}
                title="View page as Citizen/Customer searching for services"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customer</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeToggle('worker')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'worker'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-purple-900 hover:bg-purple-200/60'
                }`}
                title="View page as Cooperative Gig Worker receiving requests"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Worker</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeToggle('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'admin'
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-purple-900 hover:bg-purple-200/60'
                }`}
                title="View page as Federation/Society Admin managing dispatch & territory"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>

            {/* Emergency Service Quick Action Button (Kept right beside Role Selector) */}
            <button
              onClick={onOpenEmergency}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm shadow-rose-600/30 flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <AlertCircle className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Emergency SOS</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-purple-800 hover:bg-purple-50"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-purple-100 space-y-2">
            {/* Mobile Role Switcher */}
            <div className="p-2.5 bg-purple-50 rounded-xl space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                Switch Perspective
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => {
                    onViewModeToggle('customer');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 ${
                    viewMode === 'customer' ? 'bg-purple-900 text-white' : 'bg-white text-purple-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </button>
                <button
                  onClick={() => {
                    onViewModeToggle('worker');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 ${
                    viewMode === 'worker' ? 'bg-purple-900 text-white' : 'bg-white text-purple-900'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Worker</span>
                </button>
                <button
                  onClick={() => {
                    onViewModeToggle('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1 ${
                    viewMode === 'admin' ? 'bg-purple-900 text-white' : 'bg-white text-purple-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            <a href="#home" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-purple-50">
              Home
            </a>
            <a href="#services" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-purple-50">
              Services
            </a>
            <a href="#find-workers" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-purple-50">
              Find Workers
            </a>
            <a href="#bookings" className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-purple-50">
              Bookings
            </a>
            <a href="#map" className="block px-3 py-2 rounded-md text-sm font-semibold text-purple-800 bg-purple-100">
              Map (Geo-Spatial Matching)
            </a>
            <button
              onClick={() => {
                onOpenEmergency();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-500" />
              Request Emergency Worker
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
