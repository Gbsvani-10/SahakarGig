import React from 'react';
import { WorkerProfile } from '../../types';
import { Star, ShieldCheck, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

export interface NearbyWorkerCardProps {
  worker: WorkerProfile;
  distanceKm?: number;
  isSelected?: boolean;
  isClosest?: boolean;
  onSelect?: (worker: WorkerProfile) => void;
  onBook?: (worker: WorkerProfile) => void;
  onViewProfile?: (worker: WorkerProfile) => void;
}

export const NearbyWorkerCard: React.FC<NearbyWorkerCardProps> = ({
  worker,
  distanceKm,
  isSelected,
  isClosest,
  onSelect,
  onBook,
  onViewProfile
}) => {
  return (
    <div
      onClick={() => onSelect?.(worker)}
      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {worker.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span>{worker.name}</span>
              {worker.verificationStatus === 'Verified' && (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="text-xs text-slate-500 capitalize">{worker.primaryTrade}</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {isClosest && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Closest
            </span>
          )}
          <StatusBadge status={worker.availabilityStatus} />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{worker.rating.toFixed(1)}</span>
          <span className="text-slate-400">({worker.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 justify-end">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{distanceKm !== undefined ? `${distanceKm.toFixed(1)} km away` : 'Nearby'}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile?.(worker);
          }}
        >
          Profile
        </Button>
        <Button
          size="sm"
          className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={(e) => {
            e.stopPropagation();
            onBook?.(worker);
          }}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};
