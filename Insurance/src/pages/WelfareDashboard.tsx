import React from 'react';
import { WorkerProfile } from '../types';
import {
  Shield,
  Wallet,
  Calendar,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

interface WelfareDashboardProps {
  worker: WorkerProfile;
  onNavigateToInsurance: () => void;
  onOpenClaimModal: () => void;
}

export const WelfareDashboard: React.FC<WelfareDashboardProps> = ({
  worker,
  onNavigateToInsurance,
  onOpenClaimModal,
}) => {
  const hasEarnings = worker.dailyEarnings !== null && worker.dailyEarnings !== undefined;
  const workingDays = worker.estimatedWorkingDays || 26;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Worker Greeting Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl border border-amber-200">
            {worker.name ? worker.name.slice(0, 2).toUpperCase() : 'SG'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {worker.badge || 'SahakarGig Partner'}
              </span>
              <span className="text-xs text-stone-500 font-mono">ID: {worker.workerId || 'Pending'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              Namaste, {worker.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {worker.occupation || 'Gig Worker'} • {worker.location || 'Location Not Set'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          <div className="text-left sm:text-right">
            <div className="text-xs text-stone-500 font-medium">Daily Wage Baseline</div>
            {hasEarnings ? (
              <>
                <div className="text-xl sm:text-2xl font-black text-stone-900">
                  ₹{worker.dailyEarnings}
                  <span className="text-xs font-normal text-stone-500"> / day</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold">
                  ~₹{worker.estimatedMonthlyEarnings} estimated monthly (~{workingDays}d)
                </div>
              </>
            ) : (
              <div className="text-xs font-semibold text-stone-500 italic py-1">
                Earnings data not available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Featured Micro-Insurance Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 sm:p-8 shadow-md border border-emerald-800/50">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-stone-950" />
            <span>SahakarGig Micro-Insurance</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Protect Your Future 🛡️
          </h2>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Small daily contributions (₹5, ₹10, or ₹20/day) bring meaningful financial protection during
            accidents, sudden illness, or hospital admissions. No salary percentages — you stay in complete
            control.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              id="hero-explore-insurance-btn"
              onClick={onNavigateToInsurance}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer flex items-center gap-2"
            >
              <span>Explore /insurance Plans</span>
              <ArrowRight className="w-4 h-4 text-stone-950 stroke-[2.5]" />
            </button>

            <button
              type="button"
              id="hero-claim-help-btn"
              onClick={onOpenClaimModal}
              className="px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Need Urgent Claim Help?
            </button>
          </div>
        </div>

        {/* Decorative background shield watermark */}
        <Shield className="absolute -right-8 -bottom-10 w-64 h-64 text-emerald-800/20 stroke-[1] pointer-events-none" />
      </div>

      {/* Welfare Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Micro-Insurance Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Daily Micro-Insurance</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Voluntary contributions from ₹5 to ₹20/day tailored to low-income daily earners with income-shock
              protection.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToInsurance}
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View Insurance Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Medical Support Assistance */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Health Clinic Network</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Locate verified community healthcare centers, registered doctors, and subsidized medicine shops.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenClaimModal}
            className="mt-4 pt-3 border-t border-stone-100 text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            <span>File Medical Claim</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Worker Rights & Education */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Welfare & Trust Rights</h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Guidance on building & gig worker welfare benefits and statutory accident protection.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500">
            SahakarGig Worker Trust framework
          </div>
        </div>
      </div>

      {/* Worker Helpline & Support notice */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Toll-Free Worker Welfare Helpline: <strong>1800-123-HELP</strong> (Free 24/7 in Hindi & English)</span>
        </div>
        <span className="text-stone-400 font-mono">Worker ID: {worker.workerId || 'Pending'}</span>
      </div>
    </div>
  );
};
