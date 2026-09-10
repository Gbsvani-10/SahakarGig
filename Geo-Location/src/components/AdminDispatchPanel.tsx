import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Cpu, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { CooperativeWorker, DemandArea, LiveRequest } from '../types';
import { MOCK_DEMAND_AREAS, MOCK_LIVE_REQUESTS, SKILL_ICONS_MAP } from '../data/mockData';

interface AdminDispatchPanelProps {
  workers: CooperativeWorker[];
  onDispatchWorker?: (worker: CooperativeWorker) => void;
}

export const AdminDispatchPanel: React.FC<AdminDispatchPanelProps> = ({
  workers,
  onDispatchWorker,
}) => {
  const [demandAreas, setDemandAreas] = useState<DemandArea[]>(MOCK_DEMAND_AREAS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationSuccess, setOptimizationSuccess] = useState(false);
  const [liveRequests, setLiveRequests] = useState<LiveRequest[]>(MOCK_LIVE_REQUESTS);

  const availableCount = workers.filter((w) => w.status === 'Available').length;
  const busyCount = workers.filter((w) => w.status === 'Busy').length;
  const emergencyReadyCount = workers.filter((w) => w.status === 'Emergency Ready').length;

  const handleOptimize = () => {
    setIsOptimizing(true);
    setOptimizationSuccess(false);

    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizationSuccess(true);
      // Rebalance simulation
      setDemandAreas((prev) =>
        prev.map((area) =>
          area.demandLevel === 'High'
            ? { ...area, activeWorkers: area.activeWorkers + 3, recommendedAllocation: 1 }
            : area
        )
      );
      setTimeout(() => setOptimizationSuccess(false), 5000);
    }, 900);
  };

  const handleAssignRequest = (requestId: string) => {
    setLiveRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'Assigned' } : req))
    );
  };

  return (
    <div className="space-y-6">
      {/* Federation Operational Top Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">Federation Command & Dispatch</h2>
              <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                SIH Problem #26089
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Supervising District Labour Cooperative Societies, live GPS territory density & distress calls
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="px-4 py-2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-900 hover:to-indigo-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing Grid...' : 'AI Workforce Rebalance'}</span>
            </button>
          </div>
        </div>

        {optimizationSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>AI workforce allocation complete: 3 certified workers dynamically reassigned to High Demand Sector 1.</span>
          </div>
        )}

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-purple-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Federation Workers</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{workers.length}</div>
            <div className="text-[11px] text-purple-700 font-semibold mt-0.5">Across 4 affiliated societies</div>
          </div>

          <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Available for Dispatch</div>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{availableCount}</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">Ready for instant assignment</div>
          </div>

          <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active SOS / Emergency</div>
            <div className="text-2xl font-black text-rose-700 mt-0.5">{emergencyReadyCount}</div>
            <div className="text-[11px] text-rose-800 font-semibold mt-0.5">Under 15-min SLA guaranteed</div>
          </div>

          <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Grid Response Rate</div>
            <div className="text-2xl font-black text-indigo-900 mt-0.5">94.8%</div>
            <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">Average dispatch: 2.1 km</div>
          </div>
        </div>
      </div>

      {/* Territorial Demand Hotspots & Live Citizen Requests Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Demand Pressure Sectors */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Territorial Demand Clusters</span>
            </h3>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
              4 Sectors Monitored
            </span>
          </div>

          <div className="space-y-3">
            {demandAreas.map((area) => (
              <div
                key={area.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-purple-50/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{area.name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      area.demandLevel === 'High'
                        ? 'bg-red-100 text-red-700'
                        : area.demandLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {area.demandLevel} Demand
                  </span>
                </div>

                <div className="grid grid-cols-3 text-center text-xs pt-1 border-t border-slate-200">
                  <div>
                    <div className="text-[10px] text-slate-400">Workers</div>
                    <div className="font-bold text-slate-800">{area.activeWorkers}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Predicted</div>
                    <div className="font-bold text-slate-800">{area.predictedRequests}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Rebalance</div>
                    <div className="font-bold text-purple-900">+{area.recommendedAllocation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Service Requests Queue Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-700" />
              <span>Live Citizen Service Requests Queue</span>
            </h3>
            <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full">
              Federation Dispatch Desk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-purple-100 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">Request ID</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Citizen Location</th>
                  <th className="py-2.5 px-3">Distance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liveRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-600">{req.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{SKILL_ICONS_MAP[req.service] || '🔧'}</span>
                      <span>{req.service}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[140px] truncate">{req.customerLocation}</td>
                    <td className="py-3 px-3 font-semibold text-purple-900">{req.distanceKm} km</td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'Assigned'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.priority === 'Emergency'
                            ? 'bg-rose-100 text-rose-700 font-extrabold'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {req.status === 'Assigned' ? (
                        <span className="text-[11px] font-bold text-emerald-700">✓ Dispatched</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssignRequest(req.id)}
                          className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold rounded-lg transition-colors"
                        >
                          Dispatch
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
