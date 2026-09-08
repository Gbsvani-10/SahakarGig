import React, { useState, useEffect } from 'react';
import {
  WorkerProfile,
  ContributionAmount,
  InsuranceStatus,
  WorkerInsuranceRecord,
  ContributionHistoryItem,
  ProtectionTier,
} from '../types';
import { api } from '../utils/apiClient';
import {
  getRecommendedContribution,
  getProtectionLevel,
  DEFAULT_WORKING_DAYS_PER_MONTH,
} from '../utils/insuranceCalculations';
import { EarningsCard } from '../components/EarningsCard';
import { ProtectYourFutureCard } from '../components/ProtectYourFutureCard';
import { ContributionSelector } from '../components/ContributionSelector';
import { RecommendationCard } from '../components/RecommendationCard';
import { ProtectionOverview } from '../components/ProtectionOverview';
import { ProtectionSimulator } from '../components/ProtectionSimulator';
import { EmergencyShield } from '../components/EmergencyShield';
import { IncomeAwareProtection } from '../components/IncomeAwareProtection';
import { InsuranceSummary } from '../components/InsuranceSummary';
import { ConfirmationScreen } from '../components/ConfirmationScreen';
import { ActiveInsuranceDashboard } from '../components/ActiveInsuranceDashboard';
import { ContributionHistory } from '../components/ContributionHistory';
import { ClaimSupport } from '../components/ClaimSupport';
import { InsuranceFAQ } from '../components/InsuranceFAQ';
import { IncomeAdjustmentModal } from '../components/IncomeAdjustmentModal';
import {
  ArrowLeft,
  Shield,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  Clock,
} from 'lucide-react';

interface InsurancePageProps {
  onBackToPortal: () => void;
  openClaimOnLoad?: boolean;
}

