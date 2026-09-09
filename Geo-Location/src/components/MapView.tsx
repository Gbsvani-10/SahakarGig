import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  Eye, 
  MapPin, 
  Compass, 
  Maximize2, 
  RotateCcw, 
  ShieldCheck, 
  Star, 
  Clock, 
  Car, 
  Check, 
  Info,
  Route
} from 'lucide-react';
import { CooperativeWorker, CustomerLocation, DemandArea, ViewMode } from '../types';
import { SKILL_ICONS_MAP } from '../data/mockData';
import { generateSimulatedRoute } from '../utils/geo';

interface MapViewProps {
  customerLocation: CustomerLocation;
  workers: CooperativeWorker[];
  selectedWorker: CooperativeWorker | null;
  onSelectWorker: (worker: CooperativeWorker | null) => void;
  onBookWorker: (worker: CooperativeWorker) => void;
  onViewProfile: (worker: CooperativeWorker) => void;
  activeRouteWorker: CooperativeWorker | null;
  onToggleRoute: (worker: CooperativeWorker | null) => void;
  searchRadiusKm: number;
  viewMode: ViewMode;
  demandAreas?: DemandArea[];
  selectedDemandSkill?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  customerLocation,
  workers,
  selectedWorker,
  onSelectWorker,
  onBookWorker,
  onViewProfile,
  activeRouteWorker,
  onToggleRoute,
  searchRadiusKm,
  viewMode,
  demandAreas = [],
  selectedDemandSkill,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const radiusLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const demandLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [showServiceRadius, setShowServiceRadius] = useState(true);
  const [mapStyle, setMapStyle] = useState<'standard' | 'humanitarian'>('standard');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [customerLocation.lat, customerLocation.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Free, open, non-watermarked OpenStreetMap tiles (no API key required)
      const tileUrl =
        mapStyle === 'humanitarian'
          ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);

