import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  AlertCircle, 
  ShieldCheck, 
  Users, 
  Navigation, 
  Search, 
  Sliders, 
  Layers, 
  Zap, 
  Building2, 
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { 
  CooperativeWorker, 
  CustomerLocation, 
  ServiceCategory, 
  WorkerStatus, 
  AppLanguage, 
  ViewMode 
} from './types';
import { 
  DEFAULT_CUSTOMER_LOCATION, 
  MOCK_WORKERS, 
  MOCK_LIVE_REQUESTS, 
  MOCK_DEMAND_AREAS 
} from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { calculateHaversineDistance, estimateTravelTime, computeMatchScore } from './utils/geo';

// Components
import { Navbar } from './components/Navbar';
import { SummaryStats } from './components/SummaryStats';
import { LocationSearch } from './components/LocationSearch';
import { ServiceFilter } from './components/ServiceFilter';
import { MapView } from './components/MapView';
import { WorkerCard } from './components/WorkerCard';
import { SmartMatchingPanel } from './components/SmartMatchingPanel';
import { EmergencyModal } from './components/EmergencyModal';
import { BookingModal } from './components/BookingModal';
import { WorkerProfileModal } from './components/WorkerProfileModal';
import { WorkerViewPanel } from './components/WorkerViewPanel';
import { AdminDispatchPanel } from './components/AdminDispatchPanel';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>('en');
  const [viewMode, setViewMode] = useState<ViewMode>('customer');
  const [customerLocation, setCustomerLocation] = useState<CustomerLocation>(DEFAULT_CUSTOMER_LOCATION);
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [selectedService, setSelectedService] = useState<ServiceCategory>('All Services');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedDistanceFilter, setSelectedDistanceFilter] = useState<number | null>(null);

  // Modals & Active selections
  const [selectedWorker, setSelectedWorker] = useState<CooperativeWorker | null>(null);
  const [activeRouteWorker, setActiveRouteWorker] = useState<CooperativeWorker | null>(null);
  const [bookingWorker, setBookingWorker] = useState<CooperativeWorker | null>(null);
  const [profileWorker, setProfileWorker] = useState<CooperativeWorker | null>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<string>('map');

  const t = TRANSLATIONS[currentLanguage];

  // Recalculate dynamic distance & match scores relative to current customer location
  const allEnrichedWorkers = useMemo(() => {
    return MOCK_WORKERS.map((w) => {
      const distance = calculateHaversineDistance(
        customerLocation.lat,
        customerLocation.lng,
        w.lat,
        w.lng
      );
      const arrival = estimateTravelTime(distance, w.status === 'Emergency Ready');
      const match = computeMatchScore(
        w.skill,
        selectedService,
        distance,
        w.status,
        w.rating,
        w.experienceYears
      );

      return {
        ...w,
        distanceKm: distance,
        estimatedArrivalMin: arrival,
        matchScore: match.finalScore,
        matchBreakdown: match.breakdown,
      };
    });
  }, [customerLocation, selectedService]);

  // Filter workers based on service, availability, distance filter and search radius
  const filteredWorkers = useMemo(() => {
    return allEnrichedWorkers
      .filter((w) => {
        // Must be within customer's active search radius
        if (w.distanceKm > searchRadius) return false;

        // Service category filter
        if (selectedService !== 'All Services' && w.skill !== selectedService) {
          return false;
        }

        // Availability filter
        if (selectedAvailability !== 'All' && w.status !== selectedAvailability) {
          return false;
        }

        // Distance filter
        if (selectedDistanceFilter !== null && w.distanceKm > selectedDistanceFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [allEnrichedWorkers, searchRadius, selectedService, selectedAvailability, selectedDistanceFilter]);

  // Skill counts for filter pills
  const workerCountsBySkill = useMemo(() => {
    const counts: Record<string, number> = { 'All Services': 0 };
    allEnrichedWorkers.forEach((w) => {
      if (w.distanceKm <= searchRadius) {
        counts['All Services'] = (counts['All Services'] || 0) + 1;
        counts[w.skill] = (counts[w.skill] || 0) + 1;
      }
    });
    return counts;
  }, [allEnrichedWorkers, searchRadius]);

  // Top recommended candidate
  const topCandidate = useMemo(() => {
    if (filteredWorkers.length > 0) return filteredWorkers[0];
    return allEnrichedWorkers[0];
  }, [filteredWorkers, allEnrichedWorkers]);

  // Stats calculation
  const stats = useMemo(() => {
    const nearby = allEnrichedWorkers.filter((w) => w.distanceKm <= searchRadius);
    const available = nearby.filter((w) => w.status === 'Available' || w.status === 'Emergency Ready');
    const totalDist = nearby.reduce((acc, w) => acc + w.distanceKm, 0);
    const avgDist = nearby.length > 0 ? totalDist / nearby.length : 3.2;

    const activeReqs = MOCK_LIVE_REQUESTS.filter((r) => r.status !== 'Assigned');
    const emergencyReqs = MOCK_LIVE_REQUESTS.filter((r) => r.priority === 'Emergency');

    return {
      totalWorkers: nearby.length,
      availableCount: available.length,
      averageDistance: avgDist,
      activeRequestsCount: activeReqs.length,
      emergencyRequestsCount: emergencyReqs.length,
    };
  }, [allEnrichedWorkers, searchRadius]);

  const handleToggleRoute = (worker: CooperativeWorker | null) => {
    setActiveRouteWorker(worker);
    if (worker) {
      setSelectedWorker(worker);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24 lg:pb-12">
      {/* Navigation Header */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        viewMode={viewMode}
        onViewModeToggle={setViewMode}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Section 2: Page Header & Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-purple-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>Smart India Hackathon • Problem 26089</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 bg-purple-100/80 px-3 py-1.5 rounded-xl border border-purple-200">
              <Building2 className="w-3.5 h-3.5 text-purple-700" />
              Cooperative Gig Marketplace
            </span>
          </div>
        </div>

        {/* View Switcher: Customer vs Worker vs Admin View */}
        {viewMode === 'admin' ? (
          /* SECTION: ADMIN GEO-SPATIAL FEDERATION COMMAND VIEW */
          <div className="space-y-6">
            <AdminDispatchPanel
              workers={allEnrichedWorkers}
              onDispatchWorker={(w) => {
                setSelectedWorker(w);
                setActiveRouteWorker(w);
              }}
            />

            {/* Interactive Map in Admin Mode with Demand Layer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Federation Geo-Spatial Density & Territorial Coverage Map
                  </h2>
                  <p className="text-xs text-slate-500">
                    Territorial demand circles overlaid with live cooperative worker locations
                  </p>
                </div>
                <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Heatmap: High / Medium / Low Demand Sectors
                </span>
              </div>
              <MapView
                customerLocation={customerLocation}
                workers={filteredWorkers}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onBookWorker={setBookingWorker}
                onViewProfile={setProfileWorker}
                activeRouteWorker={activeRouteWorker}
                onToggleRoute={handleToggleRoute}
                searchRadiusKm={searchRadius}
                viewMode={viewMode}
                demandAreas={MOCK_DEMAND_AREAS}
              />
            </div>
          </div>
        ) : viewMode === 'worker' ? (
          /* SECTION: COOPERATIVE WORKER FIELD OPERATIONS & DISPATCH VIEW */
          <div className="space-y-6">
            <WorkerViewPanel
              onAcceptAndRoute={(req) => {
                const targetWorker = allEnrichedWorkers.find(w => w.skill === req.service) || allEnrichedWorkers[0];
                setActiveRouteWorker(targetWorker);
                setSelectedWorker(targetWorker);
              }}
              activeRouteWorker={activeRouteWorker}
              onSelectWorkerRoute={setActiveRouteWorker}
            />

            {/* Interactive Map in Worker Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    Active Operational Territory & Route Grid
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live route navigation from worker hub to accepted citizen location
                  </p>
                </div>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Worker GPS Signal Active
                </span>
              </div>
              <MapView
                customerLocation={customerLocation}
                workers={filteredWorkers}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onBookWorker={setBookingWorker}
                onViewProfile={setProfileWorker}
                activeRouteWorker={activeRouteWorker}
                onToggleRoute={handleToggleRoute}
                searchRadiusKm={searchRadius}
                viewMode={viewMode}
                demandAreas={MOCK_DEMAND_AREAS}
              />
            </div>

            {/* Nearby Cooperative Trade Peers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Nearby Cooperative Peers & Backup Workers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified trade union members in your vicinity for multi-person tasks or emergency assistance
                  </p>
                </div>
                <span className="text-xs text-purple-900 bg-purple-50 font-bold px-2 py-0.5 rounded-md border border-purple-200">
                  Union Solidarity Network
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.slice(0, 3).map((peer) => (
                  <div
                    key={peer.id}
                    className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-12 h-12 rounded-xl object-cover border border-purple-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{peer.name}</h4>
                        <p className="text-xs text-purple-700 font-semibold">{peer.skill}</p>
                        <p className="text-[11px] text-slate-500">{peer.distanceKm} km away • {peer.status}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleRoute(peer)}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-xl border border-purple-200"
                    >
                      Locate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* CITIZEN / CUSTOMER GEO-SPATIAL WORKER MATCHING VIEW */
          <div className="space-y-6">
            {/* Section 2: Summary Stats Cards */}
            <SummaryStats
              totalWorkers={stats.totalWorkers}
              availableCount={stats.availableCount}
              averageDistance={stats.averageDistance}
              activeRequestsCount={stats.activeRequestsCount}
              emergencyRequestsCount={stats.emergencyRequestsCount}
              currentLanguage={currentLanguage}
            />

            {/* Section 3: Location Search Input */}
            <LocationSearch
              currentLocation={customerLocation}
              onLocationChange={setCustomerLocation}
              searchRadius={searchRadius}
              onRadiusChange={setSearchRadius}
              currentLanguage={currentLanguage}
            />

            {/* Section 13: Emergency Service Banner */}
            <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-rose-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30">
                  <AlertCircle className="w-6 h-6 text-white animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-white">
                      🚨 {t.emergencyService}
                    </span>
                    <span className="bg-rose-950 text-rose-200 text-[10px] font-mono px-2 py-0.5 rounded-full border border-rose-400/40">
                      Under 15 Mins Dispatch
                    </span>
                  </div>
                  <p className="text-xs text-rose-100 mt-0.5">
                    {t.emergencySubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 shrink-0 flex items-center justify-center gap-2"
              >
                <span>{t.requestEmergency}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Section 6, 7, 8: Service Filter Bar */}
            <ServiceFilter
              selectedService={selectedService}
              onServiceChange={setSelectedService}
              selectedAvailability={selectedAvailability}
              onAvailabilityChange={setSelectedAvailability}
              selectedDistanceFilter={selectedDistanceFilter}
              onDistanceFilterChange={setSelectedDistanceFilter}
              currentLanguage={currentLanguage}
              workerCountsBySkill={workerCountsBySkill}
            />

            {/* Section 4, 11, 12, 14: Interactive Map View */}
            <div id="map" className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-700" />
                  <span>Interactive Geo-Spatial Dispatch Map</span>
                </h2>
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-purple-900">{filteredWorkers.length}</strong> matching cooperative workers
                </span>
              </div>

              <MapView
                customerLocation={customerLocation}
                workers={filteredWorkers}
                selectedWorker={selectedWorker}
                onSelectWorker={setSelectedWorker}
                onBookWorker={setBookingWorker}
                onViewProfile={setProfileWorker}
                activeRouteWorker={activeRouteWorker}
                onToggleRoute={handleToggleRoute}
                searchRadiusKm={searchRadius}
                viewMode={viewMode}
              />
            </div>

            {/* Section 10 & 11: Intelligent Smart Matching Breakdown */}
            <SmartMatchingPanel
              topWorker={topCandidate}
              customerLocation={customerLocation}
              selectedService={selectedService}
              onViewRoute={handleToggleRoute}
              onBookWorker={setBookingWorker}
              currentLanguage={currentLanguage}
            />

            {/* Section 9: Nearby Verified Worker List Cards */}
            <div id="find-workers" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{t.nearbyVerifiedWorkers}</span>
                    <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2 py-0.5 rounded-full">
                      {filteredWorkers.length}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Affiliated with District Labour Cooperative Societies & Federations
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <span>Sorted by:</span>
                  <span className="font-extrabold text-purple-900 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
                    Intelligent Match Score
                  </span>
                </div>
              </div>

              {/* Workers Grid */}
              {filteredWorkers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWorkers.map((worker) => (
                    <WorkerCard
                      key={worker.id}
                      worker={worker}
                      isSelected={selectedWorker?.id === worker.id}
                      onSelect={(w) => {
                        setSelectedWorker(w);
                        // Center on worker
                      }}
                      onBook={setBookingWorker}
                      onViewProfile={setProfileWorker}
                      onViewRoute={handleToggleRoute}
                      currentLanguage={currentLanguage}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800">
                    No Workers in Selected Filter Range
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try expanding your search radius to 15 km or 25 km, or reset service filters to "All Services".
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService('All Services');
                      setSelectedAvailability('All');
                      setSelectedDistanceFilter(null);
                      setSearchRadius(25);
                    }}
                    className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Section 23: Location Privacy Guarantee Notice */}
            <div className="bg-purple-50/60 rounded-2xl p-4 sm:p-5 border border-purple-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">
                    Cooperative Data Privacy Guarantee
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {t.privacyNote}
                  </p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-purple-800 bg-white px-3 py-1.5 rounded-xl border border-purple-200 shrink-0">
                End-to-End Encrypted Location Tokens
              </div>
            </div>

            {/* Section 29: Problem Statement Flow Architecture Summary */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-extrabold text-slate-900">
                  SahakarGig Geo-Spatial Dispatch Architecture (SIH 26089)
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Demonstrating end-to-end intelligent matching between household demand and cooperative federation workers:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">1. Citizen Need</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Service Requested</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">2. Geolocation</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Address Detected</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">3. Haversine Math</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Distance & Radius</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">4. Skill Matching</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Trade Accreditation</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">5. Status Check</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Available/Emergency</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="text-[10px] font-bold text-purple-900 uppercase">6. Map Plotting</div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">Live Marker & Route</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-900 uppercase">7. Dispatch</div>
                  <div className="text-xs font-bold text-emerald-800 mt-1">Fair-Wage Booking</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-purple-100 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
              SG
            </div>
            <div>
              <span className="font-extrabold text-slate-900">SahakarGig</span>
              <span className="ml-1 text-slate-400">• SIH Problem Statement ID 26089</span>
            </div>
          </div>
          <p className="text-center sm:text-right text-[11px] text-slate-400">
            {t.cooperativePledge}
          </p>
        </div>
      </footer>

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        workers={allEnrichedWorkers}
        customerLocation={customerLocation}
        onRequestWorker={(worker) => {
          setSelectedWorker(worker);
          setActiveRouteWorker(worker);
        }}
      />

      <BookingModal
        worker={bookingWorker}
        customerLocation={customerLocation}
        isOpen={!!bookingWorker}
        onClose={() => setBookingWorker(null)}
        onBookingSuccess={() => {
          // Booking confirmed
        }}
      />

      <WorkerProfileModal
        worker={profileWorker}
        isOpen={!!profileWorker}
        onClose={() => setProfileWorker(null)}
        onBook={(w) => {
          setProfileWorker(null);
          setBookingWorker(w);
        }}
        onViewRoute={(w) => {
          setProfileWorker(null);
          handleToggleRoute(w);
        }}
      />

      {/* Section 24: Mobile Bottom Navigation */}
      <MobileBottomNav
        viewMode={viewMode}
        onViewModeToggle={setViewMode}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        activeTab={activeMobileTab}
        onSelectTab={setActiveMobileTab}
      />
    </div>
  );
}
