import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Building2, Plus, MapPin, Users, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Cooperative } from '../../types';

export const AdminCooperatives: React.FC = () => {
  const { cooperatives, addToast } = useApp();
  const [list, setList] = useState<Cooperative[]>(cooperatives);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [state, setState] = useState('Delhi');
  const [city, setCity] = useState('New Delhi');
  const [president, setPresident] = useState('');
  const [phone, setPhone] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCoop: Cooperative = {
      id: `coop-${Date.now()}`,
      name,
      registrationNumber: regNo,
      state,
      city,
      address: `${city}, ${state}`,
      presidentName: president,
      secretaryName: 'Official Nominee',
      contactPhone: phone,
      contactEmail: 'contact@coop.org.in',
      totalWorkers: 15,
      activeWorkers: 12,
      completedJobs: 0,
      welfareFundBalance: 50000,
      verificationStatus: 'Verified',
      establishedYear: 2024,
      serviceCategories: ['Plumbing', 'Electrical'],
      bylawsDocumentUrl: '#'
    };
    setList([...list, newCoop]);
    setShowModal(false);
    addToast('success', 'Cooperative Enrolled', `${name} registered with NCCT compliance seal.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Labour Cooperative Societies</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Registered societies under State Cooperative Societies Acts and Multi-State Cooperative Societies Act
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Register New Cooperative
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => (
          <Card key={c.id} className="p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Verified NCCT ✓
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-gray-900">{c.name}</h3>
                <p className="font-mono text-[11px] text-gray-400">Reg: {c.registrationNumber}</p>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="font-semibold text-gray-900">{c.city}, {c.state}</span>
                </div>
                <div className="flex justify-between">
                  <span>President / Nodal:</span>
                  <span className="font-semibold text-gray-900">{c.presidentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Artisans Enrolled:</span>
                  <span className="font-bold text-teal-700">{c.totalWorkers} Members</span>
                </div>
                <div className="flex justify-between">
                  <span>Welfare Reserve:</span>
                  <span className="font-bold text-emerald-700">₹{(c.welfareFundBalance / 1000).toFixed(1)}k</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {c.serviceCategories.map((cat) => (
                  <span key={cat} className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400">Est. {c.establishedYear}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToast('info', 'Bylaws Audited', `Audited charter records for ${c.name}.`)}
              >
                Inspect Bylaws
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Register Labour Cooperative Society"
          subtitle="NCCT District Verification Registry"
          maxWidth="md"
        >
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            <Input
              label="Cooperative Society Full Legal Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pune Industrial Workers Cooperative Society Ltd."
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Registration Certificate No."
                required
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. MSCS/CR/2026/88"
              />
              <Input
                label="State"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City / District"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input
                label="President / Secretary Name"
                required
                value={president}
                onChange={(e) => setPresident(e.target.value)}
              />
            </div>

            <Input
              label="Official Contact Phone"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Enrol Cooperative Society
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