      markersLayerGroupRef.current = L.layerGroup().addTo(map);
      radiusLayerGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);
      demandLayerGroupRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer if Style changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl =
      mapStyle === 'humanitarian'
        ? 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // Recenter map on customer location change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([customerLocation.lat, customerLocation.lng], 13, {
        animate: true,
      });
    }
  }, [customerLocation.lat, customerLocation.lng]);

  // Render Customer & Worker Markers + Search Radius
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    const radiusGroup = radiusLayerGroupRef.current;
    const demandGroup = demandLayerGroupRef.current;

    if (!map || !markersGroup || !radiusGroup || !demandGroup) return;

    markersGroup.clearLayers();
    radiusGroup.clearLayers();
    demandGroup.clearLayers();

    // 1. Draw Customer Search Radius Circle
    const customerRadiusCircle = L.circle([customerLocation.lat, customerLocation.lng], {
      radius: searchRadiusKm * 1000,
      color: '#7c3aed',
      fillColor: '#8b5cf6',
      fillOpacity: 0.07,
      weight: 1.5,
      dashArray: '6, 6',
    });
    radiusGroup.addLayer(customerRadiusCircle);

    // 2. Draw Customer Marker with pulsing halo
    const customerIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-3 bg-purple-500/25 rounded-full animate-ping"></div>
        <div class="relative w-10 h-10 bg-purple-900 text-white rounded-full border-2 border-white shadow-xl flex items-center justify-center font-bold text-sm">
          📍
        </div>
        <div class="absolute -bottom-6 bg-purple-950 text-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md border border-purple-800">
          Customer Location
        </div>
      </div>
    `;

    const customerIcon = L.divIcon({
      className: 'customer-marker-container',
      html: customerIconHtml,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const customerMarker = L.marker([customerLocation.lat, customerLocation.lng], {
      icon: customerIcon,
      zIndexOffset: 1000,
    });
    customerMarker.bindPopup(`
      <div class="p-2 text-slate-800 font-sans">
        <div class="font-bold text-purple-900 text-sm flex items-center gap-1.5">
          <span>📍</span> Service Location (Citizen)
        </div>
        <div class="text-xs text-slate-600 mt-1 font-medium">${customerLocation.address}</div>
        <div class="text-[11px] text-purple-700 mt-1 bg-purple-50 p-1.5 rounded-lg border border-purple-100 font-mono">
          Lat: ${customerLocation.lat.toFixed(4)}, Lng: ${customerLocation.lng.toFixed(4)}
        </div>
      </div>
    `);
    markersGroup.addLayer(customerMarker);

    // 3. In Admin Mode: Draw Demand Heatmap Areas
    if (viewMode === 'admin' && demandAreas.length > 0) {
      demandAreas.forEach((area) => {
        let color = '#10b981'; // green low
        let fill = '#34d399';
        if (area.demandLevel === 'High') {
          color = '#ef4444';
          fill = '#f87171';
        } else if (area.demandLevel === 'Medium') {
          color = '#f59e0b';
          fill = '#fbbf24';
        }

        const demandCircle = L.circle([area.lat, area.lng], {
          radius: area.radiusKm * 1000,
          color: color,
          fillColor: fill,
          fillOpacity: 0.22,
          weight: 2,
        });

        demandCircle.bindPopup(`
          <div class="p-2.5 font-sans">
            <div class="flex items-center justify-between gap-2">
              <strong class="text-xs text-slate-900">${area.name}</strong>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                area.demandLevel === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }">${area.demandLevel} Demand</span>
            </div>
            <div class="text-xs text-slate-600 mt-1.5">Zone: <strong>${area.zone}</strong></div>
            <div class="text-xs text-slate-600">Active Workers: <strong>${area.activeWorkers}</strong></div>
            <div class="text-xs text-slate-600">Predicted Requests: <strong>${area.predictedRequests}</strong></div>
            <div class="text-[11px] font-semibold text-purple-700 mt-1 bg-purple-50 p-1 rounded">
              High Needs: ${area.popularSkill}
            </div>
          </div>
        `);
        demandGroup.addLayer(demandCircle);
      });
    }

    // 4. Draw Worker Markers
    workers.forEach((worker) => {
      const isSelected = selectedWorker?.id === worker.id;
      const isRouteActive = activeRouteWorker?.id === worker.id;
      const emoji = SKILL_ICONS_MAP[worker.skill] || '🔧';

      // Status indicator color
      let statusRing = 'border-emerald-500 ring-emerald-200';
      let statusDot = 'bg-emerald-500';
      if (worker.status === 'Busy') {
        statusRing = 'border-amber-500 ring-amber-200';
        statusDot = 'bg-amber-500';
      } else if (worker.status === 'Offline') {
        statusRing = 'border-slate-400 ring-slate-200';
        statusDot = 'bg-slate-400';
      } else if (worker.status === 'Emergency Ready') {
        statusRing = 'border-rose-600 ring-rose-300';
        statusDot = 'bg-rose-600 animate-ping';
      }

      // Worker Service Radius Circle (Translucent zone)
      if (showServiceRadius && (isSelected || isRouteActive || worker.status === 'Emergency Ready')) {
        const serviceZone = L.circle([worker.lat, worker.lng], {
          radius: worker.serviceRadiusKm * 1000,
          color: isSelected ? '#6b21a8' : '#9333ea',
          fillColor: isSelected ? '#a855f7' : '#c084fc',
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: '4, 4',
        });
        radiusGroup.addLayer(serviceZone);
      }

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-115'}">
          ${isSelected ? '<div class="absolute -inset-2 bg-purple-600/30 rounded-full animate-pulse"></div>' : ''}
          <div class="w-10 h-10 rounded-2xl bg-white border-2 ${statusRing} shadow-lg flex items-center justify-center text-lg relative overflow-hidden bg-gradient-to-br from-white to-purple-50">
            <span>${emoji}</span>
            <span class="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full ${statusDot} border border-white"></span>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md whitespace-nowrap shadow-xs">
            ${worker.distanceKm} km
          </div>
        </div>
      `;

      const workerIcon = L.divIcon({
        className: 'worker-marker-node',
        html: markerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const marker = L.marker([worker.lat, worker.lng], { icon: workerIcon });

      // Click event
      marker.on('click', () => {
        onSelectWorker(worker);
      });

      // Bind rich popup
      const popupHtml = `
        <div class="w-64 p-3 font-sans text-slate-800">
          <div class="flex items-start gap-2.5">
            <img src="${worker.avatar}" alt="${worker.name}" class="w-11 h-11 rounded-xl object-cover border border-purple-200 shadow-xs shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1">
                <span class="font-extrabold text-sm text-slate-900 truncate">${worker.name}</span>
                <span class="text-xs" title="Cooperative Verified">✓</span>
              </div>
              <div class="text-xs font-semibold text-purple-700 flex items-center gap-1">
                <span>${emoji}</span>
                <span>${worker.skill}</span>
              </div>
              <div class="text-[10px] text-slate-400 truncate">${worker.cooperativeSociety}</div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1.5 my-2.5 py-2 border-y border-slate-100 text-center text-xs">
            <div>
              <div class="text-[10px] text-slate-400">Rating</div>
              <div class="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                ★ ${worker.rating}
              </div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">Distance</div>
              <div class="font-bold text-slate-800">${worker.distanceKm} km</div>
            </div>
            <div>
              <div class="text-[10px] text-slate-400">ETA</div>
              <div class="font-bold text-purple-700">~${worker.estimatedArrivalMin}m</div>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs mb-3">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
              worker.status === 'Available'
                ? 'bg-emerald-100 text-emerald-800'
                : worker.status === 'Emergency Ready'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }">
              ● ${worker.status}
            </span>
            <span class="font-extrabold text-slate-800">₹${worker.hourlyRate}<span class="text-[10px] font-normal text-slate-400">/hr</span></span>
          </div>

          <div class="flex items-center gap-2">
            <button id="popup-btn-route-${worker.id}" class="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold rounded-lg border border-purple-200 transition-colors">
              View Route
            </button>
            <button id="popup-btn-book-${worker.id}" class="flex-1 py-1.5 px-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors">
              Book Worker
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        setTimeout(() => {
          const btnRoute = document.getElementById(`popup-btn-route-${worker.id}`);
          const btnBook = document.getElementById(`popup-btn-book-${worker.id}`);
          if (btnRoute) {
            btnRoute.onclick = () => onToggleRoute(worker);
          }
          if (btnBook) {
            btnBook.onclick = () => onBookWorker(worker);
          }
        }, 50);
      });

      markersGroup.addLayer(marker);
    });
  }, [
    workers,
    customerLocation,
    selectedWorker,
    activeRouteWorker,
    searchRadiusKm,
    showServiceRadius,
    viewMode,
    demandAreas,
  ]);

  // Render Simulated Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerGroupRef.current;

    if (!map || !routeGroup) return;
    routeGroup.clearLayers();

    if (!activeRouteWorker) return;

    // Generate waypoints
    const waypoints = generateSimulatedRoute(
      [activeRouteWorker.lat, activeRouteWorker.lng],
      [customerLocation.lat, customerLocation.lng],
      8
    );

    // Glowing polyline
    const routeHalo = L.polyline(waypoints, {
      color: '#9333ea',
      weight: 7,
      opacity: 0.35,
      lineCap: 'round',
    });

    const routeLine = L.polyline(waypoints, {
      color: '#6b21a8',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9,
      lineCap: 'round',
    });

    routeGroup.addLayer(routeHalo);
    routeGroup.addLayer(routeLine);

    // Midpoint marker with ETA badge
    const midIdx = Math.floor(waypoints.length / 2);
    const midPoint = waypoints[midIdx];

    const etaBadgeHtml = `
      <div class="bg-purple-950 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-purple-400 flex items-center gap-1 whitespace-nowrap">
        <span>🚗</span>
        <span>${activeRouteWorker.distanceKm} km • ~${activeRouteWorker.estimatedArrivalMin} mins</span>
      </div>
    `;

    const etaIcon = L.divIcon({
      className: 'route-eta-badge',
      html: etaBadgeHtml,
      iconSize: [120, 24],
      iconAnchor: [60, 12],
    });

    const etaMarker = L.marker(midPoint, { icon: etaIcon });
    routeGroup.addLayer(etaMarker);

    // Fit bounds to show route
    const bounds = L.latLngBounds(waypoints);
    map.fitBounds(bounds, { padding: [60, 60], animate: true });
  }, [activeRouteWorker, customerLocation]);

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([customerLocation.lat, customerLocation.lng], 13, {
        animate: true,
      });
      onToggleRoute(null);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-purple-100 shadow-md bg-slate-100">
      {/* Top Map Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none">
        {/* Active Filter / Mode Chip */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-200 shadow-sm flex items-center gap-2 text-xs font-semibold text-purple-900">
          <Compass className="w-3.5 h-3.5 text-purple-700 animate-spin" style={{ animationDuration: '10s' }} />
          <span>
            {viewMode === 'admin'
              ? 'Federation Dispatch & Territorial Coverage'
              : viewMode === 'worker'
              ? 'Worker Terminal • Operational Field Grid'
              : 'Citizen Cooperative Matching & Dispatch Grid'}
          </span>
          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {workers.length} Workers Plotted
          </span>
        </div>

        {/* Right Floating Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMapStyle(mapStyle === 'standard' ? 'humanitarian' : 'standard')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm border transition-all flex items-center gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-purple-50"
            title="Toggle Map Style (OpenStreetMap Standard / Humanitarian)"
          >
            <Layers className="w-3.5 h-3.5 text-purple-700" />
            <span className="hidden sm:inline">{mapStyle === 'standard' ? 'Standard OSM' : 'Civic HOT'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowServiceRadius(!showServiceRadius)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm border transition-all flex items-center gap-1.5 ${
              showServiceRadius
                ? 'bg-purple-800 text-white border-purple-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
            }`}
            title="Toggle Worker Service Radius Circles"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Service Zones</span>
          </button>

          <button
            type="button"
            onClick={handleResetCenter}
            className="p-2 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-900 rounded-xl border border-slate-200 shadow-sm transition-all"
            title="Reset Map to Customer Location"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Active Route Drawer banner if Route is showing */}
      {activeRouteWorker && (
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto bg-purple-950/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl border border-purple-700 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-3">
          <div className="flex items-center gap-3">
            <img
              src={activeRouteWorker.avatar}
              alt={activeRouteWorker.name}
              className="w-10 h-10 rounded-xl object-cover border border-purple-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-purple-100">{activeRouteWorker.name}</span>
                <span className="text-[11px] bg-purple-800 px-2 py-0.2 rounded-full font-medium">
                  {SKILL_ICONS_MAP[activeRouteWorker.skill]} {activeRouteWorker.skill}
                </span>
              </div>
              <p className="text-xs text-purple-200 flex items-center gap-2 mt-0.5">
                <span>📍 Worker Location</span>
                <span>➔</span>
                <span className="font-bold text-white">Route: {activeRouteWorker.distanceKm} km</span>
                <span>➔</span>
                <span className="text-emerald-400 font-bold">~{activeRouteWorker.estimatedArrivalMin} min ETA</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onBookWorker(activeRouteWorker)}
              className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              Book {activeRouteWorker.name.split(' ')[0]}
            </button>
            <button
              onClick={() => onToggleRoute(null)}
              className="px-3 py-2 bg-purple-800 hover:bg-purple-700 text-purple-200 text-xs font-semibold rounded-xl border border-purple-600 transition-colors"
            >
              Close Route
            </button>
          </div>
        </div>
      )}

      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-[480px] sm:h-[540px] lg:h-[600px] z-10"
        style={{ minHeight: '440px' }}
      />

      {/* Legend Footer */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-2 border-t border-purple-100 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-bold text-purple-900 flex items-center gap-1">
            <Info className="w-3 h-3" /> Map Legend:
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Busy
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Emergency Ready
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Offline
          </span>
          <span className="flex items-center gap-1 text-purple-800 font-medium">
            <span className="w-3 h-3 rounded-full border border-purple-500 border-dashed inline-block"></span> Worker Service Zone
          </span>
        </div>

        <div className="text-[10px] text-slate-400 font-mono">
          EPSG:3857 • Haversine Metric Grid
        </div>
      </div>
    </div>
  );
};
