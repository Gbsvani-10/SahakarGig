import React from 'react';
import { Users, UserCheck, Navigation, ClipboardList, AlertTriangle } from 'lucide-react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SummaryStatsProps {
  totalWorkers: number;
  availableCount: number;
  averageDistance: number;
  activeRequestsCount: number;
  emergencyRequestsCount: number;
  currentLanguage: AppLanguage;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  totalWorkers,
  availableCount,
  averageDistance,
  activeRequestsCount,
  emergencyRequestsCount,
  currentLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage];

  const cards = [
    {
      id: 'stat-nearby',
      label: t.nearbyWorkers,
      value: totalWorkers,
      suffix: '',
      subtext: 'Within active radius',
      icon: Users,
      bgIconColor: 'bg-purple-100 text-purple-700',
      borderHover: 'hover:border-purple-300',
      accent: 'from-purple-600 to-indigo-600',
    },
    {
      id: 'stat-available',
      label: t.availableNow,
      value: availableCount,
      suffix: '',
      subtext: 'Ready for instant dispatch',
      icon: UserCheck,
      bgIconColor: 'bg-emerald-100 text-emerald-700',
      borderHover: 'hover:border-emerald-300',
      accent: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'stat-distance',
      label: t.avgDistance,
      value: averageDistance.toFixed(1),
      suffix: ' km',
      subtext: 'Haversine proximity',
      icon: Navigation,
      bgIconColor: 'bg-indigo-100 text-indigo-700',
      borderHover: 'hover:border-indigo-300',
      accent: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'stat-requests',
      label: t.activeRequests,
      value: activeRequestsCount,
      suffix: '',
      subtext: 'In community queue',
      icon: ClipboardList,
      bgIconColor: 'bg-blue-100 text-blue-700',
      borderHover: 'hover:border-blue-300',
      accent: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'stat-emergency',
      label: t.emergencyRequests,
      value: emergencyRequestsCount,
      suffix: '',
      subtext: 'Priority SOS alerts',
      icon: AlertTriangle,
      bgIconColor: 'bg-rose-100 text-rose-700',
      borderHover: 'hover:border-rose-300',
      accent: 'from-rose-600 to-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`bg-white rounded-2xl p-4 sm:p-5 border border-purple-100/80 shadow-xs hover:shadow-md transition-all duration-300 ${card.borderHover} group relative overflow-hidden`}
          >
            {/* Subtle top indicator bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent} opacity-80 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 line-clamp-1">
                {card.label}
              </span>
              <div className={`w-8 h-8 rounded-xl ${card.bgIconColor} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </span>
              {card.suffix && (
                <span className="text-xs font-semibold text-slate-500">
                  {card.suffix}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
