import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { MapPin, Navigation, Check } from 'lucide-react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLat: number;
  initialLng: number;
  initialAddress?: string;
  initialRadiusKm?: number;
  mode?: 'customer' | 'worker';
  title?: string;
  onSaveLocation: (location: {
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
  title = 'Choose Service Location',
  onSaveLocation,
}) => {
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);
  const [address, setAddress] = useState(initialAddress);
  const [radiusKm, setRadiusKm] = useState(initialRadiusKm);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLatitude(initialLat);
    setLongitude(initialLng);
    setAddress(initialAddress);
    setRadiusKm(initialRadiusKm);
    setError('');
  }, [isOpen, initialLat, initialLng, initialAddress, initialRadiusKm]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setIsLocating(false);
      },
      (geoError) => {
        setIsLocating(false);
        setError(geoError.message || 'Unable to get your current location.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleSave = () => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const radius = Number(radiusKm);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setError('Enter a valid latitude between -90 and 90.');
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError('Enter a valid longitude between -180 and 180.');
      return;
    }
    if (mode === 'worker' && (!Number.isFinite(radius) || radius < 1 || radius > 50)) {
      setError('Worker operational radius must be between 1 and 50 km.');
      return;
    }

    onSaveLocation({
      latitude: lat,
      longitude: lng,
      address: address.trim(),
      ...(mode === 'worker' ? { radiusKm: radius } : {}),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5" />
            <div>
              <p className="font-medium">Service location</p>
              <p className="text-sm text-gray-500">Set the coordinates used for matching.</p>
            </div>
          </div>
          <Button type="button" onClick={useCurrentLocation} disabled={isLocating}>
            <Navigation className="mr-2 h-4 w-4" />
            {isLocating ? 'Locating…' : 'Use current location'}
          </Button>
        </div>

        <Input
          label="Address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Enter service address"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Latitude"
            type="number"
            step="any"
            value={latitude}
            onChange={(event) => setLatitude(Number(event.target.value))}
          />
          <Input
            label="Longitude"
            type="number"
            step="any"
            value={longitude}
            onChange={(event) => setLongitude(Number(event.target.value))}
          />
        </div>

        {mode === 'worker' && (
          <Input
            label="Operational radius (km)"
            type="number"
            min={1}
            max={50}
            step="0.5"
            value={radiusKm}
            onChange={(event) => setRadiusKm(Number(event.target.value))}
          />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" />
            Save location
          </Button>
        </div>
      </div>
    </Modal>
  );
};
