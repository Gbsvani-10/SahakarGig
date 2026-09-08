import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  Award,
  Lock,
  IndianRupee,
  RefreshCw,
  FileCheck,
  Ban,
  Check
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { User as UserType, WorkerProfile, JobRequest } from '../../types.ts';

interface AdminDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'workers' | 'jobs' | 'protection'>('overview');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<any>(null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [jobs, setJobs] = useState<JobRequest[]>([]);

  // Worker detail modal
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, workersData, jobsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminWorkers(),
        api.getAdminJobs()
      ]);
      setStats(statsData);
      setWorkers(workersData);
      setJobs(jobsData);
    } catch (err: any) {
      error('Admin Data Load Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyWorker = async (workerId: string, badgeType: 'identity' | 'skill' | 'certificate') => {
    try {
      const updated = await api.verifyWorker(workerId, badgeType);
      success('Verification Updated', `Worker badge ${badgeType} verified.`);
      setWorkers(workers.map((w) => (w.id === workerId ? updated : w)));
      if (selectedWorker?.id === workerId) setSelectedWorker(updated);
      loadAdminData();
    } catch (err: any) {
      error('Verification Failed', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Administrator Console</h1>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  System Oversight
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                SahakarGig Cooperative Governance & Social Security Monitoring
              </p>
            </div>
          </div>

          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold self-end sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl">
          {[
            { id: 'overview', label: 'Platform Overview & Metrics' },
            { id: 'workers', label: `Worker Verification (${workers.length})` },
            { id: 'jobs', label: `Job Oversight (${jobs.length})` },
            { id: 'protection', label: 'Benefits & Social Security Pool' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Total Workers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalWorkers || workers.length}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Registered members</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Verified Workers</p>
                <p className="text-2xl font-bold text-emerald-700 mt-1">{stats?.verifiedWorkers || 0}</p>
                <p className="text-[10px] text-emerald-600 mt-0.5">Identity & skills checked</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Total Customers</p>
                <p className="text-2xl font-bold text-sky-700 mt-1">{stats?.totalCustomers || 1}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Active requesters</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Total Jobs Handled</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalJobs || jobs.length}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">All time requests</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Worker Wages Paid</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">₹{(stats?.totalEarningsTransacted || 0).toLocaleString('en-IN')}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Direct labor income</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-semibold text-slate-500">Protection Pool</p>
                <p className="text-2xl font-bold text-indigo-700 mt-1">₹{stats?.socialSecurityPoolTotal || 0}</p>
                <p className="text-[10px] text-indigo-600 mt-0.5">Micro-insurance accumulated</p>
              </div>
            </div>

            {/* Quick Status Banners */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Workers Awaiting Verification Review
                </h3>
                <div className="space-y-2 text-xs">
                  {workers.filter((w) => !w.badges.identityVerified || !w.badges.skillVerified).length === 0 ? (
                    <p className="text-slate-400 py-3">All registered workers are currently verified.</p>
                  ) : (
                    workers
                      .filter((w) => !w.badges.identityVerified || !w.badges.skillVerified)
                      .slice(0, 4)
                      .map((w) => (
                        <div key={w.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800">{w.fullName}</span>
                            <span className="text-slate-500 ml-1.5">({w.jobType})</span>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              ID: {w.identityVerification.maskedNumber}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedWorker(w);
                              setActiveTab('workers');
                            }}
                            className="px-2.5 py-1 bg-white border border-slate-200 text-indigo-700 font-semibold rounded-lg hover:bg-slate-50 text-[11px]"
                          >
                            Review Docs
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Recent Service Requests
                </h3>
                <div className="space-y-2 text-xs">
                  {jobs.slice(0, 4).map((j) => (
                    <div key={j.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{j.serviceRequested}</span>
                        <p className="text-[11px] text-slate-500">
                          Worker: {j.workerName} • Customer: {j.customerName}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-700">₹{j.offeredAmount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKER VERIFICATION */}
        {activeTab === 'workers' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Worker Verification & Profiles</h3>
                <p className="text-xs text-slate-500">
                  Inspect trade certificates and grant digital cooperative badges
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Worker</th>
                    <th className="py-3 px-4">Primary Trade</th>
                    <th className="py-3 px-4">Sensitive ID (Masked)</th>
                    <th className="py-3 px-4">Badges Granted</th>
                    <th className="py-3 px-4">Work History</th>
                    <th className="py-3 px-4 text-right">Verification Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {workers.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{w.fullName}</span>
                        <span className="text-slate-400 text-[11px]">{w.mobile}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{w.jobType}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">
                        {w.identityVerification.maskedNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {w.badges.identityVerified ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                              ✓ ID
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
                              Pending ID
                            </span>
                          )}

                          {w.badges.skillVerified ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                              ✓ Skill
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                              Unverified Skill
                            </span>
                          )}

                          {w.badges.certificateVerified && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                              ✓ Cert
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{w.totalJobsCompleted} jobs</span>
                        <span className="text-slate-400 text-[11px] block">₹{w.totalEarnings} earned</span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedWorker(w)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-semibold"
                        >
                          View Full File
                        </button>
                        {!w.badges.identityVerified && (
                          <button
                            onClick={() => handleVerifyWorker(w.id, 'identity')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-semibold"
                          >
                            Approve ID
                          </button>
                        )}
                        {!w.badges.skillVerified && (
                          <button
                            onClick={() => handleVerifyWorker(w.id, 'skill')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-[11px] font-semibold"
                          >
                            Approve Skill
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: JOB OVERSIGHT */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Job Oversight & Dispute Resolution</h3>
              <p className="text-xs text-slate-500">Live feed of all customer requests, worker responses, and wage escrow</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Job ID</th>
                    <th className="py-3 px-4">Service Required</th>
                    <th className="py-3 px-4">Worker Assigned</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Wage (₹)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {jobs.map((j) => (
                    <tr key={j.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">{j.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{j.serviceRequested}</td>
                      <td className="py-3 px-4">{j.workerName}</td>
                      <td className="py-3 px-4">{j.customerName}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-700">₹{j.offeredAmount}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            j.status === 'REQUESTED'
                              ? 'bg-amber-100 text-amber-800'
                              : j.status === 'ACCEPTED'
                              ? 'bg-sky-100 text-sky-800'
                              : j.status === 'COMPLETED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {j.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {j.paymentStatus === 'PAID' ? (
                          <span className="text-emerald-700 font-semibold text-[11px]">✓ Settled</span>
                        ) : (
                          <span className="text-amber-700 font-semibold text-[11px]">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BENEFITS & SOCIAL SECURITY POOL */}
        {activeTab === 'protection' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Day-Linked Micro-Insurance Social Security Pool
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Aggregate social security reserves accumulated from active worker working days (₹10/day).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-semibold text-emerald-800 block">Total Pool Balance</span>
                  <span className="text-3xl font-extrabold text-emerald-900 mt-1 block">
                    ₹{stats?.socialSecurityPoolTotal || 120}
                  </span>
                  <span className="text-[11px] text-emerald-700 mt-1 block">Backed by verified completed labor days</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600 block">Daily Contribution Rate</span>
                  <span className="text-3xl font-extrabold text-slate-900 mt-1 block">₹10 / day</span>
                  <span className="text-[11px] text-slate-500 mt-1 block">Zero deductions on non-working days</span>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200">
                  <span className="text-xs font-semibold text-sky-800 block">Active Micro-Policies</span>
                  <span className="text-3xl font-extrabold text-sky-900 mt-1 block">{workers.length}</span>
                  <span className="text-[11px] text-sky-700 mt-1 block">Workers protected with accident & hospital cash</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Worker Review File: {selectedWorker.fullName}
              </h3>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ID Verification:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {selectedWorker.identityVerification.maskedNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Document Type:</span>
                  <span>{selectedWorker.identityVerification.idType}</span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  🔒 Masked per regulatory data protection directives.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Number:</span>
                  <span className="font-bold text-slate-800">{selectedWorker.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service Address:</span>
                  <span className="font-semibold text-slate-800">{selectedWorker.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Expected Daily Wage:</span>
                  <span className="font-extrabold text-emerald-700">₹{selectedWorker.expectedDailyWage} / day</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">Declared Trade Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedWorker.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedWorker.certifications.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Submitted Certifications:</span>
                  <div className="space-y-1">
                    {selectedWorker.certifications.map((c, i) => (
                      <div key={i} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.organization} ({c.year})</p>
                        </div>
                        {!c.verified && (
                          <button
                            onClick={() => handleVerifyWorker(selectedWorker.id, 'certificate')}
                            className="px-2 py-1 rounded bg-purple-600 text-white text-[10px] font-semibold"
                          >
                            Verify Certificate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              {!selectedWorker.badges.identityVerified && (
                <button
                  onClick={() => handleVerifyWorker(selectedWorker.id, 'identity')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  Verify Identity Badge
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
