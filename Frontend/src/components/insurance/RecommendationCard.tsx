```tsx
import React from 'react';
import { ContributionAmount } from '../../types/insurance';
import {
  getRecommendationExplanation,
  calculateMonthlyContribution,
} from '../../utils/insuranceCalculations';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface RecommendationCardProps {
  dailyEarnings: number | null;
  recommendedAmount: ContributionAmount | null;
  selectedAmount: ContributionAmount | null;
  onApplyRecommendation: (amount: ContributionAmount) => void;
  workingDays?: number | null;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  dailyEarnings,
  recommendedAmount,
  selectedAmount,
  onApplyRecommendation,
  workingDays,
}) => {
  const hasEarnings =
    dailyEarnings !== null &&
    dailyEarnings !== undefined &&
    dailyEarnings > 0;

  const hasWorkingDays =
    workingDays !== null &&
    workingDays !== undefined &&
    workingDays >= 0;

  const hasRecommendation =
    recommendedAmount !== null &&
    recommendedAmount !== undefined;

  const isCurrentlySelected =
    hasRecommendation &&
    selectedAmount === recommendedAmount;

  const explanation = hasRecommendation
    ? getRecommendationExplanation(dailyEarnings, recommendedAmount)
    : null;

  const monthlyAmount =
    hasRecommendation && hasWorkingDays
      ? calculateMonthlyContribution(
          recommendedAmount,
          workingDays
        )
      : null;

  return (
    <div
      id="smart-recommendation-card"
      className="rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50/60 border-2 border-amber-300/80 p-5 sm:p-6 shadow-xs relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6 text-stone-950" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                Income-Calibrated Recommendation
              </span>

              {hasEarnings && (
                <span className="text-xs text-stone-600 font-medium">
                  Based on verified ₹
                  {dailyEarnings!.toLocaleString('en-IN')}
                  /day wage
                </span>
              )}
            </div>

            {hasRecommendation && explanation ? (
              <>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-1">
                  Recommended: ₹{recommendedAmount} / day (
                  {explanation.tierName})
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed max-w-2xl">
                  {explanation.rationale}
                </p>

                <div className="flex items-center gap-3 text-xs text-stone-600 font-medium mt-2 flex-wrap">

                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />

                    {monthlyAmount !== null
                      ? `~₹${monthlyAmount.toLocaleString('en-IN')}/month based on recorded days`
                      : 'Monthly estimate unavailable'}
                  </span>

                  <span>•</span>

                  <span className="text-stone-500">
                    {explanation.percentageNote}
                  </span>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 mt-1 flex items-center gap-2">
                  Recommendation unavailable
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed max-w-2xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  A verified daily earnings record is required to calculate
                  an income-based recommendation.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-200/80">

          {isCurrentlySelected ? (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Currently Selected</span>
            </div>
          ) : hasRecommendation ? (
            <button
              type="button"
              id="apply-recommendation-btn"
              onClick={() =>
                onApplyRecommendation(recommendedAmount!)
              }
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>
                Switch to ₹{recommendedAmount}/day
              </span>

              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          ) : null}

          {hasRecommendation && (
            <span className="text-[11px] text-stone-500 hidden sm:block">
              You are always free to choose another tier
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
```
