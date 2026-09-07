import { 
  Complaint, 
  WelfareScheme, 
  WelfareClaim, 
  DemandForecastItem, 
  CooperativeInfo 
} from '../types';
import { 
  MOCK_COMPLAINTS, 
  MOCK_WELFARE_SCHEMES, 
  MOCK_WELFARE_CLAIMS, 
  MOCK_DEMAND_FORECAST,
  MOCK_COOPERATIVES 
} from '../data/mockData';
import { simulatedLatency } from './apiClient';

let complaintsStore: Complaint[] = [...MOCK_COMPLAINTS];
let welfareClaimsStore: WelfareClaim[] = [...MOCK_WELFARE_CLAIMS];

export const adminService = {
  async getCooperatives(): Promise<CooperativeInfo[]> {
    return simulatedLatency(MOCK_COOPERATIVES, 200);
  },

  async getWelfareSchemes(): Promise<WelfareScheme[]> {
    return simulatedLatency(MOCK_WELFARE_SCHEMES, 150);
  },

  async getWelfareClaims(): Promise<WelfareClaim[]> {
    return simulatedLatency([...welfareClaimsStore], 200);
  },

  async updateWelfareClaimStatus(
    claimId: string, 
    status: WelfareClaim['status'], 
    remarks?: string
  ): Promise<WelfareClaim> {
    const index = welfareClaimsStore.findIndex((c) => c.id === claimId);
    if (index === -1) throw new Error('Claim not found');
    welfareClaimsStore[index] = {
      ...welfareClaimsStore[index],
      status,
      remarks: remarks || welfareClaimsStore[index].remarks,
      approvalDate: status === 'Approved' || status === 'Disbursed' ? new Date().toISOString().split('T')[0] : undefined
    };
    return simulatedLatency(welfareClaimsStore[index], 200);
  },

  async getComplaints(): Promise<Complaint[]> {
    return simulatedLatency([...complaintsStore], 200);
  },

  async updateComplaintStatus(
    complaintId: string, 
    status: Complaint['status'], 
    resolutionNotes?: string
  ): Promise<Complaint> {
    const index = complaintsStore.findIndex((c) => c.id === complaintId);
    if (index === -1) throw new Error('Complaint not found');
    complaintsStore[index] = {
      ...complaintsStore[index],
      status,
      resolutionNotes: resolutionNotes || complaintsStore[index].resolutionNotes
    };
    return simulatedLatency(complaintsStore[index], 200);
  },

  async getDemandForecast(): Promise<DemandForecastItem[]> {
    return simulatedLatency(MOCK_DEMAND_FORECAST, 250);
  }
};
