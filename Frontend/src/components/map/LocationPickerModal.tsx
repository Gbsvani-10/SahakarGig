```tsx
import React, { useEffect, useState } from 'react';
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
  onSaveLocation: (loc: {
    latitude: number;
    longitude: number;
    address: string;
    radiusKm?: number;
  }) => void;
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
  onSaveLocation,
}) => {
  const [lat, setLat] = useState<number>(initialLat);
  const [lng, setLng] = useState<number>(initialLng);
  const [address, setAddress] = useState<string>(initialAddress);
  const [radiusKm, setRadiusKm] = useState<number>(initialRadiusKm);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLat(initialLat);
      setLng(initialLng);
      setAddress(initialAddress);
      setRadiusKm(initialRadiusKm);
    }
  }, [
    isOpen,
    initialLat,
    initialLng,
    initialAddress,
    initialRadiusKm,
  ]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLat(latitude);
        setLng(longitude);
        setAddress(
          `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);

        let message = 'Could not access your current location.';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              'Location permission was denied. Please allow location access in your browser.';
            break;

          case error.POSITION_UNAVAILABLE:
            message =
              'Your current location could not be determined.';
            break;

          case error.TIMEOUT:
            message =
              'Location request timed out. Please try again.';
            break;
        }

        alert(message);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  const handleSave = () => {
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      alert('Please enter valid latitude and longitude.');
      return;
    }

    if (lat < -90 || lat > 90) {
      alert('Latitude must be between -90 and 90.');
      return;
    }

    if (lng < -180 || lng > 180) {
      alert('Longitude must be between -180 and 180.');
      return;
    }

    if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
      alert('Please enter a valid service radius.');
      return;
    }

    const finalAddress =
      address.trim() || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    onSaveLocation({
      latitude: lat,
      longitude: lng,
      address: finalAddress,
      radiusKm: mode === 'worker' ? radiusKm : undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="space-y-4">

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Location Address / Landmark
          </label>

          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Connaught Place, New Delhi"
            leftIcon={
              <MapPin className="w-4 h-4 text-slate-400" />
            }
          />
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Latitude
            </label>

            <Input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (Number.isFinite(value)) {
                  setLat(value);
                }
              }}
              placeholder="e.g. 16.5062"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Longitude
            </label>

            <Input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (Number.isFinite(value)) {
                  setLng(value);
                }
              }}
              placeholder="e.g. 80.6480"
            />
          </div>

        </div>

        {/* Worker service radius */}
        {mode === 'worker' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Operational Radius:{' '}
              <span className="text-emerald-700 font-bold">
                {radiusKm} km
              </span>
            </label>

            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={radiusKm}
              onChange={(e) =>
                setRadiusKm(Number(e.target.value))
              }
              className="w-full accent-emerald-600"
            />

            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>
        )}

        {/* GPS information */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-emerald-600 mt-0.5" />

            <div>
              <p className="text-xs font-semibold text-slate-700">
                GPS Location
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Use your device's GPS to automatically detect
                your current coordinates.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-100">

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            leftIcon={
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            }
          >
            {isLocating ? 'Detecting Location...' : 'Use My GPS'}
          </Button>

          <div className="flex items-center justify-end gap-2">

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleSave}
              leftIcon={
                <Check className="w-3.5 h-3.5" />
              }
            >
              Confirm Location
            </Button>

          </div>
        </div>

      </div>
    </Modal>
  );
};

export default LocationPickerModal;
```
