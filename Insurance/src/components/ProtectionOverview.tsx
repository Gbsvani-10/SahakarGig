import React from 'react';
import { ContributionAmount } from '../types';
import { PROTECTION_BENEFITS, getProtectionLevel } from '../utils/insuranceCalculations';
import {
  Hospital,
  ShieldAlert,
  Activity,
  HeartHandshake,
  Info,
  Check,
  HelpCircle,
} from 'lucide-react';

interface ProtectionOverviewProps {
  selectedContribution: ContributionAmount;
  onOpenSimulator: () => void;
}

export const ProtectionOverview: React.FC<ProtectionOverviewProps> = ({
  selectedContribution,
  onOpenSimulator,
}) => {
  const protectionTier = getProtectionLevel(selectedContribution);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hospital':
        return <Hospital className="w-5 h-5 text-emerald-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      default:
        return <Hospital className="w-5 h-5 text-stone-600" />;
    }
  };

  return (
    <section id="protection-overview" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              What are you protected against?
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              {protectionTier} Plan (₹{selectedContribution}/day)
            </span>
          </div>
          <p className="text-sm text-stone-600">
            Clear coverage areas designed around everyday medical and occupational hazards.
          </p>
        </div>

        <button
          type="button"
          id="see-my-protection-btn-top"
          onClick={onOpenSimulator}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:text-emerald-900 underline underline-offset-4 cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>See My Protection Simulator</span>
        </button>
      </div>

      {/* 4 Simple Benefit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROTECTION_BENEFITS.map((benefit) => {
          const currentDesc = benefit.descriptions[selectedContribution];

          return (
            <div
              key={benefit.id}
              id={`protection-card-${benefit.id}`}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between hover:border-stone-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100/90 flex items-center justify-center">
                    {getIcon(benefit.icon)}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                    Illustrative benefit
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {benefit.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed min-h-[56px]">
                  {currentDesc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{benefit.illustrativeBenefit}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimers & Simulator Quick Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p>
            Illustrative descriptions. Actual assistance depends on verified bills and registered policy
            terms. No guaranteed lump-sum claims without proper claim verification.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSimulator}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
        >
          Try Simulator →
        </button>
      </div>
    </section>
  );
};
