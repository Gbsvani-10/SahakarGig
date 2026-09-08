import { WorkerProfile, WorkerSkill, WorkerCertification, WeeklyScheduleDay, NearbyServiceSearchQuery, NearbyWorkerResult, WorkerLocationUpdatePayload } from '../types';
import { apiRequest } from './apiClient';

const categoryMap: Record<string, any> = { plumbing:'Plumber', electrical:'Electrician', carpentry:'Carpenter', painting:'Painter', cleaning:'Cleaner', 'domestic helper':'Domestic Helper', caregiver:'Caregiver', driving:'Driver', gardening:'Gardener', technician:'Technician' };
const mapBackendWorker = (w: any): WorkerProfile => ({
  id:w.id,userId:w.user_id || '',name:w.name,phone:w.phone,email:w.email || '',avatarUrl:w.avatar_url || '',
  primaryCategory:categoryMap[String(w.skill || '').toLowerCase()] || 'Technician',cooperativeId:w.cooperative_id || '',cooperativeName:w.cooperative_name || '',
  rating:Number(w.rating || 0),isAvailable:Boolean(w.is_available),availabilityStatus:w.is_available?'Available':'Offline',
  verificationStatus:w.is_verified?'Verified':'Pending',latitude:w.latitude == null ? undefined : Number(w.latitude),longitude:w.longitude == null ? undefined : Number(w.longitude),
  distanceKm:Number(w.distance_km || 0),skills:[],certifications:[],schedule:[],experienceYears:Number(w.experience_years || 0),reviewCount:Number(w.review_count || 0),completedJobsCount:Number(w.completed_jobs_count || 0),
  emergencyAvailable:Boolean(w.emergency_available ?? true),serviceArea:w.service_area || '',hourlyRate:Number(w.hourly_rate || 0),priceRange:w.price_range || '',
  welfareStatus:{insuranceActive:Boolean(w.insurance_active),policyNumber:w.policy_number || '',validUntil:w.insurance_valid_until || '',schemeName:w.welfare_scheme_name || ''}
});

export const workerService = {
  async getAllWorkers(): Promise<WorkerProfile[]> { const response=await apiRequest<any[]>('/workers'); return Array.isArray(response.data)?response.data.map(mapBackendWorker):[]; },
  async getWorkerById(id:string):Promise<WorkerProfile|undefined>{ const response=await apiRequest<any[]>('/workers'); const worker=Array.isArray(response.data)?response.data.find((w:any)=>w.id===id || w.user_id===id):undefined; return worker?mapBackendWorker(worker):undefined; },
  async getWorkersByCategory(category:string):Promise<WorkerProfile[]> { return (await this.getAllWorkers()).filter(w=>w.primaryCategory===category); },
  async updateAvailability(_workerId:string,status:'Available'|'Busy'|'Offline'):Promise<WorkerProfile>{ const response=await apiRequest<any>('/workers/availability',{method:'PATCH',body:JSON.stringify({isAvailable:status==='Available'})}); return mapBackendWorker(response.data); },
  async updateSchedule(_workerId:string,_schedule:WeeklyScheduleDay[]):Promise<WorkerProfile>{ throw new Error('Worker schedule persistence is not implemented by the backend yet'); },
  async addSkill(_workerId:string,_skill:Omit<WorkerSkill,'id'|'verificationStatus'>):Promise<WorkerProfile>{ throw new Error('Worker skill persistence is not implemented by the backend yet'); },
  async addCertification(_workerId:string,_cert:Omit<WorkerCertification,'id'|'verificationStatus'>):Promise<WorkerProfile>{ throw new Error('Worker certification persistence is not implemented by the backend yet'); },
  async updateVerificationStatus(workerId:string,status:'Verified'|'Pending'|'Suspended'):Promise<WorkerProfile>{ if(status!=='Verified') throw new Error('Only verification approval is supported by the backend'); const response=await apiRequest<any>(`/workers/${encodeURIComponent(workerId)}/verify`,{method:'PATCH'}); return mapBackendWorker(response.data); },
  async getNearbyWorkers(query:NearbyServiceSearchQuery):Promise<{center:{latitude:number;longitude:number};radiusKm:number;count:number;workers:NearbyWorkerResult[]}>{ const response=await apiRequest<any>('/services/nearby',{method:'POST',body:JSON.stringify(query)}); const workers=(response?.data?.workers||[]).map((w:any)=>({worker:mapBackendWorker(w),distanceKm:Number(w.distance_km||0),matchScore:Math.max(0,Math.round(100-Number(w.distance_km||0)*5))})); return {...response.data,workers}; },
  async updateWorkerLocation(_workerId:string,payload:WorkerLocationUpdatePayload):Promise<WorkerProfile>{ const response=await apiRequest<any>('/workers/location',{method:'PATCH',body:JSON.stringify(payload)}); return mapBackendWorker(response.data); }
};
