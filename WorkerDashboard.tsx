import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  Wrench, 
  IndianRupee, 
  CheckCircle2, 
  Star, 
  Clock, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  PlayCircle, 
  HeartPulse, 
  ShieldCheck,
  Building2,
  ArrowRight
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { workers, bookings, updateBookingStatus, updateWorkerAvailability, addToast } = useApp();
  const navigate = useNavigate();

  const currentWorker = workers.find((w) => w.userId === user?.id || w.id === 'work-201') || workers[0];
  const activeStatus = currentWorker?.availabilityStatus || 'Available';

  // Worker bookings
  const workerBookings = bookings.filter((b) => b.workerId === currentWorker.id || b.workerId === 'work-201');
  const pendingRequests = workerBookings.filter((b) => b.status === 'Booked');
  const activeJob = workerBookings.find((b) => 
    b.status === 'Worker Assigned' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'In Progress'
  );
  const completedJobs = workerBookings.filter((b) => b.status === 'Service Completed' || b.status === 'Payment Completed');

  // Emergency request banner simulation (with 30s countdown)
  const [emergencyCountdown, setEmergencyCountdown] = useState(28);
  const [hasEmergency, setHasEmergency] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasEmergency && emergencyCountdown > 0) {
      timer = setInterval(() => {
        setEmergencyCountdown((c) => c - 1);
      }, 1000);
    } else if (emergencyCountdown <= 0) {
      setHasEmergency(false);
    }
    return () => clearInterval(timer);
  }, [hasEmergency, emergencyCountdown]);

  const handleAcceptEmergency = () => {
    setHasEmergency(false);
    addToast('success', 'Emergency Accepted', 'Emergency task dispatched! Routing to Active Job Tracker.');
    navigate('/worker/active-job');
  };

  const handleAcceptJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Worker Assigned');
    addToast('success', 'Job Accepted', 'Customer notified. Please proceed to active job tracker.');
    navigate('/worker/active-job');
  };

  const handleRejectJob = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Cancelled');
    addToast('info', 'Job Declined', 'Job passed back to cooperative dispatch pool.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Worker Header Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentWorker.avatarUrl}
                alt={currentWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-0.5 rounded-full" title="NCCT Certified">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">{currentWorker.name}</h1>
                <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-400/30 font-bold px-2 py-0.5 rounded">
                  {currentWorker.primaryCategory} Expert
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{currentWorker.cooperativeName}</span>
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="text-amber-400 font-bold">⭐ {currentWorker.rating} / 5</span>
                <span>• {currentWorker.experienceYears} Years Cooperative Service</span>
              </div>
            </div>
          </div>

          {/* Quick Availability Switcher */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Status</span>
              <p className="text-xs font-black text-teal-300">{activeStatus}</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => updateWorkerAvailability(currentWorker.id, 'Available')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Available' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Available
              </button>
              <button
                onClick={() => updateWorkerAvailability(currentWorker.id, 'Busy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Busy' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Busy
              </button>
              <button
                onClick={() => updateWorkerAvailability(currentWorker.id, 'Offline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Offline' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Offline
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Emergency Request Banner (CRITICAL FOR DEMO) */}
      {hasEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                🚨 Emergency Dispatch Alert
              </span>
              <span className="text-xs font-mono font-bold text-red-100">Expires in {emergencyCountdown}s</span>
            </div>
            <h3 className="text-base sm:text-lg font-black">
              Emergency Burst Pipe at Flat 402, Lotus Panache, Sector 110 (1.2 km away)
            </h3>
            <p className="text-xs text-red-100">
              Cooperative Fixed Emergency Surcharge: ₹500 Guaranteed DBT payout upon completion.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              className="bg-white text-red-700 hover:bg-gray-100 font-black shadow-md cursor-pointer text-xs"
              onClick={handleAcceptEmergency}
            >
              Accept Emergency (15m SLA)
            </Button>
            <Button
              variant="outline"
              className="text-white border-white/40 hover:bg-white/10 text-xs"
              onClick={() => setHasEmergency(false)}
            >
              Pass
            </Button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Earnings"
          value="₹1,240"
          subtitle="Net after 7% welfare deduction"
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Completed Jobs"
          value={completedJobs.length + 38}
          subtitle="All time cooperative verified"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-teal-50 text-teal-700"
        />
        <StatCard
          title="Artisan Rating"
          value="4.9"
          subtitle="Based on 42 reviews"
          icon={<Star className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="New customer bookings"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
      </div>

      {/* Active Job Spotlight (if any) */}
      {activeJob && (
        <Card variant="highlight" className="p-6 border-teal-400 bg-teal-50/40">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-200 pb-4 mb-4">
            <div>
              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Active Job In Progress
              </span>
              <h3 className="text-base font-bold text-gray-900 mt-1">{activeJob.serviceTitle}</h3>
              <p className="text-xs text-gray-500">Customer: {activeJob.customerName} ({activeJob.customerPhone})</p>
            </div>
            <StatusBadge status={activeJob.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-gray-500 block">Location:</span>
              <p className="font-semibold text-gray-900 mt-0.5">{activeJob.customerAddress}</p>
            </div>
            <div>
              <span className="text-gray-500 block">Customer Notes:</span>
              <p className="font-medium text-gray-700 mt-0.5">{activeJob.notes}</p>
            </div>
            <div className="flex items-center sm:justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/worker/active-job')}
                rightIcon={<PlayCircle className="w-4 h-4" />}
              >
                Open Job Step Tracker
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* New Job Requests Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">New Booking Requests ({pendingRequests.length})</h2>
            <p className="text-xs text-gray-500">Cooperative dispatched requests assigned to your service area</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/worker/jobs')}
          >
            View All Jobs
          </Button>
        </div>

        {pendingRequests.length === 0 ? (
          <Card className="p-8 text-center text-xs text-gray-500">
            No pending booking requests right now. Your profile is active and waiting for new dispatches.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((b) => (
              <Card key={b.id} className="p-5 space-y-4 hover:border-teal-400 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[11px] text-gray-400">{b.id}</span>
                    <h4 className="font-bold text-sm text-gray-900 mt-0.5">{b.serviceTitle}</h4>
                    <p className="text-xs text-gray-600">{b.customerName}</p>
                  </div>
                  <span className="text-xs font-black text-gray-900">₹{b.totalAmount}</span>
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{b.date} • {b.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{b.customerAddress}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectJob(b.id)}
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAcceptJob(b.id)}
                  >
                    Accept Job
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Welfare Balance & Social Security Widget */}
      <Card className="p-6 bg-slate-900 text-slate-100 border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-rose-400" />
            <div>
              <h3 className="font-bold text-base text-white">Labour Cooperative Welfare Reserve</h3>
              <p className="text-xs text-slate-400">Cooperative ID: NCCT-DEL-4412 • Pradhan Mantri Jeevan Jyoti Bima Linkage</p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-slate-200 border-slate-700 hover:bg-slate-800"
            onClick={() => navigate('/worker/welfare')}
          >
            View Social Security Cover
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Accumulated Welfare Fund:</span>
            <span className="text-lg font-black text-emerald-400">₹8,450</span>
          </div>
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Accidental Insurance:</span>
            <span className="text-lg font-black text-teal-300">₹2,00,000 Active</span>
          </div>
          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block">Tool Loan Subsidy:</span>
            <span className="text-lg font-black text-blue-300">Eligible (0% Interest)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
