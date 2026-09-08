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

interface RazorpayOrderResponse {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  bookingId: string;
  customerName?: string;
  customerEmail?: string;
  workerName?: string;
}

interface VerifyResponse {
  paymentId: string;
  orderId: string;
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

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const loadRazorpay = async (): Promise<void> => {
  if (window.Razorpay) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout.')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.'));
    document.body.appendChild(script);
  });
  if (!window.Razorpay) throw new Error('Razorpay Checkout is unavailable.');
};

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
  paymentMethod: row.payment_method || 'Razorpay'
});

export const paymentService = {
  async getTransactions(): Promise<Transaction[]> {
    const response = await apiRequest<BackendTransaction[]>('/payments/transactions');
    return Array.isArray(response.data) ? response.data.map(toTransaction) : [];
  },

  async processPayment(bookingId: string): Promise<{ transactionId: string; invoiceId: string }> {
    await loadRazorpay();
    const orderResponse = await apiRequest<RazorpayOrderResponse>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId })
    });
    const order = orderResponse.data;

    return await new Promise((resolve, reject) => {
      const Razorpay = window.Razorpay;
      if (!Razorpay) return reject(new Error('Razorpay Checkout is unavailable.'));

      const checkout = new Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'SahakarGig',
        description: 'Cooperative service payment',
        order_id: order.orderId,
        prefill: {
          name: order.customerName || '',
          email: order.customerEmail || ''
        },
        notes: { bookingId: order.bookingId },
        theme: { color: '#059669' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            const verified = await apiRequest<VerifyResponse>('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const invoice = verified.data.invoice;
            resolve({
              transactionId: verified.data.paymentId,
              invoiceId: invoice.invoice_number || invoice.id
            });
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment window was closed before completion.'))
        }
      });
      checkout.open();
    });
  },

  async getReviews(): Promise<Review[]> { return []; },
  async addReview(_review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    throw new Error('Review persistence is not implemented yet.');
  }
};
