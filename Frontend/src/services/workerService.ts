import {
  WorkerProfile,
  WorkerSkill,
  WorkerCertification,
  WeeklyScheduleDay,
  NearbyServiceSearchQuery,
  NearbyWorkerResult,
  WorkerLocationUpdatePayload,
} from '../types';

import { apiRequest } from './apiClient';

const categoryMap: Record<string, string> = {
  plumbing: 'Plumber',
  electrical: 'Electrician',
  carpentry: 'Carpenter',
  painting: 'Painter',
  cleaning: 'Cleaner',
  'domestic helper': 'Domestic Helper',
  caregiver: 'Caregiver',
  driving: 'Driver',
  gardening: 'Gardener',
  technician: 'Technician',
};

const mapBackendWorker = (w: any): WorkerProfile => {
  const skills: WorkerSkill[] = Array.isArray(w.skills)
    ? w.skills
    : [];

  const certifications: WorkerCertification[] =
    Array.isArray(w.certifications)
      ? w.certifications
      : [];

  const schedule: WeeklyScheduleDay[] =
    Array.isArray(w.schedule)
      ? w.schedule
      : [];

  const backendSkill = String(w.skill || '').trim();

  return {
    id: w.id,
    userId: w.user_id || '',
    name: w.name || '',
    phone: w.phone || '',
    email: w.email || '',
    avatarUrl: w.avatar_url || '',

    primaryCategory: backendSkill
      ? categoryMap[backendSkill.toLowerCase()] || backendSkill
      : '',

    cooperativeId: w.cooperative_id || '',
    cooperativeName: w.cooperative_name || '',

    rating:
      w.rating == null
        ? 0
        : Number(w.rating),

    isAvailable: Boolean(w.is_available),

    availabilityStatus: w.is_available
      ? 'Available'
      : 'Offline',

    verificationStatus: w.is_verified
      ? 'Verified'
      : 'Pending',

    latitude:
      w.latitude == null
        ? undefined
        : Number(w.latitude),

    longitude:
      w.longitude == null
        ? undefined
        : Number(w.longitude),

    distanceKm:
      w.distance_km == null
        ? 0
        : Number(w.distance_km),

    skills,
    certifications,
    schedule,

    experienceYears:
      w.experience_years == null
        ? 0
        : Number(w.experience_years),

    reviewCount:
      w.review_count == null
        ? 0
        : Number(w.review_count),

    completedJobsCount:
      w.completed_jobs_count == null
        ? 0
        : Number(w.completed_jobs_count),

    emergencyAvailable:
      w.emergency_available == null
        ? false
        : Boolean(w.emergency_available),

    serviceArea: w.service_area || '',

    hourlyRate:
      w.hourly_rate == null
        ? 0
        : Number(w.hourly_rate),

    priceRange: w.price_range || '',

    welfareStatus: {
      insuranceActive:
        w.insurance_active == null
          ? false
          : Boolean(w.insurance_active),

      policyNumber:
        w.policy_number || '',

      validUntil:
        w.insurance_valid_until || '',

      schemeName:
        w.welfare_scheme_name || '',
    },
  };
};

export const workerService = {
  async getAllWorkers(): Promise<WorkerProfile[]> {
    const response = await apiRequest<any[]>(
      '/workers'
    );

    return Array.isArray(response.data)
      ? response.data.map(mapBackendWorker)
      : [];
  },

  async getWorkerById(
    id: string
  ): Promise<WorkerProfile | undefined> {
    const response = await apiRequest<any[]>(
      '/workers'
    );

    const worker = Array.isArray(response.data)
      ? response.data.find(
          (w: any) =>
            String(w.id) === String(id) ||
            String(w.user_id) === String(id)
        )
      : undefined;

    return worker
      ? mapBackendWorker(worker)
      : undefined;
  },

  async getWorkersByCategory(
    category: string
  ): Promise<WorkerProfile[]> {
    return (await this.getAllWorkers()).filter(
      (worker) =>
        worker.primaryCategory.toLowerCase() ===
        category.toLowerCase()
    );
  },

  async updateAvailability(
    _workerId: string,
    status: 'Available' | 'Busy' | 'Offline'
  ): Promise<WorkerProfile> {
    const response = await apiRequest<any>(
      '/workers/availability',
      {
        method: 'PATCH',
        body: JSON.stringify({
          isAvailable:
            status === 'Available',
        }),
      }
    );

    return mapBackendWorker(response.data);
  },

  async updateSchedule(
    _workerId: string,
    _schedule: WeeklyScheduleDay[]
  ): Promise<WorkerProfile> {
    throw new Error(
      'Worker schedule persistence is not implemented by the backend yet'
    );
  },

  async addSkill(
    _workerId: string,
    _skill: Omit<
      WorkerSkill,
      'id' | 'verificationStatus'
    >
  ): Promise<WorkerProfile> {
    throw new Error(
      'Worker skill persistence is not implemented by the backend yet'
    );
  },

  async addCertification(
    _workerId: string,
    _cert: Omit<
      WorkerCertification,
      'id' | 'verificationStatus'
    >
  ): Promise<WorkerProfile> {
    throw new Error(
      'Worker certification persistence is not implemented by the backend yet'
    );
  },

  async updateVerificationStatus(
    workerId: string,
    status: 'Verified' | 'Pending' | 'Suspended'
  ): Promise<WorkerProfile> {
    if (status !== 'Verified') {
      throw new Error(
        'Only verification approval is supported by the backend'
      );
    }

    const response = await apiRequest<any>(
      `/workers/${encodeURIComponent(workerId)}/verify`,
      {
        method: 'PATCH',
      }
    );

    return mapBackendWorker(response.data);
  },

  async getNearbyWorkers(
    query: NearbyServiceSearchQuery
  ): Promise<{
    center: {
      latitude: number;
      longitude: number;
    };
    radiusKm: number;
    count: number;
    workers: NearbyWorkerResult[];
  }> {
    const response = await apiRequest<any>(
      '/services/nearby',
      {
        method: 'POST',
        body: JSON.stringify(query),
      }
    );

    const workers = (
      response?.data?.workers || []
    ).map((w: any) => ({
      worker: mapBackendWorker(w),

      distanceKm: Number(
        w.distance_km || 0
      ),

      matchScore: Math.max(
        0,
        Math.round(
          100 -
            Number(w.distance_km || 0) * 5
        )
      ),
    }));

    return {
      ...response.data,
      workers,
    };
  },

  async updateWorkerLocation(
    _workerId: string,
    payload: WorkerLocationUpdatePayload
  ): Promise<WorkerProfile> {
    const response = await apiRequest<any>(
      '/workers/location',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    );

    return mapBackendWorker(response.data);
  },
};
