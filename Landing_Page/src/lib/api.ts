import type {
  User,
  WorkerProfile,
  CustomerProfile,
  JobRequest,
  WorkDayRecord,
  FinancialSnapshot,
  InsuranceContributionSummary,
  WellBeingAlert,
  SmartMatchResult,
  AdminOverviewStats,
  VerificationItem,
  JobStatus
} from '../types.ts';

const TOKEN_KEY = 'sahakargig_token';

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const removeAuthToken = clearAuthToken;

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.error || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

function normalizeWorkerProfile(profile: WorkerProfile | null): WorkerProfile | null {
  if (!profile) return null;
  const normalized = profile as WorkerProfile & { totalEarnings?: number };
  if (typeof normalized.totalEarnings !== 'number') normalized.totalEarnings = 0;
  return normalized;
}

function createDemoWorkerRegistration(data: any): { token: string; user: User; workerProfile: WorkerProfile } {
  const now = new Date().toISOString();
  const id = `demo_worker_${Date.now()}`;
  const skills = Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : ['General Worker'];
  const maskedNumber = `XXXX-XXXX-${String(data.identityDocNumber || '').slice(-4).padStart(4, '0')}`;

  const user: User = {
    id,
    email: String(data.email || '').trim().toLowerCase(),
    mobile: String(data.mobile || '').trim(),
    role: 'WORKER',
    name: String(data.fullName || 'Worker').trim(),
    status: 'ACTIVE',
    createdAt: now
  };

  const profile = {
    id: `profile_${id}`,
    userId: id,
    fullName: user.name,
    mobile: user.mobile,
    email: user.email,
    address: data.address || '',
    pincode: data.pincode || '',
    preferredArea: data.preferredArea || data.address || '',
    jobType: data.jobType || skills[0],
    experienceYears: Number(data.experienceYears) || 0,
    skills,
    preferredWorkType: data.preferredWorkType || 'Flexible / Gig',
    expectedDailyWage: Number(data.expectedDailyWage) || 0,
    availability: data.availability || 'AVAILABLE',
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((cert: any, index: number) => ({
          id: `demo_cert_${index}`,
          skill: cert.skill || skills[0],
          name: cert.name || '',
          organization: cert.organization || '',
          year: cert.year || '',
          certificateFileName: cert.certificateFileName,
          verified: false
        }))
      : [],
    identityVerification: {
      idType: data.identityDocType || 'Aadhaar',
      maskedNumber,
      verified: false,
      submittedAt: now
    },
    emergencyContact: data.emergencyContact || { name: '', phone: '', relation: '' },
    preferredRadiusKm: Number(data.preferredRadiusKm) || 10,
    languages: Array.isArray(data.languages) ? data.languages : ['Hindi', 'English'],
    bio: data.bio || `${skills.join(', ')} professional with ${Number(data.experienceYears) || 0} years of experience.`,
    workExperienceSummary: data.workExperienceSummary || `Specializing in ${skills.join(', ')}.`,
    profileCompleteness: 100,
    badges: {
      identityVerified: false,
      skillVerified: false,
      certificateVerified: false
    },
    rating: 0,
    ratingCount: 0,
    totalJobsCompleted: 0,
    trustScore: 35,
    createdAt: now,
    updatedAt: now,
    totalEarnings: 0
  } as WorkerProfile & { totalEarnings: number };

  return {
    token: `demo-worker-token-${Date.now()}`,
    user,
    workerProfile: profile
  };
}

