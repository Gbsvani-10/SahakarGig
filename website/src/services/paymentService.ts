import { Transaction, Review } from '../types';
import { MOCK_TRANSACTIONS, MOCK_REVIEWS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

let transactionsStore: Transaction[] = [...MOCK_TRANSACTIONS];
let reviewsStore: Review[] = [...MOCK_REVIEWS];

export const paymentService = {
  async getTransactions(): Promise<Transaction[]> {
    return simulatedLatency([...transactionsStore], 200);
  },

  async processPayment(
    bookingId: string, 
    amount: number, 
    paymentMethod: string,
    customerName: string,
    workerName: string,
    serviceCategory: any
  ): Promise<{ transactionId: string; invoiceId: string }> {
    const txnId = `TXN-SGIG-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const invoiceId = `INV-2026-${bookingId.split('-')[2] || Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: Transaction = {
      id: txnId,
      bookingId,
      amount,
      workerPayout: Math.round(amount * 0.9), // 90% direct to worker
      cooperativeFee: Math.round(amount * 0.07), // 7% to labour cooperative welfare
      platformFee: Math.round(amount * 0.03), // 3% technology maintenance
      customerName,
      workerName,
      serviceCategory,
      date: new Date().toISOString().split('T')[0],
      status: 'Successful',
      paymentMethod
    };

    transactionsStore = [newTxn, ...transactionsStore];
    return simulatedLatency({ transactionId: txnId, invoiceId }, 400);
  },

  async getReviews(): Promise<Review[]> {
    return simulatedLatency([...reviewsStore], 200);
  },

  async addReview(review: Omit<Review, 'id' | 'date'>): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    reviewsStore = [newRev, ...reviewsStore];
    return simulatedLatency(newRev, 250);
  }
};
