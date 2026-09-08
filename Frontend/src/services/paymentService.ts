import { Transaction, Review } from '../types';
import { MOCK_TRANSACTIONS, MOCK_REVIEWS } from '../data/mockData';
import { apiRequest } from './apiClient';

let transactionsStore: Transaction[] = [...MOCK_TRANSACTIONS];
let reviewsStore: Review[] = [...MOCK_REVIEWS];

export const paymentService = {
  async getTransactions(): Promise<Transaction[]> {
    try { const response = await apiRequest<any[]>('/payments/transactions'); if (Array.isArray(response.data)) return response.data; }
    catch (e) { console.warn('[paymentService] transaction API unavailable:', e); }
    return [...transactionsStore];
  },
  async processPayment(bookingId:string, amount:number, paymentMethod:string, customerName:string, workerName:string, serviceCategory:any):Promise<{transactionId:string;invoiceId:string}> {
    const response = await apiRequest<any>('/bookings/complete-payment',{method:'POST',body:JSON.stringify({bookingId,amount,paymentMethod,transactionRef:`DEMO-${Date.now()}`})});
    const invoice=response.data?.invoice||response.invoice;
    const transactionId=invoice?.transaction_ref||`TXN-${Date.now()}`;
    const invoiceId=invoice?.invoice_number||invoice?.id||`INV-${Date.now()}`;
    transactionsStore=[{id:transactionId,bookingId,amount,workerPayout:Math.round(amount*.9),cooperativeFee:Math.round(amount*.07),platformFee:Math.round(amount*.03),customerName,workerName,serviceCategory,date:new Date().toISOString().split('T')[0],status:'Successful',paymentMethod},...transactionsStore];
    return {transactionId,invoiceId};
  },
  async getReviews():Promise<Review[]> { return [...reviewsStore]; },
  async addReview(review:Omit<Review,'id'|'date'>):Promise<Review> { const newRev={...review,id:`rev-${Date.now()}`,date:new Date().toISOString().split('T')[0]};reviewsStore=[newRev,...reviewsStore];return newRev; }
};
