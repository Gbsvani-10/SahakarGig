export interface InsuranceWorker {
  id?: string | number;
  userId?: string | number;
  name?: string;
  fullName?: string;
  dailyEarnings?: number | null;
  expectedDailyWage?: number | null;
  phone?: string | null;
  email?: string | null;
  skills?: string[];
}

export interface InsuranceRecord {
  id?: string | number;
  status?: string;
  selectedContribution?: number | null;
  tier?: string | null;
  reference?: string | null;
  policy?: string | null;
  enrolledAt?: string | null;
  consent?: boolean;
  coverageDetails?: Record<string, unknown> | null;
}

export interface ContributionHistoryItem {
  id?: string | number;
  amount?: number;
  contributionAmount?: number;
  date?: string;
  status?: string;
}

export interface InsuranceClaim {
  id?: string | number;
  claimType?: string;
  description?: string;
  status?: string;
  amount?: number | null;
  createdAt?: string;
}
