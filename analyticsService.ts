import { apiRequest } from './apiClient';

export interface PlatformAnalytics { totalWorkers:number; activeWorkers:number; jobsToday:number; completedJobsTotal:number; pendingJobs:number; averageRating:number; grossTransactionValue:number; workerWelfareDisbursed:number; cooperativePartnersCount:number; monthlyTrends:{month:string;bookings:number;workerEarnings:number}[]; categoryDistribution:{category:string;count:number;percentage:number}[]; }

export const analyticsService={
  async getPlatformStats():Promise<PlatformAnalytics>{
    const response=await apiRequest<any>('/admin/metrics');
    const d=response.data;
    return {...d,monthlyTrends:[],categoryDistribution:[]};
  }
};
