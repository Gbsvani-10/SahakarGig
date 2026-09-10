import React from 'react';
import { ContributionAmount } from '../../types/insurance';
import { Lightbulb, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface IncomeAwareProtectionProps {
  currentContribution?: ContributionAmount;
  onOpenAdjustment?: () => void;
  onOpenAdjustmentModal?: () => void;
}

export const IncomeAwareProtection: React.FC<IncomeAwareProtectionProps> = ({
  currentContribution = 10,
  onOpenAdjustment,
  onOpenAdjustmentModal,
}) => {
  const handleOpen = onOpenAdjustment || onOpenAdjustmentModal || (() => {});

  return (
    <section
      id="income-aware-protection"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                💡 Income-Aware Protection
              </h3>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Worker Flexibility
              </span>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed max-w-2xl">
              Your earnings may fluctuate due to seasonal demand, rain disruptions, or family needs.
              If recent earnings are lower than usual, a lower contribution (e.g. ₹5/day) may be more
              affordable so you remain protected without financial stress.
            </p>
          </div>
        </div>

        <button
          type="button"
          id="open-adjust-contribution-btn"
          onClick={handleOpen}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-500"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Adjust Contribution</span>
        </button>
      </div>

      {/* Example Box */}
      <div className="mt-5 p-4 rounded-xl bg-stone-50 border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 items-center">
        <div className="p-3 rounded-lg bg-white border border-stone-200">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Standard Option
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-stone-900">₹10 / day</span>
            <span className="text-xs text-stone-500">(~₹260/mo)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-0.5">Regular active working months</p>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center justify-between">
            <span>Low-Income Option</span>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
              Easy Pivot
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-900">₹5 / day</span>
            <span className="text-xs text-emerald-700">(~₹130/mo)</span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Low-earning or slow season</p>
        </div>

        <div className="p-3 rounded-lg bg-stone-100/80 border border-stone-200 sm:col-span-2 md:col-span-1 text-xs text-stone-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-800">Never automatic:</span> SahakarGig will
            never change your contribution without your explicit review and confirmation.
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
        <span>Current selected rate: ₹{currentContribution}/day</span>
        <span className="font-medium text-stone-500">
          Worker manual selection required for all changes.
        </span>
      </div>
    </section>
  );
};
