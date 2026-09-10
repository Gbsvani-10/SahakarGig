
export type ContributionAmount = 10 | 20 | 30;

export interface WorkerProfile {
  id?: string | number;
  userId?: string | number;

  name?: string;
  fullName?: string;

  workerId?: string | null;
  occupation?: string | null;
  employer?: string | null;
  location?: string | null;

  dailyEarnings?: number | null;
  expectedDailyWage?: number | null;
  estimatedMonthlyEarnings?: number | null;
  estimatedWorkingDays?: number | null;

  phone?: string | null;
  email?: string | null;

  skills?: string[];

  availability?: string | null;
  experienceYears?: number | null;
}

export interface InsuranceWorker extends WorkerProfile {}

export interface InsuranceRecord {
  id?: string | number;

  status?: string | null;

  selectedContribution?: ContributionAmount | null;

  tier?: string | null;

  reference?: string | null;
  referenceCode?: string | null;

  policy?: string | null;

  enrolledAt?: string | null;

  consent?: boolean;

  coverageDetails?: Record<string, unknown> | null;
}

export interface ContributionHistoryItem {
  id?: string | number;

  amount?: number | null;
  contributionAmount?: number | null;

  date?: string | null;
  status?: string | null;
}

export interface InsuranceClaim {
  id?: string | number;

  claimType?: string | null;
  description?: string | null;

  status?: string | null;

  amount?: number | null;

  createdAt?: string | null;
}
