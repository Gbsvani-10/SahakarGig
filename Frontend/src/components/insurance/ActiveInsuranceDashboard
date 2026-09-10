import React, { useState } from 'react';
import { ContributionAmount, InsuranceStatus, WorkerInsuranceRecord } from '../../types/insurance';
import {
  calculateMonthlyContribution,
  getProtectionLevel,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from '../../utils/insuranceCalculations';
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
  AlertCircle,
} from 'lucide-react';

interface ActiveInsuranceDashboardProps {
  insurance: WorkerInsuranceRecord;
  onManageContribution: () => void;
  onClaimSupport: () => void;
  workingDays?: number | null;
}

export const ActiveInsuranceDashboard: React.FC<ActiveInsuranceDashboardProps> = ({
  insurance,
  onManageContribution,
  onClaimSupport,
  workingDays,
}) => {
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const selectedContribution = (insurance.selectedContribution || 10) as ContributionAmount;
  const activeDays = workingDays || DEFAULT_WORKING_DAYS_PER_MONTH;
  const protectionLevel = insurance.protectionTier || getProtectionLevel(selectedContribution);
  const monthlyEst =
    insurance.estimatedMonthlyContribution ||
    calculateMonthlyContribution(selectedContribution, activeDays);

  const nextContributionDate =
    insurance.nextContributionDate || 'Tomorrow, 09:00 AM (deducted from verified daily wage)';

  return (
    <section
      id="active-insurance-dashboard"
      className="bg-white rounded-3xl border-2 border-emerald-600/80 shadow-md p-5 sm:p-7 space-y-6"
    >
      {/* Top Bar with Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
              insurance.status === 'active'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                SahakarGig Insurance Status
              </span>
              {insurance.status === 'active' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  🟢 Active Coverage
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="w-3 h-3 text-amber-700" />
                  🟡 Pending Verification
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
            Ref: {insurance.referenceCode || insurance.policyNumber || 'SG-POL-ACTIVE'}
          </span>
        </div>
      </div>

      {/* Core Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-stone-600" />
            <span>Daily Contribution</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            ₹{selectedContribution}
            <span className="text-xs font-medium text-stone-500"> / day</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Deducted on working days</div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 mb-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Estimated Monthly</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-950">
            ₹{monthlyEst}
            <span className="text-xs font-medium text-emerald-700"> / mo</span>
          </div>
          <div className="text-[11px] text-emerald-800 mt-1">~{activeDays} workdays approx</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Protection Level</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-stone-900">
            {protectionLevel}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Accident & Health Buffer</div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>Next Contribution</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
            {nextContributionDate}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 truncate">Wage day debit</div>
        </div>
      </div>

      {/* Plan Details Expandable */}
      <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50/50">
        <button
          type="button"
          id="view-plan-details-toggle"
          onClick={() => setShowPlanDetails(!showPlanDetails)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-100/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />
            <span className="text-sm font-bold text-stone-900">
              Plan Details & Emergency Coverage Terms
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-600">
            <span>{showPlanDetails ? 'Hide Details' : 'View Details'}</span>
            {showPlanDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showPlanDetails && (
          <div className="p-4 sm:p-5 pt-0 border-t border-stone-200/80 bg-white space-y-3 text-xs text-stone-700 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-1">Policy Scope</span>
                <p className="text-stone-600 leading-relaxed">
                  {insurance.coverageDetails ||
                    'Voluntary worker welfare micro-insurance covering emergency outpatient & inpatient medical aid, bone fractures, and acute health distress.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-900 block mb-1">Deduction Rhythm</span>
                <p className="text-stone-600 leading-relaxed">
                  ₹{selectedContribution} daily micro-debit on active verified attendance days. Pauses
                  automatically without penalty if zero earnings are logged on non-work days.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Empaneled Clinics & Hospitals:</span> Access
                emergency coordination and claim filing assistance at 45+ verified community
                healthcare centers in your district.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          type="button"
          id="active-view-details-btn"
          onClick={() => setShowPlanDetails(!showPlanDetails)}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4 text-stone-600" />
          <span>{showPlanDetails ? 'Close Details' : 'View Details'}</span>
        </button>

        <button
          type="button"
          id="active-manage-contribution-btn"
          onClick={onManageContribution}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span>Manage Contribution</span>
        </button>

        <button
          type="button"
          id="active-claim-support-btn"
          onClick={onClaimSupport}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 sm:ml-auto"
        >
          <LifeBuoy className="w-4 h-4 text-emerald-200" />
          <span>Claim Support</span>
        </button>
      </div>
    </section>
  );
};
