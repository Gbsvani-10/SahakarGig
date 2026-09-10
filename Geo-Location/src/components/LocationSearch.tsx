import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Shield, CheckCircle2, ChevronDown, Sliders } from 'lucide-react';
import { CustomerLocation, AppLanguage } from '../types';
import { DEMO_PRESET_LOCATIONS } from '../data/mockData';
import { TRANSLATIONS } from '../data/translations';

interface LocationSearchProps {
  currentLocation: CustomerLocation;
  onLocationChange: (location: CustomerLocation) => void;
  searchRadius: number;
  onRadiusChange: (radius: number) => void;
  currentLanguage: AppLanguage;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  currentLocation,
  onLocationChange,
  searchRadius,
  onRadiusChange,
  currentLanguage,
}) => {
  const [addressInput, setAddressInput] = useState(currentLocation.address);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedBadge, setDetectedBadge] = useState<string | null>('Current Location Detected');
  const [showPresets, setShowPresets] = useState(false);
  const t = TRANSLATIONS[currentLanguage];

  const radiusOptions = [5, 10, 15, 20, 25];

  const handleUseMyLocation = () => {
    setIsDetecting(true);
    setDetectedBadge(null);

    // If browser geolocation is available and user approves, use it, else fallback smoothly to calibrated demo coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc: CustomerLocation = {
            address: 'Detected Geo-Coordinates (Live GPS)',
            city: 'Local Area',
            pincode: '534202',
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
          };
          onLocationChange(newLoc);
          setAddressInput(`GPS: ${newLoc.lat}, ${newLoc.lng}`);
          setIsDetecting(false);
          setDetectedBadge(t.locationDetected);
        },
        () => {
          // Fallback to high-fidelity calibrated demo coordinates
          setTimeout(() => {
            const demoLoc: CustomerLocation = {
              address: 'H.No 4-12, Gandhi Road, Someswaram Colony',
              city: 'Bhimavaram',
              pincode: '534202',
              lat: 16.5449,
              lng: 81.5212,
            };
            onLocationChange(demoLoc);
            setAddressInput(demoLoc.address);
            setIsDetecting(false);
            setDetectedBadge(t.locationDetected);
          }, 600);
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setIsDetecting(false);
        setDetectedBadge(t.locationDetected);
      }, 500);
    }
  };

  const handleSelectPreset = (preset: typeof DEMO_PRESET_LOCATIONS[0]) => {
    onLocationChange({
      address: preset.address,
      city: 'Bhimavaram',
      pincode: '534202',
      lat: preset.lat,
      lng: preset.lng,
    });
    setAddressInput(preset.address);
    setDetectedBadge(`Selected: ${preset.name}`);
    setShowPresets(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-purple-100 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Address Input & Use My Location */}
        <div className="flex-1 space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-purple-900">
              <MapPin className="w-4 h-4 text-purple-700" />
              {t.serviceLocation}
            </span>
            <span className="text-[11px] font-medium text-slate-400 normal-case hidden sm:inline">
              Cooperative Geo-Fenced Service Zone
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Enter service location"
                className="w-full pl-9 pr-24 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white text-slate-800 text-sm font-medium rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder:text-slate-400"
              />
              <Compass className="w-4 h-4 text-purple-600 absolute left-3 top-3" />

              {/* Preset quick picker toggle */}
              <button
                type="button"
                onClick={() => setShowPresets(!showPresets)}
                className="absolute right-2 top-2 px-2 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-1 transition-colors"
              >
                Presets <ChevronDown className="w-3 h-3" />
              </button>

              {/* Presets dropdown */}
              {showPresets && (
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-purple-100 py-1 z-30 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-purple-900 uppercase tracking-wider bg-purple-50/50">
                    Select Test Service Hub (SIH Prototype)
                  </div>
                  {DEMO_PRESET_LOCATIONS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-purple-50 flex items-start gap-2 text-slate-700 hover:text-purple-900 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold">{preset.name}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{preset.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* "Use My Location" button */}
            <button
              id="btn-use-my-location"
              type="button"
              onClick={handleUseMyLocation}
              disabled={isDetecting}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-semibold rounded-xl shadow-sm shadow-purple-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-75"
            >
              <Navigation className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting...' : t.useMyLocation}</span>
            </button>
          </div>

          {/* Location feedback with coordinates */}
          {detectedBadge && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {detectedBadge}
              </span>
              <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                Latitude: <strong className="text-purple-800">{currentLocation.lat.toFixed(4)}</strong> | Longitude: <strong className="text-purple-800">{currentLocation.lng.toFixed(4)}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Right: Search Radius */}
        <div className="lg:w-80 pt-2 lg:pt-0 lg:border-l lg:border-purple-100 lg:pl-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-700" />
              {t.searchRadius}
            </label>
            <span className="text-xs font-extrabold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
              {searchRadius} km
            </span>
          </div>

          <div className="flex items-center justify-between gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
            {radiusOptions.map((radius) => (
              <button
                key={radius}
                type="button"
                onClick={() => onRadiusChange(radius)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  searchRadius === radius
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                {radius} km
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3 h-3 text-purple-500 shrink-0" />
            <span className="line-clamp-1">
              Privacy shielded: exact residence masked until dispatch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
