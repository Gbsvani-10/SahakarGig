import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldAlert, 
  CheckCircle2, 
  Radio, 
  Wrench, 
  Zap, 
  Flame, 
  Key,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const CustomerEmergency: React.FC = () => {
  const { workers, createBooking, addToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State: 'form' | 'dispatching' | 'assigned' | 'arrived' | 'completed'
  const [phase, setPhase] = useState<'form' | 'dispatching' | 'assigned' | 'arrived' | 'completed'>('form');

  const [category, setCategory] = useState<'Plumbing' | 'Electrical' | 'Gas' | 'Locksmith'>('Plumbing');
  const [urgency, setUrgency] = useState<'15 mins' | '30 mins' | 'Same Day'>('15 mins');
  const [address, setAddress] = useState('Flat 402, Lotus Panache, Sector 110, Noida');
  const [description, setDescription] = useState('Main water pipe burst under the washbasin, heavy leaking!');
  const [etaMinutes, setEtaMinutes] = useState(12);

  const assignedWorker = workers.find((w) => w.primaryCategory === (category === 'Gas' || category === 'Locksmith' ? 'Plumber' : category)) || workers[0];

  // Dispatch simulation timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'dispatching') {
      timer = setTimeout(() => {
        setPhase('assigned');
        addToast('success', 'Emergency Artisan Dispatched', `${assignedWorker.name} has been assigned and is en route!`);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [phase]);

  // ETA countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === 'assigned' && etaMinutes > 1) {
      interval = setInterval(() => {
        setEtaMinutes((prev) => Math.max(1, prev - 1));
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [phase, etaMinutes]);

  const handleStartEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase('dispatching');
    await createBooking({
      customerId: user?.id || 'cust-101',
      customerName: user?.name || 'Priya Sharma',
      customerPhone: user?.phone || '+91 98765 43210',
      customerAddress: address,
      workerId: assignedWorker.id,
      workerName: assignedWorker.name,
      workerPhone: assignedWorker.phone,
      workerAvatar: assignedWorker.avatarUrl,
      cooperativeName: assignedWorker.cooperativeName,
      serviceCategory: category,
      serviceTitle: `Emergency ${category} Response`,
      date: 'Today (Immediate)',
      timeSlot: '15-Minute Emergency Response',
      isEmergency: true,
      baseAmount: 450,
      welfareFee: 35,
      platformFee: 15,
      totalAmount: 500,
      notes: description
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Alert Header */}
      <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-red-700/80 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Cooperative Emergency Response Grid</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            Emergency 15-Minute Artisan Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-red-100">
            Guaranteed rapid arrival by nearest verified cooperative emergency unit with fixed standardized surge pricing.
          </p>
        </div>

        <a
          href="tel:1800117242"
          className="hidden sm:flex items-center gap-2 bg-white text-red-700 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md hover:bg-gray-100 transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>Call 1800-11-SAHAKAR</span>
        </a>
      </div>

      {/* PHASE 1: Emergency Request Form */}
      {phase === 'form' && (
        <Card className="p-6 sm:p-8 space-y-6 border-red-200">
          <form onSubmit={handleStartEmergency} className="space-y-5">
            {/* Trade Category Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Select Emergency Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'Plumbing', label: 'Plumbing Burst', icon: <Wrench className="w-5 h-5 text-blue-600" /> },
                  { id: 'Electrical', label: 'Power Spark / Short', icon: <Zap className="w-5 h-5 text-amber-500" /> },
                  { id: 'Gas', label: 'Gas Pipeline / Stove', icon: <Flame className="w-5 h-5 text-red-600" /> },
                  { id: 'Locksmith', label: 'Door Lock Jam', icon: <Key className="w-5 h-5 text-emerald-600" /> }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setCategory(item.id as any)}
                    className={`p-3 rounded-xl border-2 text-left flex flex-col justify-between transition-all cursor-pointer ${
                      category === item.id
                        ? 'border-red-600 bg-red-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="mb-2">{item.icon}</div>
                    <span className="text-xs font-bold text-gray-900">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Urgency SLA */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Response SLA Speed
              </label>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { time: '15 mins', desc: 'Critical Immediate', rate: '₹500 flat' },
                  { time: '30 mins', desc: 'Urgent Dispatch', rate: '₹400 flat' },
                  { time: 'Same Day', desc: 'Within 3 hours', rate: '₹300 flat' }
                ].map((tier) => (
                  <button
                    type="button"
                    key={tier.time}
                    onClick={() => setUrgency(tier.time as any)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      urgency === tier.time
                        ? 'border-red-600 bg-red-50 text-red-950 font-bold shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <p className="text-sm font-black">{tier.time}</p>
                    <p className="text-[10px] text-gray-500">{tier.desc}</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">{tier.rate}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <Input
              label="Live Distress Location / Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Full address where worker should report"
              leftIcon={<MapPin className="w-4 h-4 text-red-600" />}
            />

            {/* Problem Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Describe the Immediate Danger or Breakdown
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the urgent situation..."
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>

            {/* Transparent Rate Card Guarantee */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Statutory Emergency Rate Card Transparency</span>
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Emergency dispatch includes a standard cooperative rapid-response surcharge of ₹100. No unapproved surge pricing is permitted under Ministry regulations.
              </p>
            </div>

            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full text-base py-3 font-black shadow-md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Trigger Rapid Emergency Dispatch (15 Mins)
            </Button>
          </form>
        </Card>
      )}

      {/* PHASE 2: Dispatching Radar Animation */}
      {phase === 'dispatching' && (
        <Card className="p-12 text-center space-y-6 border-red-300">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping" />
            <span className="absolute inset-2 rounded-full bg-red-500 opacity-40 animate-pulse" />
            <div className="relative w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900">Broadcasting to Cooperative Rapid Response Grid...</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Querying 8 verified {category} emergency artisans within 3.5 km radius of your location.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cooperative Dispatcher Assigned: NCCT Desk Sector 62</span>
          </div>
        </Card>
      )}

      {/* PHASE 3 & 4: Assigned Worker with Live Tracker */}
      {(phase === 'assigned' || phase === 'arrived' || phase === 'completed') && (
        <div className="space-y-6">
          {/* Live Tracker Steps */}
          <Card className="p-6 space-y-4 border-emerald-300 bg-gradient-to-b from-emerald-50/30 to-white">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  Live Emergency Response
                </span>
                <h3 className="text-base font-bold text-gray-900">Worker En Route</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Estimated Arrival</span>
                <p className="text-xl font-black text-red-600 animate-pulse">{etaMinutes} Mins</p>
              </div>
            </div>

            {/* 4-step progress tracker */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs pt-2">
              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <p className="font-bold text-gray-900">Request Received</p>
                <span className="text-[10px] text-gray-400">10:02 AM</span>
              </div>

              <div className="space-y-1">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white mx-auto flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <p className="font-bold text-gray-900">Dispatched</p>
                <span className="text-[10px] text-gray-400">10:04 AM</span>
              </div>

              <div className="space-y-1">
                <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                  phase === 'arrived' || phase === 'completed'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-amber-500 text-white animate-pulse'
                }`}>
                  {phase === 'arrived' || phase === 'completed' ? '✓' : '3'}
                </div>
                <p className="font-bold text-gray-900">Arriving</p>
                <span className="text-[10px] text-amber-600 font-semibold">{phase === 'arrived' ? 'Arrived!' : `${etaMinutes}m ETA`}</span>
              </div>

              <div className="space-y-1">
                <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                  phase === 'completed' ? 'bg-emerald-700 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {phase === 'completed' ? '✓' : '4'}
                </div>
                <p className="font-bold text-gray-400">Resolved</p>
                <span className="text-[10px] text-gray-400">Pending</span>
              </div>
            </div>
          </Card>

          {/* Assigned Worker Profile Card */}
          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Assigned Rapid Response Artisan
            </h4>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={assignedWorker.avatarUrl}
                  alt={assignedWorker.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">{assignedWorker.name}</h3>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      Verified ✓
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold">{assignedWorker.primaryCategory} Expert</p>
                  <p className="text-xs text-gray-500">{assignedWorker.cooperativeName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${assignedWorker.phone}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {assignedWorker.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Rating:</span>
                <span className="font-bold text-gray-900">⭐ {assignedWorker.rating} / 5</span>
              </div>
              <div>
                <span className="text-gray-400 block">Distance:</span>
                <span className="font-bold text-gray-900">1.2 km away</span>
              </div>
              <div>
                <span className="text-gray-400 block">Fixed Rate:</span>
                <span className="font-bold text-gray-900">₹500 (All Inc.)</span>
              </div>
              <div>
                <span className="text-gray-400 block">Safety Gear:</span>
                <span className="font-bold text-emerald-700">Equipped & Insured</span>
              </div>
            </div>

            {/* Action Simulator for Demo */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-gray-600">Simulate Artisan Progress:</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPhase('arrived');
                    setEtaMinutes(0);
                    addToast('info', 'Worker Arrived', `${assignedWorker.name} has arrived at your address.`);
                  }}
                >
                  Simulate Arrived
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setPhase('completed');
                    addToast('success', 'Emergency Resolved', 'Work has been marked complete. Please proceed to payment & rating.');
                  }}
                >
                  Simulate Completed
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPhase('form')}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
