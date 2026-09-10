import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { HeartPulse, IndianRupee, HeartHandshake, CheckCircle2, XCircle, FileText } from 'lucide-react';

export const AdminWelfare: React.FC = () => {
  const { welfareFunds, addToast } = useApp();
  const [claims, setClaims] = useState([
    {
      id: 'CLM-DEL-101',
      worker: 'Ravi Kumar (Plumbing)',
      coop: 'Delhi Labour Cooperative',
      type: 'Medical Expense Reimbursement',
      amount: 2500,
      reason: 'Purchased prescribed medicines for wrist sprain during trade service.',
      status: 'Pending'
    },
    {
      id: 'CLM-MUM-102',
      worker: 'Suresh Patil (Electrical)',
      coop: 'Mumbai Shramik Sahakari Sanstha',
      type: 'Tool Upgrade Grant',
      amount: 4500,
      reason: 'Acquisition of digital insulation tester for certified safety audits.',
      status: 'Pending'
    },
    {
      id: 'CLM-BLR-089',
      worker: 'Manoj Verma (Carpentry)',
      coop: 'Karnataka Labour Cooperative',
      type: 'Children Education Grant',
      amount: 5000,
      reason: 'Daughter secured 88% in 10th ICSE examinations.',
      status: 'Approved'
    }
  ]);

  const handleApprove = (id: string) => {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Approved' } : c));
    addToast('success', 'Claim Approved', `Welfare claim ${id} approved for DBT bank release.`);
  };

  const handleReject = (id: string) => {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Rejected' } : c));
    addToast('info', 'Claim Returned', `Welfare claim ${id} returned to cooperative nodal officer.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Cooperative Welfare Fund Governance</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          7% statutory reserve oversight, social security audits, and healthcare grant disbursements
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Welfare Reserves"
          value="₹8,42,500"
          subtitle="Held in State Coop Banks"
          icon={<HeartPulse className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Monthly Accrual"
          value="₹48,200"
          subtitle="From completed bookings"
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Claims Disbursed"
          value="₹1,24,000"
          subtitle="48 claims settled"
          icon={<HeartHandshake className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Audit Compliance"
          value="100%"
          subtitle="NCCT verified ledger"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Welfare Claims Approval Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Worker Welfare Claims Queue
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-3">Claim ID</th>
                <th className="pb-3">Worker & Society</th>
                <th className="pb-3">Grant Type</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Justification</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-mono font-bold text-gray-900">{c.id}</td>
                  <td className="py-3">
                    <p className="font-bold text-gray-900">{c.worker}</p>
                    <p className="text-[11px] text-gray-500">{c.coop}</p>
                  </td>
                  <td className="py-3 font-semibold text-gray-800">{c.type}</td>
                  <td className="py-3 font-black text-emerald-700">₹{c.amount}</td>
                  <td className="py-3 text-gray-600 max-w-xs truncate">{c.reason}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {c.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(c.id)}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApprove(c.id)}
                        >
                          Approve
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-[11px] font-semibold">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
