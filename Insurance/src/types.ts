/**
 * Types and interfaces for SahakarGig Worker Welfare Micro-Insurance Module
 */

export type ContributionAmount = 5 | 10 | 20;

export type ProtectionTier = 'Basic' | 'Balanced' | 'Strong';

export type InsuranceStatus =
  | 'not_enrolled'
  | 'pending'
  | 'active'
  | 'expired'
  | 'suspended';

export interface WorkerProfile {
  id: string;
  workerId: string;
  name: string;
  mobile: string;
  occupation: string;
  employer: string | null;
  workStatus: string;
  location: string;
  badge: string;
  dailyEarnings: number | null;
  weeklyEarnings: number | null;
  monthlyEarnings: number | null;
  estimatedWorkingDays: number | null;
  estimatedMonthlyEarnings: number | null;
}

export interface WorkerInsuranceRecord {
  userId: string;
  workerId: string;
  status: InsuranceStatus;
  selectedContribution: ContributionAmount | null;
  estimatedMonthlyContribution: number | null;
  protectionTier: ProtectionTier | null;
  referenceCode: string | null;
  policyNumber: string | null;
  enrolledAt: string | null;
  nextContributionDate: string | null;
  coverageDetails: string | null;
  consent: boolean;
}

export interface ContributionOption {
  amount: ContributionAmount;
  tier: ProtectionTier;
  title: string;
  tagline: string;
  recommended?: boolean;
  color: string;
  lightBg: string;
  accentBorder: string;
  features: string[];
}

export interface ContributionHistoryItem {
  id: string;
  monthYear: string;
  amount: number;
  daysContributed: number;
  status: 'Completed' | 'Pending';
  date: string;
  receiptNumber: string;
}

export type ClaimType =
  | 'Accident'
  | 'Hospitalization'
  | 'Medical Emergency'
  | 'Other';

export type ClaimStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Additional Information Required';

export interface ClaimRequest {
  id: string;
  workerId: string;
  claimType: ClaimType;
  incidentDate: string;
  hospitalOrClinic: string;
  description: string;
  contactNumber: string;
  documentsAttached: string[];
  status: ClaimStatus;
  submittedAt: string;
  referenceCode: string;
}

export interface ProtectionBenefit {
  id: string;
  category: string;
  title: string;
  icon: string;
  descriptions: {
    [key in ContributionAmount]: string;
  };
  illustrativeBenefit: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Payments' | 'Claims' | 'Flexibility';
}

export interface AuthenticatedUser {
  id: string;
  workerId: string;
  name: string;
  token: string;
}
