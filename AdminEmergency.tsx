import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Users,
  Navigation
} from 'lucide-react';

export const AdminEmergency: React.FC = () => {
  const { bookings, updateBookingStatus, triggerDemoEmergencyScenario, addToast } = useApp();

  const emergencyBookings = bookings.filter((b) => b.isEmergency);

  const handleTriggerDemo = () => {
    triggerDemoEmergencyScenario();
    addToast('error', 'Demo Emergency Injected', 'Simulated 15-min burst pipe emergency created in Sector 110.');
  };

  const handleForceClose = (id: string) => {
    updateBookingStatus(id, 'Service Completed');
    addToast('success', 'Emergency Resolved', 'Emergency marked completed by admin override.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Active Command Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            Emergency Rapid Response Grid (15-Min SLA)
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time telemetry, artisan geofencing, and automated escalation protocol
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={handleTriggerDemo}
          leftIcon={<Zap className="w-4 h-4" />}
        >
          Inject Live Demo Emergency
        </Button>
      </div>

      {/* Emergency KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Emergencies"
          value={emergencyBookings.length.toString()}
          subtitle="Real-time distress signals"
          icon={<ShieldAlert className="w-5 h-5" />}
          iconBg="bg-red-50 text-red-600"
        />
        <StatCard
          title="Avg Dispatch Time"
          value="42 seconds"
          subtitle="Automated geofence matching"
          icon={<Zap className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Avg On-Site Arrival"
          value="11.4 minutes"
          subtitle="Target < 15.0 minutes"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="SLA Compliance Rate"
          value="97.4%"
          subtitle="38 of 39 within window"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
      </div>

      {/* Simulated Live Dispatch Radar / Map View */}
      <Card className="p-6 bg-slate-900 text-white border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live District Geofence Radar • NCR Sector Matrix
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Telemetry Feed: 4 Artisans In Transit • GPS Synced
          </span>
        </div>

        {/* Tactical UI Simulation Grid */}
        <div className="relative h-64 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />

          {/* Center Radar circles */}
          <div className="absolute w-44 h-44 rounded-full border border-teal-500/20 animate-ping" />
          <div className="absolute w-72 h-72 rounded-full border border-teal-500/10" />

          {/* Active Incident Pin */}
          <div className="absolute top-12 left-1/4 flex items-center gap-2 z-10">
            <div className="relative">
              <div className="w-4 h-4 rounded-full bg-red-600 animate-ping" />
              <div className="w-4 h-4 rounded-full bg-red-600 absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
                !
              </div>
            </div>
            <div className="bg-slate-800/90 p-1.5 rounded-md border border-red-500 text-[10px] shadow-xs">
              <span className="font-bold text-red-400 block">Incident: Burst Pipe (Noida Sec 110)</span>
              <span className="text-slate-300">Artisan: Ravi Kumar (ETA: 4 min)</span>
            </div>
          </div>

          {/* Available Worker Pin 1 */}
          <div className="absolute bottom-16 right-1/3 flex items-center gap-2 z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white" />
            <span className="bg-slate-800/90 text-[10px] text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
              Suresh Patil (Available 0.8 km)
            </span>
          </div>

          {/* Available Worker Pin 2 */}
          <div className="absolute top-20 right-16 flex items-center gap-2 z-10">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white" />
            <span className="bg-slate-800/90 text-[10px] text-emerald-300 px-1.5 py-0.5 rounded border border-slate-700">
              Manoj Verma (Available 1.4 km)
            </span>
          </div>

          <div className="relative z-10 bg-slate-900/90 backdrop-blur-xs border border-slate-700 px-4 py-2 rounded-xl text-center">
            <p className="text-xs font-bold text-white">Geofenced Cooperative Dispatch Engine</p>
            <p className="text-[11px] text-slate-400">Optimal artisan auto-selected within 3.5 km radius</p>
          </div>
        </div>
      </Card>

      {/* Active Emergencies Table */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
          Live Emergency Incidents Feed
        </h3>

        <div className="space-y-3">
          {emergencyBookings.map((b) => (
            <div key={b.id} className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-700">{b.id}</span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                    15m SLA Active
                  </span>
                  <StatusBadge status={b.status} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{b.serviceTitle}</h4>
                <p className="text-xs text-gray-600">
                  Customer: {b.customerName} ({b.customerPhone}) • Address: {b.customerAddress}
                </p>
                <p className="text-xs text-emerald-800 font-semibold">
                  Dispatched Artisan: {b.workerName} ({b.workerPhone}) • {b.cooperativeName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addToast('info', 'Re-route Triggered', 'Dispatched alert pinged to alternative artisan roster.')}
                >
                  Override Reroute
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  className="bg-emerald-700 hover:bg-emerald-800"
                  onClick={() => handleForceClose(b.id)}
                >
                  Mark Resolved
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
