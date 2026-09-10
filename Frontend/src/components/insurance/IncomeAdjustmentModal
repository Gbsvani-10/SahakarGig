import React, { useState } from 'react';
import { ContributionAmount } from '../../types/insurance';
import {
  calculateMonthlyContribution,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from '../../utils/insuranceCalculations';
import {
  SlidersHorizontal,
  X,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Loader2,
} from 'lucide-react';

interface IncomeAdjustmentModalProps {
  currentContribution: ContributionAmount;
  dailyEarnings: number | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmAdjustment: (newContribution: ContributionAmount, reason: string) => Promise<void>;
  workingDays?: number | null;
}

export const IncomeAdjustmentModal: React.FC<IncomeAdjustmentModalProps> = ({
  currentContribution,
  dailyEarnings,
  isOpen,
  onClose,
  onConfirmAdjustment,
  workingDays,
}) => {
  const [selectedContribution, setSelectedContribution] =
    useState<ContributionAmount>(currentContribution);
  const [reason, setReason] = useState<string>('Temporary income drop');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeDays = workingDays || DEFAULT_WORKING_DAYS_PER_MONTH;
  const currentMonthly = calculateMonthlyContribution(currentContribution, activeDays);
  const newMonthly = calculateMonthlyContribution(selectedContribution, activeDays);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setErrorMessage('Please confirm your request to adjust your contribution rate.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onConfirmAdjustment(selectedContribution, reason);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to adjust contribution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Manage Daily Contribution
              </h3>
              <p className="text-xs text-stone-500">
                Flexibility to increase, lower, or pause without losing core rights
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Informative notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            During low-wage seasons, bad weather, or medical leave, you can downscale your contribution
            to <strong>₹5/day</strong>. You remain covered under emergency outpatient care.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tier Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 block">
              Select New Contribution Rate
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 20] as ContributionAmount[]).map((amt) => {
                const isSelected = selectedContribution === amt;
                const isCurrent = currentContribution === amt;

                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedContribution(amt)}
                    className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="text-base font-black">₹{amt}/day</div>
                    <div className="text-[10px] text-stone-500">
                      {isCurrent ? '(Current)' : amt === 5 ? 'Basic' : amt === 10 ? 'Balanced' : 'Strong'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Monthly Comparison */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs text-stone-700">
            <div>
              <span className="text-stone-500 block">Current Est. Monthly</span>
              <strong>₹{currentMonthly} / mo</strong>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400" />
            <div className="text-right">
              <span className="text-stone-500 block">New Est. Monthly</span>
              <strong className="text-emerald-800 font-bold">₹{newMonthly} / mo</strong>
            </div>
          </div>

          {/* Reason selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-800 block">
              Reason for Adjustment (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-emerald-600"
            >
              <option value="Temporary income drop">Temporary income drop</option>
              <option value="Seasonal work reduction">Seasonal work reduction / Rain disruption</option>
              <option value="Seeking higher protection">Seeking higher protection coverage</option>
              <option value="Budget rebalancing">Personal budget rebalancing</option>
            </select>
          </div>

          {/* Confirmation Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>
                I confirm that I want to adjust my SahakarGig daily micro-contribution to{' '}
                <strong>₹{selectedContribution}/day</strong> starting from tomorrow.
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !confirmed}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Adjustment</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
