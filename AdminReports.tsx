import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { FileText, Download, TrendingUp, Users, HeartPulse, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { addToast } = useApp();
  const [selectedRange, setSelectedRange] = useState('Q3-2026');

  const handleExport = (reportName: string, format: 'CSV' | 'PDF') => {
    addToast('success', 'Report Exported', `${reportName} downloaded in .${format.toLowerCase()} format.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">
            NCCT & Ministry Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Statutory audits, social security fund ledgers, and cooperative economic impact metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl p-2 bg-white"
          >
            <option value="Q3-2026">Q3 FY 2026-27 (Current)</option>
            <option value="Q2-2026">Q2 FY 2026-27</option>
            <option value="Q1-2026">Q1 FY 2026-27</option>
            <option value="FY-2025-26">Full FY 2025-26 Audit</option>
          </select>
        </div>
      </div>

      {/* Impact Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Worker Income Uplift"
          value="+38.4%"
          subtitle="vs unorganized informal rates"
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Workers with Insurance"
          value="100%"
          subtitle="PMSBY & PM-JAY enrolled"
          icon={<HeartPulse className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />
        <StatCard
          title="Median Worker Earning"
          value="₹26,800/mo"
          subtitle="Cooperative wage standard"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Coop Society Retention"
          value="99.2%"
          subtitle="Bylaws compliant audit"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Reports Listing */}
      <div className="space-y-4">
        {[
          {
            title: 'Quarterly Cooperative Welfare Reserve Audit (Form NCCT-7B)',
            desc: 'Itemized 7% statutory deduction balances across 18 regional societies with bank verification certificates.',
            date: 'Updated Sep 06, 2026',
            records: '1,420 transactions'
          },
          {
            title: 'Direct Benefit Transfer (DBT) Disbursement Master Ledger',
            desc: 'Audit trail of Aadhaar payment bridge settlements directly to artisan bank accounts.',
            date: 'Updated Sep 05, 2026',
            records: '₹44.8 Lakhs disbursed'
          },
          {
            title: 'Emergency Response SLA & Geofence Reliability Log',
            desc: 'Evaluation of 15-minute emergency distress dispatches with GPS route timestamps and response times.',
            date: 'Updated Sep 04, 2026',
            records: '128 emergency cases'
          },
          {
            title: 'Artisan NSQF Trade Certification Compliance Index',
            desc: 'Verification report of ITI diplomas, NCCT training completions, and police background verifications.',
            date: 'Updated Sep 01, 2026',
            records: '100% verified'
          }
        ].map((rep, idx) => (
          <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{rep.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{rep.desc}</p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                  <span>{rep.date}</span>
                  <span>• {rep.records}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport(rep.title, 'CSV')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                CSV
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExport(rep.title, 'PDF')}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Official PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
