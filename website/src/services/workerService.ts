import { WorkerProfile, WorkerSkill, WorkerCertification, WeeklyScheduleDay } from '../types';
import { MOCK_WORKERS } from '../data/mockData';
import { simulatedLatency } from './apiClient';

let workersStore: WorkerProfile[] = [...MOCK_WORKERS];

export const workerService = {
  async getAllWorkers(): Promise<WorkerProfile[]> {
    return simulatedLatency([...workersStore], 200);
  },

  async getWorkerById(id: string): Promise<WorkerProfile | undefined> {
    const worker = workersStore.find((w) => w.id === id || w.userId === id);
    return simulatedLatency(worker, 150);
  },

  async getWorkersByCategory(category: string): Promise<WorkerProfile[]> {
    const filtered = workersStore.filter((w) => w.primaryCategory === category);
    return simulatedLatency(filtered, 200);
  },

  async updateAvailability(workerId: string, status: 'Available' | 'Busy' | 'Offline'): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');
    
    workersStore[index] = {
      ...workersStore[index],
      availabilityStatus: status,
      isAvailable: status === 'Available'
    };
    return simulatedLatency(workersStore[index], 150);
  },

  async updateSchedule(workerId: string, schedule: WeeklyScheduleDay[]): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    workersStore[index] = {
      ...workersStore[index],
      schedule
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async addSkill(workerId: string, skill: Omit<WorkerSkill, 'id' | 'verificationStatus'>): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    const newSkill: WorkerSkill = {
      ...skill,
      id: `sk-${Date.now()}`,
      verificationStatus: 'Pending'
    };

    workersStore[index] = {
      ...workersStore[index],
      skills: [...workersStore[index].skills, newSkill]
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async addCertification(
    workerId: string, 
    cert: Omit<WorkerCertification, 'id' | 'verificationStatus'>
  ): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    const newCert: WorkerCertification = {
      ...cert,
      id: `cert-${Date.now()}`,
      verificationStatus: 'Pending'
    };

    workersStore[index] = {
      ...workersStore[index],
      certifications: [...workersStore[index].certifications, newCert]
    };
    return simulatedLatency(workersStore[index], 200);
  },

  async updateVerificationStatus(workerId: string, status: 'Verified' | 'Pending' | 'Suspended'): Promise<WorkerProfile> {
    const index = workersStore.findIndex((w) => w.id === workerId);
    if (index === -1) throw new Error('Worker not found');

    workersStore[index] = {
      ...workersStore[index],
      verificationStatus: status
    };
    return simulatedLatency(workersStore[index], 200);
  }
};
