import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ShieldCheck, Sliders, CheckCircle2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { addToast } = useApp();
  const [welfarePercent, setWelfarePercent] = useState('7');
  const [platformPercent, setPlatformPercent] = useState('3');
  const [slaMinutes, setSlaMinutes] = useState('15');
  const [emergencySurcharge, setEmergencySurcharge] = useState('100');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Parameters Updated', 'Platform governance formula updated across cooperative federations.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Platform Governance Parameters</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Configure statutory cooperative deduction splits, emergency SLAs, and nodal audit policies
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <span>Cooperative Value Distribution Formula</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Worker Welfare & Social Security (%)"
                type="number"
                required
                value={welfarePercent}
                onChange={(e) => setWelfarePercent(e.target.value)}
                helperText="Statutory deduction reserved for medical, insurance, and tool grants."
              />

              <Input
                label="Digital Maintenance & Nodal Audit (%)"
                type="number"
                required
                value={platformPercent}
                onChange={(e) => setPlatformPercent(e.target.value)}
                helperText="Cooperative tech maintenance, SMS gateway, and audit costs."
              />
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
              Guaranteed Worker Direct Benefit Transfer (DBT):{' '}
              <strong className="text-emerald-800">
                {100 - (parseFloat(welfarePercent) || 0) - (parseFloat(platformPercent) || 0)}%
              </strong>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Emergency Dispatch Constraints
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Maximum Emergency SLA Target (Minutes)"
                type="number"
                required
                value={slaMinutes}
                onChange={(e) => setSlaMinutes(e.target.value)}
              />

              <Input
                label="Emergency Artisan Rapid Bonus Surcharge (₹)"
                type="number"
                required
                value={emergencySurcharge}
                onChange={(e) => setEmergencySurcharge(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
              Enforce Platform Parameters
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
