import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { ContributionAmount } from '../../types/insurance';
import {
CONTRIBUTION_OPTIONS,
calculateMonthlyContribution,
getRecommendationExplanation,
} from '../../utils/insuranceCalculations';

interface RecommendationCardProps {
recommendedAmount: ContributionAmount | null;
dailyEarnings?: number | null;
workingDays?: number | null;
onApplyRecommendation: (amount: ContributionAmount) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
recommendedAmount,
dailyEarnings,
workingDays,
onApplyRecommendation,
}) => {
if (recommendedAmount === null) {
return ( <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"> <Sparkles size={20} className="text-gray-700" /> </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Contribution Recommendation
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Recommendation will appear once verified earnings data is available.
        </p>
      </div>
    </div>
  </section>
);


}

const recommendedOption = CONTRIBUTION_OPTIONS.find(
(option) => option.amount === recommendedAmount
);

if (!recommendedOption) {
return null;
}

const monthlyContribution = calculateMonthlyContribution(
recommendedAmount,
workingDays
);

const explanation = getRecommendationExplanation(
dailyEarnings,
recommendedAmount
);

return ( <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"> <div className="flex items-start gap-4"> <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"> <Sparkles size={22} className="text-gray-700" /> </div>

    <div className="flex-1">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Recommended Contribution
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Based on your verified earnings and working pattern.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
          <CheckCircle2 size={16} />
          {recommendedOption.tier}
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">
              Suggested daily contribution
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-1">
              ₹{recommendedOption.amount}
              <span className="text-base font-medium text-gray-500">
                /day
              </span>
            </p>
          </div>

          {monthlyContribution !== null && (
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-600">
                Estimated monthly contribution
              </p>

              <p className="text-xl font-bold text-gray-900 mt-1">
                ₹{monthlyContribution}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Based on {workingDays} working days
              </p>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-4 leading-6">
          {explanation}
        </p>

        <p className="text-sm text-gray-600 mt-2 leading-6">
          {recommendedOption.description}
        </p>

        <button
          type="button"
          onClick={() => onApplyRecommendation(recommendedAmount)}
          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text
