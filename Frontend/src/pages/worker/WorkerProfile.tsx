import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import  ServiceMap  from '../../components/map/ServiceMap';
import { LocationPickerModal } from '../../components/map/LocationPickerModal';
import { ShieldCheck, Building2, Phone, Mail, MapPin, CheckCircle2, Navigation, Compass, Radio } from 'lucide-react';

export const WorkerProfile: React.FC = () => {
  const { workers, updateWorkerLocation, addToast } = useApp();
  const worker = workers[0]; // Active worker in demo

  const [name, setName] = useState(worker.name);
  const [phone, setPhone] = useState(worker.phone);
  const [cooperativeName, setCooperativeName] = useState(worker.cooperativeName);
  const [serviceArea, setServiceArea] = useState(worker.serviceArea);
  const [experienceYears, setExperienceYears] = useState(worker.experienceYears.toString());

  // Location settings
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [lat, setLat] = useState<number>(worker.latitude || 28.6280);
  const [lng, setLng] = useState<number>(worker.longitude || 77.3649);
  const [locationAddress, setLocationAddress] = useState<string>(
    worker.locationAddress || 'Sector 62, Noida, Gautam Buddha Nagar'
  );
  const [serviceRadiusKm, setServiceRadiusKm] = useState<number>(worker.serviceRadiusKm || 10);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile Saved', 'Artisan cooperative profile details updated.');
  };

  const handleSaveLocation = async (loc: {
    latitude: number;
    longitude: number;
    address: string;
    radiusKm?: number;
    accuracy?: number;
  }) => {
    setLat(loc.latitude);
    setLng(loc.longitude);
    setLocationAddress(loc.address);
    if (loc.radiusKm) setServiceRadiusKm(loc.radiusKm);

    try {
      await updateWorkerLocation(worker.id, {
        latitude: loc.latitude,
        longitude: loc.longitude,
        locationAddress: loc.address,
        serviceRadiusKm: loc.radiusKm || serviceRadiusKm,
        locationAccuracy: loc.accuracy || 10
      });
    } catch (err) {
      console.error('Failed to save worker location:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Artisan Member Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Verified credentials & operational geolocation registered under Labour Cooperative Society
        </p>
      </div>

      {/* Main Profile Info Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <img
            src={worker.avatarUrl}
            alt={worker.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-xs"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
            <p className="text-xs text-teal-700 font-semibold">{worker.primaryCategory} Expert</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> NCCT Member #{worker.cooperativeMembershipId || 'NCCT-DEL-4412'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Mobile Number (OTP Registered)"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Affiliated Labour Cooperative Society"
            disabled
            value={cooperativeName}
            leftIcon={<Building2 className="w-4 h-4 text-gray-400" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designated Service Areas (Districts)"
              required
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              leftIcon={<MapPin className="w-4 h-4" />}
            />
            <Input
              label="Verified Years of Experience"
              type="number"
              required
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="outline" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save Basic Details
            </Button>
          </div>
        </form>
      </Card>

      {/* Geolocation & Operational Coverage Area Card (Section 5 & 18) */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <span>Operational Service Geolocation</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customers in your travel radius will see you when searching for {worker.primaryCategory} services
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={() => setIsLocationModalOpen(true)}
            leftIcon={<MapPin className="w-4 h-4" />}
          >
            Update Operational Location
          </Button>
        </div>

        {/* Location Snapshot Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Base Address</span>
            <p className="text-xs font-bold text-slate-900 line-clamp-2">{locationAddress}</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Coordinates</span>
            <p className="text-xs font-mono font-bold text-slate-900">
              {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">Verified GPS Precision</span>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Travel Coverage Radius</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-emerald-700">{serviceRadiusKm}</span>
              <span className="text-xs font-bold text-emerald-800">km coverage circle</span>
            </div>
          </div>
        </div>

        {/* Map Preview of Worker's Service Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Live Service Coverage Circle (Radius: {serviceRadiusKm} km)</span>
            <span className="text-emerald-700 font-medium">Shaded area represents your dispatch zone</span>
          </div>
          <ServiceMap
            centerLat={lat}
            centerLng={lng}
            customerAddress={locationAddress}
            radiusKm={serviceRadiusKm}
            showRadiusCircle={true}
            height="320px"
          />
        </div>
      </Card>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        initialLat={lat}
        initialLng={lng}
        initialAddress={locationAddress}
        initialRadiusKm={serviceRadiusKm}
        mode="worker"
        title="Set Your Operational Service Area"
        onSaveLocation={handleSaveLocation}
      />
    </div>
  );
};
