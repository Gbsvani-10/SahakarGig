import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Filter, AlertTriangle } from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { bookings, updateBookingStatus, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = bookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Platform Booking Operations</h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Master transaction log across all federated district cooperatives
        </p>
      </div>

      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by booking ID, customer, artisan, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl p-2 bg-white w-full sm:w-auto"
        >
          <option value="All">All Booking Statuses</option>
          <option value="Booked">Booked</option>
          <option value="Worker Assigned">Worker Assigned</option>
          <option value="On the Way">On the Way</option>
          <option value="Arrived">Arrived</option>
          <option value="In Progress">In Progress</option>
          <option value="Service Completed">Service Completed</option>
          <option value="Payment Completed">Payment Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Card>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-gray-400 uppercase border-b border-gray-100">
              <tr>
                <th className="pb-3">Booking ID</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Assigned Artisan</th>
                <th className="pb-3">Cooperative</th>
                <th className="pb-3">Total (₹)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50">
                  <td className="py-3 font-mono font-bold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <span>{b.id}</span>
                      {b.isEmergency && (
                        <span className="text-[10px] bg-red-600 text-white font-black px-1.5 rounded">
                          EMG
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-gray-900">{b.serviceTitle}</td>
                  <td className="py-3 text-gray-600">
                    <p className="font-semibold text-gray-900">{b.customerName}</p>
                    <p className="text-[11px] text-gray-400">{b.customerPhone}</p>
                  </td>
                  <td className="py-3 text-gray-600">
                    <p className="font-semibold text-gray-900">{b.workerName}</p>
                    <p className="text-[11px] text-gray-400">{b.workerPhone}</p>
                  </td>
                  <td className="py-3 text-gray-500">{b.cooperativeName}</td>
                  <td className="py-3 font-black text-gray-900">₹{b.totalAmount}</td>
                  <td className="py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addToast('info', 'Booking Inspect', `Inspecting details for ${b.id}.`)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
