import React from 'react';
import { ContributionAmount, ProtectionTier } from '../../types/insurance';
import { calculateMonthlyContribution, DEFAULT_WORKING_DAYS_PER_MONTH } from '../../utils/insuranceCalculations';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  CreditCard,
  ArrowRight,
  Download,
  Share2,
  Lock,
  LifeBuoy,
} from 'lucide-react';

interface ConfirmationScreenProps {
  referenceId: string;
  selectedContribution: ContributionAmount;
  protectionTier: ProtectionTier;
  onGoToDashboard: () => void;
  onBackToPortal: () => void;
  workingDays?: number | null;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  referenceId,
  selectedContribution,
  protectionTier,
  onGoToDashboard,
  onBackToPortal,
  workingDays,
}) => {
  const activeDays = workingDays || DEFAULT_WORKING_DAYS_PER_MONTH;
  const monthlyEst = calculateMonthlyContribution(selectedContribution, activeDays);

  return (
    <div
      id="insurance-confirmation-success-screen"
      className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-9 shadow-md text-center max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Animated Success Badge */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-emerald-200">
        <CheckCircle2 className="w-12 h-12 text-emerald-700 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Protection Enrolled Successfully</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          Your SahakarGig Micro-Insurance is Active! 🛡️
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Your voluntary daily contribution of ₹{selectedContribution} has been securely registered in
          the SahakarGig database.
        </p>
      </div>

      {/* Policy Certificate Snapshot Card */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 text-left space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block">
              Enrollment Reference ID
            </span>
            <span className="font-mono text-sm font-bold text-stone-900">{referenceId}</span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
            🟢 Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div>
            <span className="text-stone-500 block">Daily Contribution</span>
            <strong className="text-stone-900 text-base font-bold">
              ₹{selectedContribution} / day
            </strong>
          </div>
          <div>
            <span className="text-stone-500 block">Protection Tier</span>
            <strong className="text-stone-900 text-base font-bold">
              {protectionTier} Level
            </strong>
          </div>
          <div>
            <span className="text-stone-500 block">Estimated Monthly</span>
            <strong className="text-stone-900 text-sm font-semibold">
              ₹{monthlyEst} / mo (~{activeDays}d)
            </strong>
          </div>
          <div>
            <span className="text-stone-500 block">Next Contribution</span>
            <strong className="text-stone-900 text-xs font-semibold">
              Tomorrow 9 AM (wage day)
            </strong>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-200 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-stone-400 shrink-0" />
          <span>Automated deduction applies only when active platform earnings are confirmed.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          id="confirm-go-dashboard-btn"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs sm:text-sm transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <span>View Active Insurance Dashboard</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        <button
          type="button"
          id="confirm-back-portal-btn"
          onClick={onBackToPortal}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <span>← Back to Worker Portal</span>
        </button>
      </div>
    </div>
  );
};
