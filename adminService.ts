import { Complaint, WelfareScheme, WelfareClaim, DemandForecastItem, CooperativeInfo } from '../types';
import { apiRequest } from './apiClient';

export const adminService = {
  async getCooperatives(): Promise<CooperativeInfo[]> {
    const response = await apiRequest<CooperativeInfo[]>('/cooperatives');
    return Array.isArray(response.data) ? response.data : [];
  },

  async getWelfareSchemes(): Promise<WelfareScheme[]> {
    const response = await apiRequest<WelfareScheme[]>('/welfare/schemes');
    return Array.isArray(response.data) ? response.data : [];
  },

  async getWelfareClaims(): Promise<WelfareClaim[]> {
    const response = await apiRequest<WelfareClaim[]>('/welfare/claims');
    return Array.isArray(response.data) ? response.data : [];
  },

  async updateWelfareClaimStatus(claimId:string,status:WelfareClaim['status'],remarks?:string):Promise<WelfareClaim>{
    const response=await apiRequest<WelfareClaim>(`/welfare/claims/${encodeURIComponent(claimId)}/status`,{method:'PATCH',body:JSON.stringify({status,remarks})});
    return response.data;
  },

  async getComplaints():Promise<Complaint[]>{
    const response=await apiRequest<Complaint[]>('/complaints');
    return Array.isArray(response.data)?response.data:[];
  },

  async updateComplaintStatus(complaintId:string,status:Complaint['status'],resolutionNotes?:string):Promise<Complaint>{
    const response=await apiRequest<Complaint>(`/complaints/${encodeURIComponent(complaintId)}/status`,{method:'PATCH',body:JSON.stringify({status,resolutionNotes})});
    return response.data;
  },

  async getDemandForecast():Promise<DemandForecastItem[]>{
    const response=await apiRequest<DemandForecastItem[]>('/admin/ai/demand-forecast',{method:'POST'});
    return Array.isArray(response.data)?response.data:[];
  }
};
