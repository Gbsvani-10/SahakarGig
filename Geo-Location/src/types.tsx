export type ServiceCategory =
  | 'All Services'
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Painter'
  | 'Cleaner'
  | 'Gardener'
  | 'Driver'
  | 'Caregiver'
  | 'Technician'
  | 'Domestic Helper';

export type WorkerStatus = 'Available' | 'Busy' | 'Offline' | 'Emergency Ready';

export interface CooperativeWorker {
  id: string;
  name: string;
  avatar: string;
  skill: Exclude<ServiceCategory, 'All Services'>;
  cooperativeSociety: string;
  federationId: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  experienceYears: number;
  hourlyRate: number;
  status: WorkerStatus;
  lat: number;
  lng: number;
  distanceKm: number;
  estimatedArrivalMin: number;
  serviceRadiusKm: number;
  phone: string;
  badges: string[];
  bio: string;
  matchScore?: number;
  matchBreakdown?: {
    skillMatch: number;
    locationMatch: number;
    availabilityMatch: number;
    ratingMatch: number;
    responseTimeMatch: number;
  };
}

export interface CustomerLocation {
  address: string;
  lat: number;
  lng: number;
  city: string;
  pincode: string;
}

export interface LiveRequest {
  id: string;
  customerLocation: string;
  service: Exclude<ServiceCategory, 'All Services'>;
  distanceKm: number;
  priority: 'Normal' | 'Emergency';
  time: string;
  status: 'Pending' | 'Searching' | 'Assigned' | 'In-Progress';
  lat: number;
  lng: number;
}

export interface DemandArea {
  id: string;
  name: string;
  zone: string;
  demandLevel: 'High' | 'Medium' | 'Low';
  activeWorkers: number;
  predictedRequests: number;
  recommendedAllocation: number;
  popularSkill: string;
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface ServiceForecast {
  service: string;
  predictedRequests: number;
  growthPercent: number;
  peakHour: string;
  recommendedWorkers: number;
}

export type AppLanguage = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'mr';

export type ViewMode = 'customer' | 'worker' | 'admin';
