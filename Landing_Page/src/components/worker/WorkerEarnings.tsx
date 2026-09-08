import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  IndianRupee,
  Briefcase,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../../lib/api.ts';
import { useToast } from '../common/Toast.tsx';
import type { WorkDayRecord } from '../../types.ts';

interface WorkerEarningsProps {
  workerId: string;
  defaultWage: number;
  onWorkDayLogged?: () => void;
}

export const WorkerEarnings: React.FC<WorkerEarningsProps> = ({
  workerId,
  defaultWage,
  onWorkDayLogged
}) => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<{
    dailyEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    totalWorkingDays: number;
    pendingAmount: number;
    paidAmount: number;
    monthlyTrends: { month: string; earnings: number; days: number }[];
    recentRecords: WorkDayRecord[];
  } | null>(null);

  // Log new work day modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logWorkType, setLogWorkType] = useState('Plumbing & Pipe Repair');
  const [logCustomer, setLogCustomer] = useState('');
  const [logWage, setLogWage] = useState(defaultWage || 700);
  const [logPaymentStatus, setLogPaymentStatus] = useState<'PAID' | 'PENDING'>('PAID');
  const [logNotes, setLogNotes] = useState('');
  const [savingLog, setSavingLog] = useState(false);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkerEarnings();
      setEarningsData(data);
    } catch (err: any) {
      error('Earnings Load Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [workerId]);

  const handleSaveWorkDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDate || !logWorkType || !logWage) {
      error('Missing Information', 'Date, work type, and daily wage are required.');
      return;
    }

    setSavingLog(true);
    try {
      await api.logWorkDay({
        date: logDate,
        workType: logWorkType,
        customerOrJob: logCustomer || 'Direct Client Work',
        dailyWage: Number(logWage),
        paymentStatus: logPaymentStatus,
        notes: logNotes
      });
      success('Work Day Recorded', `Logged ₹${logWage} for ${logDate}. Micro-insurance updated.`);
      setLogModalOpen(false);
      setLogNotes('');
      fetchEarnings();
      onWorkDayLogged?.();
    } catch (err: any) {
      error('Failed to log work day', err.message);
    } finally {
      setSavingLog(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('Remove this work day record? This will recalculate earnings and insurance contribution.')) {
      return;
    }
    try {
      await api.deleteWorkDay(id);
      success('Record Removed', 'Work day deleted and financial totals updated.');
      fetchEarnings();
      onWorkDayLogged?.();
    } catch (err: any) {
      error('Delete Failed', err.message);
    }
  };

  if (loading && !earningsData) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs">Calculating earnings from real recorded work days...</p>
      </div>
    );
  }

  const {
    dailyEarnings = 0,
    weeklyEarnings = 0,
    monthlyEarnings = 0,
    totalWorkingDays = 0,
    pendingAmount = 0,
    paidAmount = 0,
    monthlyTrends = [],
    recentRecords = []
  } = earningsData || {};

  return (
    <div className="space-y-6 text-left">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-emerald-600" />
            My Earnings & Work History
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculated dynamically from verified days worked. No assumptions of fixed monthly salaries.
          </p>
        </div>
        <button
          id="log-work-day-btn"
          onClick={() => setLogModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Working Day
        </button>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Today's Earnings</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{dailyEarnings.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Single day income</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Past 7 Days</p>
          <p className="text-xl font-bold text-slate-900 mt-1">₹{weeklyEarnings.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Weekly total</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">This Month</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">₹{monthlyEarnings.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Actual days × wage</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Working Days</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalWorkingDays}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Total recorded</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Paid Amount</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">₹{paidAmount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-700 mt-0.5">Received</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-semibold text-slate-500">Pending Amount</p>
          <p className="text-xl font-bold text-amber-600 mt-1">₹{pendingAmount.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-amber-700 mt-0.5">Awaiting release</p>
        </div>
      </div>

      {/* Monthly Trends Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Monthly Earnings & Work Days Trend</h3>
            <p className="text-xs text-slate-500">Generated dynamically from stored work records</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-md">
            Last 6 Months
          </span>
        </div>

        <div className="h-64 w-full">
          {monthlyTrends.every((m) => m.earnings === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
              <Calendar className="w-8 h-8 mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">No working days logged yet</p>
              <p className="text-slate-400 mt-0.5">Click "Log Working Day" above to record your first completed work</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    name === 'earnings' ? `₹${Number(value).toLocaleString('en-IN')}` : `${value} days`,
                    name === 'earnings' ? 'Earnings' : 'Work Days'
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px', border: 'none' }}
                />
                <Bar dataKey="earnings" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Work Day History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Work Day History</h3>
            <p className="text-xs text-slate-500">Every single verified day of work and daily wage</p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {recentRecords.length} records logged
          </span>
        </div>

        {recentRecords.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No work day history recorded yet</p>
            <p className="text-slate-400 mt-1 max-w-sm mx-auto">
              Whenever you complete client work or a customer pays for an active job, it is automatically saved here with transparent wage accounting.
            </p>
            <button
              onClick={() => setLogModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200 hover:bg-emerald-100"
            >
              <Plus className="w-3.5 h-3.5" /> Log Your First Working Day
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Work / Trade Type</th>
                  <th className="py-3 px-4">Customer / Job</th>
                  <th className="py-3 px-4">Daily Wage</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      {new Date(r.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{r.workType}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{r.customerOrJob}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">₹{r.dailyWage.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      {r.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteRecord(r.id)}
                        title="Delete record"
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Work Day Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Log Working Day
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Records an actual day of labor. Micro-insurance protection is automatically calculated for this day.
            </p>

            <form onSubmit={handleSaveWorkDay} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Date *</label>
                <input
                  type="date"
                  required
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Type / Trade *</label>
                <input
                  type="text"
                  required
                  value={logWorkType}
                  onChange={(e) => setLogWorkType(e.target.value)}
                  placeholder="e.g. Electrical wiring, Plumbing pipe fix, Wall painting"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Location / Job Name</label>
                <input
                  type="text"
                  value={logCustomer}
                  onChange={(e) => setLogCustomer(e.target.value)}
                  placeholder="e.g. House #24 Indiranagar, or Metro Station Subcontract"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Wage (₹) *</label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={50}
                    value={logWage}
                    onChange={(e) => setLogWage(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={logPaymentStatus}
                    onChange={(e) => setLogPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  >
                    <option value="PAID">Paid / Received</option>
                    <option value="PENDING">Pending Payment</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
                <span className="font-semibold">Micro-Protection Guarantee:</span> ₹10 will be dynamically accounted as your contribution for this active working day.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingLog}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl disabled:opacity-50"
                >
                  {savingLog ? 'Saving...' : 'Confirm & Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
