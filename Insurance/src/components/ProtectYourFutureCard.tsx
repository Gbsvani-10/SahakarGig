import React, { useState, useEffect } from 'react';
import { ContributionAmount } from '../types';
import {
  Shield,
  Lightbulb,
  Star,
  Check,
  Calendar,
  Wallet,
  ArrowRight,
  TrendingUp,
  Minus,
  Plus,
  Loader2,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface ProtectYourFutureCardProps {
  dailyWage?: number | null;
  selectedContribution: ContributionAmount;
  onSelectContribution: (amount: ContributionAmount) => void;
  onConfirmInsurance: () => void;
  isEnrolling?: boolean;
  isEnrolled?: boolean;
}

export const ProtectYourFutureCard: React.FC<ProtectYourFutureCardProps> = ({
  dailyWage = 300,
  selectedContribution = 10,
  onSelectContribution,
  onConfirmInsurance,
  isEnrolling = false,
  isEnrolled = false,
}) => {
  // Allow interactive worked days (default 20 as specified in the prompt)
  const [workedDays, setWorkedDays] = useState<number>(20);
  // Wage can default to ₹300 or current worker's wage
  const [wage, setWage] = useState<number>(dailyWage && dailyWage > 0 ? dailyWage : 300);
  const [isEditingWage, setIsEditingWage] = useState<boolean>(false);

  // Sync if dailyWage prop updates
  useEffect(() => {
    if (dailyWage && dailyWage > 0) {
      setWage(dailyWage);
    }
  }, [dailyWage]);

  // Calculations
  const totalEarnings = wage * workedDays;
  const insuranceDeduction = selectedContribution * workedDays;
  const takeHome = Math.max(0, totalEarnings - insuranceDeduction);

  const tiers: { amount: ContributionAmount; label: string; isStar?: boolean }[] = [
    { amount: 5, label: '₹5/day' },
    { amount: 10, label: '₹10/day', isStar: true },
    { amount: 20, label: '₹20/day' },
  ];

  return (
    <section
      id="protect-your-future-card"
      className="bg-white rounded-3xl border-2 border-stone-800 shadow-md p-6 sm:p-8 space-y-6 transition-all"
    >
      {/* Header: 🛡️ Protect Your Future */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-stone-950 flex items-center justify-center text-2xl font-bold shadow-xs border border-amber-200">
            🛡️
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              Protect Your Future
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Daily micro-insurance designed for gig and daily wage earners
            </p>
          </div>
        </div>

        {isEnrolled && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Active Coverage</span>
          </div>
        )}
      </div>

      {/* Main Breakdown Grid: Your Daily Wage & Insurance Contribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Your Daily Wage */}
        <div
          id="card-daily-wage-block"
          className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Your Daily Wage
            </span>
            <button
              type="button"
              onClick={() => setIsEditingWage(!isEditingWage)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              {isEditingWage ? 'Done' : 'Change'}
            </button>
          </div>

          <div className="mt-2">
            {isEditingWage ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-stone-600">₹</span>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="10"
                  value={wage}
                  onChange={(e) => setWage(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-28 px-3 py-1 text-2xl font-black text-stone-900 border border-stone-300 rounded-xl focus:outline-emerald-600"
                />
                <span className="text-xs text-stone-400">/ day</span>
              </div>
            ) : (
              <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                ₹{wage.toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-semibold text-stone-500 ml-1">
                  / day
                </span>
              </div>
            )}
            <p className="text-xs text-stone-500 mt-1">Base rate per active work shift</p>
          </div>
        </div>

        {/* Insurance Contribution */}
        <div
          id="card-insurance-contribution-block"
          className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Insurance Contribution
            </span>
            <span className="text-[11px] font-semibold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full">
              Voluntary
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              ₹{selectedContribution}
              <span className="text-sm font-semibold text-stone-600 ml-1.5 font-sans">
                / worked day
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Micro-deducted directly from active daily wage
            </p>
          </div>
        </div>
      </div>

      {/* This Month Breakdown Box */}
      <div
        id="card-this-month-breakdown"
        className="p-5 sm:p-6 rounded-2xl bg-stone-900 text-stone-100 shadow-sm space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-black uppercase tracking-wider text-white">
              This Month
            </span>
          </div>

          {/* Interactive Worked Days Controller */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
            <span className="text-xs text-stone-300 font-medium">Worked Days:</span>
            <button
              type="button"
              id="decrease-worked-days-btn"
              onClick={() => setWorkedDays((prev) => Math.max(0, prev - 1))}
              className="w-5 h-5 rounded-md bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-white cursor-pointer"
              title="Decrease worked days"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-bold text-amber-400 w-7 text-center font-mono">
              {workedDays}
            </span>
            <button
              type="button"
              id="increase-worked-days-btn"
              onClick={() => setWorkedDays((prev) => Math.min(31, prev + 1))}
              className="w-5 h-5 rounded-md bg-stone-700 hover:bg-stone-600 flex items-center justify-center text-white cursor-pointer"
              title="Increase worked days"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 4 Line Items as Specified */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          {/* Worked Days */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <div className="text-stone-400 text-xs">Worked Days</div>
            <div className="text-xl font-black text-white mt-1">{workedDays} days</div>
            <div className="text-[11px] text-stone-500 mt-0.5">Active shifts logged</div>
          </div>

          {/* Total Earnings */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <div className="text-stone-400 text-xs">Total Earnings</div>
            <div className="text-xl font-black text-white mt-1">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              ₹{wage} × {workedDays} days
            </div>
          </div>

          {/* Insurance Deduction */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50">
            <div className="text-amber-300 text-xs font-semibold">Insurance Deduction</div>
            <div className="text-xl font-black text-amber-400 mt-1">
              ₹{insuranceDeduction.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-200/70 mt-0.5">
              ₹{selectedContribution} × {workedDays} days
            </div>
          </div>

          {/* Take-home */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
            <div className="text-emerald-300 text-xs font-semibold">Take-home</div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              ₹{takeHome.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-200/70 mt-0.5">Net wages in pocket</div>
          </div>
        </div>
      </div>

      {/* 💡 Callout Note: You pay only on days you earn. No work = No deduction. */}
      <div
        id="card-no-work-no-deduction-callout"
        className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 flex items-start sm:items-center gap-3"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-200/80 flex items-center justify-center text-emerald-900 shrink-0 text-xl font-bold">
          💡
        </div>
        <div className="space-y-0.5">
          <div className="text-sm sm:text-base font-black text-emerald-950 tracking-tight">
            You pay only on days you earn.
          </div>
          <div className="text-xs sm:text-sm font-bold text-emerald-800">
            No work = No deduction.
          </div>
        </div>
      </div>

      {/* Tier Selector Buttons: [ ₹5/day ] [ ₹10/day ⭐ ] [ ₹20/day ] */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Select Daily Micro-Contribution
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {tiers.map((tier) => {
            const isSelected = selectedContribution === tier.amount;
            return (
              <button
                key={tier.amount}
                type="button"
                id={`tier-button-${tier.amount}`}
                onClick={() => onSelectContribution(tier.amount)}
                className={`py-3 sm:py-4 px-3 rounded-2xl border-2 font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1 text-sm sm:text-base font-black">
                  <span>{tier.label}</span>
                  {tier.isStar && <span className="text-amber-500 text-xs">⭐</span>}
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isSelected ? 'text-emerald-800' : 'text-stone-400'
                  }`}
                >
                  {tier.amount === 5 ? 'Basic' : tier.amount === 10 ? 'Recommended' : 'Strong'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Centered Primary Action: [ Confirm Insurance ] */}
      <div className="pt-2 flex flex-col items-center text-center space-y-2">
        <button
          type="button"
          id="hero-confirm-insurance-btn"
          disabled={isEnrolling}
          onClick={onConfirmInsurance}
          className="w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-black text-base transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 border border-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEnrolling ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
              <span>Confirming Insurance...</span>
            </>
          ) : (
            <>
              <span>Confirm Insurance</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-500">
          Instant activation • Zero paperwork • Pause or cancel anytime without penalties
        </p>
      </div>
    </section>
  );
};
