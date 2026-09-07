import { WorkerProfile, WorkerSkill, WorkerCertification, WeeklyScheduleDay, NearbyServiceSearchQuery, NearbyWorkerResult, WorkerLocationUpdatePayload } from '../types';
import { MOCK_WORKERS } from '../data/mockData';
import { simulatedLatency, apiRequest } from './apiClient';
import { findNearbyWorkers } from '../server/geoUtils';

let workersStore: WorkerProfile[] = [...MOCK_WORKERS];

export const workerService = {
  async getAllWorkers(): Promise<WorkerProfile[]> {
    return simulatedLatency([...workersStore], 200);
  },

  async getWorkerById(id: string): Promise<WorkerProfile | undefined> {
    const worker = workersStore.find((w) => w.id === id || w.userId === id);
    return simulatedLatency(worker, 150);
  },

  async getWorkersByCategory(category: string): Promise<WorkerProfile[]> {
    const filtered = workersStore.filter((w) => w.primaryCategory === category);
    return simulatedLatency(filtered, 200);
  },

  async updateAvailability(workerId: string, status: 'Available' | 'Busy' | 'Offline'): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');
    
    workersStore[index] = {
      ...workersStore[index],
      availabilityStatus: status,
      isAvailable: status === 'Available'
    };
    return simulatedLatency(workersStore[index], 150);
  },

  async updateSchedule(workerId: string, schedule: WeeklyScheduleDay[]): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    workersStore[index] = {
      ...workersStore[index],
      schedule
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async addSkill(workerId: string, skill: Omit<WorkerSkill, 'id' | 'verificationStatus'>): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    const newSkill: WorkerSkill = {
      ...skill,
      id: `sk-${Date.now()}`,
      verificationStatus: 'Pending'
    };

    workersStore[index] = {
      ...workersStore[index],
      skills: [...workersStore[index].skills, newSkill]
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async addCertification(
    workerId: string, 
    cert: Omit<WorkerCertification, 'id' | 'verificationStatus'>
  ): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    const newCert: WorkerCertification = {
      ...cert,
      id: `cert-${Date.now()}`,
      verificationStatus: 'Pending'
    };

    workersStore[index] = {
      ...workersStore[index],
      certifications: [...workersStore[index].certifications, newCert]
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async updateVerificationStatus(workerId: string, status: 'Verified' | 'Pending' | 'Suspended'): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    workersStore[index] = {
      ...workersStore[index],
      verificationStatus: status
    };
    return simulatedLatency(workersStore[index], 200);
  },

  /**
   * Search nearby workers via Backend API /api/services/nearby with local fallback
   */
  async getNearbyWorkers(query: NearbyServiceSearchQuery): Promise<{
    center: { latitude: number; longitude: number };
    radiusKm: number;
    count: number;
    workers: NearbyWorkerResult[];
  }> {
    try {
      const response = await apiRequest<{
        center: { latitude: number; longitude: number };
        radiusKm: number;
        count: number;
        workers: NearbyWorkerResult[];
      }>('/services/nearby', {
        method: 'POST',
        body: JSON.stringify({
          latitude: query.latitude,
          longitude: query.longitude,
          service: query.service,
          radiusKm: query.radiusKm || 5,
          availableOnly: query.availableOnly,
          minRating: query.minRating
        })
      });

      if (response && response.data && Array.isArray(response.data.workers)) {
        return response.data;
      }
    } catch (err) {
      console.warn('[workerService] Live /api/services/nearby fallback to local matching engine:', err);
    }

    // Direct local engine matching fallback
    const radius = query.radiusKm || 5;
    const matches = findNearbyWorkers(
      workersStore,
      query.latitude,
      query.longitude,
      radius,
      {
        service: query.service,
        availableOnly: query.availableOnly,
        minRating: query.minRating
      }
    );

    return simulatedLatency({
      center: { latitude: query.latitude, longitude: query.longitude },
      radiusKm: radius,
      count: matches.length,
      workers: matches
    }, 150);
  },

  /**
   * Update artisan service location via Backend API /api/workers/location
   */
  async updateWorkerLocation(
    workerId: string,
    payload: WorkerLocationUpdatePayload
  ): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId || w.userId === workerId);
    if (index === -1) throw new Error('Artisan profile not found');

    try {
      const response = await apiRequest<WorkerProfile>('/workers/location', {
        method: 'PATCH',
        body: JSON.stringify({
          workerId,
          ...payload
        })
      });
      if (response && response.data) {
        workersStore[index] = response.data;
        return response.data;
      }
    } catch (err) {
      console.warn('[workerService] Live PATCH /api/workers/location fallback to local store:', err);
    }

    const updatedWorker: WorkerProfile = {
      ...workersStore[index],
      latitude: payload.latitude,
      longitude: payload.longitude,
      locationAccuracy: payload.locationAccuracy || 10,
      locationAddress: payload.locationAddress || workersStore[index].locationAddress,
      serviceRadiusKm: payload.serviceRadiusKm || workersStore[index].serviceRadiusKm || 10,
      locationUpdatedAt: new Date().toISOString()
    };

    workersStore[index] = updatedWorker;
    return simulatedLatency(updatedWorker, 200);
  }
};
