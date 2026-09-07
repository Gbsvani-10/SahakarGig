import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Tabs } from '../../components/common/Tabs';
import { EmptyState } from '../../components/common/EmptyState';
import { Clock, MapPin, Phone, CheckCircle2, PlayCircle } from 'lucide-react';

export const WorkerJobs: React.FC = () => {
  const { bookings, updateBookingStatus, addToast } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('requests');

  const pending = bookings.filter((b) => b.status === 'Booked');
  const active = bookings.filter((b) => 
    b.status === 'Worker Assigned' || b.status === 'On the Way' || b.status === 'Arrived' || b.status === 'In Progress'
  );
  const completed = bookings.filter((b) => 
    b.status === 'Service Completed' || b.status === 'Payment Completed'
  );

  const tabs = [
    { id: 'requests', label: 'New Requests', count: pending.length },
    { id: 'active', label: 'In-Progress Jobs', count: active.length },
    { id: 'completed', label: 'Completed History', count: completed.length }
  ];

  const handleAccept = (id: string) => {
    updateBookingStatus(id, 'Worker Assigned');
    addToast('success', 'Job Accepted', 'Assigned to your queue. Launching Active Job step tracker.');
    navigate('/worker/active-job');
  };

  const handleDecline = (id: string) => {
    updateBookingStatus(id, 'Cancelled');
    addToast('info', 'Job Declined', 'Returned to cooperative dispatch pool.');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Assigned Job Roster</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Manage upcoming job dispatches, customer requests, and completed work logs
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pending.length === 0 ? (
            <div className="col-span-2">
              <EmptyState title="No Pending Requests" description="All assigned cooperative dispatches have been handled." />
            </div>
          ) : (
            pending.map((b) => (
              <Card key={b.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs text-gray-400">{b.id}</span>
                    <h3 className="font-bold text-sm text-gray-900 mt-0.5">{b.serviceTitle}</h3>
                    <p className="text-xs text-gray-600">{b.customerName} ({b.customerPhone})</p>
                  </div>
                  <span className="text-base font-black text-emerald-700">₹{b.totalAmount}</span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-500">
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
                  <Button variant="outline" size="sm" onClick={() => handleDecline(b.id)}>
                    Decline
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleAccept(b.id)}>
                    Accept Job
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {active.map((b) => (
            <Card key={b.id} className="p-5 space-y-4 border-teal-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{b.serviceTitle}</h3>
                  <p className="text-xs text-gray-600">{b.customerName} • {b.customerAddress}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/worker/active-job')}
                  rightIcon={<PlayCircle className="w-4 h-4" />}
                >
                  Open Job Step Tracker
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-3">
          {completed.map((b) => (
            <Card key={b.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-gray-900">{b.serviceTitle}</p>
                <p className="text-gray-500">{b.customerName} • Date: {b.date}</p>
              </div>
              <div className="text-right">
                <span className="font-black text-gray-900 text-sm">₹{b.totalAmount}</span>
                <span className="text-emerald-700 block font-semibold">Payment Settled ✓</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
