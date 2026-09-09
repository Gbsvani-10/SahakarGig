import fs from 'fs';
import path from 'path';
import {
  WorkerProfile,
  WorkerInsuranceRecord,
  ContributionHistoryItem,
  ClaimRequest,
  ContributionAmount,
  ProtectionTier,
} from '../types';

export interface WorkerAccount {
  profile: WorkerProfile;
  insurance: WorkerInsuranceRecord | null;
  contributions: ContributionHistoryItem[];
  claims: ClaimRequest[];
}

export interface DatabaseSchema {
  workers: Record<string, WorkerAccount>;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'sahakargig_db.json');

// Helper to determine protection tier from contribution
function getTier(amount: ContributionAmount): ProtectionTier {
  if (amount === 5) return 'Basic';
  if (amount === 10) return 'Balanced';
  return 'Strong';
}

// Initial seed accounts for SahakarGig
const SEED_WORKERS: Record<string, WorkerAccount> = {
  usr_w101: {
    profile: {
      id: 'usr_w101',
      workerId: 'SG-9842-MUM',
      name: 'Sunita Devi',
      mobile: '9876543210',
      occupation: 'Domestic & Care Economy Worker',
      employer: 'Sahakar Urban Logistics Hub',
      workStatus: 'Active Partner',
      location: 'Kurla, Mumbai, MH',
      badge: 'Verified Daily Wage Partner',
      dailyEarnings: 240, // <= 250 -> recommended ₹5/day
      weeklyEarnings: 1440,
      monthlyEarnings: 5760,
      estimatedWorkingDays: 24,
      estimatedMonthlyEarnings: 5760,
    },
    insurance: {
      userId: 'usr_w101',
      workerId: 'SG-9842-MUM',
      status: 'active',
      selectedContribution: 5,
      estimatedMonthlyContribution: 120, // 5 * 24
      protectionTier: 'Basic',
      referenceCode: 'SG-INS-2026-5501',
      policyNumber: 'SG-MICROPOL-88319',
      enrolledAt: '2026-07-01T10:00:00.000Z',
      nextContributionDate: 'Tomorrow, 09:00 AM (deducted from verified daily wage)',
      coverageDetails:
        'Essential outpatient treatment assistance, first-aid clinic emergency transit, and phone support.',
      consent: true,
    },
    contributions: [
      {
        id: 'cnt_101_1',
        monthYear: 'September 2026',
        amount: 120,
        daysContributed: 24,
        status: 'Completed',
        date: '02 Sep 2026',
        receiptNumber: 'SG-RCP-2609-01',
      },
      {
        id: 'cnt_101_2',
        monthYear: 'August 2026',
        amount: 120,
        daysContributed: 24,
        status: 'Completed',
        date: '02 Aug 2026',
        receiptNumber: 'SG-RCP-2608-14',
      },
    ],
    claims: [],
  },
  usr_w102: {
    profile: {
      id: 'usr_w102',
      workerId: 'SG-7714-BLR',
      name: 'Rajesh Sharma',
      mobile: '9822334455',
      occupation: 'Last-Mile Delivery Partner',
      employer: 'Sahakar Quick Commerce',
      workStatus: 'Active Partner',
      location: 'Indiranagar, Bengaluru, KA',
      badge: 'Verified Gig Driver',
      dailyEarnings: 380, // 251-400 -> recommended ₹10/day
      weeklyEarnings: 2280,
      monthlyEarnings: 9880,
      estimatedWorkingDays: 26,
      estimatedMonthlyEarnings: 9880,
    },
    insurance: {
      userId: 'usr_w102',
      workerId: 'SG-7714-BLR',
      status: 'active',
      selectedContribution: 10,
      estimatedMonthlyContribution: 260, // 10 * 26
      protectionTier: 'Balanced',
      referenceCode: 'SG-INS-2026-7844',
      policyNumber: 'SG-MICROPOL-91042',
      enrolledAt: '2026-08-15T09:30:00.000Z',
      nextContributionDate: 'Tomorrow, 09:00 AM (deducted from verified daily wage)',
      coverageDetails:
        'Comprehensive accident & injury support, hospitalization bed allowance, and emergency family relief.',
      consent: true,
    },
    contributions: [
      {
        id: 'cnt_102_1',
        monthYear: 'September 2026',
        amount: 260,
        daysContributed: 26,
        status: 'Completed',
        date: '03 Sep 2026',
        receiptNumber: 'SG-RCP-2609-88',
      },
    ],
    claims: [],
  },
  usr_w103: {
    profile: {
      id: 'usr_w103',
      workerId: 'SG-6210-GGN',
      name: 'Vikram Singh',
      mobile: '9811223344',
      occupation: 'Logistics & Warehouse Executive',
      employer: 'Sahakar Freight & Hubs',
      workStatus: 'Active Partner',
      location: 'Udyog Vihar, Gurugram, HR',
      badge: 'Senior Warehouse Specialist',
      dailyEarnings: 520, // > 400 -> recommended ₹20/day
      weeklyEarnings: 3120,
      monthlyEarnings: 13520,
      estimatedWorkingDays: 26,
      estimatedMonthlyEarnings: 13520,
    },
    insurance: {
      userId: 'usr_w103',
      workerId: 'SG-6210-GGN',
      status: 'active',
      selectedContribution: 20,
      estimatedMonthlyContribution: 520, // 20 * 26
      protectionTier: 'Strong',
      referenceCode: 'SG-INS-2026-9201',
      policyNumber: 'SG-MICROPOL-99512',
      enrolledAt: '2026-06-10T11:00:00.000Z',
      nextContributionDate: 'Tomorrow, 09:00 AM (deducted from verified daily wage)',
      coverageDetails:
        'Higher protection tier covering extended hospital stay, specialty trauma consults, and emergency support.',
      consent: true,
    },
    contributions: [
      {
        id: 'cnt_103_1',
        monthYear: 'September 2026',
        amount: 520,
        daysContributed: 26,
        status: 'Completed',
        date: '04 Sep 2026',
        receiptNumber: 'SG-RCP-2609-42',
      },
    ],
    claims: [],
  },
  usr_w104: {
    profile: {
      id: 'usr_w104',
      workerId: 'SG-3195-JPR',
      name: 'Pooja Meena',
      mobile: '9899001122',
      occupation: 'Artisanal Packaging Worker',
      employer: 'Sahakar Craft Co-op',
      workStatus: 'New Registrant',
      location: 'Sanganer, Jaipur, RJ',
      badge: 'New Worker Member',
      dailyEarnings: null, // REAL-WORLD CASE: Earnings data not available!
      weeklyEarnings: null,
      monthlyEarnings: null,
      estimatedWorkingDays: null,
      estimatedMonthlyEarnings: null,
    },
    insurance: null, // REAL-WORLD CASE: Not enrolled!
    contributions: [], // REAL-WORLD CASE: No contribution history yet!
    claims: [],
  },
};

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to read from sahakargig_db.json, re-initializing seed data', e);
    }

    // Default initialization
    const initialData: DatabaseSchema = { workers: SEED_WORKERS };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write to sahakargig_db.json', e);
    }
  }

  public getWorkerListSafe(): { id: string; workerId: string; name: string; occupation: string; dailyEarnings: number | null }[] {
    return Object.values(this.data.workers).map((w) => ({
      id: w.profile.id,
      workerId: w.profile.workerId,
      name: w.profile.name,
      occupation: w.profile.occupation,
      dailyEarnings: w.profile.dailyEarnings,
    }));
  }

  public getWorkerById(userId: string): WorkerProfile | null {
    const worker = this.data.workers[userId];
    return worker ? worker.profile : null;
  }

  public getWorkerByWorkerId(workerId: string): WorkerProfile | null {
    const worker = Object.values(this.data.workers).find((w) => w.profile.workerId === workerId);
    return worker ? worker.profile : null;
  }

  public getInsurance(userId: string): WorkerInsuranceRecord | null {
    const worker = this.data.workers[userId];
    if (!worker) return null;
    return worker.insurance;
  }

  public enrollInsurance(
    userId: string,
    selectedContribution: ContributionAmount,
    consent: boolean
  ): WorkerInsuranceRecord {
    const worker = this.data.workers[userId];
    if (!worker) {
      throw new Error('Worker not found');
    }

    const workingDays = worker.profile.estimatedWorkingDays || 26;
    const monthlyContribution = selectedContribution * workingDays;
    const tier = getTier(selectedContribution);
    const refCode = `SG-INS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const polNum = `SG-MICROPOL-${Math.floor(10000 + Math.random() * 90000)}`;

    const newInsurance: WorkerInsuranceRecord = {
      userId,
      workerId: worker.profile.workerId,
      status: 'active',
      selectedContribution,
      estimatedMonthlyContribution: monthlyContribution,
      protectionTier: tier,
      referenceCode: refCode,
      policyNumber: polNum,
      enrolledAt: new Date().toISOString(),
      nextContributionDate: 'Tomorrow, 09:00 AM (deducted from verified daily wage)',
      coverageDetails:
        tier === 'Basic'
          ? 'Essential outpatient aid, accident emergency clinic transit, and 24/7 helpline guidance.'
          : tier === 'Balanced'
          ? 'Comprehensive accident and injury support, hospitalization bed allowance, and emergency family relief.'
          : 'Higher protection tier covering extended hospital stay, trauma care, specialist consults, and emergency support.',
      consent,
    };

    worker.insurance = newInsurance;
    this.saveData(this.data);
    return newInsurance;
  }

  public adjustInsurance(
    userId: string,
    newContribution: ContributionAmount,
    _reason: string
  ): WorkerInsuranceRecord {
    const worker = this.data.workers[userId];
    if (!worker || !worker.insurance) {
      throw new Error('No active insurance found to adjust');
    }

    const workingDays = worker.profile.estimatedWorkingDays || 26;
    const monthlyContribution = newContribution * workingDays;
    const tier = getTier(newContribution);

    worker.insurance.selectedContribution = newContribution;
    worker.insurance.estimatedMonthlyContribution = monthlyContribution;
    worker.insurance.protectionTier = tier;

    this.saveData(this.data);
    return worker.insurance;
  }

  public getContributions(userId: string): ContributionHistoryItem[] {
    const worker = this.data.workers[userId];
    if (!worker) return [];
    return worker.contributions;
  }

  public getClaims(userId: string): ClaimRequest[] {
    const worker = this.data.workers[userId];
    if (!worker) return [];
    return worker.claims;
  }

  public createClaim(
    userId: string,
    claimData: Omit<ClaimRequest, 'id' | 'workerId' | 'status' | 'submittedAt' | 'referenceCode'>
  ): ClaimRequest {
    const worker = this.data.workers[userId];
    if (!worker) {
      throw new Error('Worker not found');
    }

    const newClaim: ClaimRequest = {
      id: `clm_${Date.now()}`,
      workerId: worker.profile.workerId,
      claimType: claimData.claimType,
      incidentDate: claimData.incidentDate,
      hospitalOrClinic: claimData.hospitalOrClinic,
      description: claimData.description,
      contactNumber: claimData.contactNumber,
      documentsAttached: claimData.documentsAttached || [],
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      referenceCode: `SG-CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    worker.claims.unshift(newClaim);
    this.saveData(this.data);
    return newClaim;
  }
}

export const db = new DatabaseManager();
