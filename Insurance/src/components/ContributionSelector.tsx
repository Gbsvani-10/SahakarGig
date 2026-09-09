import React from 'react';
import { ContributionAmount } from '../types';
import {
  CONTRIBUTION_TIERS,
  calculateMonthlyContribution,
  calculateRemainingEarnings,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from '../utils/insuranceCalculations';
import { Check, Star, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface ContributionSelectorProps {
  selectedAmount: ContributionAmount;
  onSelectAmount: (amount: ContributionAmount) => void;
  recommendedAmount: ContributionAmount;
  dailyEarnings: number | null;
  workingDays?: number | null;
}

export const ContributionSelector: React.FC<ContributionSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
  recommendedAmount,
  dailyEarnings,
  workingDays,
}) => {
  const activeWorkingDays = workingDays || DEFAULT_WORKING_DAYS_PER_MONTH;
  const currentMonthly = calculateMonthlyContribution(selectedAmount, activeWorkingDays);
  const remainingDaily = calculateRemainingEarnings(dailyEarnings, selectedAmount);
  const hasEarnings = dailyEarnings !== null && dailyEarnings !== undefined;

  return (
    <section id="daily-contribution-selector" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Select Your Daily Micro-Contribution
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Zero Percentage Cuts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Fixed daily micro-amounts that fit a ₹200–₹500 daily wage without overburdening your budget.
          </p>
        </div>

        <div className="text-xs font-medium text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
          Calculated for ~{activeWorkingDays} working days/mo
        </div>
      </div>

      {/* 3 Main Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONTRIBUTION_TIERS.map((tier) => {
          const isSelected = selectedAmount === tier.amount;
          const isRecommended = recommendedAmount === tier.amount;
          const monthlyAmount = calculateMonthlyContribution(tier.amount, activeWorkingDays);
          const remaining = calculateRemainingEarnings(dailyEarnings, tier.amount);

          return (
            <div
              key={tier.amount}
              id={`tier-card-${tier.amount}`}
              onClick={() => onSelectAmount(tier.amount)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectAmount(tier.amount);
                }
              }}
              className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
              }`}
            >
              {/* Badges row */}
              <div className="flex items-center justify-between gap-2 min-h-[26px]">
                {isRecommended ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-stone-950 shadow-xs">
                    <Star className="w-3 h-3 fill-stone-950" />
                    <span>⭐ Recommended</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    {tier.tier} Tier
                  </span>
                )}

                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Selected</span>
                  </span>
                )}
              </div>

              {/* Price & Title */}
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                    ₹{tier.amount}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-500">
                    / day
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mt-1">{tier.title}</h3>
                <p className="text-xs text-stone-500">{tier.tagline}</p>
              </div>

              {/* Monthly Cost & Remaining Calculation */}
              <div className="my-4 pt-3 border-t border-stone-100 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-stone-600">
                  <span>Estimated monthly:</span>
                  <strong className="text-stone-900 text-sm font-bold">
                    ₹{monthlyAmount}
                    <span className="text-[10px] font-normal text-stone-500"> / mo</span>
                  </strong>
                </div>

                <div className="flex justify-between items-center text-stone-600">
                  <span>Remaining daily:</span>
                  {hasEarnings ? (
                    <strong className="text-emerald-800 font-bold">
                      ₹{remaining}
                      <span className="text-[10px] font-normal text-stone-500"> / day</span>
                    </strong>
                  ) : (
                    <span className="text-[11px] text-stone-500 italic">
                      Earnings not available
                    </span>
                  )}
                </div>
              </div>

              {/* Tier Features */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  Included Protection
                </span>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom select button */}
              <div className="mt-5 pt-3">
                <button
                  type="button"
                  id={`select-btn-${tier.amount}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAmount(tier.amount);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  {isSelected ? 'Selected Active Option' : `Choose ₹${tier.amount} / day`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Strip */}
      <div
        id="contribution-dynamic-summary"
        className="p-4 rounded-2xl bg-stone-900 text-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="text-xs text-stone-400 font-medium">Selected Daily Contribution</div>
            <div className="text-base sm:text-lg font-bold text-white">
              ₹{selectedAmount} / day •{' '}
              <span className="text-amber-400 font-semibold">
                Estimated ~₹{currentMonthly} monthly
              </span>
            </div>
          </div>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-800 text-xs">
          <div className="text-stone-400">Estimated Remaining Daily Earnings</div>
          {hasEarnings ? (
            <div className="text-base font-bold text-emerald-400">
              ₹{remainingDaily} / day{' '}
              <span className="text-xs text-stone-400 font-normal">
                (from ₹{dailyEarnings}/day)
              </span>
            </div>
          ) : (
            <div className="text-xs text-amber-300 flex items-center sm:justify-end gap-1 font-medium mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Earnings data not available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
