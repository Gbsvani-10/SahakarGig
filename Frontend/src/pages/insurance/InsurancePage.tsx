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
ContributionAmount,
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

const getContributionAmount = (
amount: number | null | undefined
): ContributionAmount | null => {
if (amount === 10) return 10;
if (amount === 20) return 20;
if (amount === 30) return 30;

return null;
};

const getProtectionTier = (
amount: ContributionAmount
): string => {
const option = CONTRIBUTION_OPTIONS.find(
(item) => item.amount === amount
);

return option?.tier || 'Data not available';
};

export const InsurancePage: React.FC<InsurancePageProps> = ({
onBackToPortal,
openClaimOnLoad = false,
}) => {
const [worker, setWorker] =
useState<InsuranceWorkerData | null>(null);

const [insuranceRecord, setInsuranceRecord] =
useState<InsuranceRecord | null>(null);

const [insuranceStatus, setInsuranceStatus] =
useState<InsuranceStatus>('not_enrolled');

const [contributionHistory, setContributionHistory] =
useState<ContributionHistoryItem[]>([]);

const [isLoading, setIsLoading] =
useState(true);

const [loadError, setLoadError] =
useState<string | null>(null);

const [selectedContribution, setSelectedContribution] =
useState<ContributionAmount | null>(null);

const [isEnrolling, setIsEnrolling] =
useState(false);

const [showConfirmation, setShowConfirmation] =
useState(false);

const [newlyEnrolledRef, setNewlyEnrolledRef] =
useState<string | null>(null);

const [showSimulatorModal, setShowSimulatorModal] =
useState(false);

const [showAdjustmentModal, setShowAdjustmentModal] =
useState(false);

const [showClaimSupport, setShowClaimSupport] =
useState(openClaimOnLoad);

const loadWorkerData = async () => {
try {
setIsLoading(true);
setLoadError(null);

```
  const workerProfile =
    (await insuranceApi.getWorkerProfile()) as InsuranceWorkerData;

  if (!workerProfile) {
    throw new Error(
      'Worker profile was not found.'
    );
  }

  setWorker(workerProfile);

  const recommended =
    getRecommendedContribution(
      workerProfile.dailyEarnings
    );

  if (recommended) {
    setSelectedContribution(
      getContributionAmount(recommended.amount)
    );
  } else {
    setSelectedContribution(null);
  }

  const insurance =
    await insuranceApi.getInsuranceRecord();

  setInsuranceRecord(insurance);

  if (insurance?.status) {
    const status =
      String(insurance.status).toLowerCase();

    if (
      status === 'active' ||
      status === 'pending' ||
      status === 'inactive' ||
      status === 'not_enrolled'
    ) {
      setInsuranceStatus(
        status as InsuranceStatus
      );
    } else {
      setInsuranceStatus('not_enrolled');
    }
  } else {
    setInsuranceStatus('not_enrolled');
  }

  const existingContribution =
    getContributionAmount(
      insurance?.selectedContribution
    );

  if (existingContribution !== null) {
    setSelectedContribution(
      existingContribution
    );
  }

  const history =
    await insuranceApi.getContributionHistory();

  setContributionHistory(
    Array.isArray(history)
      ? history
      : []
  );
} catch (error: unknown) {
  console.error(
    'Error loading worker insurance data:',
    error
  );

  setLoadError(
    error instanceof Error
      ? error.message
      : 'Unable to load your insurance information.'
  );
} finally {
  setIsLoading(false);
}
```

};

useEffect(() => {
loadWorkerData();
}, []);

const recommendedAmount = useMemo(() => {
return getRecommendedContribution(
worker?.dailyEarnings
);
}, [worker?.dailyEarnings]);

const isEnrolled =
insuranceStatus === 'active' ||
insuranceStatus === 'pending';

const handleConfirmEnrollment = async () => {
if (!worker) return;

```
if (selectedContribution === null) {
  alert(
    'Please select a valid contribution amount.'
  );
  return;
}

try {
  setIsEnrolling(true);

  const result =
    await insuranceApi.enrollInsurance(
      selectedContribution,
      true
    );

  setInsuranceRecord(result);
  setInsuranceStatus('active');

  const reference =
    typeof result?.referenceCode === 'string'
      ? result.referenceCode
      : null;

  setNewlyEnrolledRef(reference);

  setShowConfirmation(true);

  const history =
    await insuranceApi.getContributionHistory();

  setContributionHistory(
    Array.isArray(history)
      ? history
      : []
  );
} catch (error: unknown) {
  alert(
    error instanceof Error
      ? error.message
      : 'Failed to confirm insurance.'
  );
} finally {
  setIsEnrolling(false);
}
```

};

const handleConfirmAdjustment = async (
newAmount: ContributionAmount,
reason: string
) => {
try {
const updated =
await insuranceApi.adjustContribution(
newAmount,
reason,
true
);

```
  setInsuranceRecord(updated);
  setSelectedContribution(newAmount);

  const history =
    await insuranceApi.getContributionHistory();

  setContributionHistory(
    Array.isArray(history)
      ? history
      : []
  );

  alert(
    'Contribution updated to ₹' +
      newAmount +
      '/day.'
  );
} catch (error: unknown) {
  throw new Error(
    error instanceof Error
      ? error.message
      : 'Failed to update contribution.'
  );
}
```

};

if (isLoading) {
return ( <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4"> <Loader2 className="w-10 h-10 animate-spin text-emerald-700 mx-auto" />

```
    <h3 className="text-lg font-bold text-stone-800">
      Loading your insurance information...
    </h3>

    <p className="text-xs text-stone-500">
      Connecting to SahakarGig secure welfare ledger
    </p>
  </div>
);
```

}

if (loadError || !worker) {
return ( <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4"> <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center mx-auto"> <AlertCircle className="w-7 h-7" /> </div>

```
    <h3 className="text-xl font-bold text-stone-900">
      Unable to load your insurance information.
    </h3>

    <p className="text-xs text-stone-600 leading-relaxed">
      {loadError ||
        'Worker profile data is not available.'}
    </p>

    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        type="button"
        onClick={loadWorkerData}
        className="px-5 py-2.5 rounded-xl bg-stone-900 text-amber-400 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-800"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>

      {onBackToPortal && (
        <button
          type="button"
          onClick={onBackToPortal}
          className="px-5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
        >
          ← Back to Worker Portal
        </button>
      )}
    </div>
  </div>
);
```

}

return ( <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-200">

```
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
    {onBackToPortal && (
      <button
        type="button"
        id="back-to-worker-portal-btn"
        onClick={onBackToPortal}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-700 hover:text-stone-950 transition-colors group self-start"
      >
        <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-stone-700" />
        </div>

        <span>
          ← Back to Worker Portal
        </span>
      </button>
    )}

    <div className="flex items-center gap-2 text-xs text-stone-500 font-medium self-start sm:self-auto">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />

      <span>
        SahakarGig Worker Welfare • /insurance
      </span>
    </div>
  </div>

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

  <EarningsCard worker={worker} />

  <ProtectYourFutureCard
    dailyWage={worker.dailyEarnings}
    workedDays={worker.estimatedWorkingDays}
    selectedContribution={selectedContribution}
    onSelectContribution={(amount) =>
      setSelectedContribution(amount)
    }
    onConfirmInsurance={
      handleConfirmEnrollment
    }
    isEnrolling={isEnrolling}
    isEnrolled={isEnrolled}
  />

  {showConfirmation &&
    newlyEnrolledRef &&
    selectedContribution !== null && (
      <ConfirmationScreen
        referenceId={newlyEnrolledRef}
        selectedContribution={
          selectedContribution
        }
        protectionTier={getProtectionTier(
          selectedContribution
        )}
        onGoToDashboard={() => {
          setShowConfirmation(false);

          const element =
            document.getElementById(
              'active-insurance-dashboard'
            );

          element?.scrollIntoView({
            behavior: 'smooth',
          });
        }}
        onBackToPortal={
          onBackToPortal
        }
        workingDays={
          worker.estimatedWorkingDays
        }
      />
    )}

  {isEnrolled && insuranceRecord ? (
    <div
      id="active-insurance-dashboard"
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-900">
          Your Active Micro-Insurance
        </h2>

        <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Synced with SahakarGig Database
        </span>
      </div>

      <ActiveInsuranceDashboard
        insurance={insuranceRecord}
        onManageContribution={() =>
          setShowAdjustmentModal(true)
        }
        onClaimSupport={() =>
          setShowClaimSupport(true)
        }
        workingDays={
          worker.estimatedWorkingDays
        }
      />
    </div>
  ) : (
    <div
      id="not-enrolled-banner"
      className="p-5 rounded-2xl bg-stone-50 border-2 border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shrink-0">
          <Clock className="w-6 h-6 text-amber-700" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-stone-900">
            Insurance not enrolled
          </h3>

          <p className="text-xs text-stone-600 mt-1">
            Choose a contribution above to activate your protection.
          </p>
        </div>
      </div>

      <span className="text-xs font-semibold text-stone-500">
        Status: Not Enrolled
      </span>
    </div>
  )}

  <RecommendationCard
    dailyEarnings={worker.dailyEarnings}
    recommendedAmount={
      recommendedAmount
        ? getContributionAmount(
            recommendedAmount.amount
          )
        : null
    }
    selectedAmount={
      selectedContribution
    }
    workingDays={
      worker.estimatedWorkingDays
    }
  />

  <ContributionSelector
    selectedContribution={
      selectedContribution
    }
    onSelectContribution={(amount) =>
      setSelectedContribution(amount)
    }
  />

  <ProtectionOverview />

  <IncomeAwareProtection
    dailyEarnings={
      worker.dailyEarnings
    }
    workingDays={
      worker.estimatedWorkingDays
    }
  />

  <EmergencyShield />

  <InsuranceSummary
    insurance={insuranceRecord}
    selectedContribution={
      selectedContribution
    }
    workingDays={
      worker.estimatedWorkingDays
    }
  />

  <ContributionHistory
    history={contributionHistory}
  />

  <div className="flex justify-center">
    <button
      type="button"
      onClick={() =>
        setShowSimulatorModal(true)
      }
      className="px-5 py-2.5 rounded-xl bg-stone-900 text-amber-400 text-xs font-bold hover:bg-stone-800 transition-colors"
    >
      Open Protection Simulator
    </button>
  </div>

  {showSimulatorModal && (
    <ProtectionSimulator
      dailyEarnings={worker.dailyEarnings}
      workingDays={worker.estimatedWorkingDays}
      selectedContribution={
        selectedContribution
      }
      onClose={() =>
        setShowSimulatorModal(false)
      }
    />
  )}

  {showClaimSupport && (
    <ClaimSupport
      onClose={() =>
        setShowClaimSupport(false)
      }
    />
  )}

  <InsuranceFAQ />

  {showAdjustmentModal &&
    insuranceRecord && (
      <IncomeAdjustmentModal
        currentContribution={
          getContributionAmount(
            insuranceRecord.selectedContribution
          )
        }
        onConfirm={
          handleConfirmAdjustment
        }
        onClose={() =>
          setShowAdjustmentModal(false)
        }
      />
    )}
</div>
```

);
};

export default InsurancePage;
