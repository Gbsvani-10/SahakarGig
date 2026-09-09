import React from 'react';
import { Home, Grid, MapPin, AlertCircle, User, Wrench, ShieldAlert } from 'lucide-react';
import { ViewMode } from '../types';

interface MobileBottomNavProps {
  viewMode: ViewMode;
  onViewModeToggle: (mode: ViewMode) => void;
  onOpenEmergency: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  viewMode,
  onViewModeToggle,
  onOpenEmergency,
  activeTab,
  onSelectTab,
}) => {
  const getNextMode = (current: ViewMode): ViewMode => {
    if (current === 'customer') return 'worker';
    if (current === 'worker') return 'admin';
    return 'customer';
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-1.5 shadow-2xl flex items-center justify-around">
      <button
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-semibold transition-colors ${
          activeTab === 'home' ? 'text-purple-800' : 'text-slate-500'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('services')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-semibold transition-colors ${
          activeTab === 'services' ? 'text-purple-800' : 'text-slate-500'
        }`}
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span>Services</span>
      </button>

      {/* Primary Map button */}
      <button
        onClick={() => onSelectTab('map')}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-bold text-purple-700 relative"
      >
        <div className="w-10 h-10 -mt-5 rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-800 text-white flex items-center justify-center shadow-lg shadow-purple-700/30 border-2 border-white">
          <MapPin className="w-5 h-5" />
        </div>
        <span className="mt-0.5 font-extrabold text-purple-900">Map</span>
      </button>

      {/* Emergency Button */}
      <button
        onClick={onOpenEmergency}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-bold text-rose-600"
      >
        <AlertCircle className="w-5 h-5 mb-0.5 text-rose-500 animate-pulse" />
        <span>Emergency</span>
      </button>

      {/* Role Switcher beside emergency */}
      <button
        onClick={() => onViewModeToggle(getNextMode(viewMode))}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] text-[10px] font-semibold text-purple-900 transition-colors"
        title="Tap to switch between Customer, Worker, and Admin views"
      >
        {viewMode === 'customer' && <User className="w-5 h-5 mb-0.5 text-purple-700" />}
        {viewMode === 'worker' && <Wrench className="w-5 h-5 mb-0.5 text-amber-600" />}
        {viewMode === 'admin' && <ShieldAlert className="w-5 h-5 mb-0.5 text-indigo-700" />}
        <span className="capitalize font-bold text-purple-950">{viewMode}</span>
      </button>
    </div>
  );
};
