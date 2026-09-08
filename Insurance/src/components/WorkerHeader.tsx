import React, { useState, useEffect } from 'react';
import { WorkerProfile } from '../types';
import { api } from '../utils/apiClient';
import {
  Shield,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  RefreshCw,
  Sparkles,
  Check,
  Building2,
  Home,
  LifeBuoy,
} from 'lucide-react';

interface WorkerHeaderProps {
  worker: WorkerProfile;
  currentPath: string;
  onNavigate: (path: string) => void;
  onWorkerSwitched: () => void;
}

export const WorkerHeader: React.FC<WorkerHeaderProps> = ({
  worker,
  currentPath,
  onNavigate,
  onWorkerSwitched,
}) => {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [workerList, setWorkerList] = useState<
    { id: string; workerId: string; name: string; occupation: string; dailyEarnings: number | null }[]
  >([]);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    api
      .getWorkerList()
      .then(setWorkerList)
      .catch((err) => console.error('Failed to fetch worker list', err));
  }, []);

  const handleSwitchWorker = async (userId: string) => {
    try {
      setSwitching(true);
      await api.loginAsWorker(userId);
      setShowSwitchModal(false);
      onWorkerSwitched();
    } catch (e) {
      console.error('Failed to switch worker', e);
    } finally {
      setSwitching(false);
    }
  };

  const isInsuranceActive = currentPath === '/insurance' || currentPath.startsWith('#/insurance');

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* SahakarGig Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-105 transition-transform">
                SG
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  SahakarGig
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-800/80 text-emerald-200 px-1.5 py-0.5 rounded">
                    Welfare
                  </span>
                </span>
                <span className="text-[11px] text-stone-400 block -mt-0.5">
                  Worker Welfare & Micro-Insurance
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links with Insurance Menu Icon */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              id="nav-worker-portal-btn"
              onClick={() => onNavigate('/')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !isInsuranceActive
                  ? 'bg-stone-800 text-amber-400'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Worker Portal</span>
            </button>

            {/* Prominent Insurance Icon / Menu Item */}
            <button
              type="button"
              id="nav-insurance-module-btn"
              onClick={() => onNavigate('/insurance')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                isInsuranceActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-stone-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Micro-Insurance</span>
            </button>

            {/* Authenticated Worker Profile / Switcher */}
            <div className="relative pl-1 sm:pl-3 border-l border-stone-800">
              <button
                type="button"
                id="worker-switcher-dropdown-btn"
                onClick={() => setShowSwitchModal(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 border border-stone-700/80 transition-all cursor-pointer text-left"
                title="Switch Authenticated Worker account to test dynamic fetching"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                  {worker.name ? worker.name.charAt(0) : 'W'}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-stone-200 leading-tight">
                    {worker.name}
                  </div>
                  <div className="text-[10px] text-amber-400 font-mono">
                    {worker.dailyEarnings !== null ? `₹${worker.dailyEarnings}/day` : 'No Earnings Data'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Switch Authenticated Worker Modal */}
      {showSwitchModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-white text-stone-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Switch Authenticated Worker
                </h3>
                <p className="text-xs text-stone-500">
                  Verify real dynamic data fetching & security across worker profiles
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSwitchModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {workerList.map((w) => {
                const isCurrent = w.id === worker.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSwitchWorker(w.id)}
                    disabled={switching}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm">{w.name}</span>
                        <span className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                          {w.workerId}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">{w.occupation}</div>
                      <div className="text-xs font-semibold text-amber-800 mt-1">
                        {w.dailyEarnings !== null
                          ? `Daily Wage: ₹${w.dailyEarnings}/day`
                          : '⚠️ Earnings data not available (New worker)'}
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full hover:bg-stone-200">
                        Login as {w.name.split(' ')[0]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200">
              <strong className="text-stone-800">Real Backend Enforcement:</strong> Each worker&apos;s
              profile, real earnings, recommended tier, and insurance records are fetched dynamically
              from the backend server.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
