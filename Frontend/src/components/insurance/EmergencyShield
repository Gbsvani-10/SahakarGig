import React from 'react';
import { ContributionAmount } from '../../types/insurance';
import { getProtectionLevel } from '../../utils/insuranceCalculations';
import { Shield, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

interface EmergencyShieldProps {
  selectedContribution: ContributionAmount;
  onSelectContribution?: (amount: ContributionAmount) => void;
}

export const EmergencyShield: React.FC<EmergencyShieldProps> = ({
  selectedContribution,
  onSelectContribution,
}) => {
  const currentTier = getProtectionLevel(selectedContribution);

  const tiers: { amount: ContributionAmount; label: string; name: string; percentage: number }[] = [
    { amount: 5, label: 'Basic', name: '₹5/day Basic Shield', percentage: 33 },
    { amount: 10, label: 'Balanced', name: '₹10/day Balanced Shield', percentage: 66 },
    { amount: 20, label: 'Strong', name: '₹20/day Strong Shield', percentage: 100 },
  ];

  const getMeterColor = () => {
    switch (selectedContribution) {
      case 5:
        return 'bg-amber-500';
      case 10:
        return 'bg-emerald-500';
      case 20:
        return 'bg-blue-600';
    }
  };

  const getMeterWidth = () => {
    switch (selectedContribution) {
      case 5:
        return 'w-1/3';
      case 10:
        return 'w-2/3';
      case 20:
        return 'w-full';
    }
  };

  return (
    <section
      id="emergency-shield-widget"
      className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">
              🚨 Your Emergency Shield
            </h3>
            <p className="text-xs text-stone-500">
              Visual indicator of coverage depth across protection levels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-stone-500">Protection Level:</span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-900 text-white flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {currentTier} Protection (₹{selectedContribution}/day)
          </span>
        </div>
      </div>

      {/* Visual Multi-step Meter */}
      <div className="mt-2 space-y-2">
        <div className="relative h-4 w-full bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getMeterColor()} ${getMeterWidth()}`}
          />
        </div>

        {/* Meter Steps / Tier Selectors */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {tiers.map((t) => {
            const isActive = selectedContribution === t.amount;
            return (
              <button
                key={t.amount}
                type="button"
                onClick={() => onSelectContribution && onSelectContribution(t.amount)}
                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>₹{t.amount}/day</span>
                  <span className={isActive ? 'text-emerald-400' : 'text-stone-500'}>
                    {t.label}
                  </span>
                </div>
                <div className="text-[11px] opacity-80 mt-0.5 truncate">
                  {t.amount === 5 && 'Essential safety net'}
                  {t.amount === 10 && 'Broader everyday cover'}
                  {t.amount === 20 && 'Highest tier buffer'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Tap any tier to switch your daily contribution level anytime.</span>
        </div>
        <span className="italic text-[11px]">
          Illustrative representation — labeled as Protection Level, not an insurance score.
        </span>
      </div>
    </section>
  );
};
