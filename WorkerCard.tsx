import React from 'react';
import { 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase, 
  Navigation, 
  Zap, 
  Building2,
  ChevronRight,
  Route
} from 'lucide-react';
import { CooperativeWorker, AppLanguage } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

interface WorkerCardProps {
  worker: CooperativeWorker;
  isSelected: boolean;
  onSelect: (worker: CooperativeWorker) => void;
  onBook: (worker: CooperativeWorker) => void;
  onViewProfile: (worker: CooperativeWorker) => void;
  onViewRoute: (worker: CooperativeWorker) => void;
  currentLanguage: AppLanguage;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({
  worker,
  isSelected,
  onSelect,
  onBook,
  onViewProfile,
  onViewRoute,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];
  const emoji = SKILL_ICONS_MAP[worker.skill] || '🔧';

  // Status visual badge styling
  let statusBadge = (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      Available Now
    </span>
  );

  if (worker.status === 'Busy') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Busy on Job
      </span>
    );
  } else if (worker.status === 'Emergency Ready') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
        🚨 Emergency Ready
      </span>
    );
  } else if (worker.status === 'Offline') {
    statusBadge = (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        Offline
      </span>
    );
  }

  return (
    <div
      id={`worker-card-${worker.id}`}
      onClick={() => onSelect(worker)}
      className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative group cursor-pointer ${
        isSelected
          ? 'border-purple-600 shadow-md ring-2 ring-purple-600/20 bg-purple-50/20'
          : 'border-purple-100/80 shadow-xs hover:shadow-md hover:border-purple-300'
      }`}
    >
      {/* Top row: Avatar, Name, Skill, Verified badge & Match Score */}
      <div className="flex items-start gap-3.5">
        <div className="relative shrink-0">
          <img
            src={worker.avatar}
            alt={worker.name}
            className="w-14 h-14 rounded-2xl object-cover border border-purple-200 shadow-xs"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-xl bg-purple-900 text-white flex items-center justify-center text-xs shadow-xs border border-white">
            {emoji}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 truncate">
              <h3 className="font-extrabold text-slate-900 text-base truncate group-hover:text-purple-900 transition-colors">
                {worker.name}
              </h3>
              {worker.verified && (
                <span className="inline-flex items-center gap-0.5 text-purple-700 bg-purple-50 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-purple-200 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  Verified
                </span>
              )}
            </div>

            {/* Match Score Badge */}
            {worker.matchScore && (
              <div className="shrink-0 text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-purple-900 bg-gradient-to-r from-purple-100 to-indigo-100 px-2 py-0.5 rounded-full border border-purple-200">
                  <Zap className="w-3 h-3 text-purple-700" />
                  {worker.matchScore}% Match
                </span>
              </div>
            )}
          </div>

          {/* Skill & Cooperative Society */}
          <div className="flex items-center gap-1.5 text-xs text-purple-800 font-semibold mt-0.5">
            <span>{worker.skill}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-medium">{worker.experienceYears} yrs experience</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate mt-0.5">
            <Building2 className="w-3 h-3 text-purple-500 shrink-0" />
            <span className="truncate">{worker.cooperativeSociety}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Stats */}
      <div className="grid grid-cols-4 gap-2 my-3 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
        <div>
          <div className="text-[10px] text-slate-400 font-medium">Rating</div>
          <div className="font-extrabold text-xs text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{worker.rating}</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-medium">Completed</div>
          <div className="font-extrabold text-xs text-slate-800 mt-0.5">
            {worker.completedJobs} jobs
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-medium">Distance</div>
          <div className="font-extrabold text-xs text-purple-900 flex items-center justify-center gap-0.5 mt-0.5">
            <MapPin className="w-3 h-3 text-purple-600" />
            <span>{worker.distanceKm} km</span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-medium">Est. Arrival</div>
          <div className="font-extrabold text-xs text-emerald-700 flex items-center justify-center gap-0.5 mt-0.5">
            <Clock className="w-3 h-3 text-emerald-600" />
            <span>~{worker.estimatedArrivalMin}m</span>
          </div>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {worker.badges.slice(0, 2).map((badge, idx) => (
          <span
            key={idx}
            className="text-[10px] font-semibold text-purple-700 bg-purple-50/80 px-2 py-0.5 rounded-md border border-purple-100"
          >
            {badge}
          </span>
        ))}
        <span className="text-[10px] text-slate-400 ml-auto font-medium">
          Federation: <strong className="text-slate-600">{worker.federationId}</strong>
        </span>
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div>
          {statusBadge}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewRoute(worker);
            }}
            className="p-2 text-purple-700 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
            title="View Route on Map"
          >
            <Route className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(worker);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
          >
            {t.viewProfile}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBook(worker);
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-transform active:scale-95 flex items-center gap-1"
          >
            <span>{t.bookNow}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
