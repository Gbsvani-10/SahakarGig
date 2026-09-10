import React, { useState } from 'react';
import { BookingData, Language } from './types';
import { PaymentPage } from './components/PaymentPage';
import { Dashboard } from './components/Dashboard';

// Sample demo bookings satisfying requirements
const initialBookings: BookingData[] = [
  {
    id: 'SG10245',
    workerName: 'Ravi Kumar',
    workerPhone: '+91 98765 43210',
    workerUpiId: 'ravi.kumar@upi',
    service: 'Plumbing',
    serviceCategory: 'Home Maintenance',
    scheduledDate: '10 September 2026',
    scheduledTime: '10:00 AM',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98123 45678',
    customerAddress: 'Flat 402, Green Meadows, Hyderabad',
    baseServiceAmount: 1000,
    gstRate: 0.18,
    adminFee: 50,
    paymentStatus: 'pending',
  },
  {
    id: 'SG10246',
    workerName: 'Suresh Rao',
    workerPhone: '+91 98765 12345',
    workerUpiId: 'suresh.rao@upi',
    service: 'Electrical Repair',
    serviceCategory: 'Electrical',
    scheduledDate: '11 September 2026',
    scheduledTime: '02:30 PM',
    customerName: 'Aarav Sharma',
    customerPhone: '+91 98123 45678',
    customerAddress: 'Flat 402, Green Meadows, Hyderabad',
    baseServiceAmount: 850,
    gstRate: 0.18,
    adminFee: 50,
    paymentStatus: 'pending',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'payment'>('payment'); // Default to payment page so reviewer sees it immediately
  const [language, setLanguage] = useState<Language>('en');
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('SG10245');

  const selectedBooking =
    bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handlePaymentSuccess = (bookingId: string, transactionId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              paymentStatus: 'paid',
              paidAt: new Date().toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
              transactionId,
              paymentMethod: 'UPI App',
            }
          : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {currentView === 'payment' ? (
        <PaymentPage
          booking={selectedBooking}
          language={language}
          onLanguageChange={setLanguage}
          onBackToDashboard={() => setCurrentView('dashboard')}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : (
        <Dashboard
          bookings={bookings}
          selectedBookingId={selectedBookingId}
          onSelectBooking={(id) => setSelectedBookingId(id)}
          onOpenPayments={() => setCurrentView('payment')}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}
    </div>
  );
}
