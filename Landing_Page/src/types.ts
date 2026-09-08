export type UserRole = 'WORKER' | 'CUSTOMER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  mobile: string;
  role: UserRole;
  name: string;
  status: UserStatus;
  createdAt: string;
}

export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE' | 'THIS_WEEK' | 'CURRENTLY_WORKING';
export type WorkTypePreference = 'Full-time' | 'Part-time' | 'Flexible / Gig';

export interface SkillCertification {
  id: string;
  skill: string;
  name: string;
  organization: string;
  year: string;
  certificateFileName?: string;
  verified: boolean;
  reviewedAt?: string;
}

export interface IdentityVerification {
  idType: 'Aadhaar' | 'Voter ID' | 'PAN Card';
  maskedNumber: string; // e.g. "XXXX-XXXX-8921"
  verified: boolean;
  submittedAt: string;
  reviewedAt?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  pincode: string;
  preferredArea: string;
  jobType: string;
  experienceYears: number;
  skills: string[];
  preferredWorkType: WorkTypePreference;
  expectedDailyWage: number;
  availability: AvailabilityStatus;
  certifications: SkillCertification[];
  identityVerification: IdentityVerification;
  profilePhoto?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  preferredRadiusKm: number;
  languages: string[];
  bio: string;
  workExperienceSummary: string;
  profileCompleteness: number; // percentage 0 - 100
  badges: {
    identityVerified: boolean;
    skillVerified: boolean;
    certificateVerified: boolean;
  };
  rating: number; // 0 - 5
  ratingCount: number;
  totalJobsCompleted: number;
  trustScore: number; // 0 - 100 transparently calculated
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  address: string;
  pincode: string;
  preferredServiceArea: string;
  commonServicesRequired: string[];
  profilePhoto?: string;
  savedWorkers: string[]; // worker IDs
  createdAt: string;
}

export type JobStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAYMENT_PENDING'
  | 'PAID';

export interface JobRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  workerId: string;
  workerName: string;
  workerSkill: string;
  serviceType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  estimatedBudget: number;
  status: JobStatus;
  matchReasons?: string[];
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  paidAt?: string;
  rating?: number;
  review?: string;
}

export interface WorkDayRecord {
  id: string;
  workerId: string;
  date: string; // YYYY-MM-DD
  workType: string;
  customerOrJob: string;
  dailyWage: number;
  paymentStatus: 'PAID' | 'PENDING';
  jobId?: string;
  notes?: string;
  createdAt: string;
}

export interface WorkerProtectionConfig {
  dailyContributionRate: number; // e.g. 10 (₹10/working day)
  accidentCoverageAmount: number; // e.g. 200000 (₹2 Lakhs)
  emergencySupportAmount: number; // e.g. 15000 (₹15,000)
  hospitalCashDaily: number; // e.g. 500 (₹500/day)
}

export interface InsuranceContributionSummary {
  workerId: string;
  month: string; // YYYY-MM
  actualWorkingDays: number;
  dailyContributionRate: number;
  totalContribution: number;
  isEligible: boolean;
  eligibilityReason: string;
  coverageStatus: 'ACTIVE' | 'NEEDS_WORK_DAYS' | 'INACTIVE';
  breakdown: {
    accidentCover: number;
    emergencySupport: number;
    hospitalCash: number;
  };
}

export interface VerificationItem {
  id: string;
  workerId: string;
  workerName: string;
  workerMobile: string;
  type: 'PROFILE' | 'SKILL' | 'CERTIFICATE';
  title: string;
  detail: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
}

export interface FinancialSnapshot {
  month: string;
  workingDays: number;
  estimatedIncome: number;
  insuranceContribution: number;
  pendingPayments: number;
  paidPayments: number;
  netExpectedAmount: number;
}

export interface WellBeingAlert {
  id: string;
  type: 'INFO' | 'SUPPORT' | 'POSITIVE';
  title: string;
  message: string;
  metricDetails?: string;
}

export interface SmartMatchResult {
  worker: WorkerProfile;
  score: number;
  whyThisMatch: string[];
}

export interface AdminOverviewStats {
  totalWorkers: number;
  activeWorkers: number;
  totalCustomers: number;
  activeJobs: number;
  completedJobs: number;
  pendingVerifications: number;
  totalPlatformTransactions: number;
  totalInsuranceContributions: number;
  totalPendingPayments: number;
}
