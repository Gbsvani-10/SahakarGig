import { Booking, BookingStatus } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { apiRequest } from './apiClient';

let bookingsStore: Booking[] = [...INITIAL_BOOKINGS];
const skillMap: Record<string,string> = { Electrician:'electrical', Plumber:'plumbing', Carpenter:'carpentry', Painter:'painting', Cleaner:'cleaning', 'Domestic Helper':'domestic helper', Caregiver:'caregiver', Driver:'driving', Gardener:'gardening', Technician:'technician' };

function mapBooking(b:any): Booking {
  const existing = bookingsStore.find(x => x.id === b.id);
  const serviceCategory = Object.keys(skillMap).find(k => skillMap[k] === String(b.service_type || '').toLowerCase()) || (existing?.serviceCategory || 'Technician');
  return {
    ...existing, id:b.id, customerId:b.customer_id, customerName:existing?.customerName || 'Customer', customerPhone:existing?.customerPhone || '', customerAddress:existing?.customerAddress || '',
    workerId:b.worker_id || existing?.workerId || '', workerName:b.worker_name || existing?.workerName || 'Cooperative Worker', workerPhone:b.worker_phone || existing?.workerPhone || '', workerAvatar:existing?.workerAvatar,
    cooperativeName:existing?.cooperativeName || 'SahakarGig Cooperative', serviceCategory, serviceTitle:existing?.serviceTitle || serviceCategory,
    date:existing?.date || String(b.created_at || '').slice(0,10), timeSlot:existing?.timeSlot || 'Standard', description:existing?.description, notes:existing?.notes,
    isEmergency:Boolean(b.is_emergency), estimatedPrice:Number(b.amount || existing?.estimatedPrice || 350), finalPrice:b.amount == null ? existing?.finalPrice : Number(b.amount),
    baseAmount:existing?.baseAmount, welfareFee:existing?.welfareFee, platformFee:existing?.platformFee, totalAmount:b.amount == null ? existing?.totalAmount : Number(b.amount),
    status:b.status === 'accepted' ? 'Worker Accepted' : b.status === 'completed' ? 'Service Completed' : b.status === 'cancelled' ? 'Cancelled' : (existing?.status || 'Booking Requested'),
    statusTimeline:existing?.statusTimeline || [], paymentStatus:existing?.paymentStatus || 'Pending', paymentMethod:existing?.paymentMethod, transactionId:existing?.transactionId, invoiceId:existing?.invoiceId, otp:existing?.otp,
    createdAt:b.created_at || existing?.createdAt || new Date().toISOString()
  } as Booking;
}

export const bookingService = {
  async getAllBookings():Promise<Booking[]> { try { const r=await apiRequest<any[]>('/bookings'); if(Array.isArray(r.data)){ bookingsStore=r.data.map(mapBooking); return [...bookingsStore]; } } catch(e){ console.warn('[bookingService] backend fetch failed:',e); } return [...bookingsStore]; },
  async getBookingById(id:string){ return bookingsStore.find(b=>b.id===id); },
  async getCustomerBookings(customerId:string){ const all=await this.getAllBookings(); return all.filter(b=>b.customerId===customerId); },
  async getWorkerBookings(_workerId:string){ return this.getAllBookings(); },
  async createBooking(data:Omit<Booking,'id'|'createdAt'|'statusTimeline'>):Promise<Booking>{
    const source:any=data;
    const r=await apiRequest<any>('/bookings/create',{method:'POST',body:JSON.stringify({skill:skillMap[data.serviceCategory] || String(data.serviceCategory).toLowerCase(),workerId:data.workerId || null,latitude:Number(source.latitude ?? 0),longitude:Number(source.longitude ?? 0),isEmergency:Boolean(data.isEmergency)})});
    const booking=mapBooking({...r.data,worker_name:data.workerName,worker_phone:data.workerPhone});
    Object.assign(booking,{customerName:data.customerName,customerPhone:data.customerPhone,customerAddress:data.customerAddress,serviceTitle:data.serviceTitle,date:data.date,timeSlot:data.timeSlot,description:data.description,statusTimeline:[{status:booking.status || 'Booking Requested',timestamp:new Date().toLocaleTimeString(),note:data.isEmergency?'Emergency request dispatched':'Service request created'}]});
    bookingsStore=[booking,...bookingsStore.filter(x=>x.id!==booking.id)]; return booking;
  },
  async updateBookingStatus(bookingId:string,newStatus:BookingStatus,note?:string):Promise<Booking>{
    const apiStatus=newStatus==='Worker Accepted'?'accepted':newStatus==='Service Completed'||newStatus==='Payment Completed'?'completed':newStatus==='Cancelled'?'cancelled':'requested';
    try { const r=await apiRequest<any>(`/bookings/${bookingId}/status`,{method:'PATCH',body:JSON.stringify({status:apiStatus})}); const current=bookingsStore.find(b=>b.id===bookingId); const updated=mapBooking(r.data); updated.status=newStatus; updated.statusTimeline=[...(current?.statusTimeline||[]),{status:newStatus,timestamp:new Date().toLocaleTimeString(),note}]; bookingsStore=bookingsStore.map(b=>b.id===bookingId?{...b,...updated}:b); return updated; } catch(e){ const current=bookingsStore.find(b=>b.id===bookingId); if(!current) throw new Error('Booking not found'); const updated={...current,status:newStatus,statusTimeline:[...current.statusTimeline,{status:newStatus,timestamp:new Date().toLocaleTimeString(),note}]}; bookingsStore=bookingsStore.map(b=>b.id===bookingId?updated:b); return updated; }
  },
  resetMockBookings(){ bookingsStore=[...INITIAL_BOOKINGS]; }
};
