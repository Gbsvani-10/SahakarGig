import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WorkerProfile } from '../../types';

export interface ServiceMapProps {
  centerLat: number;
  centerLng: number;
  customerAddress?: string;
  radiusKm?: number;
  workers?: Array<{ worker: WorkerProfile; distanceKm?: number }>;
  selectedWorkerId?: string;
  onSelectWorker?: (worker: WorkerProfile) => void;
  height?: string;
  showRadiusCircle?: boolean;
}

export const ServiceMap: React.FC<ServiceMapProps> = ({
  centerLat,
  centerLng,
  customerAddress,
  radiusKm = 10,
  workers = [],
  selectedWorkerId,
  onSelectWorker,
  height = '400px',
  showRadiusCircle = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 12);
    }
  }, [centerLat, centerLng]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    // Customer / Center Marker
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `<div style="background:#059669;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;">📍</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const centerMarker = L.marker([centerLat, centerLng], { icon: centerIcon }).addTo(markersRef.current);
    if (customerAddress) {
      centerMarker.bindPopup(`<b>Your Location</b><br/>${customerAddress}`);
    }

    if (showRadiusCircle && radiusKm > 0) {
      L.circle([centerLat, centerLng], {
        radius: radiusKm * 1000,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 1.5
      }).addTo(markersRef.current);
    }

    // Workers Markers
    workers.forEach((item) => {
      const w = item.worker;
      if (!w.latitude || !w.longitude) return;

      const isSelected = w.id === selectedWorkerId;
      const workerIcon = L.divIcon({
        className: 'custom-worker-marker',
        html: `<div style="background:${isSelected ? '#dc2626' : '#2563eb'};color:white;width:${isSelected ? 32 : 26}px;height:${isSelected ? 32 : 26}px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.25);font-size:12px;cursor:pointer;">🛠️</div>`,
        iconSize: [isSelected ? 32 : 26, isSelected ? 32 : 26],
        iconAnchor: [isSelected ? 16 : 13, isSelected ? 16 : 13]
      });

      const marker = L.marker([w.latitude, w.longitude], { icon: workerIcon }).addTo(markersRef.current!);
      marker.bindPopup(`<b>${w.name}</b><br/>Trade: ${w.primaryTrade}<br/>Rating: ⭐ ${w.rating.toFixed(1)}`);
      marker.on('click', () => {
        onSelectWorker?.(w);
      });
    });
  }, [centerLat, centerLng, radiusKm, workers, selectedWorkerId, showRadiusCircle, customerAddress, onSelectWorker]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
    </div>
  );
};
