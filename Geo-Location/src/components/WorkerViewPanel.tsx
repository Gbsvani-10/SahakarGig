import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Navigation, 
  TrendingUp, 
  Zap, 
  Check, 
  Radio, 
  User, 
  Award, 
  Wallet,
  ArrowRight
} from 'lucide-react';
import { CooperativeWorker, LiveRequest } from '../types';
import { MOCK_LIVE_REQUESTS, SKILL_ICONS_MAP } from '../data/mockData';

interface WorkerViewPanelProps {
  onAcceptAndRoute: (req: LiveRequest) => void;
  activeRouteWorker: CooperativeWorker | null;
  onSelectWorkerRoute: (worker: CooperativeWorker | null) => void;
}

export const WorkerViewPanel: React.FC<WorkerViewPanelProps> = ({
  onAcceptAndRoute,
  activeRouteWorker,
  onSelectWorkerRoute,
}) => {
  const [workerStatus, setWorkerStatus] = useState<'Available' | 'Busy' | 'Emergency Ready'>('Available');
  const [liveRequests, setLiveRequests] = useState<LiveRequest[]>(MOCK_LIVE_REQUESTS);
  const [acceptedJobId, setAcceptedJobId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStatusChange = (status: 'Available' | 'Busy' | 'Emergency Ready') => {
    setWorkerStatus(status);
    setStatusMessage(`Status updated to ${status}. Broadcasted to Federation grid.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAcceptJob = (req: LiveRequest) => {
    setAcceptedJobId(req.id);
    onAcceptAndRoute(req);
    setStatusMessage(`Job ${req.id} accepted! Live navigation route drawn on map.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Worker Identity & Status Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                alt="Worker Profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-600 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">Ramesh Kumar</h2>
                <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                  Certified Senior Electrician
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  ★ 4.9 (184 Jobs)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span className="font-semibold text-purple-900">Godavari Electricians Cooperative Society</span>
                <span>•</span>
                <span>Reg ID: <strong className="font-mono text-slate-700">WB-COOP-8821</strong></span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold">Active Member in Good Standing</span>
              </p>
            </div>
          </div>

          {/* Status Mode Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-500 px-2 uppercase tracking-wider">
              My Live Status:
            </span>
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleStatusChange('Available')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  workerStatus === 'Available'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Available</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Busy')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  workerStatus === 'Busy'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-300"></span>
                <span>On-Job / Busy</span>
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('Emergency Ready')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  workerStatus === 'Emergency Ready'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Emergency Ready</span>
              </button>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Worker Financial & Cooperative Welfare Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-purple-100">
          <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Today's Fair Earnings</div>
            <div className="text-xl font-extrabold text-purple-950 mt-0.5">₹1,450.00</div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">3 completed tasks</div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Platform Commission</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-0.5">₹0 (0%)</div>
            <div className="text-[11px] text-emerald-800 font-semibold mt-0.5">100% direct cooperative pay</div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Welfare & Insurance</div>
            <div className="text-sm font-extrabold text-blue-900 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              PMSBY Active
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-0.5">Cooperative Accident Shield</div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operational Radius</div>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">8.0 km</div>
            <div className="text-[11px] text-amber-700 font-medium mt-0.5">Bhimavaram Central Sector</div>
          </div>
        </div>
      </div>

      {/* Live Incoming Service Requests Panel for Worker */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-700 animate-pulse" />
              <span>Incoming Citizen Requests Near You</span>
              <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {liveRequests.length} Pending Calls
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatched based on your verified trade accreditation and GPS proximity
            </p>
          </div>

          <span className="text-[11px] text-purple-900 bg-purple-50 font-bold px-2.5 py-1 rounded-xl border border-purple-200">
            Auto-Refresh Active (30s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {liveRequests.map((req) => {
            const isAccepted = acceptedJobId === req.id;
            return (
              <div
                key={req.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                  isAccepted
                    ? 'bg-purple-50 border-purple-400 shadow-md ring-2 ring-purple-500/20'
                    : req.priority === 'Emergency'
                    ? 'bg-rose-50/70 border-rose-200 hover:shadow-md'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-purple-50/40 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border">
                      {req.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        req.priority === 'Emergency'
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {req.priority === 'Emergency' ? '🚨 EMERGENCY' : 'Standard'}
                    </span>
                  </div>

                  <div>
                    <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                      <span>{SKILL_ICONS_MAP[req.service] || '🔧'}</span>
                      <span>{req.service} Needed</span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="truncate">{req.customerLocation}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70">
                    <span className="font-semibold text-slate-600">
                      Distance: <strong className="text-purple-900">{req.distanceKm} km</strong>
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Est: ₹450 - ₹600
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAcceptJob(req)}
                    disabled={isAccepted}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 ${
                      isAccepted
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-purple-800 hover:bg-purple-900 text-white active:scale-95'
                    }`}
                  >
                    {isAccepted ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Accepted & Routing</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Accept & Route</span>
                      </>
                    )}
                  </button>

                  <a
                    href="tel:9848012345"
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
                    title="Call Citizen Dispatch Coordinator"
                  >
                    <Phone className="w-3.5 h-3.5 text-purple-700" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
