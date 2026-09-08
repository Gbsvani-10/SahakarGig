export type Language = 'en' | 'te' | 'hi';

export type PaymentMode = 'standard' | 'easy';

export type PaymentStatus =
  | 'idle'
  | 'initiating'
  | 'intent_dispatched'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'unconfirmed';

export interface UpiApp {
  id: string;
  name: string;
  scheme: string;
  packageName?: string;
  iconBg: string;
  popular?: boolean;
}

export interface PaymentRequest {
  orderId: string;
  merchantName: string;
  merchantUpiId: string;
  amount: number;
  currency: 'INR';
  description: string;
  customerName?: string;
  customerPhone?: string;
  serviceCategory?: string;
  idempotencyKey: string;
}

export interface Transaction {
  transactionId: string;
  orderId: string;
  merchantName: string;
  merchantUpiId: string;
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  status: PaymentStatus;
  selectedApp?: string;
  paymentReference?: string;
  failureReason?: string;
  isDemoTransaction: boolean;
  upiUri?: string;
  completedAt?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  parsedAmount?: number;
}

export interface DemoGigOrder {
  id: string;
  workerName: string;
  serviceName: string;
  cooperativeUnit: string;
  upiId: string;
  amount: number;
  category: string;
  verifiedWorker: boolean;
}
