```tsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WorkerProfile } from '../../types';

export interface ServiceMapProps {
  centerLat: number;
  centerLng: number;
  customerAddress?: string;
  radiusKm?: number;
  workers?: Array<{
    worker: WorkerProfile;
    distanceKm?: number;
  }>;
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
  showRadiusCircle = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  /*
   * Create the map once.
   */
  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [centerLat, centerLng],
        12
      );

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
        }
      ).addTo(map);

      const markerLayer = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = markerLayer;
    } else {
      mapInstanceRef.current.setView(
        [centerLat, centerLng],
        12
      );
    }

    /*
     * Leaflet sometimes calculates the container size before
     * the modal/card has finished rendering.
     */
    const timer = window.setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [centerLat, centerLng]);

  /*
   * Update markers whenever worker/location data changes.
   */
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markerLayer = markersRef.current;

    if (!map || !markerLayer) {
      return;
    }

    markerLayer.clearLayers();

    /*
     * Customer location marker
     */
    const centerIcon = L.divIcon({
      className: 'custom-center-marker',
      html: `
        <div
          style="
            background:#059669;
            color:white;
            width:30px;
            height:30px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            border:3px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            font-size:14px;
          "
        >
          📍
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    const centerMarker = L.marker(
      [centerLat, centerLng],
      {
        icon: centerIcon,
      }
    ).addTo(markerLayer);

    if (customerAddress) {
      centerMarker.bindPopup(
        `<b>Your Location</b><br/>${escapeHtml(customerAddress)}`
      );
    }

    /*
     * Search/service radius
     */
    if (showRadiusCircle && radiusKm > 0) {
      L.circle(
        [centerLat, centerLng],
        {
          radius: radiusKm * 1000,
          color: '#059669',
          fillColor: '#10b981',
          fillOpacity: 0.1,
          weight: 1.5,
        }
      ).addTo(markerLayer);
    }

    /*
     * Worker markers
     */
    workers.forEach((item) => {
      const worker = item.worker;

      const latitude = Number(worker.latitude);
      const longitude = Number(worker.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        return;
      }

      const isSelected =
        String(worker.id) === String(selectedWorkerId);

      const markerSize = isSelected ? 32 : 26;
      const markerAnchor = markerSize / 2;

      const workerIcon = L.divIcon({
        className: 'custom-worker-marker',
        html: `
          <div
            style="
              background:${isSelected ? '#dc2626' : '#2563eb'};
              color:white;
              width:${markerSize}px;
              height:${markerSize}px;
              border-radius:50%;
              display:flex;
              align-items:center;
              justify-content:center;
              border:2px solid white;
              box-shadow:0 2px 5px rgba(0,0,0,0.25);
              font-size:12px;
              cursor:pointer;
            "
          >
            🛠️
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerAnchor, markerAnchor],
      });

      const marker = L.marker(
        [latitude, longitude],
        {
          icon: workerIcon,
        }
      ).addTo(markerLayer);

      const workerName =
        worker.name || 'Worker';

      const trade =
        worker.primaryTrade || 'Service Professional';

      const rating = Number(worker.rating);
      const safeRating = Number.isFinite(rating)
        ? rating.toFixed(1)
        : '—';

      marker.bindPopup(
        `
          <div>
            <b>${escapeHtml(workerName)}</b>
            <br/>
            Trade: ${escapeHtml(trade)}
            <br/>
            Rating: ⭐ ${safeRating}
            ${
              item.distanceKm !== undefined &&
              Number.isFinite(Number(item.distanceKm))
                ? `<br/>Distance: ${Number(
                    item.distanceKm
                  ).toFixed(1)} km`
                : ''
            }
          </div>
        `
      );

      marker.on('click', () => {
        onSelectWorker?.(worker);
      });
    });

    /*
     * Invalidate the map after markers are rendered.
     */
    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    centerLat,
    centerLng,
    radiusKm,
    workers,
    selectedWorkerId,
    showRadiusCircle,
    customerAddress,
    onSelectWorker,
  ]);

  /*
   * Cleanup Leaflet when component is removed.
   */
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height,
        }}
      />
    </div>
  );
};

/*
 * Basic HTML escaping for values inserted into Leaflet popups.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default ServiceMap;
```
