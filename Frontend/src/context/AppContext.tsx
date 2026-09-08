import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Booking, 
  BookingStatus, 
  WorkerProfile, 
  NotificationItem, 
  Complaint,
  WelfareClaim,
  ServiceItem,
  CooperativeInfo,
  WelfareScheme,
  Transaction,
  WorkerLocationUpdatePayload,
  NearbyWorkerResult
} from '../types';
import { bookingService } from '../services/bookingService';
import { workerService } from '../services/workerService';
import { notificationService } from '../services/notificationService';
import { adminService } from '../services/adminService';
import { paymentService } from '../services/paymentService';
import { clientGeoService, GeoLocationState } from '../services/geoService';
import { MOCK_SERVICES, MOCK_COOPERATIVES, MOCK_WELFARE_SCHEMES, MOCK_TRANSACTIONS } from '../data/mockData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  bookings: Booking[];
  workers: WorkerProfile[];
  services: ServiceItem[];
  cooperatives: CooperativeInfo[];
  welfareFunds: WelfareScheme[];
  payments: Transaction[];
  notifications: NotificationItem[];
  complaints: Complaint[];
  welfareClaims: WelfareClaim[];
  toasts: ToastMessage[];
  unreadNotificationCount: number;
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  refreshData: () => Promise<void>;
  createBooking: (data: Omit<Booking, 'id' | 'createdAt' | 'statusTimeline'>) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, status: BookingStatus, note?: string) => Promise<void>;
  updatePaymentStatus: (bookingId: string, status: 'Paid' | 'Pending') => Promise<void>;
  updateWorkerAvailability: (workerId: string, status: 'Available' | 'Busy' | 'Offline') => Promise<void>;
  updateWorkerVerification: (workerId: string, status: 'Verified' | 'Pending' | 'Suspended') => Promise<void>;
  addWorkerSkill: (workerId: string, skill: any) => Promise<void>;
  addWorkerCertification: (workerId: string, cert: any) => Promise<void>;
  updateComplaintStatus: (id: string, status: Complaint['status'], resolutionNotes?: string) => Promise<void>;
  updateWelfareClaimStatus: (id: string, status: WelfareClaim['status'], remarks?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (role: any) => Promise<void>;
  triggerDemoEmergencyScenario: () => Promise<void>;
  resetAllDemoData: () => Promise<void>;
  customerLocation: GeoLocationState;
  setCustomerLocation: (loc: GeoLocationState) => void;
  updateWorkerLocation: (workerId: string, payload: WorkerLocationUpdatePayload) => Promise<WorkerProfile>;
  searchNearbyWorkers: (query: { service?: string; radiusKm?: number; availableOnly?: boolean }) => Promise<NearbyWorkerResult[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [services] = useState<ServiceItem[]>(MOCK_SERVICES);
  const [cooperatives, setCooperatives] = useState<CooperativeInfo[]>(MOCK_COOPERATIVES);
  const [welfareFunds, setWelfareFunds] = useState<WelfareScheme[]>(MOCK_WELFARE_SCHEMES);
  const [payments, setPayments] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [welfareClaims, setWelfareClaims] = useState<WelfareClaim[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [customerLocation, setCustomerLocation] = useState<GeoLocationState>(clientGeoService.getInitialCustomerLocation);

  const addToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const [b, w, n, c, wc] = await Promise.all([
        bookingService.getAllBookings(),
        workerService.getAllWorkers(),
        notificationService.getNotifications(),
        adminService.getComplaints(),
        adminService.getWelfareClaims()
      ]);
      setBookings(b);
      setWorkers(w);
      setNotifications(n);
      setComplaints(c);
      setWelfareClaims(wc);
    } catch (err) {
      console.error('Failed to refresh data', err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const createBooking = async (data: Omit<Booking, 'id' | 'createdAt' | 'statusTimeline'>): Promise<Booking> => {
    const newBooking = await bookingService.createBooking(data);
    setBookings((prev) => [newBooking, ...prev]);

    // Send notifications to both worker and admin
    await notificationService.addNotification({
      recipientRole: 'worker',
      title: data.isEmergency ? '🚨 Emergency Request Dispatched!' : 'New Service Booking Received',
      message: `${data.serviceTitle} from ${data.customerName} (${data.customerAddress})`,
      type: data.isEmergency ? 'emergency' : 'booking',
      linkTo: '/worker/jobs'
    });

    await notificationService.addNotification({
      recipientRole: 'admin',
      title: data.isEmergency ? 'Urgent Emergency Request Logged' : 'New Platform Booking Created',
      message: `${data.serviceCategory} allocated to ${data.workerName}`,
      type: 'system',
      linkTo: '/admin/bookings'
    });

    addToast(
      'success',
      data.isEmergency ? 'Emergency Dispatched!' : 'Booking Requested',
      `Assigned to verified artisan ${data.workerName}`
    );

    await refreshData();
    return newBooking;
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus, note?: string) => {
    const updated = await bookingService.updateBookingStatus(bookingId, status, note);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));

    // Trigger toast & alerts
    if (status === 'Worker Accepted') {
      addToast('info', 'Worker Accepted Job', `${updated.workerName} has confirmed your request.`);
      await notificationService.addNotification({
        recipientRole: 'customer',
        title: 'Artisan Confirmed! ✓',
        message: `${updated.workerName} accepted your booking for ${updated.serviceTitle}`,
        type: 'booking',
        linkTo: '/customer/bookings'
      });
    } else if (status === 'Worker On The Way') {
      addToast('info', 'Worker On The Way 🛵', `${updated.workerName} is en route. ETA: 15 mins.`);
      await notificationService.addNotification({
        recipientRole: 'customer',
        title: 'Worker On The Way 🛵',
        message: `${updated.workerName} has departed and is traveling to your location.`,
        type: 'booking',
        linkTo: '/customer/bookings'
      });
    } else if (status === 'Service Completed') {
      addToast('success', 'Service Completed ✓', 'Please verify work and proceed with payment.');
      await notificationService.addNotification({
        recipientRole: 'customer',
        title: 'Service Completed by Artisan',
        message: `Work finished. Amount due: ₹${updated.finalPrice || updated.estimatedPrice}`,
        type: 'payment',
        linkTo: '/customer/payments'
      });
    } else if (status === 'Payment Completed') {
      addToast('success', 'Payment Successful', `Invoice ${updated.invoiceId} generated.`);
      await notificationService.addNotification({
        recipientRole: 'worker',
        title: 'Payment Received!',
        message: `₹${updated.finalPrice || updated.estimatedPrice} collected for job ${updated.id}`,
        type: 'payment',
        linkTo: '/worker/earnings'
      });
    }

    await refreshData();
  };

  const updateWorkerAvailability = async (workerId: string, status: 'Available' | 'Busy' | 'Offline') => {
    const updated = await workerService.updateAvailability(workerId, status);
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
    addToast('info', 'Status Updated', `Availability set to: ${status}`);
  };

  const updateWorkerVerification = async (workerId: string, status: 'Verified' | 'Pending' | 'Suspended') => {
    const updated = await workerService.updateVerificationStatus(workerId, status);
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
    addToast('success', 'Verification Updated', `Worker status updated to: ${status}`);
  };

  const addWorkerSkill = async (workerId: string, skill: any) => {
    const updated = await workerService.addSkill(workerId, skill);
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
    addToast('success', 'Skill Added', 'Submitted for cooperative admin verification.');
  };

  const addWorkerCertification = async (workerId: string, cert: any) => {
    const updated = await workerService.addCertification(workerId, cert);
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
    addToast('success', 'Certification Uploaded', 'Document sent for verification.');
  };

  const updateComplaintStatus = async (id: string, status: Complaint['status'], resolutionNotes?: string) => {
    const updated = await adminService.updateComplaintStatus(id, status, resolutionNotes);
    setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
    addToast('info', 'Complaint Updated', `Status changed to ${status}`);
  };

  const updateWelfareClaimStatus = async (id: string, status: WelfareClaim['status'], remarks?: string) => {
    const updated = await adminService.updateWelfareClaimStatus(id, status, remarks);
    setWelfareClaims((prev) => prev.map((wc) => (wc.id === id ? updated : wc)));
    addToast('success', 'Welfare Claim Updated', `Claim status set to ${status}`);
  };

  const markNotificationRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = async (role: any) => {
    await notificationService.markAllAsRead(role);
    setNotifications((prev) => prev.map((n) => (n.recipientRole === role ? { ...n, isRead: true } : n)));
  };

  const triggerDemoEmergencyScenario = async () => {
    // 1-click trigger to generate an active emergency scenario for judges demo
    const emergencyBooking = await createBooking({
      customerId: 'cust-101',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 12340',
      customerAddress: 'B-402, Green Valley Apartments, Sector 62, Noida',
      workerId: 'work-201',
      workerName: 'Ravi Kumar',
      workerPhone: '+91 98123 45678',
      workerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      cooperativeName: 'Delhi Labour Welfare Cooperative Society Ltd.',
      serviceCategory: 'Plumber',
      serviceTitle: 'Emergency Burst Pipe & Valve Leakage',
      date: new Date().toISOString().split('T')[0],
      timeSlot: 'Immediate (Within 15 Mins)',
      description: 'Severe pipe burst under kitchen sink, water spreading rapidly. Emergency repair required immediately.',
      isEmergency: true,
      estimatedPrice: 450,
      finalPrice: 450,
      status: 'Booking Requested',
      paymentStatus: 'Pending'
    });

    addToast('warning', '🚨 Emergency Scenario Triggered!', 'Emergency plumbing request logged. Switch to Worker or Admin to see live dispatch!');
    return;
  };

  const updatePaymentStatus = async (bookingId: string, status: 'Paid' | 'Pending') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: status } : b))
    );
    setPayments((prev) =>
      prev.map((p) => (p.bookingId === bookingId ? { ...p, status: status === 'Paid' ? 'Successful' : 'Pending' } : p))
    );
    addToast('success', 'Payment Updated', `Payment status updated to ${status}.`);
  };

  const updateWorkerLocation = async (workerId: string, payload: WorkerLocationUpdatePayload) => {
    const updated = await workerService.updateWorkerLocation(workerId, payload);
    setWorkers((prev) => prev.map((w) => (w.id === workerId ? updated : w)));
    addToast('success', '📍 Service Location Saved', `Operational location set to ${updated.locationAddress || 'coordinates'}`);
    return updated;
  };

  const searchNearbyWorkers = async (query: { service?: string; radiusKm?: number; availableOnly?: boolean }) => {
    const result = await workerService.getNearbyWorkers({
      latitude: customerLocation.latitude,
      longitude: customerLocation.longitude,
      service: query.service,
      radiusKm: query.radiusKm || 5,
      availableOnly: query.availableOnly
    });
    return result.workers;
  };

  const resetAllDemoData = async () => {
    bookingService.resetMockBookings();
    await refreshData();
    addToast('info', 'Demo Reset', 'All bookings and states reset to initial baseline.');
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        bookings,
        workers,
        services,
        cooperatives,
        welfareFunds,
        payments,
        notifications,
        complaints,
        welfareClaims,
        toasts,
        unreadNotificationCount,
        customerLocation,
        setCustomerLocation,
        updateWorkerLocation,
        searchNearbyWorkers,
        addToast,
        removeToast,
        refreshData,
        createBooking,
        updateBookingStatus,
        updatePaymentStatus,
        updateWorkerAvailability,
        updateWorkerVerification,
        addWorkerSkill,
        addWorkerCertification,
        updateComplaintStatus,
        updateWelfareClaimStatus,
        markNotificationRead,
        markAllNotificationsRead,
        triggerDemoEmergencyScenario,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
