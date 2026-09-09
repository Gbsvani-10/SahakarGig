import {
  WorkerProfile,
  WorkerInsuranceRecord,
  ContributionHistoryItem,
  ClaimRequest,
  ContributionAmount,
} from '../types';

const TOKEN_STORAGE_KEY = 'sahakargig_session_token';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMsg = 'Network request failed';
      try {
        const body = await response.json();
        if (body.error) errorMsg = body.error;
      } catch {
        errorMsg = response.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return response.json();
  }

  // Get current authenticated worker profile
  public async getWorkerProfile(): Promise<WorkerProfile> {
    const res = await this.request<{ worker: WorkerProfile }>('/api/worker/me');
    return res.worker;
  }

  // Get list of test workers for quick switching
  public async getWorkerList(): Promise<{ id: string; workerId: string; name: string; occupation: string; dailyEarnings: number | null }[]> {
    const res = await this.request<{ workers: { id: string; workerId: string; name: string; occupation: string; dailyEarnings: number | null }[] }>('/api/auth/workers');
    return res.workers;
  }

  // Login / switch active worker session
  public async loginAsWorker(userId: string): Promise<{ token: string; user: { id: string; workerId: string; name: string } }> {
    const res = await this.request<{ token: string; user: { id: string; workerId: string; name: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    this.setToken(res.token);
    return res;
  }

  // Logout
  public async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  // Get insurance status
  public async getInsuranceRecord(): Promise<{ insurance: WorkerInsuranceRecord | null; status: string }> {
    return this.request<{ insurance: WorkerInsuranceRecord | null; status: string }>('/api/insurance/me');
  }

  // Confirm enrollment
  public async enrollInsurance(selectedContribution: ContributionAmount, consent: boolean): Promise<WorkerInsuranceRecord> {
    const res = await this.request<{ message: string; insurance: WorkerInsuranceRecord }>('/api/insurance/enroll', {
      method: 'POST',
      body: JSON.stringify({ selectedContribution, consent }),
    });
    return res.insurance;
  }

  // Adjust daily contribution
  public async adjustContribution(
    newContribution: ContributionAmount,
    reason: string,
    confirmed: boolean
  ): Promise<WorkerInsuranceRecord> {
    const res = await this.request<{ message: string; insurance: WorkerInsuranceRecord }>('/api/insurance/adjust', {
      method: 'POST',
      body: JSON.stringify({ newContribution, reason, confirmed }),
    });
    return res.insurance;
  }

  // Get contribution history
  public async getContributionHistory(): Promise<ContributionHistoryItem[]> {
    const res = await this.request<{ history: ContributionHistoryItem[] }>('/api/insurance/history');
    return res.history;
  }

  // Get claims
  public async getClaims(): Promise<ClaimRequest[]> {
    const res = await this.request<{ claims: ClaimRequest[] }>('/api/insurance/claims');
    return res.claims;
  }

  // Submit claim
  public async submitClaim(claimData: {
    claimType: string;
    incidentDate: string;
    hospitalOrClinic: string;
    description: string;
    contactNumber: string;
    documentsAttached?: string[];
  }): Promise<ClaimRequest> {
    const res = await this.request<{ message: string; claim: ClaimRequest }>('/api/insurance/claims', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
    return res.claim;
  }
}

export const api = new ApiClient();