export const InsurancePage: React.FC<InsurancePageProps> = ({
  onBackToPortal,
  openClaimOnLoad = false,
}) => {
  // Authentication & data states
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [insuranceRecord, setInsuranceRecord] = useState<WorkerInsuranceRecord | null>(null);
  const [insuranceStatus, setInsuranceStatus] = useState<InsuranceStatus>('not_enrolled');
  const [contributionHistory, setContributionHistory] = useState<ContributionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form selection states
  const [selectedContribution, setSelectedContribution] = useState<ContributionAmount>(10);
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [newlyEnrolledRef, setNewlyEnrolledRef] = useState<string>('');

  // Modals
  const [showSimulatorModal, setShowSimulatorModal] = useState<boolean>(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState<boolean>(false);
  const [showClaimSupport, setShowClaimSupport] = useState<boolean>(openClaimOnLoad);

  // Fetch real authenticated data from backend
  const loadWorkerData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // Fetch worker profile
      const workerProfile = await api.getWorkerProfile();
      setWorker(workerProfile);

      // Initialize recommended tier based on current worker's REAL earnings
      const recommended = getRecommendedContribution(workerProfile.dailyEarnings);
      setSelectedContribution(recommended);

      // Fetch current worker's real insurance status
      const insRes = await api.getInsuranceRecord();
      setInsuranceRecord(insRes.insurance);
      setInsuranceStatus((insRes.status as InsuranceStatus) || 'not_enrolled');

      if (insRes.insurance?.selectedContribution) {
        setSelectedContribution(insRes.insurance.selectedContribution as ContributionAmount);
      }

      // Fetch current worker's contribution ledger
      const history = await api.getContributionHistory();
      setContributionHistory(history);
    } catch (err: any) {
      console.error('Error fetching worker insurance data:', err);
      setLoadError(
        err.message || 'Unable to load your insurance information. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkerData();
  }, []);

  // Handle enrollment confirmation
  const handleConfirmEnrollment = async () => {
    if (!worker) return;
    try {
      setIsEnrolling(true);
      const res = await api.enrollInsurance(selectedContribution, true);
      setInsuranceRecord(res);
      setInsuranceStatus('active');
      setNewlyEnrolledRef(res.referenceCode || `SG-INS-2026-${Date.now().toString().slice(-4)}`);
      setShowConfirmation(true);

      // Refresh ledger
      const history = await api.getContributionHistory();
      setContributionHistory(history);
    } catch (err: any) {
      alert(err.message || 'Failed to confirm insurance. Please check your network and try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  // Handle contribution adjustment
  const handleConfirmAdjustment = async (newAmount: ContributionAmount, reason: string) => {
    try {
      const updated = await api.adjustContribution(newAmount, reason, true);
      setInsuranceRecord(updated);
      setSelectedContribution(newAmount);
      alert(`Contribution updated to ₹${newAmount}/day. Changes recorded in SahakarGig.`);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update contribution');
    }
  };

  // Rule-based recommendation for current worker
  const recommendedAmount = getRecommendedContribution(worker?.dailyEarnings ?? null);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-700 mx-auto" />
        <h3 className="text-lg font-bold text-stone-800">
          Loading your insurance information...
        </h3>
        <p className="text-xs text-stone-500">
          Connecting to SahakarGig secure welfare ledger
        </p>
      </div>
    );
  }

  // Error state
  if (loadError || !worker) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-stone-900">
          Unable to load your insurance information.
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          {loadError || 'Please check your connection or switch to another worker account.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={loadWorkerData}
            className="px-5 py-2.5 rounded-xl bg-stone-900 text-amber-400 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-800 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <button
            type="button"
            onClick={onBackToPortal}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            ← Back to Worker Portal
          </button>
        </div>
      </div>
    );
  }

  const isEnrolled =
    insuranceStatus === 'active' || insuranceStatus === 'pending' || insuranceRecord !== null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumbs & Back to Worker Portal Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
        <button
          type="button"
          id="back-to-worker-portal-btn"
          onClick={onBackToPortal}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-950 transition-colors cursor-pointer group self-start"
        >
          <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-stone-700" />
          </div>
          <span>← Back to Worker Portal</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>SahakarGig Worker Welfare • /insurance</span>
        </div>
      </div>

      {/* Main Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-stone-950 shadow-xs">
          <Shield className="w-3.5 h-3.5 text-stone-950 stroke-[2.5]" />
          <span>Micro-Insurance Module</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight">
          Protect Your Future 🛡️
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-medium">
          Small contribution. Meaningful protection.
        </p>
      </div>

      {/* 1. Worker Earnings Card (Real Data or Earnings data not available) */}
      <EarningsCard worker={worker} />

      {/* 🛡️ Protect Your Future - Dynamic Micro-Contribution & Earnings Breakdown */}
      <ProtectYourFutureCard
        dailyWage={worker.dailyEarnings ?? 300}
        selectedContribution={selectedContribution}
        onSelectContribution={(amt) => setSelectedContribution(amt)}
        onConfirmInsurance={handleConfirmEnrollment}
        isEnrolling={isEnrolling}
        isEnrolled={isEnrolled}
      />

      {/* SUCCESS CONFIRMATION MODAL / SCREEN */}
      {showConfirmation && (
        <ConfirmationScreen
          referenceId={newlyEnrolledRef}
          selectedContribution={selectedContribution}
          protectionTier={getProtectionLevel(selectedContribution)}
          onGoToDashboard={() => {
            setShowConfirmation(false);
            const el = document.getElementById('active-insurance-dashboard');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onBackToPortal={onBackToPortal}
          workingDays={worker.estimatedWorkingDays}
        />
      )}

      {/* 12. & 13. REAL INSURANCE STATUS / ACTIVE DASHBOARD */}
      {isEnrolled && insuranceRecord ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Your Active Micro-Insurance</h2>
            <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Synced with SahakarGig Database
            </span>
          </div>
          <ActiveInsuranceDashboard
            insurance={insuranceRecord}
            onManageContribution={() => setShowAdjustmentModal(true)}
            onClaimSupport={() => setShowClaimSupport(true)}
            workingDays={worker.estimatedWorkingDays}
          />
        </div>
      ) : (
        /* Real-world State when Worker is NOT ENROLLED */
        <div
          id="not-enrolled-banner"
          className="p-5 rounded-2xl bg-stone-50 border-2 border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                You are not enrolled in an insurance plan yet.
              </h3>
              <p className="text-xs text-stone-600 mt-0.5 leading-relaxed">
                Choose a daily micro-contribution below (₹5, ₹10, or ₹20/day) to activate accident and
                hospitalization protection for you and your family.
              </p>
            </div>
          </div>
          <a
            href="#daily-contribution-selector"
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shrink-0 text-center transition-colors cursor-pointer shadow-xs"
          >
            Select Contribution Below ↓
          </a>
        </div>
      )}

      {/* 4. Smart Recommendation Card */}
      <RecommendationCard
        dailyEarnings={worker.dailyEarnings}
        recommendedAmount={recommendedAmount}
        selectedAmount={selectedContribution}
        onApplyRecommendation={(amt) => setSelectedContribution(amt)}
        workingDays={worker.estimatedWorkingDays}
      />

      {/* 2. & 3. Daily Contribution Selector & Calculations */}
      <ContributionSelector
        selectedAmount={selectedContribution}
        onSelectAmount={(amt) => setSelectedContribution(amt)}
        recommendedAmount={recommendedAmount}
        dailyEarnings={worker.dailyEarnings}
        workingDays={worker.estimatedWorkingDays}
      />

      {/* 7. Emergency Shield Visual Meter */}
      <EmergencyShield selectedContribution={selectedContribution} />

      {/* 5. Protection Overview Benefits Grid */}
      <ProtectionOverview
        selectedContribution={selectedContribution}
        onOpenSimulator={() => setShowSimulatorModal(true)}
      />

      {/* 8. Income-Aware Protection Advisory Block */}
      <IncomeAwareProtection onOpenAdjustmentModal={() => setShowAdjustmentModal(true)} />

      {/* 10. Insurance Summary & Mandatory Consent & Real Confirmation */}
      <InsuranceSummary
        worker={worker}
        selectedContribution={selectedContribution}
        onConfirmEnrollment={handleConfirmEnrollment}
        isSubmitting={isEnrolling}
      />

      {/* 14. Contribution History Ledger */}
      <ContributionHistory history={contributionHistory} isLoading={false} />

      {/* 15. Claim Support Section */}
      <ClaimSupport />

      {/* 16. Insurance Educational FAQs & 30-Second Explainer */}
      <InsuranceFAQ />

      {/* 6. "See My Protection" Interactive Simulator Modal */}
      <ProtectionSimulator
        isOpen={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
        selectedContribution={selectedContribution}
      />

      {/* 9. Income Adjustment / Manage Contribution Modal */}
      <IncomeAdjustmentModal
        isOpen={showAdjustmentModal}
        onClose={() => setShowAdjustmentModal(false)}
        currentContribution={
          (insuranceRecord?.selectedContribution as ContributionAmount) || selectedContribution
        }
        dailyEarnings={worker.dailyEarnings}
        onConfirmAdjustment={handleConfirmAdjustment}
        workingDays={worker.estimatedWorkingDays}
      />
    </div>
  );
};
