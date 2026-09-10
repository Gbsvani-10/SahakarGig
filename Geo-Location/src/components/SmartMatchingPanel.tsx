import React from 'react';
import { 
  Cpu, 
  MapPin, 
  Clock, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  Navigation,
  Sparkles,
  Route
} from 'lucide-react';
import { CooperativeWorker, CustomerLocation, AppLanguage } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

interface SmartMatchingPanelProps {
  topWorker: CooperativeWorker | null;
  customerLocation: CustomerLocation;
  selectedService: string;
  onViewRoute: (worker: CooperativeWorker) => void;
  onBookWorker: (worker: CooperativeWorker) => void;
  currentLanguage: AppLanguage;
}

export const SmartMatchingPanel: React.FC<SmartMatchingPanelProps> = ({
  topWorker,
  customerLocation,
  selectedService,
  onViewRoute,
  onBookWorker,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  if (!topWorker) return null;

  const breakdown = topWorker.matchBreakdown || {
    skillMatch: 100,
    locationMatch: 95,
    availabilityMatch: 100,
    ratingMatch: 92,
    responseTimeMatch: 90,
  };

  const metrics = [
    { label: 'Skill Match', value: breakdown.skillMatch, color: 'bg-purple-600', text: 'Exact trade accreditation' },
    { label: 'Location Proximity', value: breakdown.locationMatch, color: 'bg-indigo-600', text: `${topWorker.distanceKm} km from request` },
    { label: 'Availability', value: breakdown.availabilityMatch, color: 'bg-emerald-600', text: topWorker.status },
    { label: 'Verification & Rating', value: breakdown.ratingMatch, color: 'bg-amber-500', text: `${topWorker.rating}★ Cooperative Badge` },
    { label: 'Response Time', value: breakdown.responseTimeMatch, color: 'bg-teal-600', text: `~${topWorker.estimatedArrivalMin} min ETA` },
  ];

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/40 to-indigo-50/30 rounded-2xl p-5 sm:p-6 border border-purple-200 shadow-sm space-y-6">
      {/* Header with AI/Formula badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <Cpu className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              {t.smartMatching}
            </h2>
            <span className="bg-purple-100 text-purple-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-purple-200 uppercase">
              Algorithmic Geo-Dispatch
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Multi-variable constraint optimization: <span className="font-bold text-purple-800">Location + Skill + Availability + Distance + Rating</span>
          </p>
        </div>

        {/* Big Match Score Tag */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-purple-200 shadow-xs">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Top Recommended</div>
            <div className="text-xs font-extrabold text-slate-900">{topWorker.name}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex flex-col items-center justify-center shadow-sm">
            <span className="text-base font-extrabold leading-none">{topWorker.matchScore || 94}%</span>
            <span className="text-[9px] font-medium text-purple-200">Score</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Breakdown on left, Haversine Distance Flow on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Breakdown Bars */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            Weighted Match Score Breakdown
          </h3>

          <div className="space-y-2.5">
            {metrics.map((m) => (
              <div key={m.label} className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
                <div className="flex items-center justify-between text-xs mb-1 font-medium">
                  <span className="font-bold text-slate-800">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 hidden sm:inline">{m.text}</span>
                    <span className="font-extrabold text-purple-900">{m.value}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Section 11 - Haversine Distance Calculation Model */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-purple-100 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-purple-700" />
                Distance Calculation
              </h3>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                Haversine Equation
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Geodesic spatial vector with urban road correction factor (1.28x)
            </p>
          </div>

          {/* Flow Visual: Customer -> Distance -> Worker */}
          <div className="py-3 px-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between gap-2">
            {/* Customer */}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-purple-900 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                📍
              </div>
              <span className="text-[11px] font-bold text-slate-800 block mt-1">Customer</span>
              <span className="text-[9px] text-slate-400 font-mono">16.544°N</span>
            </div>

            {/* Distance Vector Arrow */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs font-extrabold text-purple-900 bg-white px-2 py-0.5 rounded-full border border-purple-200 shadow-2xs">
                {topWorker.distanceKm} km
              </span>
              <div className="w-full flex items-center my-1">
                <div className="h-0.5 flex-1 bg-purple-300"></div>
                <Navigation className="w-3.5 h-3.5 text-purple-700 rotate-90 shrink-0 mx-0.5" />
                <div className="h-0.5 flex-1 bg-purple-300"></div>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                ~{topWorker.estimatedArrivalMin} min transit
              </span>
            </div>

            {/* Worker */}
            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-white border border-purple-300 text-purple-900 flex items-center justify-center text-lg shadow-xs">
                {SKILL_ICONS_MAP[topWorker.skill]}
              </div>
              <span className="text-[11px] font-bold text-slate-800 block mt-1 truncate max-w-[80px]">
                {topWorker.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-slate-400 font-mono">Worker 🔧</span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
              <strong className="text-slate-900 text-sm">{topWorker.distanceKm} km</strong>
            </div>
            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Est. Travel Time</span>
              <strong className="text-emerald-700 text-sm">~{topWorker.estimatedArrivalMin} minutes</strong>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onViewRoute(topWorker)}
              className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Route className="w-3.5 h-3.5 text-purple-700" />
              <span>{t.viewRoute}</span>
            </button>
            <button
              type="button"
              onClick={() => onBookWorker(topWorker)}
              className="flex-1 py-2 px-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1 transition-all active:scale-95"
            >
              <span>{t.bookNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
