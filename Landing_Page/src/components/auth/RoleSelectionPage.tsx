import React from 'react';
import { Briefcase, UserCheck, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

interface RoleSelectionPageProps {
  onSelectRole: (role: 'WORKER' | 'CUSTOMER' | 'ADMIN') => void;
  onBack: () => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole, onBack }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl w-full text-center">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            Digital Cooperative Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome to SahakarGig
          </h1>
          <p className="text-base sm:text-lg text-slate-600 mt-2">
            Choose how you want to continue
          </p>
        </div>

        {/* 3 Modern Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* WORKER CARD */}
          <div
            id="role-card-worker"
            onClick={() => onSelectRole('WORKER')}
            className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-500 p-7 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white text-emerald-700 flex items-center justify-center mb-6 transition-all">
                <Briefcase className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">WORKER</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Manage your work, skills, earnings and benefits.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Continue as Worker</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* CUSTOMER CARD */}
          <div
            id="role-card-customer"
            onClick={() => onSelectRole('CUSTOMER')}
            className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-sky-500 p-7 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-sky-50 group-hover:bg-sky-600 group-hover:text-white text-sky-700 flex items-center justify-center mb-6 transition-all">
                <UserCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">CUSTOMER</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Find trusted workers and manage your service requests.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-sky-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Continue as Customer</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* ADMIN CARD */}
          <div
            id="role-card-admin"
            onClick={() => onSelectRole('ADMIN')}
            className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-500 p-7 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-700 flex items-center justify-center mb-6 transition-all">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900">ADMIN</h2>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" /> Auth Only
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Monitor and manage the SahakarGig ecosystem.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-semibold text-sm group-hover:translate-x-1 transition-transform">
              <span>Admin Portal Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="mt-8">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
          >
            ← Return to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
