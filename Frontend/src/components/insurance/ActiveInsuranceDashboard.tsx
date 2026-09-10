
import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Calendar,
  CreditCard,
  FileText,
  SlidersHorizontal,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';

import {
  ContributionAmount,
  InsuranceRecord,
} from '../../types/insurance';

import {
  calculateMonthlyContribution,
  CONTRIBUTION_OPTIONS,
} from '../../utils/insuranceCalculations';

interface ActiveInsuranceDashboardProps {
  insurance: InsuranceRecord;
  onManageContribution: () => void;
  onClaimSupport: () => void;
  workingDays?: number | null;
}

const ActiveInsuranceDashboard: React.FC<
  ActiveInsuranceDashboardProps
> = ({
  insurance,
  onManageContribution,
  onClaimSupport,
  workingDays,
}) => {
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const selectedContribution =
    insurance.selectedContribution as ContributionAmount | null;

  const selectedOption = CONTRIBUTION_OPTIONS.find(
    (option) => option.amount === selectedContribution
  );

  const protectionLevel = selectedOption?.tier || 'Not selected';

  const monthlyContribution =
    selectedContribution != null && workingDays != null
      ? calculateMonthlyContribution(
          selectedContribution,
          workingDays
        )
      : null;

  const isActive =
    String(insurance.status || '').toLowerCase() === 'active';

  const reference =
    insurance.referenceCode ||
    insurance.reference ||
    insurance.policyNumber ||
    insurance.policy ||
    'Not available';

  const coverageDetails = insurance.coverageDetails;

  const getCoverageText = (): string => {
    if (!coverageDetails) {
      return 'Coverage details will be shown here once they are provided by the active insurance scheme.';
    }

    if (typeof coverageDetails === 'string') {
      return coverageDetails;
    }

    const values = Object.entries(coverageDetails)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (char) => char.toUpperCase());

        return `${formattedKey}: ${String(value)}`;
      });

    return values.length > 0
      ? values.join(' • ')
      : 'Coverage details are currently unavailable.';
  };

  return (
    <section
      id="active-insurance-dashboard"
      className="bg-white rounded-3xl border-2 border-emerald-600/80 shadow-md p-5 sm:p-7 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              isActive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <ShieldCheck className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                SahakarGig Insurance Status
              </span>

              {isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Active Coverage
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-700" />
                  Pending / Inactive
                </span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-0.5">
              Worker Micro-Shield • {protectionLevel} Tier
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono bg-stone-100 text-stone-700 px-3 py-1.5 rounded-xl border border-stone-200">
            Ref: {reference}
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Daily contribution */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-stone-600" />
            <span>Daily Contribution</span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {selectedContribution != null
              ? `₹${selectedContribution}`
              : 'Not selected'}

            {selectedContribution != null && (
              <span className="text-xs font-medium text-stone-500">
                {' '}
                / day
              </span>
            )}
          </div>

          <div className="text-[11px] text-stone-500 mt-1">
            Based on your selected plan
          </div>
        </div>

        {/* Monthly contribution */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Estimated Monthly</span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-emerald-950">
            {monthlyContribution != null
              ? `₹${monthlyContribution}`
              : 'Not available'}

            {monthlyContribution != null && (
              <span className="text-xs font-medium text-emerald-700">
                {' '}
                / month
              </span>
            )}
          </div>

          <div className="text-[11px] text-emerald-800 mt-1">
            {workingDays != null
              ? `${workingDays} working days`
              : 'Working-day data unavailable'}
          </div>
        </div>

        {/* Protection level */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Protection Level</span>
          </div>

          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {protectionLevel}
          </div>

          <div className="text-[11px] text-stone-500 mt-1">
            Based on selected contribution
          </div>
        </div>

        {/* Enrollment date */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Enrollment</span>
          </div>

          <div className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
            {insurance.enrolledAt
              ? new Date(insurance.enrolledAt).toLocaleDateString()
              : 'Not available'}
          </div>

          <div className="text-[11px] text-stone-500 mt-1">
            Verified insurance record
          </div>
        </div>
      </div>

      {/* Plan details */}
      <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50">
        <button
          type="button"
          id="view-plan-details-toggle"
          onClick={() =>
            setShowPlanDetails((previous) => !previous)
          }
          className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />

            <span className="text-sm font-bold text-stone-900">
              Plan Details & Coverage Terms
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-stone-600">
            <span>
              {showPlanDetails ? 'Hide Details' : 'View Details'}
            </span>

            {showPlanDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {showPlanDetails && (
          <div className="p-4 sm:p-5 pt-0 border-t border-stone-200/80 bg-white space-y-3 text-xs text-stone-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              {/* Coverage */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-1">
                  Policy Scope
                </span>

                <p className="text-stone-600 leading-relaxed">
                  {getCoverageText()}
                </p>
              </div>

              {/* Contribution */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-1">
                  Contribution
                </span>

                <p className="text-stone-600 leading-relaxed">
                  {selectedContribution != null
                    ? `₹${selectedContribution} per working day based on the selected protection plan.`
                    : 'No contribution plan has been selected yet.'}
                </p>
              </div>
            </div>

            {/* Confirmation */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />

              <div>
                <span className="font-semibold">
                  Insurance Record:
                </span>{' '}
                The information shown here comes from your actual
                insurance record. Coverage and claim eligibility are
                subject to the active insurance scheme terms.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          type="button"
          id="active-view-details-btn"
          onClick={() =>
            setShowPlanDetails((previous) => !previous)
          }
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4 text-stone-600" />

          <span>
            {showPlanDetails ? 'Close Details' : 'View Details'}
          </span>
        </button>

        <button
          type="button"
          id="active-manage-contribution-btn"
          onClick={onManageContribution}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />

          <span>Manage Contribution</span>
        </button>

        <button
          type="button"
          id="active-claim-support-btn"
          onClick={onClaimSupport}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 sm:ml-auto"
        >
          <LifeBuoy className="w-4 h-4" />

          <span>Claim Support</span>
        </button>
      </div>
    </section>
  );
};

export default ActiveInsuranceDashboard;
