import React, { useState } from 'react';
import { ContributionAmount } from '../../types/insurance';
import { SIMULATOR_SCENARIOS, getProtectionLevel } from '../../utils/insuranceCalculations';
import {
X,
ShieldAlert,
Hospital,
Activity,
HelpCircle,
FileText,
CheckCircle,
AlertCircle,
} from 'lucide-react';

interface ProtectionSimulatorProps {
isOpen: boolean;
onClose: () => void;
selectedContribution: ContributionAmount;
onStartClaimFromScenario?: (scenarioType: string) => void;
}

export const ProtectionSimulator: React.FC<ProtectionSimulatorProps> = ({
isOpen,
onClose,
selectedContribution,
onStartClaimFromScenario,
}) => {
const [selectedScenarioId, setSelectedScenarioId] = useState<string>('Hospitalization');
const protectionTier = getProtectionLevel(selectedContribution);

if (!isOpen) return null;

const currentScenario =
SIMULATOR_SCENARIOS.find((s) => s.id === selectedScenarioId) || SIMULATOR_SCENARIOS[0];

const getScenarioIcon = (id: string) => {
switch (id) {
case 'Accident':
return <ShieldAlert className="w-5 h-5 text-amber-600" />;
case 'Hospitalization':
return <Hospital className="w-5 h-5 text-emerald-600" />;
case 'Medical Emergency':
return <Activity className="w-5 h-5 text-blue-600" />;
default:
return <HelpCircle className="w-5 h-5 text-purple-600" />;
}
};

return ( <div
   role="dialog"
   aria-modal="true"
   aria-labelledby="simulator-modal-title"
   className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
 > <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-6"> <div className="p-5 sm:p-6 bg-stone-900 text-white flex items-center justify-between"> <div> <div className="flex items-center gap-2"> <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
Interactive Tool </span> <span className="text-xs text-stone-400">
Selected Plan: ₹{selectedContribution}/day ({protectionTier}) </span> </div>

```
        <h2 id="simulator-modal-title" className="text-xl font-bold mt-1 text-white">
          See My Protection Simulator
        </h2>

        <p className="text-xs text-stone-300 mt-0.5">
          Simulate an unexpected situation to understand how micro-insurance support works.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close simulator"
        className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
      <div>
        <label className="block text-sm font-bold text-stone-900 mb-2">
          What happened?{' '}
          <span className="font-normal text-stone-500">(Choose a scenario)</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SIMULATOR_SCENARIOS.map((s) => {
            const isSelected = s.id === selectedScenarioId;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedScenarioId(s.id)}
                className={'p-3 rounded-xl border text-left transition-all flex flex-col items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 shadow-xs ring-1 ring-emerald-500'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }'}
              >
                <div className="mb-2">{getScenarioIcon(s.id)}</div>

                <div>
                  <div className="text-xs font-bold text-stone-900">{s.label}</div>
                  <div className="text-[10px] text-stone-500 line-clamp-1">
                    {s.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div className="flex items-center gap-2">
            {getScenarioIcon(currentScenario.id)}

            <h4 className="text-base font-bold text-stone-900">
              Scenario: {currentScenario.label}
            </h4>
          </div>

          <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
            Demo / Illustrative Example
          </span>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">
            How Insurance Support Works
          </div>

          <p className="text-sm text-stone-800 leading-relaxed bg-white p-3.5 rounded-lg border border-stone-200">
            {currentScenario.explanation}
          </p>

          <p className="text-xs text-stone-600 mt-2 italic font-medium">
            {currentScenario.coverageNote}
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Documents Typically Required For This Event</span>
          </div>

          <ul className="space-y-1.5 text-xs text-stone-700 bg-white p-3.5 rounded-lg border border-stone-200">
            {currentScenario.whatToSubmit.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 flex items-start gap-2 text-xs text-amber-900">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />

          <p>
            <span className="font-semibold">Illustrative disclaimer:</span> Micro-insurance
            provides transparent reimbursement support subject to verified medical receipts
            and policy rules. We never show false cash-advance guarantees.
          </p>
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
      <button
        type="button"
        onClick={onClose}
        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-100 transition-colors cursor-pointer"
      >
        Close Simulator
      </button>

      {onStartClaimFromScenario && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onStartClaimFromScenario(currentScenario.id);
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          Start Claim for {currentScenario.label} →
        </button>
      )}
    </div>
  </div>
</div>


);
};
