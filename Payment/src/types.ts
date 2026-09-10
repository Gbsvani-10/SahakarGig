export type Language = 'en' | 'te' | 'hi';

export interface BookingData {
  id: string;
  workerName: string;
  workerPhone: string;
  workerAvatar?: string;
  workerUpiId: string;
  service: string;
  serviceCategory: string;
  scheduledDate: string;
  scheduledTime: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  baseServiceAmount: number;
  gstRate: number; // e.g. 0.18
  adminFee: number; // e.g. 50
  paymentStatus: 'pending' | 'verifying' | 'paid' | 'failed' | 'cancelled';
  paidAt?: string;
  transactionId?: string;
  paymentMethod?: string;
}

export interface PaymentCalculation {
  serviceAmount: number;
  gstRatePercent: number;
  gstAmount: number;
  adminCharge: number;
  grandTotal: number;
  amountPayableToWorker: number;
}

export interface PaymentReceiptData {
  paymentId: string;
  bookingId: string;
  workerName: string;
  workerUpiId: string;
  serviceName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  utrNumber: string;
  status: 'PAID' | 'VERIFIED';
}
