import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { WorkerProfile, NearbyWorkerResult } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { SearchBar } from '../../components/common/SearchBar';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/StatusBadge';
import  ServiceMap  from '../../components/map/ServiceMap';
import { LocationPickerModal } from '../../components/map/LocationPickerModal';
import { NearbyWorkerCard } from '../../components/map/NearbyWorkerCard';
import { clientGeoService } from '../../services/geoService';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Award, 
  Wrench, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar,
  Navigation,
  Compass,
  Map as MapIcon,
  LayoutGrid,
  Filter,
  RefreshCw,
  Loader2
} from 'lucide-react';

export const CustomerWorkers: React.FC = () => {
  const { workers, customerLocation, setCustomerLocation, addToast } = useApp();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  // Location State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [nearbyWorkers, setNearbyWorkers] = useState<NearbyWorkerResult[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState<boolean>(false);

  const categories = ['All', 'Plumber', 'Electrician', 'Carpenter', 'Painter', 'Cleaner', 'Caregiver', 'Technician'];
  const radiusOptions = [1, 3, 5, 10, 20];

  // Fetch nearby matching workers whenever customer location, radius, category, or availableOnly changes
  useEffect(() => {
    let isCancelled = false;

    const fetchNearby = async () => {
      setIsLoadingNearby(true);
      try {
        const queryParams = new URLSearchParams({
          latitude: String(customerLocation.latitude),
          longitude: String(customerLocation.longitude),
          radiusKm: String(radiusKm),
          availableOnly: String(availableOnly),
          service: selectedCategory === 'All' ? '' : selectedCategory
        });

        const res = await fetch(`/api/services/nearby?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && json.success && json.data && Array.isArray(json.data.workers)) {
            setNearbyWorkers(json.data.workers);
            setIsLoadingNearby(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API /api/services/nearby fetch error, using local fallback:', err);
      }

      // Local fallback matching calculation
      if (!isCancelled) {
        import('../../server/geoUtils').then(({ findNearbyWorkers }) => {
          const matches = findNearbyWorkers(
            workers,
            customerLocation.latitude,
            customerLocation.longitude,
            radiusKm,
            {
              service: selectedCategory === 'All' ? undefined : selectedCategory,
              availableOnly
            }
          );
          setNearbyWorkers(matches);
          setIsLoadingNearby(false);
        });
      }
    };

    fetchNearby();

    return () => {
      isCancelled = true;
    };
  }, [customerLocation, radiusKm, selectedCategory, availableOnly, workers]);

  // Handle GPS detection using Browser Geolocation API
  const handleUseCurrentGPS = async () => {
    setIsDetectingLocation(true);
    try {
      const geoState = await clientGeoService.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 8000
      });
      setCustomerLocation(geoState);
      addToast('success', '📍 Location Updated', `Set to ${geoState.address || 'your current coordinates'}`);
    } catch (err: any) {
      addToast('error', 'Location Error', err.userFriendlyMessage || 'Could not access browser location.');
      setIsLocationModalOpen(true);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Handle saving location from picker modal
  const handleSaveLocationFromModal = (loc: { latitude: number; longitude: number; address: string }) => {
    setCustomerLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      address: loc.address,
      source: 'manual_picker',
      timestamp: new Date().toISOString()
    });
    addToast('success', 'Location Saved', `Updated search center to ${loc.address}`);
  };

  // Filter workers based on search query
  const displayWorkers = nearbyWorkers.filter((nw) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const w = nw.worker;
    return (
      w.name.toLowerCase().includes(term) ||
      w.primaryCategory.toLowerCase().includes(term) ||
      w.cooperativeName.toLowerCase().includes(term) ||
      w.serviceArea.toLowerCase().includes(term) ||
      (w.locationAddress && w.locationAddress.toLowerCase().includes(term))
    );
  });

  const handleBookWorker = (worker: WorkerProfile) => {
    setSelectedWorker(null);
    navigate(`/customer/booking-flow?workerId=${worker.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>Verified Cooperative Artisans</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Geo-Matched
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time proximity matching connected directly to verified Labour Cooperative Societies
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'map'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map & Distance</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'grid'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid List</span>
          </button>
        </div>
      </div>

      {/* Location Status & Radius Banner (Section 3 & 4) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Current Location Display */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Search Center</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-emerald-700 font-semibold">Active GPS</span>
            </div>
            <div className="text-sm font-bold text-slate-900 line-clamp-1">
              {customerLocation.address || `Lat: ${customerLocation.latitude.toFixed(4)}, Lng: ${customerLocation.longitude.toFixed(4)}`}
            </div>
          </div>
        </div>

        {/* Quick Location Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleUseCurrentGPS}
            disabled={isDetectingLocation}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition disabled:opacity-50"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Detecting GPS...</span>
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" />
                <span>📍 Use My Current Location</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>Change Location</span>
          </button>
        </div>
      </div>

      {/* Filter, Radius Selector & Search Controls */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by artisan name, trade, or locality..."
            className="w-full md:w-80"
          />

          {/* Search Radius Pills (Section 4) */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-500 mr-1 whitespace-nowrap">Radius:</span>
            {radiusOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadiusKm(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  radiusKm === r
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {r} km
              </button>
            ))}

            {/* Available Only Filter */}
            <label className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer select-none whitespace-nowrap">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span>Available Now Only</span>
            </label>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1 whitespace-nowrap">Trade:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Map Column (7 cols on large screens) */}
          <div className="lg:col-span-7 space-y-3 sticky top-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-semibold text-slate-700">
                Interactive Service Map ({displayWorkers.length} Artisans within {radiusKm} km)
              </span>
              <span className="text-emerald-700 font-medium">Click any pin to inspect artisan</span>
            </div>

            <ServiceMap
              centerLat={customerLocation.latitude}
              centerLng={customerLocation.longitude}
              customerAddress={customerLocation.address}
              radiusKm={radiusKm}
              workers={displayWorkers}
              selectedWorkerId={selectedWorker?.id}
              onSelectWorker={(w) => setSelectedWorker(w)}
              height="480px"
              showRadiusCircle={true}
            />
          </div>

          {/* Nearby List Column (5 cols on large screens) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span>Nearby Artisans (Ranked by Proximity & Verification)</span>
              {isLoadingNearby && <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />}
            </div>

            {displayWorkers.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  No verified service providers found within {radiusKm} km
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try expanding your search radius to find certified artisans serving nearby NCR zones, or clear the trade filter.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRadiusKm(20)}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
                  >
                    Search within 20 km
                  </button>
                  {selectedCategory !== 'All' && (
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('All')}
                      className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                    >
                      Show All Trades
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsLocationModalOpen(true)}
                    className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition"
                  >
                    Choose Location Manually
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                {displayWorkers.map((item, idx) => (
                  <NearbyWorkerCard
                    key={item.worker.id}
                    worker={item.worker}
                    distanceKm={item.distanceKm}
                    isSelected={selectedWorker?.id === item.worker.id}
                    isClosest={idx === 0}
                    onSelect={(w) => setSelectedWorker(w)}
                    onBook={(w) => handleBookWorker(w)}
                    onViewProfile={(w) => setSelectedWorker(w)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-600">
            Showing {displayWorkers.length} verified artisans within {radiusKm} km of your location
          </div>

          {displayWorkers.length === 0 ? (
            <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-900">No artisans found within {radiusKm} km</h4>
              <p className="text-xs text-slate-500">Expand your radius or select a different category.</p>
              <button
                type="button"
                onClick={() => setRadiusKm(20)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Expand to 20 km
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayWorkers.map((item, idx) => (
                <NearbyWorkerCard
                  key={item.worker.id}
                  worker={item.worker}
                  distanceKm={item.distanceKm}
                  isClosest={idx === 0}
                  onSelect={(w) => setSelectedWorker(w)}
                  onBook={(w) => handleBookWorker(w)}
                  onViewProfile={(w) => setSelectedWorker(w)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialLat={customerLocation.latitude}
        initialLng={customerLocation.longitude}
        initialAddress={customerLocation.address}
        mode="customer"
        title="Set Your Service Location"
        onSaveLocation={handleSaveLocationFromModal}
      />

      {/* Detailed Worker Profile Modal */}
      {selectedWorker && (
        <Modal
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          title={selectedWorker.name}
          subtitle={`Verified Artisan • ${selectedWorker.cooperativeName}`}
          maxWidth="xl"
        >
          <div className="space-y-6">
            {/* Top Overview */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <img
                src={selectedWorker.avatarUrl}
                alt={selectedWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border border-emerald-300 shadow-xs"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{selectedWorker.name}</h3>
                  <StatusBadge status="Verified" />
                </div>
                <p className="text-xs font-bold text-emerald-800">
                  {selectedWorker.primaryCategory} • {selectedWorker.experienceYears} Years Experience
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedWorker.rating} ({selectedWorker.reviewCount} reviews)
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700">
                    📍 {selectedWorker.distanceKm ? `${selectedWorker.distanceKm.toFixed(1)} km away` : 'Nearby'}
                  </span>
                </div>
              </div>
            </div>

            {/* Service Location & Coverage Area */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Service Operational Base & Coverage:</span>
              </div>
              <p className="text-slate-600">{selectedWorker.locationAddress || selectedWorker.serviceArea}</p>
              <p className="text-slate-400 text-[11px]">Maximum travel radius: {selectedWorker.serviceRadiusKm || 15} km</p>
            </div>

            {/* Cooperative Society Details */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>Affiliated Cooperative Society:</span>
              </div>
              <p className="text-blue-800">{selectedWorker.cooperativeName}</p>
              <p className="text-[11px] text-blue-600">Welfare & Medical Cover: {selectedWorker.welfareStatus.schemeName}</p>
            </div>

            {/* Skills & Certifications */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Certified Skills & Competencies</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedWorker.skills.map((skill) => (
                  <div key={skill.id} className="p-2.5 rounded-lg border border-gray-200 bg-white text-xs space-y-1">
                    <div className="font-semibold text-gray-900 flex items-center justify-between">
                      <span>{skill.name}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {skill.level}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500">Certified by: {skill.certifiedBy}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate & Booking Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <span className="text-xs text-gray-500 block">Cooperative Standard Tariff</span>
                <span className="text-xl font-black text-gray-900">₹{selectedWorker.hourlyRate}</span>
                <span className="text-xs text-gray-500"> / hour</span>
              </div>
              <Button
                variant="primary"
                onClick={() => handleBookWorker(selectedWorker)}
              >
                Proceed to Book Artisan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
