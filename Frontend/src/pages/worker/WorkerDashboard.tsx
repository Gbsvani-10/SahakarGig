import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  IndianRupee,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  PlayCircle,
  HeartPulse,
  ShieldCheck,
  Building2,
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();

  const {
    workers,
    bookings,
    updateBookingStatus,
    updateWorkerAvailability,
    addToast,
  } = useApp();

  const navigate = useNavigate();

  /*
   * Find the currently logged-in worker using the real
   * authenticated user's ID.
   *
   * IMPORTANT:
   * No hardcoded/demo worker ID is used here.
   */
  const currentWorker = workers.find(
    (worker) =>
      String(worker.userId) === String(user?.id)
  );

  /*
   * Wait until the worker profile is loaded.
   *
   * This prevents the dashboard from crashing when
   * the API is still loading the worker list.
   */
  if (!currentWorker) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">
            Loading worker profile...
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Please wait while your profile is loaded.
          </p>
        </div>
      </div>
    );
  }

  const activeStatus =
    currentWorker.availabilityStatus || 'Available';

  /*
   * Only bookings belonging to this real worker.
   *
   * No demo worker ID / fallback is used.
   */
  const workerBookings = bookings.filter(
    (booking) =>
      String(booking.workerId) ===
        String(currentWorker.id) ||
      String(booking.workerId) ===
        String(currentWorker.userId)
  );

  const pendingRequests = workerBookings.filter(
    (booking) => booking.status === 'Booked'
  );

  const activeJob = workerBookings.find(
    (booking) =>
      booking.status === 'Worker Assigned' ||
      booking.status === 'On the Way' ||
      booking.status === 'Arrived' ||
      booking.status === 'In Progress'
  );

  const completedJobs = workerBookings.filter(
    (booking) =>
      booking.status === 'Service Completed' ||
      booking.status === 'Payment Completed'
  );

  /*
   * Calculate earnings from actual completed bookings.
   *
   * No hardcoded ₹1,240 value.
   */
  const totalEarnings = completedJobs.reduce(
    (total, booking) => {
      const amount = Number(
        booking.totalAmount || 0
      );

      return total + amount;
    },
    0
  );

  /*
   * Calculate today's earnings from actual booking dates.
   */
  const today = new Date();

  const todayString =
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

  const todaysEarnings = completedJobs.reduce(
    (total, booking) => {
      if (!booking.date) {
        return total;
      }

      const bookingDate = new Date(
        booking.date
      );

      if (Number.isNaN(bookingDate.getTime())) {
        return total;
      }

      const bookingDateString =
        `${bookingDate.getFullYear()}-${String(
          bookingDate.getMonth() + 1
        ).padStart(2, '0')}-${String(
          bookingDate.getDate()
        ).padStart(2, '0')}`;

      if (bookingDateString === todayString) {
        return (
          total +
          Number(booking.totalAmount || 0)
        );
      }

      return total;
    },
    0
  );

  const rating =
    Number(currentWorker.rating || 0);

  const reviewCount =
    Number(currentWorker.reviewCount || 0);

  const handleAcceptJob = (
    bookingId: string
  ) => {
    updateBookingStatus(
      bookingId,
      'Worker Assigned'
    );

    addToast(
      'success',
      'Job Accepted',
      'Customer notified. Please proceed to active job tracker.'
    );

    navigate('/worker/active-job');
  };

  const handleRejectJob = (
    bookingId: string
  ) => {
    updateBookingStatus(
      bookingId,
      'Cancelled'
    );

    addToast(
      'info',
      'Job Declined',
      'Job passed back to cooperative dispatch pool.'
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* =========================================
          WORKER HEADER CARD
          ========================================= */}

      <Card className="p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white border-slate-800 shadow-md">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div className="flex items-center gap-4">

            <div className="relative">

              <img
                src={
                  currentWorker.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    currentWorker.name || 'Worker'
                  )}`
                }
                alt={currentWorker.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-xs"
              />

              <span
                className="absolute -bottom-1 -right-1 bg-emerald-700 text-white p-0.5 rounded-full"
                title="Worker Profile"
              >
                <ShieldCheck className="w-4 h-4" />
              </span>

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-xl font-black text-white">
                  {currentWorker.name}
                </h1>

                <span className="text-xs bg-teal-500/20 text-teal-300 border border-teal-400/30 font-bold px-2 py-0.5 rounded">
                  {currentWorker.primaryCategory ||
                    'Worker'} Expert
                </span>

              </div>

              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">

                <Building2 className="w-3.5 h-3.5 text-teal-400" />

                <span>
                  {currentWorker.cooperativeName ||
                    'SahakarGig Cooperative'}
                </span>

              </p>

              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">

                <span className="text-amber-400 font-bold">
                  ⭐ {rating} / 5
                </span>

                <span>
                  • {currentWorker.experienceYears || 0}{' '}
                  Years Experience
                </span>

              </div>

            </div>

          </div>

          {/* =========================================
              AVAILABILITY SWITCHER
              ========================================= */}

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-3">

            <div className="text-right hidden sm:block">

              <span className="text-[10px] uppercase font-bold text-slate-400">
                Current Status
              </span>

              <p className="text-xs font-black text-teal-300">
                {activeStatus}
              </p>

            </div>

            <div className="flex gap-1">

              <button
                onClick={() =>
                  updateWorkerAvailability(
                    currentWorker.id,
                    'Available'
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Available
              </button>

              <button
                onClick={() =>
                  updateWorkerAvailability(
                    currentWorker.id,
                    'Busy'
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Busy'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Busy
              </button>

              <button
                onClick={() =>
                  updateWorkerAvailability(
                    currentWorker.id,
                    'Offline'
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === 'Offline'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Offline
              </button>

            </div>

          </div>

        </div>

      </Card>


      {/* =========================================
          REAL STAT CARDS
          ========================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Today's Earnings"
          value={`₹${todaysEarnings.toLocaleString('en-IN')}`}
          subtitle={`Total earnings: ₹${totalEarnings.toLocaleString('en-IN')}`}
          icon={
            <IndianRupee className="w-5 h-5" />
          }
          iconBg="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Completed Jobs"
          value={completedJobs.length}
          subtitle="Completed cooperative jobs"
          icon={
            <CheckCircle2 className="w-5 h-5" />
          }
          iconBg="bg-teal-50 text-teal-700"
        />

        <StatCard
          title="Artisan Rating"
          value={rating.toFixed(1)}
          subtitle={`Based on ${reviewCount} reviews`}
          icon={
            <Star className="w-5 h-5" />
          }
          iconBg="bg-amber-50 text-amber-700"
        />

        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="New customer bookings"
          icon={
            <Clock className="w-5 h-5" />
          }
          iconBg="bg-blue-50 text-blue-700"
        />

      </div>


      {/* =========================================
          ACTIVE JOB
          ========================================= */}

      {activeJob && (
        <Card
          variant="highlight"
          className="p-6 border-teal-400 bg-teal-50/40"
        >

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-teal-200 pb-4 mb-4">

            <div>

              <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Active Job In Progress
              </span>

              <h3 className="text-base font-bold text-gray-900 mt-1">
                {activeJob.serviceTitle}
              </h3>

              <p className="text-xs text-gray-500">
                Customer: {activeJob.customerName}
                {activeJob.customerPhone
                  ? ` (${activeJob.customerPhone})`
                  : ''}
              </p>

            </div>

            <StatusBadge
              status={activeJob.status}
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">

            <div>

              <span className="text-gray-500 block">
                Location:
              </span>

              <p className="font-semibold text-gray-900 mt-0.5">
                {activeJob.customerAddress ||
                  'Address not available'}
              </p>

            </div>

            <div>

              <span className="text-gray-500 block">
                Customer Notes:
              </span>

              <p className="font-medium text-gray-700 mt-0.5">
                {activeJob.notes ||
                  'No customer notes'}
              </p>

            </div>

            <div className="flex items-center sm:justify-end gap-2">

              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  navigate(
                    '/worker/active-job'
                  )
                }
                rightIcon={
                  <PlayCircle className="w-4 h-4" />
                }
              >
                Open Job Step Tracker
              </Button>

            </div>

          </div>

        </Card>
      )}


      {/* =========================================
          NEW BOOKING REQUESTS
          ========================================= */}

      <div className="space-y-4">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-base font-bold text-gray-900">
              New Booking Requests (
              {pendingRequests.length})
            </h2>

            <p className="text-xs text-gray-500">
              Cooperative dispatched requests assigned to your service area
            </p>

          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate('/worker/jobs')
            }
          >
            View All Jobs
          </Button>

        </div>


        {pendingRequests.length === 0 ? (

          <Card className="p-8 text-center text-xs text-gray-500">

            No pending booking requests right now.
            Your profile is active and waiting for
            new dispatches.

          </Card>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {pendingRequests.map((booking) => (

              <Card
                key={booking.id}
                className="p-5 space-y-4 hover:border-teal-400 transition-colors"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <span className="font-mono text-[11px] text-gray-400">
                      {booking.id}
                    </span>

                    <h4 className="font-bold text-sm text-gray-900 mt-0.5">
                      {booking.serviceTitle}
                    </h4>

                    <p className="text-xs text-gray-600">
                      {booking.customerName}
                    </p>

                  </div>

                  <span className="text-xs font-black text-gray-900">
                    ₹{booking.totalAmount}
                  </span>

                </div>


                <div className="space-y-1 text-xs text-gray-500">

                  <div className="flex items-center gap-1.5">

                    <Clock className="w-3.5 h-3.5 text-gray-400" />

                    <span>
                      {booking.date} •{' '}
                      {booking.timeSlot}
                    </span>

                  </div>

                  <div className="flex items-center gap-1.5">

                    <MapPin className="w-3.5 h-3.5 text-gray-400" />

                    <span className="truncate">
                      {booking.customerAddress}
                    </span>

                  </div>

                </div>


                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleRejectJob(
                        booking.id
                      )
                    }
                  >
                    Decline
                  </Button>

                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      handleAcceptJob(
                        booking.id
                      )
                    }
                  >
                    Accept Job
                  </Button>

                </div>

              </Card>

            ))}

          </div>

        )}

      </div>


      {/* =========================================
          WELFARE / SOCIAL SECURITY
          ========================================= */}

      <Card className="p-6 bg-slate-900 text-slate-100 border-slate-800">

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">

          <div className="flex items-center gap-3">

            <HeartPulse className="w-8 h-8 text-rose-400" />

            <div>

              <h3 className="font-bold text-base text-white">
                Labour Cooperative Welfare Reserve
              </h3>

              <p className="text-xs text-slate-400">
                Your welfare and social security information
              </p>

            </div>

          </div>

          <Button
            size="sm"
            variant="outline"
            className="text-slate-200 border-slate-700 hover:bg-slate-800"
            onClick={() =>
              navigate('/worker/welfare')
            }
          >
            View Social Security Cover
          </Button>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">

          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">

            <span className="text-slate-400 block">
              Accumulated Welfare Fund:
            </span>

            <span className="text-lg font-black text-emerald-400">
              Data not available
            </span>

          </div>


          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">

            <span className="text-slate-400 block">
              Accidental Insurance:
            </span>

            <span className="text-lg font-black text-teal-300">
              Data not available
            </span>

          </div>


          <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700">

            <span className="text-slate-400 block">
              Tool Loan Subsidy:
            </span>

            <span className="text-lg font-black text-blue-300">
              Data not available
            </span>

          </div>

        </div>

      </Card>

    </div>
  );
};
