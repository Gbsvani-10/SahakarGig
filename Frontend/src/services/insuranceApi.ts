const getToken = () =>
  localStorage.getItem("sahakar_auth_token") ||
  localStorage.getItem("sahakargig_token") ||
  "";

const request = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
};

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

export const insuranceApi = {
  async getWorkerProfile(): Promise<InsuranceWorker> {
    return request<InsuranceWorker>("/api/insurance/worker");
  },

  async getInsuranceRecord(): Promise<InsuranceRecord | null> {
    return request<InsuranceRecord | null>("/api/insurance/record");
  },

  async getContributionHistory(): Promise<ContributionHistoryItem[]> {
    return request<ContributionHistoryItem[]>("/api/insurance/contributions");
  },

  async enrollInsurance(
    contribution: number,
    consent: boolean
  ): Promise<InsuranceRecord> {
    return request<InsuranceRecord>("/api/insurance/enroll", {
      method: "POST",
      body: JSON.stringify({
        selectedContribution: contribution,
        consent,
      }),
    });
  },

  async adjustContribution(
    contribution: number
  ): Promise<InsuranceRecord> {
    return request<InsuranceRecord>("/api/insurance/adjust", {
      method: "POST",
      body: JSON.stringify({
        selectedContribution: contribution,
      }),
    });
  },

  async getClaims(): Promise<InsuranceClaim[]> {
    return request<InsuranceClaim[]>("/api/insurance/claims");
  },

  async createClaim(data: {
    claimType: string;
    description: string;
    amount?: number;
  }): Promise<InsuranceClaim> {
    return request<InsuranceClaim>("/api/insurance/claims", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export default insuranceApi;
