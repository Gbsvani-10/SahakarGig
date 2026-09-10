import React from 'react';
import { 
  Wrench, 
  Droplets, 
  Hammer, 
  Palette, 
  Sparkles, 
  Trees, 
  Car, 
  HeartHandshake, 
  Cpu, 
  Home, 
  Layers, 
  Clock, 
  MapPin, 
  Filter, 
  CheckCircle 
} from 'lucide-react';
import { ServiceCategory, WorkerStatus, AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ServiceFilterProps {
  selectedService: ServiceCategory;
  onServiceChange: (service: ServiceCategory) => void;
  selectedAvailability: string;
  onAvailabilityChange: (avail: string) => void;
  selectedDistanceFilter: number | null;
  onDistanceFilterChange: (dist: number | null) => void;
  currentLanguage: AppLanguage;
  workerCountsBySkill: Record<string, number>;
}

export const ServiceFilter: React.FC<ServiceFilterProps> = ({
  selectedService,
  onServiceChange,
  selectedAvailability,
  onAvailabilityChange,
  selectedDistanceFilter,
  onDistanceFilterChange,
  currentLanguage,
  workerCountsBySkill,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const services: { label: ServiceCategory; icon: any; emoji: string }[] = [
    { label: 'All Services', icon: Layers, emoji: '⚡' },
    { label: 'Plumber', icon: Droplets, emoji: '🚰' },
    { label: 'Electrician', icon: Wrench, emoji: '🔧' },
    { label: 'Carpenter', icon: Hammer, emoji: '🪚' },
    { label: 'Painter', icon: Palette, emoji: '🎨' },
    { label: 'Cleaner', icon: Sparkles, emoji: '🧹' },
    { label: 'Gardener', icon: Trees, emoji: '🌳' },
    { label: 'Driver', icon: Car, emoji: '🚗' },
    { label: 'Caregiver', icon: HeartHandshake, emoji: '👩‍⚕️' },
    { label: 'Technician', icon: Cpu, emoji: '🔩' },
    { label: 'Domestic Helper', icon: Home, emoji: '🏠' },
  ];

  const availabilityOptions = [
    { id: 'All', label: 'All', icon: CheckCircle },
    { id: 'Available Now', label: 'Available Now', icon: Clock },
    { id: 'Busy', label: 'Busy', icon: Clock },
    { id: 'Emergency Ready', label: 'Emergency Ready', icon: Clock },
  ];

  const distanceOptions = [
    { label: 'Any Distance', value: null },
    { label: 'Within 2 km', value: 2 },
    { label: 'Within 5 km', value: 5 },
    { label: 'Within 10 km', value: 10 },
    { label: 'Within 20 km', value: 20 },
  ];

  return (
    <div className="space-y-3 bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-xs">
      {/* Category Horizontal Scroll Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-purple-700" />
            {t.allServices}
          </span>
          <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
            Selected: <strong className="text-purple-900">{selectedService}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {services.map((item) => {
            const isSelected = selectedService === item.label;
            const count = workerCountsBySkill[item.label] ?? 0;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onServiceChange(item.label)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  isSelected
                    ? 'bg-purple-800 text-white border-purple-900 shadow-sm shadow-purple-900/25 scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-900'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filters: Availability & Distance */}
      <div className="pt-2 border-t border-purple-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Availability Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            {t.availability}:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {availabilityOptions.map((opt) => {
              const isSelected = selectedAvailability === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onAvailabilityChange(opt.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? opt.id === 'Available Now'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : opt.id === 'Emergency Ready'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-purple-800 hover:bg-white/60'
                  }`}
                >
                  {opt.id === 'Available Now' && '🟢 '}
                  {opt.id === 'Busy' && '🟡 '}
                  {opt.id === 'Emergency Ready' && '🚨 '}
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distance Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-purple-600" />
            {t.distance}:
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {distanceOptions.map((dist) => {
              const isSelected = selectedDistanceFilter === dist.value;
              return (
                <button
                  key={dist.label}
                  type="button"
                  onClick={() => onDistanceFilterChange(dist.value)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    isSelected
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-indigo-800 hover:bg-white/60'
                  }`}
                >
                  {dist.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
