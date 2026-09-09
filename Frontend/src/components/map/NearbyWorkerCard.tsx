```tsx
import React from 'react';
import { WorkerProfile } from '../../types';
import {
  Star,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
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
  isSelected = false,
  isClosest = false,
  onSelect,
  onBook,
  onViewProfile,
}) => {
  const workerName = worker.name || 'Nearby Worker';

  const initials = workerName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const rating = Number(worker.rating);
  const safeRating = Number.isFinite(rating) ? rating : 0;

  const reviewCount = Number(worker.reviewCount);
  const safeReviewCount = Number.isFinite(reviewCount)
    ? reviewCount
    : 0;

  const handleCardClick = () => {
    onSelect?.(worker);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Worker header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {initials || 'W'}
          </div>

          {/* Worker information */}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
              <span className="truncate">
                {workerName}
              </span>

              {worker.verificationStatus === 'Verified' && (
                <ShieldCheck
                  className="w-4 h-4 text-emerald-600 flex-shrink-0"
                  aria-label="Verified worker"
                />
              )}
            </div>

            <div className="text-xs text-slate-500 capitalize truncate">
              {worker.primaryTrade || 'Service Professional'}
            </div>
          </div>
        </div>

        {/* Availability / closest status */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">

          {isClosest && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Closest
            </span>
          )}

          <StatusBadge
            status={worker.availabilityStatus}
          />
        </div>
      </div>

      {/* Rating and distance */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />

          <span className="font-semibold">
            {safeRating.toFixed(1)}
          </span>

          <span className="text-slate-400">
            ({safeReviewCount})
          </span>
        </div>

        {/* Distance */}
        <div className="flex items-center gap-1 justify-end">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />

          <span>
            {typeof distanceKm === 'number' &&
            Number.isFinite(distanceKm)
              ? `${distanceKm.toFixed(1)} km away`
              : 'Nearby'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2 pt-2">

        {/* Profile */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            onViewProfile?.(worker);
          }}
        >
          Profile
        </Button>

        {/* Book */}
        <Button
          type="button"
          size="sm"
          className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={(event) => {
            event.stopPropagation();
            onBook?.(worker);
          }}
        >
          Book Now
        </Button>

      </div>
    </div>
  );
};

export default NearbyWorkerCard;
```
