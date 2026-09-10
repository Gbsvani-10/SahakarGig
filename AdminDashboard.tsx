import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Building2, 
  Users, 
  Briefcase, 
  HeartPulse, 
  IndianRupee, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  TrendingUp,
  Activity,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { cooperatives, workers, bookings, welfareFunds, addToast } = useApp();
  const navigate = useNavigate();

  const totalCoops = cooperatives.length;
  const totalWorkers = workers.length;
  const activeBookings = bookings.filter((b) => 
    b.status === 'Worker Assigned' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'In Progress'
  );
  const emergencyBookings = bookings.filter((b) => b.isEmergency);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Cooperative Governance Console
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            Platform Command & Governance Center
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time cooperative audit, artisan verification, welfare fund reserves, and emergency SLA tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/emergency')}
            className="text-red-700 border-red-200 hover:bg-red-50"
            leftIcon={<AlertTriangle className="w-4 h-4 text-red-600" />}
          >
            Emergency Command
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/cooperatives')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Register Cooperative
          </Button>
        </div>
      </div>

      {/* Primary KPI Metrics (6 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Active Coops"
          value={totalCoops.toString()}
          subtitle="All NCCT registered"
          icon={<Building2 className="w-4 h-4" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Verified Artisans"
          value={totalWorkers.toString()}
          subtitle="Aadhaar KYC verified"
          icon={<Users className="w-4 h-4" />}
          iconBg="bg-teal-50 text-teal-700"
        />
        <StatCard
          title="Active Gigs"
          value={activeBookings.length.toString()}
          subtitle="Currently in execution"
          icon={<Briefcase className="w-4 h-4" />}
          iconBg="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Welfare Corpus"
          value="₹8.42L"
          subtitle="7% statutory pool"
          icon={<HeartPulse className="w-4 h-4" />}
          iconBg="bg-rose-50 text-rose-700"
        />
        <StatCard
          title="Emergency SLA"
          value="11.4 min"
          subtitle="Target < 15 min"
          icon={<Clock className="w-4 h-4" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Gross Disbursed"
          value="₹44.8L"
          subtitle="Direct to worker DBT"
          icon={<IndianRupee className="w-4 h-4" />}
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Emergency SLA Monitor & Rapid Actions */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="font-bold text-base text-white">Emergency Response Grid SLA</h3>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Live district dispatch algorithm active across Delhi NCR, Mumbai MMR, Bengaluru Urban, and Pune
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-right">
              <span className="text-slate-400 block text-[10px]">Today's Emergencies</span>
              <span className="font-mono font-bold text-white text-base">14 Dispatched</span>
            </div>
            <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-right">
              <span className="text-slate-400 block text-[10px]">SLA Adherence</span>
              <span className="font-mono font-bold text-emerald-400 text-base">97.4%</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="text-white border-slate-600 hover:bg-slate-700 text-xs"
              onClick={() => navigate('/admin/emergency')}
            >
              Open Live SLA Map
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <button
            onClick={() => navigate('/admin/workers')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <p className="font-bold text-white flex items-center justify-between">
              <span>Approve Pending Workers</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">3 workers awaiting trade verification</p>
          </button>

          <button
            onClick={() => navigate('/admin/cooperatives')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <p className="font-bold text-white flex items-center justify-between">
              <span>Cooperative Societies</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Audit bylaws & society registrations</p>
          </button>

          <button
            onClick={() => navigate('/admin/welfare')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <p className="font-bold text-white flex items-center justify-between">
              <span>Welfare Fund Approvals</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">₹14,500 pending claim disbursal</p>
          </button>

          <button
            onClick={() => navigate('/admin/reports')}
            className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-left transition-colors cursor-pointer"
          >
            <p className="font-bold text-white flex items-center justify-between">
              <span>NCCT Ministry Reports</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Download quarterly compliance audit</p>
          </button>
        </div>
      </Card>

      {/* Two Column Section: Cooperative Roster Performance & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cooperative Performance Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Cooperative Societies Roster
                </h3>
                <p className="text-xs text-gray-500">Ranked by verified artisan members and welfare contributions</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/cooperatives')}
              >
                Manage All
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 uppercase border-b border-gray-100">
                  <tr>
                    <th className="pb-2">Cooperative Society</th>
                    <th className="pb-2">Location</th>
                    <th className="pb-2">Members</th>
                    <th className="pb-2">Jobs Done</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cooperatives.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3">
                        <p className="font-bold text-gray-900">{c.name}</p>
                        <span className="font-mono text-[10px] text-gray-400">{c.registrationNumber}</span>
                      </td>
                      <td className="py-3 text-gray-600">{c.city}, {c.state}</td>
                      <td className="py-3 font-semibold text-gray-800">{c.totalWorkers}</td>
                      <td className="py-3 font-bold text-gray-900">{c.completedJobs}</td>
                      <td className="py-3">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          Active ✓
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Live Dispatch Feed</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Live Websocket
              </span>
            </div>

            <div className="space-y-3 divide-y divide-gray-100 text-xs">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="pt-2.5 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{b.serviceTitle}</span>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-gray-500 text-[11px]">
                    Customer: {b.customerName} • Artisan: {b.workerName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>{b.customerAddress}</span>
                    <span className="font-bold text-gray-800">₹{b.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/admin/bookings')}
            >
              View Full Booking Ledger
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
