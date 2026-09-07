import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ShieldCheck, Building2, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export const WorkerProfile: React.FC = () => {
  const { workers, addToast } = useApp();
  const worker = workers[0];

  const [name, setName] = useState(worker.name);
  const [phone, setPhone] = useState(worker.phone);
  const [cooperativeName, setCooperativeName] = useState(worker.cooperativeName);
  const [serviceArea, setServiceArea] = useState(worker.serviceArea);
  const [experienceYears, setExperienceYears] = useState(worker.experienceYears.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Profile Saved', 'Artisan cooperative profile details updated.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Artisan Member Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Verified details registered with your primary Labour Cooperative Society
        </p>
      </div>

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
                <ShieldCheck className="w-3.5 h-3.5" /> NCCT Member #NCCT-DEL-4412
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

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
