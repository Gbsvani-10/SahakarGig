import React from 'react';
import {
  ShieldCheck,
  HeartPulse,
  Wallet,
  Users,
} from 'lucide-react';
import { ContributionAmount } from '../../types/insurance';
import { CONTRIBUTION_OPTIONS } from '../../utils/insuranceCalculations';

interface ProtectionOverviewProps {
  selectedContribution: ContributionAmount | null;
}

const ProtectionOverview: React.FC<ProtectionOverviewProps> = ({
  selectedContribution,
}) => {
  const selectedOption = CONTRIBUTION_OPTIONS.find(
    (option) => option.amount === selectedContribution
  );

  const protectionTier = selectedOption?.tier || 'Not selected';

  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Work Protection',
      description:
        'Protection support designed for workers who contribute through the cooperative platform.',
    },
    {
      icon: HeartPulse,
      title: 'Health Support',
      description:
        'Access to eligible health-related support according to the active insurance scheme.',
    },
    {
      icon: Wallet,
      title: 'Financial Support',
      description:
        'Provides financial assistance for eligible situations covered by the selected protection plan.',
    },
    {
      icon: Users,
      title: 'Community Support',
      description:
        'A cooperative-based protection system built around the needs of participating workers.',
    },
  ];

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Protection Overview
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Understand the protection and support available through your
            selected contribution plan.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-sm font-semibold text-gray-800">
          <ShieldCheck size={18} />
          {protectionTier}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
            >
              <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <Icon size={22} className="text-gray-700" />
              </div>

              <h3 className="font-semibold text-gray-900">
                {benefit.title}
              </h3>

              <p className="text-sm text-gray-600 mt-2 leading-6">
                {benefit.description}
              </p>
            </div>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Selected contribution
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                ₹{selectedOption.amount}/day
              </p>
            </div>

            <div className="text-sm text-gray-600">
              {selectedOption.description}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProtectionOverview;
