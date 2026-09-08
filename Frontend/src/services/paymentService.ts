import { Transaction, Review } from '../types';
import { apiRequest } from './apiClient';

interface PaymentInvoice {
  id: string;
  invoice_number: string;
  amount: number;
  payment_method: string;
  transaction_ref?: string;
  status: string;
  created_at?: string;
}

interface PaymentResponse {
  invoice: PaymentInvoice;
}

interface BackendTransaction {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  transaction_ref?: string;
  status: string;
  date?: string;
  created_at?: string;
  customer_name?: string;
  worker_name?: string;
  service_category?: string;
}

const toTransaction = (row: BackendTransaction): Transaction => ({
  id: row.transaction_ref || row.id,
  bookingId: row.booking_id,
  amount: Number(row.amount),
  workerPayout: Math.round(Number(row.amount) * 0.9),
  cooperativeFee: Math.round(Number(row.amount) * 0.07),
  platformFee: Math.round(Number(row.amount) * 0.03),
  customerName: row.customer_name || 'Customer',
  workerName: row.worker_name || 'Cooperative Worker',
  serviceCategory: (row.service_category || 'Technician') as Transaction['serviceCategory'],
  date: row.date || row.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  createdAt: row.created_at,
  status: row.status === 'paid' ? 'Successful' : row.status === 'pending' ? 'Pending' : 'Failed',
  paymentMethod: row.payment_method || 'UPI'
});

export const paymentService = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiRequest<BackendTransaction[]>('/payments/transactions');
    return Array.isArray(response.data) ? response.data.map(toTransaction) : [];
  },

  async processPayment(
    bookingId: string,
    amount: number,
    paymentMethod: string,
    _customerName?: string,
    _workerName?: string,
    _serviceCategory?: Transaction['serviceCategory']
  ): Promise<{ transactionId: string; invoiceId: string }> {
    const transactionRef = `TXN-SG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const response = await apiRequest<PaymentResponse>('/bookings/complete-payment', {
      method: 'POST',
      body: JSON.stringify({ bookingId, amount, paymentMethod, transactionRef })
    });

    const invoice = response.data.invoice;
    return {
      transactionId: invoice.transaction_ref || transactionRef,
      invoiceId: invoice.invoice_number || invoice.id
    };
  },

  async getReviews(): Promise<Review[]> {
    return [];
  },

  async addReview(_review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    throw new Error('Review persistence is not implemented yet.');
  }
};
