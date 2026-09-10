import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Layers,
  HelpCircle,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { InsuranceContributionSummary } from '../../types.ts';

interface WorkerProtectionProps {
  workerId: string;
}

export const WorkerProtection: React.FC<WorkerProtectionProps> = ({ workerId }) => {
  const { error } = useToast();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<InsuranceContributionSummary | null>(null);

  const fetchProtection = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkerProtection();
      setSummary(data);
    } catch (err: any) {
      error('Failed to load protection details', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtection();
  }, [workerId]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p>Loading worker protection and insurance breakdown...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-slate-700">Unable to load worker protection data</p>
        <button
          onClick={fetchProtection}
          className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  const {
    actualWorkingDays,
    dailyContributionRate,
    totalContribution,
    isEligible,
    eligibilityReason,
    coverageStatus,
    breakdown
  } = summary;

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-emerald-950/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Day-Linked Social Security
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Worker Protection & Security</h2>
            <p className="text-xs text-emerald-100/90 max-w-xl mt-1 leading-relaxed">
              Transparent micro-insurance tied directly to your verified working days. No fixed monthly burden—contributions adjust to your actual days on the job.
            </p>
          </div>

          <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-center min-w-[170px]">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider block">
              Current Coverage
            </span>
            <span className="text-xl font-extrabold text-white mt-0.5 block">
              {coverageStatus === 'ACTIVE' ? '🟢 FULLY COVERED' : coverageStatus === 'NEEDS_WORK_DAYS' ? '🟡 ACCUMULATING' : '⚪ INACTIVE'}
            </span>
            <span className="text-[10px] text-emerald-200/80 mt-1 block">
              Accident cover: ₹{(breakdown.accidentCover / 100000).toFixed(1)} Lakhs
            </span>
          </div>
        </div>
      </div>

      {/* Transparent Calculation Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Transparent Contribution Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Strictly calculated from your stored work day records. Zero work = Zero deduction.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Formula: Days × ₹{dailyContributionRate}/day
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Actual Working Days</span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{actualWorkingDays} Days</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Verified records in the current period
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Daily Contribution Rate</span>
              <IndianRupee className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">₹{dailyContributionRate}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Fixed cooperative micro-tier rate
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold">
              <span>Total Contribution (Month)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-emerald-800 mt-2">₹{totalContribution}</p>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">
              {actualWorkingDays} days × ₹{dailyContributionRate} = ₹{totalContribution}
            </p>
          </div>
        </div>

        <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-800">Eligibility Status:</strong> {eligibilityReason} If work stops due to illness or personal reasons, no insurance charges are accumulated or penalized.
          </p>
        </div>
      </div>

      {/* Coverage Packages Included */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Accident Protection */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Accident Protection</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{breakdown.accidentCover.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Covers on-the-job accidental disability or emergency hospitalization expenses incurred during work shifts.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
            <span>Status</span>
            <span>{isEligible ? '✓ Active Coverage' : 'Awaiting 5 Work Days'}</span>
          </div>
        </div>

        {/* Emergency Medical Support */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Emergency Support Grant</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{breakdown.emergencySupport.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Quick-disbursal financial assistance for family health crises or sudden tool replacement after damage.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-700 font-semibold">
            <span>Status</span>
            <span>{isEligible ? '✓ Available on Request' : 'Available upon Verification'}</span>
          </div>
        </div>

        {/* Hospital Daily Cash */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
            <IndianRupee className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Hospital Cash Daily</h4>
          <p className="text-xl font-extrabold text-slate-900 mt-1">₹{breakdown.hospitalCash}/day</p>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Daily income compensation up to 14 days if admitted to hospital, ensuring your household does not go without bread.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-700 font-semibold">
            <span>Status</span>
            <span>{isEligible ? '✓ Income Protected' : 'Active after 5 Work Days'}</span>
          </div>
        </div>
      </div>

      {/* Benefits Claim & Emergency Help Info */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">Need to file an Emergency Support Claim?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit hospital bills or incident details. The SahakarGig Administrator reviews claims within 24 hours.
          </p>
        </div>
        <button
          onClick={() => alert('Emergency claim portal connected to admin desk. For immediate assistance call 1800-SAHAKAR (24x7 Helpline).')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-sm"
        >
          File Support Request
        </button>
      </div>
    </div>
  );
};
