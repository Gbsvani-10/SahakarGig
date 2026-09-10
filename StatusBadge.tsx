import React from 'react';
import { BookingStatus } from '../../types';
import { Badge } from './Badge';

export const StatusBadge: React.FC<{ status: BookingStatus | string; className?: string }> = ({
  status,
  className = ''
}) => {
  switch (status) {
    case 'Booking Requested':
      return <Badge variant="amber" className={className}>⏳ Requested</Badge>;
    case 'Worker Assigned':
      return <Badge variant="blue" className={className}>👤 Assigned</Badge>;
    case 'Worker Accepted':
      return <Badge variant="teal" className={className}>👍 Accepted</Badge>;
    case 'Worker On The Way':
      return <Badge variant="purple" className={className}>🛵 On The Way</Badge>;
    case 'Service Started':
      return <Badge variant="blue" className={className}>⚙️ In Progress</Badge>;
    case 'Service Completed':
      return <Badge variant="emerald" className={className}>✓ Completed</Badge>;
    case 'Payment Completed':
      return <Badge variant="emerald" className={className}>₹ Paid</Badge>;
    case 'Cancelled':
      return <Badge variant="red" className={className}>✕ Cancelled</Badge>;
    case 'Verified':
      return <Badge variant="emerald" className={className}>✓ Verified</Badge>;
    case 'Pending':
      return <Badge variant="amber" className={className}>⏳ Pending</Badge>;
    case 'Suspended':
      return <Badge variant="red" className={className}>✕ Suspended</Badge>;
    case 'Available':
      return <Badge variant="emerald" className={className}>● Available</Badge>;
    case 'Busy':
      return <Badge variant="amber" className={className}>● Busy</Badge>;
    case 'Offline':
      return <Badge variant="gray" className={className}>○ Offline</Badge>;
    default:
      return <Badge variant="gray" className={className}>{status}</Badge>;
  }
};
