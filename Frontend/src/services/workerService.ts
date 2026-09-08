import { WorkerProfile, WorkerSkill, WorkerCertification, WeeklyScheduleDay, NearbyServiceSearchQuery, NearbyWorkerResult, WorkerLocationUpdatePayload } from '../types';
import { MOCK_WORKERS } from '../data/mockData';
import { apiRequest } from './apiClient';
import { findNearbyWorkers } from '../server/geoUtils';

let workersStore: WorkerProfile[] = [...MOCK_WORKERS];

const mapBackendWorker = (w: any): WorkerProfile => {
  const categoryMap: Record<string, any> = { plumbing:'Plumber', electrical:'Electrician', carpentry:'Carpenter', painting:'Painter', cleaning:'Cleaner', caregiver:'Caregiver', driving:'Driver', gardening:'Gardener', technician:'Technician' };
  const category = categoryMap[String(w.skill || '').toLowerCase()] || 'Technician';
  return {
    ...MOCK_WORKERS.find(m => m.id === w.id || m.userId === w.user_id),
    id: w.id,
    userId: w.user_id || w.id,
    name: w.name,
    phone: w.phone,
    email: MOCK_WORKERS.find(m => m.id === w.id)?.email || `${String(w.name).toLowerCase().replace(/\s+/g,'.')}@sahakargig.local`,
    primaryCategory: category,
    cooperativeId: w.cooperative_id,
    cooperativeName: w.cooperative_name || 'SahakarGig Cooperative',
    rating: Number(w.rating || 0),
    isAvailable: Boolean(w.is_available),
    availabilityStatus: w.is_available ? 'Available' : 'Offline',
    verificationStatus: w.is_verified ? 'Verified' : 'Pending',
    latitude: w.latitude == null ? undefined : Number(w.latitude),
    longitude: w.longitude == null ? undefined : Number(w.longitude),
    distanceKm: Number(w.distance_km || 0),
    skills: [],
    certifications: [],
    schedule: [],
    experienceYears: 0,
    reviewCount: 0,
    completedJobsCount: 0,
    emergencyAvailable: true,
    serviceArea: 'Cooperative service area',
    hourlyRate: 350,
    priceRange: '₹300–₹700',
    welfareStatus: { insuranceActive: true, policyNumber: 'Pending', validUntil: '', schemeName: 'SahakarGig Worker Protection' },
    avatarUrl: MOCK_WORKERS.find(m => m.id === w.id)?.avatarUrl || ''
  } as WorkerProfile;
};

export const workerService = {
  async getAllWorkers(): Promise<WorkerProfile[]> {
    try {
      const response = await apiRequest<any[]>('/workers');
      if (Array.isArray(response.data)) {
        workersStore = response.data.map(mapBackendWorker);
        return [...workersStore];
      }
    } catch (e) { console.warn('[workerService] /workers unavailable:', e); }
    return [...workersStore];
  },

  async getWorkerById(id: string): Promise<WorkerProfile | undefined> {
    const local = workersStore.find(w => w.id === id || w.userId === id);
    return local;
  },

  async getWorkersByCategory(category: string): Promise<WorkerProfile[]> {
    return workersStore.filter(w => w.primaryCategory === category);
  },

  async updateAvailability(workerId: string, status: 'Available' | 'Busy' | 'Offline'): Promise<WorkerProfile> {
    const index = workersStore.findIndex(w => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Worker not found');
    workersStore[index] = { ...workersStore[index], availabilityStatus: status, isAvailable: status === 'Available' };
    return workersStore[index];
  },

  async updateSchedule(workerId: string, schedule: WeeklyScheduleDay[]): Promise<WorkerProfile> {
    const index = workersStore.findIndex(w => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Worker not found');
    workersStore[index] = { ...workersStore[index], schedule };
    return workersStore[index];
  },

  async addSkill(workerId: string, skill: Omit<WorkerSkill, 'id' | 'verificationStatus'>): Promise<WorkerProfile> {
    const index = workersStore.findIndex(w => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Worker not found');
    const updated = { ...workersStore[index], skills: [...workersStore[index].skills, { ...skill, id:`sk-${Date.now()}`, verificationStatus:'Pending' as const }] };
    workersStore[index] = updated; return updated;
  },

  async addCertification(workerId: string, cert: Omit<WorkerCertification, 'id' | 'verificationStatus'>): Promise<WorkerProfile> {
    const index = workersStore.findIndex(w => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Worker not found');
    const updated = { ...workersStore[index], certifications: [...workersStore[index].certifications, { ...cert, id:`cert-${Date.now()}`, verificationStatus:'Pending' as const }] };
    workersStore[index] = updated; return updated;
  },

  async updateVerificationStatus(workerId: string, status: 'Verified' | 'Pending' | 'Suspended'): Promise<WorkerProfile> {
    const index = workersStore.findIndex(w => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Worker not found');
    if (status === 'Verified') await apiRequest(`/workers/${workerId}/verify`, { method:'PATCH' });
    workersStore[index] = { ...workersStore[index], verificationStatus: status };
    return workersStore[index];
  },

  async getNearbyWorkers(query: NearbyServiceSearchQuery): Promise<{center:{latitude:number;longitude:number};radiusKm:number;count:number;workers:NearbyWorkerResult[]}> {
    try {
      const response = await apiRequest<any>('/services/nearby', { method:'POST', body:JSON.stringify(query) });
      if (response?.data?.workers) {
        const workers = response.data.workers.map((w:any) => ({ worker: mapBackendWorker(w), distanceKm:Number(w.distance_km || 0), matchScore: Math.max(0, Math.round(100 - Number(w.distance_km || 0) * 5)) }));
        return { ...response.data, workers };
      }
    } catch (e) { console.warn('[workerService] nearby API failed; local fallback:', e); }
    const radius = query.radiusKm || 5;
    const matches = findNearbyWorkers(workersStore, query.latitude, query.longitude, radius, { service:query.service, availableOnly:query.availableOnly, minRating:query.minRating });
    return { center:{latitude:query.latitude,longitude:query.longitude}, radiusKm:radius, count:matches.length, workers:matches };
  },

  async updateWorkerLocation(workerId:string, payload:WorkerLocationUpdatePayload):Promise<WorkerProfile> {
    const index = workersStore.findIndex(w=>w.id===workerId || w.userId===workerId);
    if(index===-1) throw new Error('Worker not found');
    const response = await apiRequest<any>('/workers/location',{method:'PATCH',body:JSON.stringify(payload)});
    const updated = mapBackendWorker(response.data);
    workersStore[index] = {...workersStore[index],...updated,latitude:payload.latitude,longitude:payload.longitude,locationAccuracy:payload.locationAccuracy,locationAddress:payload.locationAddress,serviceRadiusKm:payload.serviceRadiusKm || workersStore[index].serviceRadiusKm,locationUpdatedAt:new Date().toISOString()};
    return workersStore[index];
  }
};
