```tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Shield,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
} from 'lucide-react';

import insuranceApi from '../../services/insuranceApi';

import {
  InsuranceWorker,
  InsuranceRecord,
  ContributionHistoryItem,
} from '../../types/insurance';

import {
  CONTRIBUTION_OPTIONS,
  getRecommendedContribution,
} from '../../utils/insuranceCalculations';

import { EarningsCard } from '../../components/insurance/EarningsCard';
import { ProtectYourFutureCard } from '../../components/insurance/ProtectYourFutureCard';
import { ContributionSelector } from '../../components/insurance/ContributionSelector';
import { RecommendationCard } from '../../components/insurance/RecommendationCard';
import { ProtectionOverview } from '../../components/insurance/ProtectionOverview';
import { ProtectionSimulator } from '../../components/insurance/ProtectionSimulator';
import { EmergencyShield } from '../../components/insurance/EmergencyShield';
import { IncomeAwareProtection } from '../../components/insurance/IncomeAwareProtection';
import { InsuranceSummary } from '../../components/insurance/InsuranceSummary';
import { ConfirmationScreen } from '../../components/insurance/ConfirmationScreen';
import { ActiveInsuranceDashboard } from '../../components/insurance/ActiveInsuranceDashboard';
import { ContributionHistory } from '../../components/insurance/ContributionHistory';
import { ClaimSupport } from '../../components/insurance/ClaimSupport';
import { InsuranceFAQ } from '../../components/insurance/InsuranceFAQ';
import { IncomeAdjustmentModal } from '../../components/insurance/IncomeAdjustmentModal';

type ContributionAmount = 10 | 20 | 30;

type InsuranceStatus =
  | 'not_enrolled'
  | 'active'
  | 'pending'
  | 'inactive';

interface InsuranceWorkerData extends InsuranceWorker {
  estimatedWorkingDays?: number | null;
}

interface InsurancePageProps {
  onBackToPortal?: () => void;
  openClaimOnLoad?: boolean;
}

const getProtectionTier = (amount: ContributionAmount): string => {
  const option = CONTRIBUTION_OPTIONS.find(
    (item) => item.amount === amount
  );

  return option?.tier || 'Basic';
};

const getContributionAmount = (
  amount: number | null | undefined
): ContributionAmount => {
  if (amount === 30) return 30;
  if (amount === 20) return 20;
  return 10;
};

export const InsurancePage: React.FC<InsurancePageProps> = ({
  onBackToPortal,
  openClaimOnLoad = false,
}) => {
  const [worker, setWorker] = useState<InsuranceWorkerData | null>(null);

  const [insuranceRecord, setInsuranceRecord] =
    useState<InsuranceRecord | null>(null);

  const [insuranceStatus, setInsuranceStatus] =
    useState<InsuranceStatus>('not_enrolled');

  const [contributionHistory, setContributionHistory] = useState<
    ContributionHistoryItem[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const [selectedContribution, setSelectedContribution] =
    useState<ContributionAmount>(10);

  const [isEnrolling, setIsEnrolling] = useState(false);

  const [showConfirmation, setShowConfirmation] = useState(false);

  const [newlyEnrolledRef, setNewlyEnrolledRef] = useState<string | null>(
    null
  );

  const [showSimulatorModal, setShowSimulatorModal] = useState(false);

  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);

  const [showClaimSupport, setShowClaimSupport] =
    useState(openClaimOnLoad);

  /*
   * Load the currently authenticated worker's real insurance data.
   */
  const loadWorkerData = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      /*
       * Worker profile comes from the main SahakarGig backend.
       * No demo worker / fallback worker is used.
       */
      const workerProfile =
        (await insuranceApi.getWorkerProfile()) as InsuranceWorkerData;

      setWorker(workerProfile);

      /*
       * Recommendation is calculated only when real earnings
       * are available.
       */
      const recommended = getRecommendedContribution(
        workerProfile.dailyEarnings
      );

      if (recommended) {
        setSelectedContribution(
          getContributionAmount(recommended.amount)
        );
      }

      /*
       * Current insurance record.
       */
      const insurance = await insuranceApi.getInsuranceRecord();

      setInsuranceRecord(insurance);

      if (insurance?.status) {
        setInsuranceStatus(
          insurance.status.toLowerCase() as InsuranceStatus
        );
      } else {
        setInsuranceStatus('not_enrolled');
      }

      /*
       * If worker already selected a contribution,
       * show that actual value.
       */
      if (
        insurance?.selectedContribution !== null &&
        insurance?.selectedContribution !== undefined
      ) {
        setSelectedContribution(
          getContributionAmount(insurance.selectedContribution)
        );
      }

      /*
       * Real contribution ledger.
       */
      const history =
        await insuranceApi.getContributionHistory();

      setContributionHistory(history);
    } catch (error: unknown) {
      console.error(
        'Error loading worker insurance data:',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load your insurance information.';

      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkerData();
  }, []);

  /*
   * Recommended contribution for this actual worker.
   */
  const recommendedAmount = useMemo(() => {
    return getRecommendedContribution(worker?.dailyEarnings);
  }, [worker?.dailyEarnings]);

  /*
   * Whether this worker already has an insurance record.
   */
  const isEnrolled =
    insuranceStatus === 'active' ||
    insuranceStatus === 'pending' ||
    insuranceRecord !== null;

  /*
   * Enrollment.
   */
  const handleConfirmEnrollment = async () => {
    if (!worker) return;

    try {
      setIsEnrolling(true);

      const result = await insuranceApi.enrollInsurance(
        selectedContribution,
        true
      );

      setInsuranceRecord(result);

      setInsuranceStatus('active');

      /*
       * Use only the reference
```
