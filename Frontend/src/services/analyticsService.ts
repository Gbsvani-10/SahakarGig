import { simulatedLatency } from './apiClient';

export interface PlatformAnalytics {
  totalWorkers: number;
  activeWorkers: number;
  jobsToday: number;
  completedJobsTotal: number;
  pendingJobs: number;
  averageRating: number;
  grossTransactionValue: number;
  workerWelfareDisbursed: number;
  cooperativePartnersCount: number;
  monthlyTrends: {
    month: string;
    bookings: number;
    workerEarnings: number;
  }[];
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

export const analyticsService = {
  async getPlatformStats(): Promise<PlatformAnalytics> {
    const stats: PlatformAnalytics = {
      totalWorkers: 1250,
      activeWorkers: 980,
      jobsToday: 436,
      completedJobsTotal: 382,
      pendingJobs: 54,
      averageRating: 4.8,
      grossTransactionValue: 1485000,
      workerWelfareDisbursed: 420000,
      cooperativePartnersCount: 85,
      monthlyTrends: [
        { month: 'Apr', bookings: 290, workerEarnings: 104400 },
        { month: 'May', bookings: 340, workerEarnings: 122400 },
        { month: 'Jun', bookings: 380, workerEarnings: 136800 },
        { month: 'Jul', bookings: 410, workerEarnings: 147600 },
        { month: 'Aug', bookings: 460, workerEarnings: 165600 },
        { month: 'Sep', bookings: 510, workerEarnings: 183600 }
      ],
      categoryDistribution: [
        { category: 'Plumbing', count: 320, percentage: 26 },
        { category: 'Electrician', count: 280, percentage: 22 },
        { category: 'Cleaner', count: 240, percentage: 19 },
        { category: 'Caregiver', count: 150, percentage: 12 },
        { category: 'Technician', count: 140, percentage: 11 },
        { category: 'Carpenter & Others', count: 120, percentage: 10 }
      ]
    };
    return simulatedLatency(stats, 200);
  }
};