export const api = {
  // Auth
  registerWorker: async (data: any) => {
    try {
      const result = await fetchApi<{ token: string; user: User; workerProfile: WorkerProfile }>('/api/auth/register-worker', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { ...result, workerProfile: normalizeWorkerProfile(result.workerProfile)! };
    } catch (err) {
      console.warn('Worker registration API unavailable; using demo profile.', err);
      return createDemoWorkerRegistration(data);
    }
  },

  registerCustomer: (data: any) =>
    fetchApi<{ token: string; user: User; customerProfile: CustomerProfile }>('/api/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  login: (data: { identifier: string; password: string; expectedRole?: string }) =>
    fetchApi<{ token: string; user: User; profile: WorkerProfile | CustomerProfile | null }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getMe: () =>
    fetchApi<{ user: User; profile: WorkerProfile | CustomerProfile | null }>('/api/auth/me'),

  getCurrentUser: () =>
    fetchApi<{ user: User; profile: WorkerProfile | CustomerProfile | null }>('/api/auth/me'),

  logout: async () => {
    try {
      await fetchApi<{ success: boolean }>('/api/auth/logout', { method: 'POST' });
    } finally {
      clearAuthToken();
    }
  },

  // Worker Profile endpoints
  getWorkerProfile: async () => {
    const me = await fetchApi<{ user: User; profile: WorkerProfile | null }>('/api/auth/me');
    return normalizeWorkerProfile(me.profile);
  },

  getCustomerProfile: async () => {
    const me = await fetchApi<{ user: User; profile: CustomerProfile | null }>('/api/auth/me');
    return me.profile;
  },

  getWorkers: (params?: { skill?: string; location?: string; pincode?: string; availabilityOnly?: boolean }) => {
    const q = new URLSearchParams();
    if (params?.skill) q.append('skill', params.skill);
    if (params?.location) q.append('location', params.location);
    if (params?.pincode) q.append('pincode', params.pincode);
    if (params?.availabilityOnly) q.append('availabilityOnly', 'true');
    return fetchApi<WorkerProfile[]>(`/api/workers?${q.toString()}`);
  },

  searchWorkers: async (params?: {
    skill?: string;
    location?: string;
    pincode?: string;
    availability?: string;
    verifiedOnly?: boolean;
    maxWage?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.skill) q.append('skill', params.skill);
    if (params?.location) q.append('location', params.location);
    if (params?.pincode) q.append('pincode', params.pincode);
    if (params?.availability === 'AVAILABLE') q.append('availabilityOnly', 'true');

    const list = await fetchApi<WorkerProfile[]>(`/api/workers?${q.toString()}`);
    let filtered = list;
    if (params?.verifiedOnly) {
      filtered = filtered.filter((w) => w.badges.identityVerified || w.badges.skillVerified);
    }
    if (params?.maxWage) {
      filtered = filtered.filter((w) => w.expectedDailyWage <= params.maxWage!);
    }
    return filtered;
  },

  getWorkerById: (id: string) => fetchApi<WorkerProfile>(`/api/workers/${id}`),

  updateWorkerAvailability: (availability: WorkerProfile['availability']) =>
    fetchApi<WorkerProfile>('/api/workers/me/availability', {
      method: 'PUT',
      body: JSON.stringify({ availability })
    }),

  updateWorkerProfile: (data: Partial<WorkerProfile>) =>
    fetchApi<WorkerProfile>('/api/workers/me/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  getFinancialSnapshot: () =>
    fetchApi<FinancialSnapshot>('/api/workers/me/financial-snapshot'),

  getWorkerEarnings: () =>
    fetchApi<{
      dailyEarnings: number;
      weeklyEarnings: number;
      monthlyEarnings: number;
      totalWorkingDays: number;
      pendingAmount: number;
      paidAmount: number;
      monthlyTrends: { month: string; earnings: number; days: number }[];
      recentRecords: WorkDayRecord[];
    }>('/api/workers/me/earnings'),

  getWorkDays: () => fetchApi<WorkDayRecord[]>('/api/workers/me/work-days'),

  logWorkDay: (data: {
    date: string;
    workType: string;
    customerOrJob: string;
    dailyWage: number;
    paymentStatus: 'PAID' | 'PENDING';
    notes?: string;
  }) =>
    fetchApi<WorkDayRecord>('/api/workers/me/work-days', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteWorkDay: (id: string) =>
    fetchApi<{ success: boolean }>(`/api/workers/me/work-days/${id}`, {
      method: 'DELETE'
    }),

  getWorkerProtection: () =>
    fetchApi<InsuranceContributionSummary>('/api/workers/me/protection'),

  getWellBeingAlerts: () =>
    fetchApi<WellBeingAlert[]>('/api/workers/me/well-being-alerts'),

  // Jobs
  getJobs: () => fetchApi<JobRequest[]>('/api/jobs'),

  getWorkerJobs: () => fetchApi<JobRequest[]>('/api/jobs'),

  getCustomerJobs: () => fetchApi<JobRequest[]>('/api/jobs'),

  createJobRequest: (data: {
    workerId: string;
    serviceRequested?: string;
    serviceType?: string;
    description: string;
    serviceAddress?: string;
    location?: string;
    pincode?: string;
    scheduledDate?: string;
    preferredDate?: string;
    scheduledTimeSlot?: string;
    preferredTime?: string;
    durationDays?: number;
    offeredAmount?: number;
    estimatedBudget?: number;
    customerContact?: string;
    matchReasons?: string[];
  }) =>
    fetchApi<JobRequest>('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateJobStatus: (id: string, status: JobStatus, ratingDetails?: { rating: number; review?: string }) =>
    fetchApi<JobRequest>(`/api/jobs/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, ...ratingDetails })
    }),

  acceptJob: (jobId: string) =>
    fetchApi<JobRequest>(`/api/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'ACCEPTED' })
    }),

  declineJob: (jobId: string) =>
    fetchApi<JobRequest>(`/api/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'REJECTED' })
    }),

  completeJob: (jobId: string) =>
    fetchApi<JobRequest>(`/api/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'COMPLETED' })
    }),

  payJob: (jobId: string, details?: { rating?: number; feedback?: string }) =>
    fetchApi<JobRequest>(`/api/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'PAID',
        rating: details?.rating,
        review: details?.feedback
      })
    }),

  toggleSavedWorker: (workerId: string) =>
    fetchApi<{ savedWorkers: string[] }>(`/api/customers/saved-workers/${workerId}`, {
      method: 'POST'
    }),

  // Admin
  getAdminOverview: () => fetchApi<AdminOverviewStats>('/api/admin/overview'),

  getAdminStats: async () => {
    const stats = await fetchApi<AdminOverviewStats>('/api/admin/overview');
    return {
      ...stats,
      totalEarningsTransacted: stats.totalPlatformTransactions,
      socialSecurityPoolTotal: stats.totalInsuranceContributions
    };
  },

  getAdminWorkers: () => fetchApi<WorkerProfile[]>('/api/admin/workers'),

  getAdminCustomers: () => fetchApi<CustomerProfile[]>('/api/admin/customers'),

  getAdminJobs: () => fetchApi<JobRequest[]>('/api/admin/jobs'),

  getAdminVerifications: () => fetchApi<VerificationItem[]>('/api/admin/verifications'),

  reviewVerification: (id: string, status: 'APPROVED' | 'REJECTED') =>
    fetchApi<VerificationItem>(`/api/admin/verifications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ status })
    }),

  verifyWorker: (workerId: string, badgeType: 'identity' | 'skill' | 'certificate') =>
    fetchApi<WorkerProfile>(`/api/admin/workers/${workerId}/verify-badge`, {
      method: 'POST',
      body: JSON.stringify({ badgeType })
    }),

  toggleWorkerStatus: (workerId: string) =>
    fetchApi<{ success: boolean; newStatus: string }>(`/api/admin/workers/${workerId}/toggle-status`, {
      method: 'POST'
    })
};