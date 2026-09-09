import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Briefcase, LogOut, Menu, X, ChevronDown, User, Sparkles } from 'lucide-react';
import type { User as UserType } from '../types.ts';

interface NavbarProps {
  currentUser: UserType | null;
  currentRole: string | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onNavigate,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'WORKER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Briefcase className="w-3.5 h-3.5" /> Worker
          </span>
        );
      case 'CUSTOMER':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <UserCheck className="w-3.5 h-3.5" /> Customer
          </span>
        );
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => onNavigate(currentUser ? `${currentUser.role.toLowerCase()}-dashboard` : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tight">SG</span>
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                SahakarGig
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  2026
                </span>
              </span>
              <p className="text-[11px] text-slate-500 hidden sm:block">Empowering workers, simplifying work life</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!currentUser ? (
              <>
                <button
                  id="nav-explore"
                  onClick={() => onNavigate('landing')}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Explore Platform
                </button>
                <button
                  id="nav-how-it-works"
                  onClick={() => {
                    onNavigate('landing');
                    setTimeout(() => {
                      document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  How It Works
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <button
                  id="nav-signin"
                  onClick={() => onNavigate('role-selection')}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Sign In
                </button>
                <button
                  id="nav-get-started"
                  onClick={() => onNavigate('role-selection')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-lg shadow-sm shadow-emerald-600/25 transition-all"
                >
                  Get Started
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {getRoleBadge(currentUser.role)}

                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-medium text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[140px] mt-0.5">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Sign out of SahakarGig"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg border border-slate-200 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden gap-2">
            {currentUser && getRoleBadge(currentUser.role)}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-3">
            {!currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate('landing');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-medium text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-50"
                >
                  Explore Platform
                </button>
                <button
                  onClick={() => {
                    onNavigate('role-selection');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left text-sm font-semibold text-emerald-700 py-2 px-3 rounded-lg bg-emerald-50"
                >
                  Get Started / Sign In
                </button>
              </>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">Role: {currentUser.role}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-rose-600 py-2 px-3 rounded-lg hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
