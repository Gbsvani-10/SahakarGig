export type UserRole = 'customer' | 'worker' | 'admin' | 'guest';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  cooperativeId?: string;
  cooperativeName?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  joinedDate?: string;
}

export interface CooperativeInfo {
  id: string;
  name: string;
  registrationNumber: string;
  district?: string;
  state: string;
  city?: string;
  address?: string;
  establishedYear?: number;
  affiliatedFederation?: string;
  totalMembers?: number;
  totalWorkers?: number;
  activeWorkers?: number;
  completedJobs?: number;
  welfareFundBalance?: number;
  verificationStatus?: string;
  serviceCategories?: string[];
  bylawsDocumentUrl?: string;
  presidentName?: string;
  secretaryName?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  rating?: number;
}

export type ServiceCategory = 
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Painter'
  | 'Cleaner'
  | 'Domestic Helper'
  | 'Caregiver'
  | 'Driver'
  | 'Gardener'
  | 'Technician';

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  iconName: string;
  basePrice: number;
  priceRange: string;
  durationMinutes: number;
  popular?: boolean;
  emergencyAvailable?: boolean;
  inclusions: string[];
}

export interface WorkerSkill {
  id: string;
  category: ServiceCategory;
  name: string;
  yearsExperience: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  certifiedBy?: string;
}

export interface WorkerCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  expiryDate?: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  certificateNumber: string;
  documentUrl?: string;
}

export interface WeeklyScheduleDay {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  enabled: boolean;
  start: string;
  end: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl: string;
  primaryCategory: ServiceCategory;
  cooperativeId: string;
  cooperativeName: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  verificationStatus: 'Verified' | 'Pending' | 'Suspended';
  isAvailable: boolean;
  availabilityStatus: 'Available' | 'Busy' | 'Offline';
  emergencyAvailable: boolean;
  distanceKm: number;
  serviceArea: string;
  hourlyRate: number;
  priceRange: string;
  skills: WorkerSkill[];
  certifications: WorkerCertification[];
  schedule: WeeklyScheduleDay[];
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
  welfareStatus: {
    insuranceActive: boolean;
    policyNumber: string;
    validUntil: string;
    schemeName: string;
  };
}

export type BookingStatus =
  | 'Booking Requested'
  | 'Booked'
  | 'Worker Assigned'
  | 'Worker Accepted'
  | 'Worker On The Way'
  | 'On the Way'
  | 'Arrived'
  | 'Service Started'
  | 'In Progress'
  | 'Service Completed'
  | 'Payment Completed'
  | 'Cancelled';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerAvatar?: string;
  cooperativeName: string;
  serviceCategory: ServiceCategory;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  description?: string;
  notes?: string;
  isEmergency: boolean;
  estimatedPrice?: number;
  finalPrice?: number;
  baseAmount?: number;
  welfareFee?: number;
  platformFee?: number;
  totalAmount?: number;
  status?: BookingStatus;
  statusTimeline: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
  paymentStatus?: 'Pending' | 'Paid' | 'Refunded';
  paymentMethod?: 'UPI' | 'Card' | 'Net Banking' | 'Cash to Cooperative Agent';
  transactionId?: string;
  invoiceId?: string;
  otp?: string;
  createdAt: string;
}

export type Worker = WorkerProfile;

export type Cooperative = CooperativeInfo & {
  city?: string;
  totalWorkers?: number;
  completedJobs?: number;
  welfareFundBalance?: number;
  verificationStatus?: string;
  serviceCategories?: string[];
  bylawsDocumentUrl?: string;
  presidentName?: string;
  secretaryName?: string;
  contactEmail?: string;
  address?: string;
};

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  rating: number;
  comment: string;
  date: string;
  serviceCategory: ServiceCategory;
}

export interface WelfareScheme {
  id: string;
  name: string;
  type: 'Insurance' | 'Health' | 'Pension' | 'Education' | 'Tool Subsidy';
  provider: string;
  description: string;
  coverageAmount: string;
  eligibility: string;
  subsidyPercentage: number;
  status: 'Active' | 'Upcoming';
}

export interface WelfareClaim {
  id: string;
  workerId: string;
  workerName: string;
  schemeId: string;
  schemeName: string;
  claimAmount: number;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Disbursed' | 'Rejected';
  submissionDate: string;
  approvalDate?: string;
  remarks?: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  workerId: string;
  workerName: string;
  category: 'Quality of Work' | 'Pricing Issue' | 'Worker Delay' | 'Behavior' | 'Cancellation';
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  description: string;
  createdAt: string;
  resolutionNotes?: string;
}

export interface DemandForecastItem {
  service: ServiceCategory;
  currentDemandScore: number;
  forecastDemandScore: number;
  percentageChange: number;
  projectedWorkersNeeded: number;
  availableWorkers: number;
  shortfallOrSurplus: number;
  seasonalTrendNote: string;
  priorityAction: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'booking' | 'payment' | 'emergency' | 'verification' | 'welfare' | 'system';
  linkTo?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  workerPayout: number;
  cooperativeFee: number;
  platformFee: number;
  customerName: string;
  workerName: string;
  serviceCategory: ServiceCategory;
  date: string;
  createdAt?: string;
  status: 'Successful' | 'Pending' | 'Failed';
  paymentMethod: string;
}
