import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MapPin, Navigation, Check } from 'lucide-react';

export interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat: number;
  initialLng: number;
  initialAddress?: string;
  initialRadiusKm?: number;
  mode?: 'customer' | 'worker';
  title?: string;
  onSaveLocation: (loc: { latitude: number; longitude: number; address: string; radiusKm?: number }) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialAddress = '',
  initialRadiusKm = 10,
  mode = 'customer',
  title = 'Select Location',
  onSaveLocation
}) => {
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [radiusKm, setRadiusKm] = useState(initialRadiusKm);

  useEffect(() => {
    setLat(initialLat);
    setLng(initialLng);
    setAddress(initialAddress);
    setRadiusKm(initialRadiusKm);
  }, [initialLat, initialLng, initialAddress, initialRadiusKm, isOpen]);

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          setAddress(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        },
        () => {
          alert('Could not access current GPS location.');
        }
      );
    }
  };

  const handleSave = () => {
    onSaveLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      address: address.trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      radiusKm: Number(radiusKm)
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Location Address / Landmark</label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Connaught Place, New Delhi"
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
            <Input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
            <Input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {mode === 'worker' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operational Radius (km): <span className="text-emerald-700 font-bold">{radiusKm} km</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value) || 10)}
              className="w-full accent-emerald-600"
            />
          </div>
        )}

        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            leftIcon={<Navigation className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Use My GPS
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSave}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
