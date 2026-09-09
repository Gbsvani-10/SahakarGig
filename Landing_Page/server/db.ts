import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  WorkerProfile,
  CustomerProfile,
  JobRequest,
  WorkDayRecord,
  VerificationItem,
  WorkerProtectionConfig,
  InsuranceContributionSummary,
  FinancialSnapshot,
  WellBeingAlert,
  SmartMatchResult,
  AdminOverviewStats
} from '../src/types.ts';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'sahakargig.json');

interface StoredUser extends User {
  passwordHash: string;
  salt: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  workers: WorkerProfile[];
  customers: CustomerProfile[];
  jobs: JobRequest[];
  workDays: WorkDayRecord[];
  verifications: VerificationItem[];
  sessions: { token: string; userId: string; expiresAt: number }[];
  protectionConfig: WorkerProtectionConfig;
}

const DEFAULT_PROTECTION_CONFIG: WorkerProtectionConfig = {
  dailyContributionRate: 10, // ₹10 per working day
  accidentCoverageAmount: 200000, // ₹2,00,000
  emergencySupportAmount: 15000, // ₹15,000
  hospitalCashDaily: 500 // ₹500/day
};

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, generatedSalt, 64).toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
  return calculated === hash;
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (!parsed.protectionConfig) {
          parsed.protectionConfig = DEFAULT_PROTECTION_CONFIG;
        }
        return parsed;
      }
    } catch (err) {
      console.error('Error reading database file, initializing fresh store:', err);
    }

    const initialData: DatabaseSchema = {
      users: [],
      workers: [],
      customers: [],
      jobs: [],
      workDays: [],
      verifications: [],
      sessions: [],
      protectionConfig: DEFAULT_PROTECTION_CONFIG
    };

    // Pre-authorized system admin account (Public sign-up is prohibited per requirements)
    const adminPassword = hashPassword('Admin@2026');
    const defaultAdmin: StoredUser = {
      id: 'admin_sys_01',
      email: 'admin@sahakargig.in',
      mobile: '9876543210',
      role: 'ADMIN',
      name: 'Sahakar System Admin',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      passwordHash: adminPassword.hash,
      salt: adminPassword.salt
    };
    initialData.users.push(defaultAdmin);

    this.saveDirect(initialData);
    return initialData;
  }

  private saveDirect(dataToSave: DatabaseSchema) {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  private save() {
    this.saveDirect(this.data);
  }

  // --- Auth & Users ---

  getUserByEmailOrMobile(identifier: string): StoredUser | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.data.users.find(
      (u) => u.email.toLowerCase() === clean || u.mobile === identifier.trim()
    );
  }

  getUserById(id: string): StoredUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(
    email: string,
    mobile: string,
    password: string,
    role: 'WORKER' | 'CUSTOMER',
    name: string
  ): StoredUser {
    const { hash, salt } = hashPassword(password);
    const newUser: StoredUser = {
      id: `${role.toLowerCase()}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      role,
      name: name.trim(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      salt
    };

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  validateCredentials(identifier: string, password: string): StoredUser | null {
    const user = this.getUserByEmailOrMobile(identifier);
    if (!user) return null;
    if (user.status === 'SUSPENDED') {
      throw new Error('Account has been suspended. Please contact administrator.');
    }
    const valid = verifyPassword(password, user.passwordHash, user.salt);
    return valid ? user : null;
  }

  createSession(userId: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    this.data.sessions.push({ token, userId, expiresAt });
    this.save();
    return token;
  }

  getUserBySession(token: string): StoredUser | null {
    const session = this.data.sessions.find((s) => s.token === token && s.expiresAt > Date.now());
    if (!session) return null;
    return this.getUserById(session.userId) || null;
  }

  removeSession(token: string) {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // --- Worker Profiles ---

  getWorkerByUserId(userId: string): WorkerProfile | undefined {
    return this.data.workers.find((w) => w.userId === userId);
  }

  getWorkerById(id: string): WorkerProfile | undefined {
    return this.data.workers.find((w) => w.id === id);
  }

  getAllWorkers(): WorkerProfile[] {
    return this.data.workers;
  }

  calculateTrustScore(profile: WorkerProfile): number {
    let score = Math.round(profile.profileCompleteness * 0.35); // up to 35
    if (profile.badges.identityVerified) score += 25;
    if (profile.badges.skillVerified) score += 20;
    if (profile.badges.certificateVerified) score += 10;
    const jobBonus = Math.min(10, profile.totalJobsCompleted * 2);
    score += jobBonus;
    return Math.min(100, Math.max(10, score));
  }

  calculateCompleteness(p: Partial<WorkerProfile>): number {
    let fields = 0;
    let total = 8;
    if (p.fullName && p.fullName.length > 2) fields++;
    if (p.mobile && p.mobile.length >= 10) fields++;
    if (p.address && p.address.length > 3) fields++;
    if (p.skills && p.skills.length > 0) fields++;
    if (p.expectedDailyWage && p.expectedDailyWage > 0) fields++;
    if (p.availability) fields++;
    if (p.identityVerification && p.identityVerification.maskedNumber) fields++;
    if (p.emergencyContact && p.emergencyContact.phone) fields++;
    return Math.round((fields / total) * 100);
  }

  createOrUpdateWorker(profileData: Partial<WorkerProfile> & { userId: string }): WorkerProfile {
    const existingIndex = this.data.workers.findIndex((w) => w.userId === profileData.userId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const existing = this.data.workers[existingIndex];
      const updated: WorkerProfile = {
        ...existing,
        ...profileData,
        updatedAt: now
      };
      updated.profileCompleteness = this.calculateCompleteness(updated);
      updated.trustScore = this.calculateTrustScore(updated);
      this.data.workers[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const completeness = this.calculateCompleteness(profileData);
      const newWorker: WorkerProfile = {
        id: `wrk_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        userId: profileData.userId,
        fullName: profileData.fullName || '',
        mobile: profileData.mobile || '',
        email: profileData.email || '',
        address: profileData.address || '',
        pincode: profileData.pincode || '',
        preferredArea: profileData.preferredArea || '',
        jobType: profileData.jobType || 'General Worker',
        experienceYears: profileData.experienceYears || 1,
        skills: profileData.skills || [],
        preferredWorkType: profileData.preferredWorkType || 'Flexible / Gig',
        expectedDailyWage: profileData.expectedDailyWage || 600,
        availability: profileData.availability || 'AVAILABLE',
        certifications: profileData.certifications || [],
        identityVerification: profileData.identityVerification || {
          idType: 'Aadhaar',
          maskedNumber: 'XXXX-XXXX-0000',
          verified: false,
          submittedAt: now
        },
        profilePhoto: profileData.profilePhoto,
        emergencyContact: profileData.emergencyContact || { name: '', phone: '', relation: '' },
        preferredRadiusKm: profileData.preferredRadiusKm || 10,
        languages: profileData.languages || ['Hindi', 'English'],
        bio: profileData.bio || '',
        workExperienceSummary: profileData.workExperienceSummary || '',
        profileCompleteness: completeness,
        badges: {
          identityVerified: false,
          skillVerified: false,
          certificateVerified: false
        },
        rating: 4.8,
        ratingCount: 1,
        totalJobsCompleted: 0,
        trustScore: 35,
        createdAt: now,
        updatedAt: now
      };
      newWorker.trustScore = this.calculateTrustScore(newWorker);
      this.data.workers.push(newWorker);

      // Create initial verification item for admin review
      this.data.verifications.push({
        id: `ver_${Date.now()}`,
        workerId: newWorker.id,
        workerName: newWorker.fullName,
        workerMobile: newWorker.mobile,
        type: 'PROFILE',
        title: 'New Worker Profile Onboarding',
        detail: `Worker ${newWorker.fullName} registered skills: ${newWorker.skills.join(', ')} with ${newWorker.identityVerification.idType} ID verification submitted.`,
        status: 'PENDING',
        submittedAt: now
      });

      this.save();
      return newWorker;
    }
  }

  updateWorkerAvailability(workerId: string, availability: WorkerProfile['availability']): WorkerProfile | null {
    const worker = this.getWorkerById(workerId);
    if (!worker) return null;
    worker.availability = availability;
    worker.updatedAt = new Date().toISOString();
    this.save();
    return worker;
  }

  // --- Customer Profiles ---

  getCustomerByUserId(userId: string): CustomerProfile | undefined {
    return this.data.customers.find((c) => c.userId === userId);
  }

  getCustomerById(id: string): CustomerProfile | undefined {
    return this.data.customers.find((c) => c.id === id);
  }

  getAllCustomers(): CustomerProfile[] {
    return this.data.customers;
  }

  createOrUpdateCustomer(profileData: Partial<CustomerProfile> & { userId: string }): CustomerProfile {
    const existingIndex = this.data.customers.findIndex((c) => c.userId === profileData.userId);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      const updated = {
        ...this.data.customers[existingIndex],
        ...profileData
      };
      this.data.customers[existingIndex] = updated;
      this.save();
      return updated;
    } else {
      const newCustomer: CustomerProfile = {
        id: `cust_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
        userId: profileData.userId,
        fullName: profileData.fullName || '',
        contactNumber: profileData.contactNumber || '',
        email: profileData.email || '',
        address: profileData.address || '',
        pincode: profileData.pincode || '',
        preferredServiceArea: profileData.preferredServiceArea || '',
        commonServicesRequired: profileData.commonServicesRequired || [],
        profilePhoto: profileData.profilePhoto,
        savedWorkers: [],
        createdAt: now
      };
      this.data.customers.push(newCustomer);
      this.save();
      return newCustomer;
    }
  }

  toggleSaveWorker(customerId: string, workerId: string): string[] {
    const customer = this.getCustomerById(customerId);
    if (!customer) return [];
    if (customer.savedWorkers.includes(workerId)) {
      customer.savedWorkers = customer.savedWorkers.filter((id) => id !== workerId);
    } else {
      customer.savedWorkers.push(workerId);
    }
    this.save();
    return customer.savedWorkers;
  }

  // --- Jobs & Service Requests ---

  createJobRequest(params: {
    customerId: string;
    workerId: string;
    serviceType: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    location: string;
    estimatedBudget: number;
    matchReasons?: string[];
  }): JobRequest {
    const customer = this.getCustomerById(params.customerId);
    const worker = this.getWorkerById(params.workerId);

    const newJob: JobRequest = {
      id: `job_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      customerId: params.customerId,
      customerName: customer?.fullName || 'Customer',
      customerContact: customer?.contactNumber || '',
      customerAddress: customer?.address || '',
      workerId: params.workerId,
      workerName: worker?.fullName || 'Worker',
      workerSkill: params.serviceType,
      serviceType: params.serviceType,
      description: params.description,
      preferredDate: params.preferredDate,
      preferredTime: params.preferredTime,
      location: params.location,
      estimatedBudget: params.estimatedBudget,
      status: 'REQUESTED',
      matchReasons: params.matchReasons || [],
      createdAt: new Date().toISOString()
    };

    this.data.jobs.push(newJob);
    this.save();
    return newJob;
  }

  updateJobStatus(
    jobId: string,
    newStatus: JobRequest['status'],
    ratingDetails?: { rating: number; review?: string }
  ): JobRequest | null {
    const job = this.data.jobs.find((j) => j.id === jobId);
    if (!job) return null;

    const now = new Date().toISOString();
    job.status = newStatus;

    if (newStatus === 'ACCEPTED') {
      job.acceptedAt = now;
    } else if (newStatus === 'COMPLETED') {
      job.completedAt = now;
      const worker = this.getWorkerById(job.workerId);
      if (worker) {
        worker.totalJobsCompleted += 1;
        worker.trustScore = this.calculateTrustScore(worker);
      }
    } else if (newStatus === 'PAID') {
      job.paidAt = now;
      if (ratingDetails) {
        job.rating = ratingDetails.rating;
        job.review = ratingDetails.review;
        const worker = this.getWorkerById(job.workerId);
        if (worker) {
          const totalRatingPoints = worker.rating * worker.ratingCount + ratingDetails.rating;
          worker.ratingCount += 1;
          worker.rating = Number((totalRatingPoints / worker.ratingCount).toFixed(1));
          worker.trustScore = this.calculateTrustScore(worker);
        }
      }

      // Automatically log a paid work day into the worker's work days history!
      const existingWorkDay = this.data.workDays.find((wd) => wd.jobId === job.id);
      if (!existingWorkDay) {
        this.logWorkDay({
          workerId: job.workerId,
          date: job.preferredDate || now.split('T')[0],
          workType: job.serviceType,
          customerOrJob: job.customerName || 'Service Request',
          dailyWage: job.estimatedBudget,
          paymentStatus: 'PAID',
          jobId: job.id,
          notes: `Completed job #${job.id.slice(-6)}`
        });
      } else {
        existingWorkDay.paymentStatus = 'PAID';
      }
    }

    this.save();
    return job;
  }

  getJobsForWorker(workerId: string): JobRequest[] {
    return this.data.jobs.filter((j) => j.workerId === workerId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getJobsForCustomer(customerId: string): JobRequest[] {
    return this.data.jobs.filter((j) => j.customerId === customerId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getAllJobs(): JobRequest[] {
    return this.data.jobs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- Work Days & Earnings ---

  logWorkDay(params: {
    workerId: string;
    date: string;
    workType: string;
    customerOrJob: string;
    dailyWage: number;
    paymentStatus: 'PAID' | 'PENDING';
    jobId?: string;
    notes?: string;
  }): WorkDayRecord {
    const record: WorkDayRecord = {
      id: `wd_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      workerId: params.workerId,
      date: params.date,
      workType: params.workType,
      customerOrJob: params.customerOrJob,
      dailyWage: Number(params.dailyWage),
      paymentStatus: params.paymentStatus,
      jobId: params.jobId,
      notes: params.notes,
      createdAt: new Date().toISOString()
    };

    this.data.workDays.push(record);
    this.save();
    return record;
  }

  deleteWorkDay(recordId: string, workerId: string): boolean {
    const initialLen = this.data.workDays.length;
    this.data.workDays = this.data.workDays.filter((w) => !(w.id === recordId && w.workerId === workerId));
    if (this.data.workDays.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  getWorkDaysForWorker(workerId: string): WorkDayRecord[] {
    return this.data.workDays
      .filter((w) => w.workerId === workerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  calculateWorkerFinancialSnapshot(workerId: string): FinancialSnapshot {
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const records = this.getWorkDaysForWorker(workerId);

    const currentMonthRecords = records.filter((r) => r.date.startsWith(currentMonthPrefix));
    const workingDays = currentMonthRecords.length;

    let estimatedIncome = 0;
    let pendingPayments = 0;
    let paidPayments = 0;

    for (const r of currentMonthRecords) {
      estimatedIncome += r.dailyWage;
      if (r.paymentStatus === 'PAID') {
        paidPayments += r.dailyWage;
      } else {
        pendingPayments += r.dailyWage;
      }
    }

    // Connected to actual working days:
    // Daily contribution x actual working days = monthly contribution
    const insuranceContribution = workingDays * this.data.protectionConfig.dailyContributionRate;
    const netExpectedAmount = estimatedIncome - insuranceContribution;

    return {
      month: currentMonthPrefix,
      workingDays,
      estimatedIncome,
      insuranceContribution,
      pendingPayments,
      paidPayments,
      netExpectedAmount
    };
  }

  calculateEarningsBreakdown(workerId: string) {
    const records = this.getWorkDaysForWorker(workerId);
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Daily earnings (today)
    const todayRecords = records.filter((r) => r.date === todayStr);
    const dailyEarnings = todayRecords.reduce((acc, r) => acc + r.dailyWage, 0);

    // Weekly earnings (past 7 days)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRecords = records.filter((r) => new Date(r.date) >= sevenDaysAgo);
    const weeklyEarnings = weeklyRecords.reduce((acc, r) => acc + r.dailyWage, 0);

    // Monthly earnings (current calendar month)
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyRecords = records.filter((r) => r.date.startsWith(currentMonthPrefix));
    const monthlyEarnings = monthlyRecords.reduce((acc, r) => acc + r.dailyWage, 0);

    const totalWorkingDays = records.length;
    const pendingAmount = records
      .filter((r) => r.paymentStatus === 'PENDING')
      .reduce((acc, r) => acc + r.dailyWage, 0);
    const paidAmount = records
      .filter((r) => r.paymentStatus === 'PAID')
      .reduce((acc, r) => acc + r.dailyWage, 0);

    // Monthly chart data (group by last 6 months)
    const monthlyTrends: { month: string; earnings: number; days: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'short' });
      const monthRecs = records.filter((r) => r.date.startsWith(prefix));
      const earnings = monthRecs.reduce((acc, r) => acc + r.dailyWage, 0);
      monthlyTrends.push({
        month: label,
        earnings,
        days: monthRecs.length
      });
    }

    return {
      dailyEarnings,
      weeklyEarnings,
      monthlyEarnings,
      totalWorkingDays,
      pendingAmount,
      paidAmount,
      monthlyTrends,
      recentRecords: records.slice(0, 30)
    };
  }

  // --- Benefits & Micro-Insurance ---

  getInsuranceSummary(workerId: string): InsuranceContributionSummary {
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const records = this.getWorkDaysForWorker(workerId);
    const monthRecords = records.filter((r) => r.date.startsWith(currentMonthPrefix));
    const actualWorkingDays = monthRecords.length;

    const rate = this.data.protectionConfig.dailyContributionRate;
    const totalContribution = actualWorkingDays * rate;

    // Eligibility rule: at least 5 recorded work days in the current or previous 30 days
    const isEligible = actualWorkingDays >= 5;
    const eligibilityReason = isEligible
      ? 'Eligible: Worker has recorded 5+ verified working days this month.'
      : `Partially covered: Minimum 5 working days required for full coverage. Current: ${actualWorkingDays} days.`;

    const coverageStatus = isEligible
      ? 'ACTIVE'
      : actualWorkingDays > 0
      ? 'NEEDS_WORK_DAYS'
      : 'INACTIVE';

    return {
      workerId,
      month: currentMonthPrefix,
      actualWorkingDays,
      dailyContributionRate: rate,
      totalContribution,
      isEligible,
      eligibilityReason,
      coverageStatus,
      breakdown: {
        accidentCover: this.data.protectionConfig.accidentCoverageAmount,
        emergencySupport: this.data.protectionConfig.emergencySupportAmount,
        hospitalCash: this.data.protectionConfig.hospitalCashDaily
      }
    };
  }

  // --- Well-Being Supportive Alerts ---

  getWorkerWellBeingAlerts(workerId: string): WellBeingAlert[] {
    const records = this.getWorkDaysForWorker(workerId);
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthPrefix = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;

    const currentDays = records.filter((r) => r.date.startsWith(currentMonthPrefix)).length;
    const prevDays = records.filter((r) => r.date.startsWith(prevMonthPrefix)).length;

    const currentIncome = records
      .filter((r) => r.date.startsWith(currentMonthPrefix))
      .reduce((sum, r) => sum + r.dailyWage, 0);
    const prevIncome = records
      .filter((r) => r.date.startsWith(prevMonthPrefix))
      .reduce((sum, r) => sum + r.dailyWage, 0);

    const alerts: WellBeingAlert[] = [];

    if (prevDays > 0 && currentDays < prevDays / 2 && now.getDate() > 15) {
      alerts.push({
        id: 'alert_days_drop',
        type: 'SUPPORT',
        title: 'Working Days Insight',
        message: 'Your working days have decreased this month compared to your previous pattern.',
        metricDetails: `${currentDays} days this month vs ${prevDays} days last month`
      });
    }

    if (prevIncome > 0 && currentIncome < prevIncome * 0.6 && now.getDate() > 20) {
      alerts.push({
        id: 'alert_income_low',
        type: 'SUPPORT',
        title: 'Earnings Flow Notice',
        message: 'Your estimated income is lower than your recent average. Ensure pending jobs are followed up.',
        metricDetails: `Current: ₹${currentIncome} vs Previous: ₹${prevIncome}`
      });
    }

    if (currentDays >= 15) {
      alerts.push({
        id: 'alert_streak',
        type: 'POSITIVE',
        title: 'Strong Consistency',
        message: 'You have maintained high work consistency with 15+ verified work days this month.',
        metricDetails: `${currentDays} days completed`
      });
    }

    return alerts;
  }

  // --- Smart Work Matching ---

  matchWorkersForCustomer(params: {
    skill?: string;
    location?: string;
    pincode?: string;
    availabilityOnly?: boolean;
  }): SmartMatchResult[] {
    const workers = this.data.workers;
    const results: SmartMatchResult[] = [];

    for (const w of workers) {
      let score = 0;
      const reasons: string[] = [];

      // Skill match
      const skillTarget = params.skill?.toLowerCase().trim();
      const hasSkill = skillTarget
        ? w.skills.some((s) => s.toLowerCase().includes(skillTarget)) ||
          w.jobType.toLowerCase().includes(skillTarget)
        : true;

      if (skillTarget && hasSkill) {
        score += 40;
        reasons.push(`Matched required skill "${params.skill}"`);
      } else if (!skillTarget) {
        score += 20;
      }

      // Location match
      if (params.pincode && w.pincode === params.pincode) {
        score += 25;
        reasons.push(`Direct location proximity (Pincode ${params.pincode})`);
      } else if (
        params.location &&
        (w.preferredArea.toLowerCase().includes(params.location.toLowerCase()) ||
          w.address.toLowerCase().includes(params.location.toLowerCase()))
      ) {
        score += 20;
        reasons.push(`Available in your service area (${w.preferredArea || w.address})`);
      }

      // Availability match
      if (w.availability === 'AVAILABLE') {
        score += 20;
        reasons.push('Available immediately for today');
      } else if (w.availability === 'THIS_WEEK') {
        score += 10;
        reasons.push('Available for scheduling this week');
      } else if (params.availabilityOnly) {
        continue;
      }

      // Experience match
      if (w.experienceYears >= 4) {
        score += 15;
        reasons.push(`Highly experienced with ${w.experienceYears}+ years in the trade`);
      } else if (w.experienceYears >= 1) {
        score += 10;
        reasons.push(`${w.experienceYears} year(s) of verified field experience`);
      }

      // Badges bonus
      if (w.badges.skillVerified) {
        score += 10;
        reasons.push('Certified and Skill-Verified by SahakarGig');
      }

      if (hasSkill || !skillTarget) {
        results.push({
          worker: w,
          score,
          whyThisMatch: reasons.length > 0 ? reasons : ['General match based on profile availability']
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  // --- Verifications & Admin Center ---

  getAllVerifications(): VerificationItem[] {
    return this.data.verifications.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  reviewVerification(verificationId: string, status: 'APPROVED' | 'REJECTED'): VerificationItem | null {
    const item = this.data.verifications.find((v) => v.id === verificationId);
    if (!item) return null;

    item.status = status;
    item.reviewedAt = new Date().toISOString();

    const worker = this.getWorkerById(item.workerId);
    if (worker && status === 'APPROVED') {
      if (item.type === 'PROFILE') {
        worker.badges.identityVerified = true;
      } else if (item.type === 'SKILL') {
        worker.badges.skillVerified = true;
      } else if (item.type === 'CERTIFICATE') {
        worker.badges.certificateVerified = true;
      }
      worker.trustScore = this.calculateTrustScore(worker);
    }

    this.save();
    return item;
  }

  toggleWorkerAccountStatus(userId: string): { status: User['status'] } | null {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.status = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    this.save();
    return { status: user.status };
  }

  verifyWorkerBadge(workerId: string, badgeType: 'identity' | 'skill' | 'certificate'): WorkerProfile | null {
    const worker = this.getWorkerById(workerId);
    if (!worker) return null;

    if (badgeType === 'identity') {
      worker.badges.identityVerified = true;
      worker.identityVerification.verified = true;
    } else if (badgeType === 'skill') {
      worker.badges.skillVerified = true;
    } else if (badgeType === 'certificate') {
      worker.badges.certificateVerified = true;
      worker.certifications.forEach((c) => {
        c.verified = true;
      });
    }

    worker.trustScore = this.calculateTrustScore(worker);
    this.save();
    return worker;
  }

  getAdminOverviewStats(): AdminOverviewStats {
    const totalWorkers = this.data.workers.length;
    const activeWorkers = this.data.workers.filter((w) => w.availability === 'AVAILABLE').length;
    const totalCustomers = this.data.customers.length;
    const activeJobs = this.data.jobs.filter((j) =>
      ['ACCEPTED', 'IN_PROGRESS', 'REQUESTED'].includes(j.status)
    ).length;
    const completedJobs = this.data.jobs.filter((j) => ['COMPLETED', 'PAID'].includes(j.status)).length;
    const pendingVerifications = this.data.verifications.filter((v) => v.status === 'PENDING').length;

    // Platform transactions (all paid work days + paid jobs)
    const paidWorkDays = this.data.workDays.filter((w) => w.paymentStatus === 'PAID');
    const totalPlatformTransactions = paidWorkDays.reduce((acc, r) => acc + r.dailyWage, 0);

    const totalInsuranceContributions =
      paidWorkDays.length * this.data.protectionConfig.dailyContributionRate;

    const pendingWorkDays = this.data.workDays.filter((w) => w.paymentStatus === 'PENDING');
    const totalPendingPayments = pendingWorkDays.reduce((acc, r) => acc + r.dailyWage, 0);

    return {
      totalWorkers,
      activeWorkers,
      totalCustomers,
      activeJobs,
      completedJobs,
      pendingVerifications,
      totalPlatformTransactions,
      totalInsuranceContributions,
      totalPendingPayments
    };
  }
}

export const db = new Database();
