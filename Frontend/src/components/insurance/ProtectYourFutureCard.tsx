```tsx
import React from 'react';
import { ContributionAmount } from '../../types/insurance';
import {
  Shield,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface ProtectYourFutureCardProps {
  dailyWage?: number | null;
  workedDays?: number | null;
  selectedContribution: ContributionAmount | null;
  onSelectContribution: (amount: ContributionAmount) => void;
  onConfirmInsurance: () => void;
  isEnrolling?: boolean;
  isEnrolled?: boolean;
}

export const ProtectYourFutureCard: React.FC<ProtectYourFutureCardProps> = ({
  dailyWage,
  workedDays,
  selectedContribution,
  onSelectContribution,
  onConfirmInsurance,
  isEnrolling = false,
  isEnrolled = false,
}) => {
  const hasWage =
    dailyWage !== null &&
    dailyWage !== undefined &&
    dailyWage > 0;

  const hasWorkedDays =
    workedDays !== null &&
    workedDays !== undefined &&
    workedDays >= 0;

  const hasContribution =
    selectedContribution !== null &&
    selectedContribution !== undefined;

  const totalEarnings =
    hasWage && hasWorkedDays
      ? dailyWage! * workedDays!
      : null;

  const insuranceDeduction =
    hasContribution && hasWorkedDays
      ? selectedContribution! * workedDays!
      : null;

  const takeHome =
    totalEarnings !== null && insuranceDeduction !== null
      ? Math.max(0, totalEarnings - insuranceDeduction)
      : null;

  const contributionOptions: {
    amount: ContributionAmount;
    label: string;
    tier: string;
    isRecommended?: boolean;
  }[] = [
    {
      amount: 10,
      label: '₹10/day',
      tier: 'Basic',
    },
    {
      amount: 20,
      label: '₹20/day',
      tier: 'Recommended',
      isRecommended: true,
    },
    {
      amount: 30,
      label: '₹30/day',
      tier: 'Enhanced',
    },
  ];

  return (
    <section
      id="protect-your-future-card"
      className="bg-white rounded-3xl border-2 border-stone-800 shadow-md p-6 sm:p-8 space-y-6 transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-stone-950 flex items-center justify-center text-2xl font-bold shadow-xs border border-amber-200">
            <Shield className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
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

      {/* Wage + Contribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Daily Wage */}
        <div
          id="card-daily-wage-block"
          className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90"
        >
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Your Daily Wage
          </span>

          <div className="mt-2">
            {hasWage ? (
              <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                ₹{dailyWage!.toLocaleString('en-IN')}
                <span className="text-xs sm:text-sm font-semibold text-stone-500 ml-1">
                  / day
                </span>
              </div>
            ) : (
              <div className="text-base font-semibold text-stone-600 italic py-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Wage data not available</span>
              </div>
            )}

            <p className="text-xs text-stone-500 mt-1">
              Synced from actual platform earnings
            </p>
          </div>
        </div>

        {/* Insurance Contribution */}
        <div
          id="card-insurance-contribution-block"
          className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90"
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
            {hasContribution ? (
              <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                ₹{selectedContribution}
                <span className="text-sm font-semibold text-stone-600 ml-1.5">
                  / worked day
                </span>
              </div>
            ) : (
              <div className="text-base font-semibold text-stone-600 italic py-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Select a contribution</span>
              </div>
            )}

            <p className="text-xs text-stone-600 mt-1">
              Deducted only from days with recorded earnings
            </p>
          </div>
        </div>
      </div>

      {/* This Month Breakdown */}
      <div
        id="card-this-month-breakdown"
        className="p-5 sm:p-6 rounded-2xl bg-stone-900 text-stone-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />

            <span className="text-sm font-black uppercase tracking-wider text-white">
              This Month
            </span>
          </div>

          <div className="flex items-center gap-2 bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700">
            <span className="text-xs text-stone-300 font-medium">
              Recorded Worked Days:
            </span>

            <span className="text-sm font-bold text-amber-400 font-mono">
              {hasWorkedDays
                ? `${workedDays} days`
                : 'Data not available'}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">

          {/* Worked Days */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <div className="text-stone-400 text-xs">
              Worked Days
            </div>

            <div className="text-xl font-black text-white mt-1">
              {hasWorkedDays
                ? `${workedDays} days`
                : 'Not available'}
            </div>

            <div className="text-[11px] text-stone-500 mt-0.5">
              Based on recorded active shifts
            </div>
          </div>

          {/* Total Earnings */}
          <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <div className="text-stone-400 text-xs">
              Total Earnings
            </div>

            <div className="text-xl font-black text-white mt-1">
              {totalEarnings !== null
                ? `₹${totalEarnings.toLocaleString('en-IN')}`
                : 'Not available'}
            </div>

            {hasWage && hasWorkedDays && (
              <div className="text-[11px] text-stone-500 mt-0.5">
                ₹{dailyWage!.toLocaleString('en-IN')} × {workedDays} days
              </div>
            )}
          </div>

          {/* Insurance Deduction */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50">
            <div className="text-amber-300 text-xs font-semibold">
              Insurance Deduction
            </div>

            <div className="text-xl font-black text-amber-400 mt-1">
              {insuranceDeduction !== null
                ? `₹${insuranceDeduction.toLocaleString('en-IN')}`
                : 'Not available'}
            </div>

            {hasContribution && hasWorkedDays && (
              <div className="text-[11px] text-amber-200/70 mt-0.5">
                ₹{selectedContribution} × {workedDays} days
              </div>
            )}
          </div>

          {/* Take Home */}
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
            <div className="text-emerald-300 text-xs font-semibold">
              Take-home
            </div>

            <div className="text-xl font-black text-emerald-400 mt-1">
              {takeHome !== null
                ? `₹${takeHome.toLocaleString('en-IN')}`
                : 'Not available'}
            </div>

            <div className="text-[11px] text-emerald-200/70 mt-0.5">
              Net wages after recorded contribution
            </div>
          </div>
        </div>
      </div>

      {/* No work = No deduction */}
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
            No recorded work = No insurance deduction.
          </div>
        </div>
      </div>

      {/* Contribution Selector */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
          Select Daily Micro-Contribution
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {contributionOptions.map((option) => {
            const isSelected =
              selectedContribution === option.amount;

            return (
              <button
                key={option.amount}
                type="button"
                id={`tier-button-${option.amount}`}
                onClick={() =>
                  onSelectContribution(option.amount)
                }
                className={`py-3 sm:py-4 px-3 rounded-2xl border-2 font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-1 text-sm sm:text-base font-black">
                  <span>{option.label}</span>

                  {option.isRecommended && (
                    <span className="text-amber-500 text-xs">
                      ⭐
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${
                    isSelected
                      ? 'text-emerald-800'
                      : 'text-stone-400'
                  }`}
                >
                  {option.tier}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm */}
      <div className="pt-2 flex flex-col items-center text-center space-y-2">
        <button
          type="button"
          id="hero-confirm-insurance-btn"
          disabled={isEnrolling || !hasContribution}
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
              <span>
                {hasContribution
                  ? 'Confirm Insurance'
                  : 'Select Contribution First'}
              </span>

              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-500">
          Contribution is calculated only against recorded working days.
        </p>
      </div>
    </section>
  );
};
```
