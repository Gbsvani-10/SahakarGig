import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Clock, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const WorkerAvailability: React.FC = () => {
  const { workers, updateWorkerAvailability, addToast } = useApp();
  const currentWorker = workers[0];

  const [dutyStatus, setDutyStatus] = useState(currentWorker.availabilityStatus);
  const [schedule, setSchedule] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false
  });

  const [emergencyOptIn, setEmergencyOptIn] = useState(true);

  const handleSave = () => {
    updateWorkerAvailability(currentWorker.id, dutyStatus);
    addToast('success', 'Roster Updated', 'Your weekly working schedule and emergency dispatch status have been synced.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Availability & Work Schedule</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Configure duty hours, working days, and emergency rapid-response dispatch eligibility
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Instant Live Duty Switch */}
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Live Duty Status
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'Available', label: 'Available (Online)', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
              { id: 'Busy', label: 'Busy (On Job)', color: 'border-amber-500 bg-amber-50 text-amber-900' },
              { id: 'Offline', label: 'Offline (Resting)', color: 'border-slate-500 bg-slate-50 text-slate-900' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setDutyStatus(st.id as any)}
                className={`p-4 rounded-xl border-2 font-bold text-xs transition-all cursor-pointer ${
                  dutyStatus === st.id ? st.color + ' shadow-xs' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Emergency Dispatch Opt-In */}
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <input
            type="checkbox"
            checked={emergencyOptIn}
            onChange={(e) => setEmergencyOptIn(e.target.checked)}
            className="mt-1 rounded border-red-400 text-red-600 focus:ring-red-500"
          />
          <div>
            <h4 className="text-xs font-bold text-red-950 uppercase tracking-wider">
              Opt-in to Rapid 15-Minute Emergency Dispatch
            </h4>
            <p className="text-xs text-red-800 mt-0.5">
              Enables notifications for urgent distress breakdowns within 3.5 km (+₹100 bonus surcharge credited directly per job).
            </p>
          </div>
        </div>

        {/* Weekly Day Roster */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Weekly Working Days
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
            {[
              { key: 'monday', label: 'Mon' },
              { key: 'tuesday', label: 'Tue' },
              { key: 'wednesday', label: 'Wed' },
              { key: 'thursday', label: 'Thu' },
              { key: 'friday', label: 'Fri' },
              { key: 'saturday', label: 'Sat' },
              { key: 'sunday', label: 'Sun' }
            ].map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setSchedule({ ...schedule, [d.key]: !schedule[d.key as keyof typeof schedule] })}
                className={`p-3 rounded-xl border text-center font-bold text-xs transition-colors cursor-pointer ${
                  schedule[d.key as keyof typeof schedule]
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-white text-gray-400 border-gray-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" onClick={handleSave} rightIcon={<CheckCircle2 className="w-4 h-4" />}>
            Save Availability Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};
