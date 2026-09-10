import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase, 
  Building2, 
  Phone, 
  Award, 
  Compass, 
  Route, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { CooperativeWorker, CustomerLocation } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';

interface WorkerProfileModalProps {
  worker: CooperativeWorker | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (worker: CooperativeWorker) => void;
  onViewRoute: (worker: CooperativeWorker) => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({
  worker,
  isOpen,
  onClose,
  onBook,
  onViewRoute,
}) => {
  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-purple-200 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header Cover Banner */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-300 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight truncate">{worker.name}</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 shrink-0 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-purple-200 mt-1">
                <span>{SKILL_ICONS_MAP[worker.skill]}</span>
                <span>{worker.skill}</span>
                <span>•</span>
                <span>{worker.experienceYears} Years Experience</span>
              </div>

              <div className="text-xs text-purple-300 flex items-center gap-1 mt-1 truncate">
                <Building2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{worker.cooperativeSociety}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Rating</div>
              <div className="font-extrabold text-slate-900 text-sm flex items-center justify-center gap-0.5 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{worker.rating}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Completed</div>
              <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                {worker.completedJobs}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Distance</div>
              <div className="font-extrabold text-purple-900 text-sm mt-0.5">
                {worker.distanceKm} km
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium">Service Radius</div>
              <div className="font-extrabold text-indigo-900 text-sm mt-0.5">
                {worker.serviceRadiusKm} km
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Professional Biography
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {worker.bio}
            </p>
          </div>

          {/* Certifications & Badges */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-700" />
              Accreditations & Cooperative Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {worker.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-purple-50 text-purple-900 text-xs font-bold rounded-lg border border-purple-200 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-purple-600" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Cooperative Accreditation Box */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3.5 rounded-2xl border border-purple-200 text-xs space-y-1.5">
            <div className="font-bold text-purple-950 flex items-center justify-between">
              <span>Cooperative Federation ID:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-purple-300 text-purple-900">
                {worker.federationId}
              </span>
            </div>
            <p className="text-[11px] text-purple-800">
              Insured through Labour Cooperative Social Welfare Scheme with ESIC & PF compliance.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Standard Tariff</span>
            <span className="text-base font-extrabold text-slate-900">₹{worker.hourlyRate}<span className="text-xs text-slate-500 font-normal">/hr</span></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewRoute(worker);
              }}
              className="px-3.5 py-2.5 bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Route className="w-4 h-4 text-purple-700" />
              <span>View Route</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(worker);
              }}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all active:scale-95"
            >
              Book Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
