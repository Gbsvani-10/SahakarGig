import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { 
  HeartPulse, 
  HeartHandshake, 
  Award, 
  CheckCircle2, 
  FileText, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const WorkerWelfare: React.FC = () => {
  const { welfareFunds, addToast } = useApp();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimType, setClaimType] = useState('Medical Reimbursement');
  const [claimAmount, setClaimAmount] = useState('2500');
  const [claimReason, setClaimReason] = useState('Purchased prescribed medicines for wrist sprain during trade service.');

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowClaimModal(false);
    addToast('success', 'Claim Submitted', 'Your claim has been submitted to the Cooperative Welfare Committee for review.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Worker Welfare & Social Security</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Cooperative social security reserves funded by 7% statutory contributions from each gig
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowClaimModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Submit Welfare Claim
        </Button>
      </div>

      {/* Welfare KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Welfare Balance"
          value="₹8,450"
          subtitle="Available for claims"
          icon={<HeartPulse className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Accident Insurance"
          value="₹2,00,000"
          subtitle="Active coverage"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Ayushman Bharat"
          value="Linked"
          subtitle="PM-JAY Gold Card"
          icon={<HeartHandshake className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Approved Claims"
          value="2"
          subtitle="₹6,200 reimbursed"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Active Benefits Schemes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">PM Suraksha Bima Yojana</h3>
          <p className="text-xs text-gray-600">
            ₹2 Lakh accidental death and permanent disability protection, sponsored directly through cooperative membership dues.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">Policy Active</span>
            <span className="font-mono text-gray-400">PMSBY-2026-DEL</span>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Artisan Tool Upgrade Grant</h3>
          <p className="text-xs text-gray-600">
            0% interest micro-grant up to ₹15,000 for acquiring modern professional power tools and diagnostic testing kits.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-bold">Eligible to Apply</span>
            <span className="text-gray-400">Max ₹15,000</span>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-gray-900">Children Merit Scholarship</h3>
          <p className="text-xs text-gray-600">
            Annual educational grant of ₹5,000 for worker-members' children scoring above 75% in 10th/12th state board exams.
          </p>
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-700 font-semibold">Open for 2026</span>
            <span className="text-gray-400">NCCT Scheme</span>
          </div>
        </Card>
      </div>

      {/* Welfare Claim History */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Welfare Claims & Grant History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-2">Claim ID</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Submitted Date</th>
                <th className="pb-2">Committee Review</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-2.5 font-mono text-gray-700">WLF-2026-081</td>
                <td className="py-2.5 font-bold text-gray-900">Medical Expense Reimbursement</td>
                <td className="py-2.5 font-bold text-gray-900">₹2,800</td>
                <td className="py-2.5 text-gray-500">12 Aug 2026</td>
                <td className="py-2.5 text-gray-600">Approved by Secretary</td>
                <td className="py-2.5">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Disbursed ✓</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono text-gray-700">WLF-2026-042</td>
                <td className="py-2.5 font-bold text-gray-900">Tool Upgrade Grant</td>
                <td className="py-2.5 font-bold text-gray-900">₹3,400</td>
                <td className="py-2.5 text-gray-500">22 Jun 2026</td>
                <td className="py-2.5 text-gray-600">Tool Receipt Audited</td>
                <td className="py-2.5">
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Disbursed ✓</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Claim Submission Modal */}
      {showClaimModal && (
        <Modal
          isOpen={showClaimModal}
          onClose={() => setShowClaimModal(false)}
          title="Submit Welfare Fund Claim"
          subtitle="Processed by Labour Cooperative Social Security Committee"
          maxWidth="md"
        >
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Claim Category
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm bg-white"
              >
                <option value="Medical Reimbursement">Medical & Health Reimbursement</option>
                <option value="Tool Subsidy">Artisan Tool Upgrade Grant</option>
                <option value="Accidental Injury">On-Duty Minor Injury Allowance</option>
                <option value="Children Scholarship">Children Education Grant</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Requested Amount (₹)
              </label>
              <input
                type="number"
                required
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Reason & Details
              </label>
              <textarea
                rows={3}
                required
                value={claimReason}
                onChange={(e) => setClaimReason(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowClaimModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Submit Claim to Cooperative
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
