import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  IndianRupee, 
  Building2, 
  ArrowUpRight, 
  Download, 
  CheckCircle2, 
  TrendingUp, 
  HeartHandshake,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const WorkerEarnings: React.FC = () => {
  const { payments, addToast } = useApp();
  const [requesting, setRequesting] = useState(false);

  const handleRequestPayout = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      addToast('success', 'DBT Transfer Initiated', '₹3,420 has been dispatched to State Cooperative Bank via Direct Benefit Transfer.');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Artisan Earnings & Payouts</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Direct Benefit Transfer (DBT) ledger governed by Labour Cooperative Bylaws
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleRequestPayout}
          isLoading={requesting}
          leftIcon={<ArrowUpRight className="w-4 h-4" />}
        >
          Withdraw Net Balance (₹3,420)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Payout"
          value="₹1,240"
          subtitle="Net credited"
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="This Week"
          value="₹6,850"
          subtitle="12 completed jobs"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-700"
        />
        <StatCard
          title="This Month"
          value="₹28,400"
          subtitle="Gross ₹31,550"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Total Lifetime"
          value="₹1,42,800"
          subtitle="Cooperative tenure"
          icon={<Building2 className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Transparent Value Distribution Breakdown Card */}
      <Card className="p-6 space-y-6 bg-slate-900 text-white border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Transparent 90-7-3 Cooperative Commission Formula</span>
            </h3>
            <p className="text-xs text-slate-400">
              Zero predatory platform fees. Your earnings are legally protected by cooperative act guidelines.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            90% Guaranteed Take-Home
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold uppercase text-[11px]">Worker Take-Home (90%)</span>
            <p className="text-2xl font-black text-white">₹28,400</p>
            <p className="text-slate-400 text-[11px]">Transferred directly to your Aadhaar-linked bank account.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-rose-400 font-bold uppercase text-[11px]">Worker Welfare Fund (7%)</span>
            <p className="text-2xl font-black text-white">₹2,208</p>
            <p className="text-slate-400 text-[11px]">Accumulates into your medical, pension, and insurance reserve.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
            <span className="text-blue-400 font-bold uppercase text-[11px]">Digital Operations (3%)</span>
            <p className="text-2xl font-black text-white">₹946</p>
            <p className="text-slate-400 text-[11px]">Funds server hosting, SMS dispatch gateway, and cooperative nodal audit.</p>
          </div>
        </div>
      </Card>

      {/* Linked DBT Bank Account Details */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Direct Benefit Transfer (DBT) Bank Account</span>
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
            NPCI Aadhaar Linked ✓
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block">Bank Name:</span>
            <p className="font-bold text-gray-900 mt-0.5">Delhi State Cooperative Bank Ltd.</p>
          </div>
          <div>
            <span className="text-gray-400 block">Account Number:</span>
            <p className="font-mono font-bold text-gray-900 mt-0.5">•••• •••• 8819</p>
          </div>
          <div>
            <span className="text-gray-400 block">IFSC Code:</span>
            <p className="font-mono font-bold text-gray-900 mt-0.5">DSCB0000014 (Hauz Khas)</p>
          </div>
        </div>
      </Card>

      {/* Historical Payout Ledger */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Direct Benefit Transfer History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-2">Disbursement ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Gross Billing</th>
                <th className="pb-2">Welfare (7%)</th>
                <th className="pb-2">Net DBT Disbursed</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { id: 'DBT-DEL-9081', date: '06 Sep 2026', gross: '₹1,500', welfare: '₹105', net: '₹1,350', status: 'Credited' },
                { id: 'DBT-DEL-8920', date: '04 Sep 2026', gross: '₹2,400', welfare: '₹168', net: '₹2,160', status: 'Credited' },
                { id: 'DBT-DEL-8711', date: '01 Sep 2026', gross: '₹3,200', welfare: '₹224', net: '₹2,880', status: 'Credited' },
                { id: 'DBT-DEL-8540', date: '28 Aug 2026', gross: '₹1,800', welfare: '₹126', net: '₹1,620', status: 'Credited' }
              ].map((row) => (
                <tr key={row.id}>
                  <td className="py-2.5 font-mono text-gray-700">{row.id}</td>
                  <td className="py-2.5 text-gray-600">{row.date}</td>
                  <td className="py-2.5 text-gray-900 font-semibold">{row.gross}</td>
                  <td className="py-2.5 text-rose-600">{row.welfare}</td>
                  <td className="py-2.5 font-black text-emerald-700">{row.net}</td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {row.status}
                    </span>
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
