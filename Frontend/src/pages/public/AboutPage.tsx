import React from 'react';
import { Card } from '../../components/common/Card';
import { Building2, ShieldCheck, HeartHandshake, Award, Users, BookOpen } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
          Cooperative Digital Marketplace
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          About SahakarGig Vision
        </h1>
        <p className="text-base text-gray-700 leading-relaxed">
          SahakarGig establishes the digital foundation for Labour Cooperative Societies and Federations across India, connecting verified skilled artisans directly with households and communities.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Cooperative Ownership</h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Labour cooperatives are managed by worker-members democratically. SahakarGig empowers primary societies to operate modern digital dispatch systems without costly tech intermediaries.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Dignified Gig Work</h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Eliminating the precariousness of algorithmic gig work by integrating social safety nets: accidental insurance, medical coverage, and children merit grants.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Vocational Standards</h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Continuous vocational upskilling and certification via recognized cooperative training institutes and skill councils.
          </p>
        </Card>
      </div>

      {/* Institutional Details */}
      <Card variant="highlight" className="p-8 space-y-4">
        <h3 className="text-lg font-bold text-emerald-950">Institutional Framework & Compliance</h3>
        <p className="text-xs text-emerald-900 leading-relaxed max-w-4xl">
          SahakarGig operates strictly in alignment with the Multi-State Cooperative Societies (MSCS) Act and State Cooperative Societies Acts. Cooperative societies register their active artisans through verified biometric e-KYC and trade skill testing, guaranteeing transparent pricing and worker welfare reserve deductions.
        </p>
      </Card>
    </div>
  );
};
