import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import type { UserRole } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process .env.port) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper auth middleware
  const authMiddleware = (roles?: UserRole[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }
      const token = authHeader.split(' ')[1];
      const user = db.getUserBySession(token);
      if (!user) {
        res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
        return;
      }
      if (roles && !roles.includes(user.role)) {
        res.status(403).json({ error: 'Access forbidden: Insufficient permissions.' });
        return;
      }
      (req as any).user = user;
      (req as any).token = token;
      next();
    };
  };

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // --- AUTHENTICATION ROUTES ---

  // Worker registration
  app.post('/api/auth/register-worker', (req, res) => {
    try {
      const {
        fullName,
        email,
        mobile,
        password,
        address,
        pincode,
        preferredArea,
        jobType,
        experienceYears,
        skills,
        preferredWorkType,
        expectedDailyWage,
        availability,
        certifications,
        identityDocType,
        identityDocNumber,
        emergencyContact,
        preferredRadiusKm,
        languages,
        bio,
        workExperienceSummary
      } = req.body;

      if (!email || !mobile || !password || !fullName) {
        res.status(400).json({ error: 'Full name, email, mobile number, and password are required.' });
        return;
      }

      if (db.getUserByEmailOrMobile(email) || db.getUserByEmailOrMobile(mobile)) {
        res.status(409).json({ error: 'An account with this email or mobile number already exists.' });
        return;
      }

      // Secure masking of government identity number (never expose raw Aadhaar or govt ID)
      const rawId = String(identityDocNumber || '').trim();
      const last4 = rawId.slice(-4) || '0000';
      const maskedNumber = `XXXX-XXXX-${last4}`;

      const user = db.createUser(email, mobile, password, 'WORKER', fullName);
      const token = db.createSession(user.id);

      const workerProfile = db.createOrUpdateWorker({
        userId: user.id,
        fullName,
        mobile,
        email,
        address: address || '',
        pincode: pincode || '',
        preferredArea: preferredArea || address || '',
        jobType: jobType || (skills && skills[0]) || 'General Worker',
        experienceYears: Number(experienceYears) || 1,
        skills: Array.isArray(skills) && skills.length > 0 ? skills : ['General Support'],
        preferredWorkType: preferredWorkType || 'Flexible / Gig',
        expectedDailyWage: Number(expectedDailyWage) || 600,
        availability: availability || 'AVAILABLE',
        certifications: Array.isArray(certifications) ? certifications : [],
        identityVerification: {
          idType: identityDocType || 'Aadhaar',
          maskedNumber,
          verified: false,
          submittedAt: new Date().toISOString()
        },
        emergencyContact: emergencyContact || { name: '', phone: '', relation: '' },
        preferredRadiusKm: Number(preferredRadiusKm) || 10,
        languages: languages || ['Hindi', 'English'],
        bio: bio || '',
        workExperienceSummary: workExperienceSummary || ''
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          name: user.name,
          status: user.status,
          createdAt: user.createdAt
        },
        workerProfile
      });
    } catch (err: any) {
      console.error('Error during worker registration:', err);
      res.status(500).json({ error: err.message || 'Worker registration failed. Please try again.' });
    }
  });

  // Customer registration
  app.post('/api/auth/register-customer', (req, res) => {
    try {
      const {
        fullName,
        contactNumber,
        email,
        password,
        address,
        pincode,
        preferredServiceArea,
        commonServicesRequired
      } = req.body;

      if (!email || !contactNumber || !password || !fullName) {
        res.status(400).json({ error: 'Full name, email, contact number, and password are required.' });
        return;
      }

      if (db.getUserByEmailOrMobile(email) || db.getUserByEmailOrMobile(contactNumber)) {
        res.status(409).json({ error: 'An account with this email or mobile number already exists.' });
        return;
      }

      const user = db.createUser(email, contactNumber, password, 'CUSTOMER', fullName);
      const token = db.createSession(user.id);

      const customerProfile = db.createOrUpdateCustomer({
        userId: user.id,
        fullName,
        contactNumber,
        email,
        address: address || '',
        pincode: pincode || '',
        preferredServiceArea: preferredServiceArea || '',
        commonServicesRequired: commonServicesRequired || []
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          name: user.name,
          status: user.status,
          createdAt: user.createdAt
        },
        customerProfile
      });
    } catch (err: any) {
      console.error('Error during customer registration:', err);
      res.status(500).json({ error: err.message || 'Customer registration failed. Please try again.' });
    }
  });

  // Universal Login (Worker, Customer, Admin)
  app.post('/api/auth/login', (req, res) => {
    try {
      const { identifier, password, expectedRole } = req.body;
      if (!identifier || !password) {
        res.status(400).json({ error: 'Please enter your email or mobile number, and password.' });
        return;
      }

      const user = db.validateCredentials(identifier, password);
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials. Please check your details and try again.' });
        return;
      }

      if (expectedRole && user.role !== expectedRole) {
        res.status(403).json({
          error: `This portal is for ${expectedRole.toLowerCase()}s. Your account is registered as ${user.role.toLowerCase()}.`
        });
        return;
      }

      const token = db.createSession(user.id);

      let profile = null;
      if (user.role === 'WORKER') {
        profile = db.getWorkerByUserId(user.id);
      } else if (user.role === 'CUSTOMER') {
        profile = db.getCustomerByUserId(user.id);
      }

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          name: user.name,
          status: user.status,
          createdAt: user.createdAt
        },
        profile
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(401).json({ error: err.message || 'Authentication failed.' });
    }
  });

  // Current session user
  app.get('/api/auth/me', authMiddleware(), (req, res) => {
    const user = (req as any).user;
    let profile = null;
    if (user.role === 'WORKER') {
      profile = db.getWorkerByUserId(user.id);
    } else if (user.role === 'CUSTOMER') {
      profile = db.getCustomerByUserId(user.id);
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        name: user.name,
        status: user.status,
        createdAt: user.createdAt
      },
      profile
    });
  });

  // Logout
  app.post('/api/auth/logout', authMiddleware(), (req, res) => {
    const token = (req as any).token;
    if (token) {
      db.removeSession(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // --- WORKER ROUTES ---

  // Get matching workers for discovery (Customer & general search)
  app.get('/api/workers', (req, res) => {
    const { skill, location, pincode, availabilityOnly } = req.query;
    const matches = db.matchWorkersForCustomer({
      skill: skill as string,
      location: location as string,
      pincode: pincode as string,
      availabilityOnly: availabilityOnly === 'true'
    });

    res.json(matches);
  });

  // Worker profile by ID
  app.get('/api/workers/:id', (req, res) => {
    const worker = db.getWorkerById(req.params.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }
    res.json(worker);
  });

  // Toggle current worker availability
  app.put('/api/workers/me/availability', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }

    const { availability } = req.body;
    if (!availability) {
      res.status(400).json({ error: 'Availability state is required.' });
      return;
    }

    const updated = db.updateWorkerAvailability(worker.id, availability);
    res.json(updated);
  });

  // Update current worker profile
  app.put('/api/workers/me/profile', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const profile = db.createOrUpdateWorker({
      ...req.body,
      userId: user.id
    });
    res.json(profile);
  });

  // Financial snapshot
  app.get('/api/workers/me/financial-snapshot', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const snapshot = db.calculateWorkerFinancialSnapshot(worker.id);
    res.json(snapshot);
  });

  // Worker earnings breakdown (charts, metrics, work history)
  app.get('/api/workers/me/earnings', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const earnings = db.calculateEarningsBreakdown(worker.id);
    res.json(earnings);
  });

  // Work days list
  app.get('/api/workers/me/work-days', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const records = db.getWorkDaysForWorker(worker.id);
    res.json(records);
  });

  // Log a new work day record
  app.post('/api/workers/me/work-days', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }

    const { date, workType, customerOrJob, dailyWage, paymentStatus, notes } = req.body;
    if (!date || !workType || dailyWage === undefined) {
      res.status(400).json({ error: 'Date, work type, and daily wage are required to log work.' });
      return;
    }

    const record = db.logWorkDay({
      workerId: worker.id,
      date,
      workType,
      customerOrJob: customerOrJob || 'Direct Client Work',
      dailyWage: Number(dailyWage),
      paymentStatus: paymentStatus || 'PAID',
      notes
    });

    res.status(201).json(record);
  });

  // Delete a work day record
  app.delete('/api/workers/me/work-days/:id', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const ok = db.deleteWorkDay(req.params.id, worker.id);
    res.json({ success: ok });
  });

  // Micro-insurance and worker protection summary
  app.get('/api/workers/me/protection', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const summary = db.getInsuranceSummary(worker.id);
    res.json(summary);
  });

  // Worker well-being supportive alerts
  app.get('/api/workers/me/well-being-alerts', authMiddleware(['WORKER']), (req, res) => {
    const user = (req as any).user;
    const worker = db.getWorkerByUserId(user.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found' });
      return;
    }
    const alerts = db.getWorkerWellBeingAlerts(worker.id);
    res.json(alerts);
  });

  // --- JOB & SERVICE REQUEST ROUTES ---

  // Get jobs relevant to authenticated user
  app.get('/api/jobs', authMiddleware(), (req, res) => {
    const user = (req as any).user;
    if (user.role === 'WORKER') {
      const worker = db.getWorkerByUserId(user.id);
      if (!worker) return res.json([]);
      return res.json(db.getJobsForWorker(worker.id));
    } else if (user.role === 'CUSTOMER') {
      const customer = db.getCustomerByUserId(user.id);
      if (!customer) return res.json([]);
      return res.json(db.getJobsForCustomer(customer.id));
    } else if (user.role === 'ADMIN') {
      return res.json(db.getAllJobs());
    }
    res.json([]);
  });

  // Create a new job request (Customer selects worker)
  app.post('/api/jobs', authMiddleware(['CUSTOMER']), (req, res) => {
    const user = (req as any).user;
    const customer = db.getCustomerByUserId(user.id);
    if (!customer) {
      res.status(404).json({ error: 'Customer profile not found' });
      return;
    }

    const {
      workerId,
      serviceType,
      serviceRequested,
      description,
      preferredDate,
      scheduledDate,
      preferredTime,
      scheduledTimeSlot,
      location,
      serviceAddress,
      estimatedBudget,
      offeredAmount,
      matchReasons
    } = req.body;

    const resolvedServiceType = serviceRequested || serviceType;
    const resolvedDate = scheduledDate || preferredDate;
    const resolvedTime = scheduledTimeSlot || preferredTime || 'Morning (9:00 AM - 1:00 PM)';
    const resolvedLocation = serviceAddress || location || customer.address || 'Customer site';
    const resolvedBudget = Number(offeredAmount) || Number(estimatedBudget) || 700;

    if (!workerId || !resolvedServiceType || !description || !resolvedDate) {
      res.status(400).json({ error: 'Worker, service type, description, and date are required.' });
      return;
    }

    const newJob = db.createJobRequest({
      customerId: customer.id,
      workerId,
      serviceType: resolvedServiceType,
      description,
      preferredDate: resolvedDate,
      preferredTime: resolvedTime,
      location: resolvedLocation,
      estimatedBudget: resolvedBudget,
      matchReasons
    });

    res.status(201).json(newJob);
  });

  // Update job status (Accept, Decline, In Progress, Completed, Paid)
  app.put('/api/jobs/:id/status', authMiddleware(), (req, res) => {
    const { status, rating, review } = req.body;
    if (!status) {
      res.status(400).json({ error: 'New status is required.' });
      return;
    }

    const ratingDetails = rating !== undefined ? { rating: Number(rating), review } : undefined;
    const updated = db.updateJobStatus(req.params.id, status, ratingDetails);

    if (!updated) {
      res.status(404).json({ error: 'Job request not found' });
      return;
    }

    res.json(updated);
  });

  // Save / Bookmark worker toggle (Customer)
  app.post('/api/customers/saved-workers/:workerId', authMiddleware(['CUSTOMER']), (req, res) => {
    const user = (req as any).user;
    const customer = db.getCustomerByUserId(user.id);
    if (!customer) {
      res.status(404).json({ error: 'Customer profile not found' });
      return;
    }

    const saved = db.toggleSaveWorker(customer.id, req.params.workerId);
    res.json({ savedWorkers: saved });
  });

  // --- ADMIN MANAGEMENT ROUTES ---

  // Admin Overview Stats
  app.get('/api/admin/overview', authMiddleware(['ADMIN']), (req, res) => {
    const stats = db.getAdminOverviewStats();
    res.json(stats);
  });

  // Admin Worker Management
  app.get('/api/admin/workers', authMiddleware(['ADMIN']), (req, res) => {
    const workers = db.getAllWorkers();
    res.json(workers);
  });

  // Admin Customer Management
  app.get('/api/admin/customers', authMiddleware(['ADMIN']), (req, res) => {
    const customers = db.getAllCustomers();
    res.json(customers);
  });

  // Admin Job Management
  app.get('/api/admin/jobs', authMiddleware(['ADMIN']), (req, res) => {
    const jobs = db.getAllJobs();
    res.json(jobs);
  });

  // Admin Verification Center
  app.get('/api/admin/verifications', authMiddleware(['ADMIN']), (req, res) => {
    const verifications = db.getAllVerifications();
    res.json(verifications);
  });

  // Review verification item (Approve / Reject)
  app.post('/api/admin/verifications/:id/review', authMiddleware(['ADMIN']), (req, res) => {
    const { status } = req.body;
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      res.status(400).json({ error: 'Status must be APPROVED or REJECTED' });
      return;
    }

    const reviewed = db.reviewVerification(req.params.id, status);
    if (!reviewed) {
      res.status(404).json({ error: 'Verification item not found' });
      return;
    }

    res.json(reviewed);
  });

  // Suspend or Activate worker account
  app.post('/api/admin/workers/:id/toggle-status', authMiddleware(['ADMIN']), (req, res) => {
    const worker = db.getWorkerById(req.params.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }

    const result = db.toggleWorkerAccountStatus(worker.userId);
    if (!result) {
      res.status(404).json({ error: 'User account not found' });
      return;
    }

    res.json({ success: true, newStatus: result.status });
  });

  // Verify worker badge (identity, skill, certificate)
  app.post('/api/admin/workers/:id/verify-badge', authMiddleware(['ADMIN']), (req, res) => {
    const { badgeType } = req.body;
    if (!badgeType || !['identity', 'skill', 'certificate'].includes(badgeType)) {
      res.status(400).json({ error: 'Valid badgeType is required (identity, skill, certificate).' });
      return;
    }

    const updated = db.verifyWorkerBadge(req.params.id, badgeType);
    if (!updated) {
      res.status(404).json({ error: 'Worker not found' });
      return;
    }

    res.json(updated);
  });

  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SahakarGig server running on http://localhost:${PORT}`);
  });
}

startServer();
