import React, { useState } from 'react';
import { ContributionAmount, WorkerProfile } from '../types';
import {
  calculateMonthlyContribution,
  calculateRemainingEarnings,
  getProtectionLevel,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from '../utils/insuranceCalculations';
import {
  ShieldCheck,
  Calendar,
  Wallet,
  CheckSquare,
  Square,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface InsuranceSummaryProps {
  worker: WorkerProfile;
  selectedContribution: ContributionAmount;
  onConfirmEnrollment: () => void;
  isSubmitting?: boolean;
}

export const InsuranceSummary: React.FC<InsuranceSummaryProps> = ({
  worker,
  selectedContribution,
  onConfirmEnrollment,
  isSubmitting = false,
}) => {
  const [agreed, setAgreed] = useState(false);

  const workingDays = worker.estimatedWorkingDays || DEFAULT_WORKING_DAYS_PER_MONTH;
  const monthlyEstimated = calculateMonthlyContribution(selectedContribution, workingDays);
  const remainingDaily = calculateRemainingEarnings(worker.dailyEarnings, selectedContribution);
  const protectionLevel = getProtectionLevel(selectedContribution);
  const hasEarnings = worker.dailyEarnings !== null && worker.dailyEarnings !== undefined;

  return (
    <section
      id="insurance-summary-enrollment"
      className="bg-white rounded-3xl border-2 border-stone-800 p-5 sm:p-7 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              Enrollment Summary
            </span>
            <span className="text-xs text-stone-500">Step 3 of 3</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Review & Confirm Your Protection Plan
          </h2>
        </div>

        <div className="text-xs text-stone-500 font-mono bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
          Worker: {worker.name} ({worker.workerId || 'Pending'})
        </div>
      </div>

      {/* Numerical Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Daily Contribution */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90">
          <div className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-amber-700" />
            <span>Daily Contribution</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">
            ₹{selectedContribution}
            <span className="text-xs font-semibold text-stone-500 ml-1">/ day</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Deducted only on active attendance days
          </div>
        </div>

        {/* Estimated Monthly */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90">
          <div className="text-xs font-semibold text-emerald-900 mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Estimated Monthly Contribution</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-950">
            ₹{monthlyEstimated}
            <span className="text-xs font-semibold text-emerald-700 ml-1">/ mo</span>
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">
            Based on ~{workingDays} working days/month
          </div>
        </div>

        {/* Protection Tier */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 col-span-1 sm:col-span-2 md:col-span-1">
          <div className="text-xs font-semibold text-stone-600 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Selected Protection Level</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900">
            {protectionLevel}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Emergency hospital & accident support
          </div>
        </div>
      </div>

      {/* Income Balance Comparison Row */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-stone-600">Current Worker Daily Wage:</span>
          {hasEarnings ? (
            <strong className="text-stone-900 text-sm font-bold">₹{worker.dailyEarnings}/day</strong>
          ) : (
            <span className="text-stone-500 italic">Earnings data not available</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-600">Estimated Remaining Daily Earning:</span>
          {hasEarnings ? (
            <strong className="text-emerald-800 text-sm font-bold">
              ₹{remainingDaily} / day
            </strong>
          ) : (
            <span className="text-stone-500 italic">Earnings data not available</span>
          )}
        </div>
      </div>

      {/* Mandatory Consent Checkbox */}
      <div className="rounded-2xl border-2 border-stone-300 bg-stone-50/50 p-4 sm:p-5">
        <label
          htmlFor="insurance-consent-checkbox"
          className="flex items-start gap-3.5 cursor-pointer select-none"
        >
          <button
            type="button"
            id="insurance-consent-checkbox"
            role="checkbox"
            aria-checked={agreed}
            onClick={() => setAgreed(!agreed)}
            className="mt-0.5 shrink-0 text-emerald-700 focus:outline-none"
          >
            {agreed ? (
              <CheckSquare className="w-5 h-5 text-emerald-700 fill-emerald-100" />
            ) : (
              <Square className="w-5 h-5 text-stone-400" />
            )}
          </button>
          <div className="text-xs sm:text-sm text-stone-800 leading-relaxed">
            <span className="font-bold text-stone-950">
              I understand and agree to the selected insurance contribution.
            </span>
            <p className="text-xs text-stone-600 mt-1">
              I authorize SahakarGig to deduct ₹{selectedContribution} daily from my verified
              attendance wages for voluntary micro-insurance protection. I understand contributions
              pause automatically on days with zero earnings, and I can adjust or cancel this coverage
              at any time through my Worker Portal.
            </p>
          </div>
        </label>
      </div>

      {/* Confirmation Button Block */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>Secured under SahakarGig Worker Trust framework • No lock-in period</span>
        </div>

        <button
          type="button"
          id="confirm-insurance-btn"
          disabled={!agreed || isSubmitting}
          onClick={onConfirmEnrollment}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            agreed && !isSubmitting
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-300'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving to SahakarGig Database...</span>
            </>
          ) : (
            <>
              <span>Confirm Insurance</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
