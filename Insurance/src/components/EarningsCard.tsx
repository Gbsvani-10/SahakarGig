import React from 'react';
import { WorkerProfile } from '../types';
import { Wallet, Calendar, Lock, AlertCircle, Building2, User } from 'lucide-react';

interface EarningsCardProps {
  worker: WorkerProfile;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ worker }) => {
  const hasEarnings = worker.dailyEarnings !== null && worker.dailyEarnings !== undefined;
  const hasMonthlyEarnings =
    worker.estimatedMonthlyEarnings !== null && worker.estimatedMonthlyEarnings !== undefined;
  const workingDays = worker.estimatedWorkingDays || 26;

  return (
    <div
      id="earnings-card"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-base">
            ₹
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Current Worker Earnings Baseline
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Verified Account
              </span>
            </div>
            <p className="text-base font-bold text-stone-900 mt-0.5">
              {worker.name} • <span className="font-normal text-stone-600">{worker.occupation || 'Gig Worker'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Read-only from Platform</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {/* Today's Earning */}
        <div
          id="today-earnings-block"
          className="p-4 rounded-xl bg-gradient-to-br from-stone-50 to-amber-50/40 border border-stone-200/90 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1">
              <Wallet className="w-3.5 h-3.5 text-amber-700" />
              <span>Today&apos;s Earning</span>
            </div>
            {hasEarnings ? (
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                ₹{worker.dailyEarnings!.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-stone-500 ml-1">/ day</span>
              </div>
            ) : (
              <div className="text-base font-semibold text-stone-600 italic py-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Earnings data not available</span>
              </div>
            )}
            <div className="text-xs text-stone-500 mt-0.5">
              {hasEarnings ? 'Active daily platform wage' : 'Awaiting attendance confirmation'}
            </div>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                hasEarnings
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {hasEarnings ? 'Live Wage' : 'Unrecorded'}
            </span>
          </div>
        </div>

        {/* Estimated Monthly Earnings */}
        <div
          id="monthly-earnings-block"
          className="p-4 rounded-xl bg-gradient-to-br from-stone-50 to-emerald-50/40 border border-stone-200/90 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 mb-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Estimated Monthly Earnings</span>
            </div>
            {hasMonthlyEarnings ? (
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                ₹{worker.estimatedMonthlyEarnings!.toLocaleString('en-IN')}
              </div>
            ) : (
              <div className="text-base font-semibold text-stone-600 italic py-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                <span>Earnings data not available</span>
              </div>
            )}
            <div className="text-xs text-stone-500 mt-0.5">
              {hasMonthlyEarnings
                ? `Calculated on ~${workingDays} active working days/mo`
                : 'Subject to active shifts logged'}
            </div>
          </div>
          <div className="text-right">
            {hasEarnings && (
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                ₹{worker.dailyEarnings} × {workingDays}d
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3.5 flex items-start gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600">
        <Building2 className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <p>
          Worker ID: <strong className="text-stone-800">{worker.workerId || 'Data not available'}</strong> •
          Employer/Platform:{' '}
          <strong className="text-stone-800">{worker.employer || 'Not available'}</strong> •
          Location: <strong className="text-stone-800">{worker.location || 'Not available'}</strong>.
          Earnings records are synced securely from the SahakarGig partner platform.
        </p>
      </div>
    </div>
  );
};
