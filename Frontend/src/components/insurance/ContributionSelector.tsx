import React from 'react';
import { ContributionAmount } from '../../types/insurance';
import {
  CONTRIBUTION_OPTIONS,
  calculateMonthlyContribution,
} from '../../utils/insuranceCalculations';

interface ContributionSelectorProps {
  selectedAmount: ContributionAmount | null;
  onSelectAmount: (amount: ContributionAmount) => void;
  recommendedAmount?: ContributionAmount | null;
  dailyEarnings?: number | null;
  workingDays?: number | null;
}

const ContributionSelector: React.FC<ContributionSelectorProps> = ({
  selectedAmount,
  onSelectAmount,
  recommendedAmount,
  dailyEarnings,
  workingDays,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Choose your daily contribution
        </h3>

        <p className="text-sm text-gray-600 mt-1">
          Select the amount you want to contribute per working day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CONTRIBUTION_OPTIONS.map((option) => {
          const isSelected = selectedAmount === option.amount;
          const isRecommended = recommendedAmount === option.amount;

          const monthlyContribution =
            workingDays != null
              ? calculateMonthlyContribution(
                  option.amount,
                  workingDays
                )
              : null;

          return (
            <button
              key={option.amount}
              type="button"
              onClick={() => onSelectAmount(option.amount)}
              className={`text-left rounded-xl border p-4 transition ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">
                  {option.label}
                </span>

                {isRecommended && (
                  <span className="text-xs font-semibold">
                    Recommended
                  </span>
                )}
              </div>

              <p className="text-sm font-medium mt-2">
                {option.tier}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {option.description}
              </p>

              {monthlyContribution != null && (
                <p className="text-sm text-gray-700 mt-3">
                  Estimated monthly contribution: ₹
                  {monthlyContribution}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {dailyEarnings != null && (
        <p className="text-sm text-gray-600">
          Your verified daily earnings: ₹{dailyEarnings}
        </p>
      )}
    </div>
  );
};

export default ContributionSelector;
