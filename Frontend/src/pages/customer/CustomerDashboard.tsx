import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  CreditCard, 
  Users, 
  Search, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Phone, 
  Star,
  Wrench,
  Zap,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { bookings, services, workers } = useApp();
  const navigate = useNavigate();

  const customerBookings = bookings.filter((b) => b.customerId === user?.id || b.customerId === 'cust-101');
  const upcomingBookings = customerBookings.filter((b) => b.status !== 'Payment Completed' && b.status !== 'Cancelled');
  const completedBookings = customerBookings.filter((b) => b.status === 'Payment Completed');
  const pendingPayments = customerBookings.filter((b) => b.status === 'Service Completed' && b.paymentStatus === 'Pending');

  const activeBooking = upcomingBookings[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs text-emerald-200">
            <span>Cooperative Community Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Namaste, {user?.name?.split(' ')[0] || 'Priya'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Directly connect with background-verified artisans from Delhi & Noida Labour Cooperatives with guaranteed transparent rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="danger"
            onClick={() => navigate('/customer/emergency')}
            leftIcon={<AlertTriangle className="w-4 h-4" />}
            className="animate-pulse shadow-md"
          >
            Emergency Service (15 Mins)
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={() => navigate('/customer/services')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Book Standard Service
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Upcoming Bookings"
          value={upcomingBookings.length}
          subtitle="Scheduled / En route"
          icon={<Calendar className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-700"
        />
        <StatCard
          title="Completed Services"
          value={completedBookings.length}
          subtitle="Cooperative verified"
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments.length}
          subtitle={pendingPayments.length > 0 ? 'Requires action' : 'All clear'}
          icon={<CreditCard className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-700"
        />
        <StatCard
          title="Saved Artisans"
          value="4"
          subtitle="Preferred workers"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-purple-50 text-purple-700"
        />
      </div>

      {/* Active / Next Booking Spotlight (if any) */}
      {activeBooking && (
        <Card variant="highlight" className="p-6 border-emerald-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-200/60 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                  Active Booking In Progress
                </span>
                {activeBooking.isEmergency && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    🚨 Urgent Emergency
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-gray-900 mt-1">{activeBooking.serviceTitle}</h3>
              <p className="text-xs text-gray-500">Booking ID: {activeBooking.id}</p>
            </div>
            <StatusBadge status={activeBooking.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeBooking.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'}
                alt={activeBooking.workerName}
                className="w-10 h-10 rounded-full object-cover border border-emerald-400"
              />
              <div>
                <p className="font-bold text-gray-900">{activeBooking.workerName}</p>
                <p className="text-gray-500">{activeBooking.cooperativeName}</p>
                <p className="text-emerald-700 font-medium">{activeBooking.workerPhone}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Slot: {activeBooking.timeSlot} ({activeBooking.date})</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">{activeBooking.customerAddress}</span>
              </div>
            </div>

            <div className="flex items-center sm:justify-end gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/customer/bookings')}
              >
                Track Live Status
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Popular Categories & Services Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recommended Services for Your Area</h2>
            <p className="text-xs text-gray-500">Verified artisans with high availability in Noida & East Delhi</p>
          </div>
          <Link to="/customer/services" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center">
            View All (10) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.slice(0, 4).map((srv) => (
            <Card
              key={srv.id}
              className="hover:border-emerald-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              onClick={() => navigate('/customer/services')}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700">{srv.category}</span>
                  {srv.emergencyAvailable && (
                    <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">
                      15m
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{srv.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{srv.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs mt-3">
                <span className="font-bold text-gray-900">{srv.priceRange}</span>
                <span className="text-emerald-700 font-semibold">Book Now</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Verified Workers in Proximity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Top Rated Cooperative Workers Near You</h2>
            <p className="text-xs text-gray-500">Directly affiliated with certified labour cooperatives</p>
          </div>
          <Link to="/customer/workers" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center">
            View All Workers <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workers.slice(0, 3).map((worker) => (
            <Card key={worker.id} className="p-4 space-y-3 hover:border-emerald-400 transition-colors">
              <div className="flex items-start gap-3">
                <img
                  src={worker.avatarUrl}
                  alt={worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{worker.name}</h4>
                    <span className="text-emerald-600 text-xs" title="Verified Worker">✓</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold">{worker.primaryCategory}</p>
                  <p className="text-[11px] text-gray-500 truncate">{worker.cooperativeName}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{worker.rating}</span>
                  <span className="text-gray-400 font-normal">({worker.completedJobsCount} jobs)</span>
                </div>
                <span className="text-gray-600 font-medium">📍 {worker.distanceKm} km away</span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">{worker.priceRange}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/customer/services')}
                >
                  Book Artisan
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
