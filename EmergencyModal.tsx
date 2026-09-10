import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  X, 
  Wrench, 
  Droplets, 
  Cpu, 
  HeartHandshake, 
  HelpCircle, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  Radio, 
  CheckCircle2, 
  PhoneCall,
  Zap
} from 'lucide-react';
import { CooperativeWorker, CustomerLocation } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: CooperativeWorker[];
  customerLocation: CustomerLocation;
  onRequestWorker: (worker: CooperativeWorker) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  workers,
  customerLocation,
  onRequestWorker,
}) => {
  const [selectedEmergencySkill, setSelectedEmergencySkill] = useState<string>('Electrician');
  const [isSearching, setIsSearching] = useState(false);
  const [matchedEmergencyWorker, setMatchedEmergencyWorker] = useState<CooperativeWorker | null>(null);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  const emergencyCategories = [
    { label: 'Electrician', icon: Wrench, desc: 'Short circuit, blackouts, sparking' },
    { label: 'Plumber', icon: Droplets, desc: 'Pipe burst, heavy leakage, tank overflow' },
    { label: 'Technician', icon: Cpu, desc: 'Inverter failure, AC breakdown, gas leak' },
    { label: 'Caregiver', icon: HeartHandshake, desc: 'Elderly assistance, medical companion' },
    { label: 'Other', icon: HelpCircle, desc: 'Locks, structural, urgent repairs' },
  ];

  const handleSearch = (skillToFind: string) => {
    setIsSearching(true);
    setDispatchConfirmed(false);
    setMatchedEmergencyWorker(null);

    setTimeout(() => {
      // Filter candidates prioritizing: Emergency Ready/Available, Verified, Closest distance
      let candidates = workers.filter((w) => {
        const skillMatch = skillToFind === 'Other' ? true : w.skill === skillToFind;
        const statusMatch = w.status === 'Emergency Ready' || w.status === 'Available';
        return skillMatch && statusMatch;
      });

      if (candidates.length === 0) {
        // Fallback to any available worker in that skill
        candidates = workers.filter((w) => skillToFind === 'Other' || w.skill === skillToFind);
      }

      // Sort by distance ascending
      candidates.sort((a, b) => a.distanceKm - b.distanceKm);

      const best = candidates[0] || workers[0];
      setMatchedEmergencyWorker(best);
      setIsSearching(false);
    }, 1100);
  };

  useEffect(() => {
    if (isOpen) {
      setDispatchConfirmed(false);
      handleSearch(selectedEmergencySkill);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-rose-200 animate-in zoom-in-95">
        {/* Top Emergency Header */}
        <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-md">
              <AlertCircle className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-rose-950/60 px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide uppercase border border-rose-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Rapid Response Network
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
                Emergency Cooperative Dispatch
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Need immediate assistance? Finding verified nearest available cooperative worker.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Service Selection Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Required Emergency Trade
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {emergencyCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedEmergencySkill === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      setSelectedEmergencySkill(cat.label);
                      handleSearch(cat.label);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-rose-600' : 'text-slate-500'}`} />
                    <div className="font-extrabold text-xs mt-1.5 text-slate-900">{cat.label}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{cat.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Verification */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-700 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">Dispatch Location:</span>
                <span className="text-slate-500 ml-1 truncate">{customerLocation.address}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold shrink-0">
              100% Priority
            </span>
          </div>

          {/* Searching Radar State */}
          {isSearching && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 bg-purple-50/50 rounded-2xl border border-purple-100">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 animate-ping absolute inset-0"></div>
                <div className="w-16 h-16 rounded-full bg-rose-100 border-2 border-rose-500 flex items-center justify-center relative shadow-md">
                  <Radio className="w-8 h-8 text-rose-600 animate-spin" />
                </div>
              </div>
              <div>
                <div className="font-extrabold text-sm text-slate-800">
                  Finding nearest available workers...
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Scanning verified cooperative radius for {selectedEmergencySkill}
                </div>
              </div>
            </div>
          )}

          {/* Matched Result */}
          {!isSearching && matchedEmergencyWorker && !dispatchConfirmed && (
            <div className="border-2 border-emerald-500/40 bg-emerald-50/30 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Nearest Available Worker Located
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Instant Dispatch Ready
                </span>
              </div>

              <div className="flex items-start gap-3.5 bg-white p-3.5 rounded-xl border border-emerald-200/80 shadow-xs">
                <img
                  src={matchedEmergencyWorker.avatar}
                  alt={matchedEmergencyWorker.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-300 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900 truncate">
                      {matchedEmergencyWorker.name}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full border border-purple-200">
                      <ShieldCheck className="w-3 h-3 text-purple-600" /> Verified
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-purple-800 mt-0.5">
                    {SKILL_ICONS_MAP[matchedEmergencyWorker.skill]} {matchedEmergencyWorker.skill}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {matchedEmergencyWorker.cooperativeSociety}
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-medium">Distance</div>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                    {matchedEmergencyWorker.distanceKm} km
                  </div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-medium">Estimated Arrival</div>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">
                    ⚡ ~{matchedEmergencyWorker.estimatedArrivalMin} min
                  </div>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-medium">Rating</div>
                  <div className="font-extrabold text-amber-600 text-sm flex items-center justify-center gap-0.5 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{matchedEmergencyWorker.rating}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Request Worker */}
              <button
                type="button"
                onClick={() => {
                  setDispatchConfirmed(true);
                  onRequestWorker(matchedEmergencyWorker);
                }}
                className="w-full py-3 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-700 hover:to-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Request Worker Immediately</span>
              </button>
            </div>
          )}

          {/* Confirmed state */}
          {dispatchConfirmed && matchedEmergencyWorker && (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Emergency Dispatch Initiated!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  <strong>{matchedEmergencyWorker.name}</strong> from {matchedEmergencyWorker.cooperativeSociety} has received your emergency alert.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Emergency Reference:</span>
                  <span className="font-mono font-bold text-slate-900">EMG-26089-{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Arrival:</span>
                  <span className="font-bold text-emerald-700">Under {matchedEmergencyWorker.estimatedArrivalMin} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Worker Contact:</span>
                  <span className="font-bold text-purple-900">{matchedEmergencyWorker.phone}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Track on Map
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
