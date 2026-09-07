import { Booking, BookingStatus } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

// In-memory store initialized from mock data and updated reactively
let bookingsStore: Booking[] = [...INITIAL_BOOKINGS];

export const bookingService = {
  async getAllBookings(): Promise<Booking[]> {
    return simulatedLatency([...bookingsStore], 200);
  },

  async getBookingById(id: string): Promise<Booking | undefined> {
    const booking = bookingsStore.find((b) => b.id === id);
    return simulatedLatency(booking, 150);
  },

  async getCustomerBookings(customerId: string): Promise<Booking[]> {
    const filtered = bookingsStore.filter((b) => b.customerId === customerId);
    return simulatedLatency(filtered, 200);
  },

  async getWorkerBookings(workerId: string): Promise<Booking[]> {
    const filtered = bookingsStore.filter((b) => b.workerId === workerId);
    return simulatedLatency(filtered, 200);
  },

  async createBooking(newBookingData: Omit<Booking, 'id' | 'createdAt' | 'statusTimeline'>): Promise<Booking> {
    const newBooking: Booking = {
      ...newBookingData,
      id: `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'Booking Requested',
      statusTimeline: [
        {
          status: 'Booking Requested',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: newBookingData.isEmergency ? 'Urgent emergency service dispatched' : 'Standard booking placed'
        }
      ],
      otp: `${Math.floor(1000 + Math.random() * 9000)}`
    };

    bookingsStore = [newBooking, ...bookingsStore];
    return simulatedLatency(newBooking, 300);
  },

  async updateBookingStatus(
    bookingId: string, 
    newStatus: BookingStatus, 
    note?: string
  ): Promise<Booking> {
    const index = bookingsStore.findIndex((b) => b.id === bookingId);
    if (index === -1) {
      throw new Error(`Booking ${bookingId} not found`);
    }

    const current = bookingsStore[index];
    const updated: Booking = {
      ...current,
      status: newStatus,
      statusTimeline: [
        ...current.statusTimeline,
        {
          status: newStatus,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: note || `Status updated to ${newStatus}`
        }
      ]
    };

    if (newStatus === 'Payment Completed') {
      updated.paymentStatus = 'Paid';
      updated.transactionId = `TXN-SGIG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      updated.invoiceId = `INV-2026-${bookingId.split('-')[2] || '0891'}`;
    }

    bookingsStore[index] = updated;
    return simulatedLatency(updated, 200);
  },

  resetMockBookings() {
    bookingsStore = [...INITIAL_BOOKINGS];
  }
};
