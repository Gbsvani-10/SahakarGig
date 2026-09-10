import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Tabs } from '../../components/common/Tabs';
import { EmptyState } from '../../components/common/EmptyState';
import { Modal } from '../../components/common/Modal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  Star, 
  AlertTriangle, 
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CustomerBookings: React.FC = () => {
  const { bookings, updateBookingStatus, addToast } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const customerBookings = bookings.filter((b) => b.customerId === user?.id || b.customerId === 'cust-101');

  const upcoming = customerBookings.filter((b) => 
    b.status === 'Booked' || b.status === 'Worker Assigned' || b.status === 'On the Way'
  );
  const active = customerBookings.filter((b) => 
    b.status === 'Arrived' || b.status === 'In Progress'
  );
  const completed = customerBookings.filter((b) => 
    b.status === 'Service Completed' || b.status === 'Payment Completed'
  );
  const cancelled = customerBookings.filter((b) => b.status === 'Cancelled');

  const getListForTab = () => {
    switch (activeTab) {
      case 'upcoming': return upcoming;
      case 'active': return active;
      case 'completed': return completed;
      case 'cancelled': return cancelled;
      default: return upcoming;
    }
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcoming.length },
    { id: 'active', label: 'Active In-Progress', count: active.length },
    { id: 'completed', label: 'Completed', count: completed.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelled.length }
  ];

  const handleCancelBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'Cancelled');
    setSelectedBooking(null);
    addToast('info', 'Booking Cancelled', 'Your booking request has been cancelled.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">My Service Bookings</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Real-time status tracking, artisan direct dispatch, and transparent billing
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/customer/services')}
        >
          Book New Service
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {getListForTab().length === 0 ? (
        <EmptyState
          title={`No ${activeTab} bookings`}
          description={`You do not have any services currently under the ${activeTab} tab.`}
          actionLabel="Browse Verified Trades"
          onAction={() => navigate('/customer/services')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getListForTab().map((b) => (
            <Card key={b.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-gray-500">{b.id}</span>
                      {b.isEmergency && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                          Emergency
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base text-gray-900 mt-0.5">{b.serviceTitle}</h3>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {/* Worker info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img
                    src={b.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'}
                    alt={b.workerName}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-900 truncate">{b.workerName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{b.cooperativeName}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">{b.workerPhone}</p>
                  </div>
                </div>

                {/* Schedule & Location */}
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span>{b.date} • {b.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{b.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Footer with Price & Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block font-semibold">Total Fair Wage</span>
                  <span className="text-sm font-black text-gray-900">₹{b.totalAmount}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedBooking(b)}
                  >
                    View Details
                  </Button>

                  {b.status === 'Service Completed' && b.paymentStatus === 'Pending' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate('/customer/payments')}
                    >
                      Pay ₹{b.totalAmount}
                    </Button>
                  )}

                  {b.status === 'Payment Completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/customer/ratings')}
                    >
                      Rate & Review
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          title={`Booking ${selectedBooking.id}`}
          subtitle={selectedBooking.serviceTitle}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-semibold text-gray-600">Current Progress Status:</span>
              <StatusBadge status={selectedBooking.status} />
            </div>

            {/* Stepper of Statuses */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Lifecycle Stages</h4>
              <div className="p-3 rounded-xl border border-gray-200 space-y-2">
                {[
                  'Booked',
                  'Worker Assigned',
                  'On the Way',
                  'Arrived',
                  'In Progress',
                  'Service Completed',
                  'Payment Completed'
                ].map((st, i) => (
                  <div key={st} className="flex items-center justify-between text-xs">
                    <span className={selectedBooking.status === st ? 'font-bold text-emerald-700' : 'text-gray-600'}>
                      {i + 1}. {st}
                    </span>
                    {selectedBooking.status === st && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Active Now
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Details */}
            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">Fair Cooperative Bill</h4>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>Base Wage:</span>
                  <span className="font-bold">₹{selectedBooking.baseAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worker Welfare Fund (7%):</span>
                  <span className="font-bold">₹{selectedBooking.welfareFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Digital Maintenance (3%):</span>
                  <span className="font-bold">₹{selectedBooking.platformFee}</span>
                </div>
                <div className="flex justify-between border-t border-emerald-200 pt-1.5 font-bold text-sm text-emerald-950">
                  <span>Total Amount:</span>
                  <span>₹{selectedBooking.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              {selectedBooking.status === 'Booked' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                >
                  Cancel Booking
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
