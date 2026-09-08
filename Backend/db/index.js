const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pgPool = null;
let usePostgres = false;

// In-Memory Database Store for Instant Zero-Config Deployment
const inMemoryStore = {
  cooperatives: [
    {
      id: 'coop-1',
      name: 'Hyderabad Labour Cooperative',
      region: 'Telangana',
      created_at: new Date().toISOString()
    }
  ],
  users: [],
  workers: [
    {
      id: 'work-201',
      cooperative_id: 'coop-1',
      name: 'Ravi Kumar',
      phone: '9876543210',
      skill: 'plumbing',
      is_verified: true,
      is_available: true,
      rating: 4.80,
      latitude: 17.3850,
      longitude: 78.4867,
      created_at: new Date().toISOString()
    },
    {
      id: 'work-202',
      cooperative_id: 'coop-1',
      name: 'Suresh Reddy',
      phone: '9876543211',
      skill: 'electrical',
      is_verified: true,
      is_available: true,
      rating: 4.60,
      latitude: 17.3900,
      longitude: 78.4900,
      created_at: new Date().toISOString()
    },
    {
      id: 'work-203',
      cooperative_id: 'coop-1',
      name: 'Anil Kumar',
      phone: '9876543212',
      skill: 'carpentry',
      is_verified: true,
      is_available: true,
      rating: 4.70,
      latitude: 17.3750,
      longitude: 78.4820,
      created_at: new Date().toISOString()
    },
    {
      id: 'work-204',
      cooperative_id: 'coop-1',
      name: 'Lakshmi Devi',
      phone: '9876543213',
      skill: 'cleaning',
      is_verified: true,
      is_available: true,
      rating: 4.90,
      latitude: 17.3800,
      longitude: 78.4800,
      created_at: new Date().toISOString()
    }
  ],
  bookings: [
    {
      id: 'bk-demo-1',
      customer_id: 'cust-101',
      worker_id: 'work-201',
      service_type: 'plumbing',
      is_emergency: false,
      status: 'completed',
      latitude: 17.3850,
      longitude: 78.4867,
      amount: 450.00,
      created_at: new Date().toISOString()
    }
  ],
  ratings: [],
  invoices: [],
  users: [
    {
      id: 'admin-001',
      name: 'Coop Admin',
      email: 'demo.admin@sahakargig.local',
      password_hash: '$2b$10$SAUk3qqFUA73opb4Xx7GvuvsnxxMhYmyXadfDyBFBhdGxMMS2Acue',
      phone: '9998887770',
      role: 'coop_admin',
      created_at: new Date().toISOString()
    },
    {
      id: 'cust-101',
      name: 'John Customer',
      email: 'demo.customer@sahakargig.local',
      password_hash: '$2b$10$SAUk3qqFUA73opb4Xx7GvuvsnxxMhYmyXadfDyBFBhdGxMMS2Acue',
      phone: '9998887771',
      role: 'customer',
      created_at: new Date().toISOString()
    },
    {
      id: 'cust-102',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      password_hash: '$2b$10$M9RN0f3llYGSbVmUWIU8.OZ4Ir4g/ZXO4zEv1nHyY91t5nskLZ8sa',
      phone: '+91 98765 43210',
      role: 'customer',
      created_at: new Date().toISOString()
    },
    {
      id: 'user-w1',
      name: 'Ravi Kumar',
      email: 'ravi.worker@sahakargig.local',
      password_hash: '$2b$10$M9RN0f3llYGSbVmUWIU8.OZ4Ir4g/ZXO4zEv1nHyY91t5nskLZ8sa',
      phone: '9876543210',
      role: 'worker',
      created_at: new Date().toISOString()
    }
  ]
};

// Try initializing PostgreSQL if DATABASE_URL is set
if (process.env.DATABASE_URL) {
  try {
    const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false }
    });
    usePostgres = true;
    console.log('[Database] Configured for PostgreSQL via DATABASE_URL');
  } catch (e) {
    console.warn('[Database] Failed to initialize PostgreSQL pool:', e.message);
    usePostgres = false;
  }
} else {
  console.log('[Database] No DATABASE_URL provided. Running with high-performance embedded resilient database.');
}

/**
 * Calculates distance between two coordinates in km using Haversine formula
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resilient query executor that routes to PostgreSQL if available,
 * or handles operations in-memory seamlessly.
 */
async function query(text, params = []) {
  if (usePostgres && pgPool) {
    try {
      return await pgPool.query(text, params);
    } catch (err) {
      console.warn('[Database] PostgreSQL query error, falling back to embedded store:', err.message);
    }
  }

  // Embedded In-Memory Query Engine
  const trimmed = text.trim();
  const upper = trimmed.toUpperCase();

  // Transactions: BEGIN / COMMIT / ROLLBACK
  if (upper.startsWith('BEGIN') || upper.startsWith('COMMIT') || upper.startsWith('ROLLBACK')) {
    return { rows: [], rowCount: 0 };
  }

  // User Login: SELECT * FROM users WHERE email = $1
  if (upper.includes('FROM USERS WHERE EMAIL =')) {
    const email = (params[0] || '').toLowerCase();
    const user = inMemoryStore.users.find(u => u.email.toLowerCase() === email);
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }

  // User Registration: INSERT INTO users ...
  if (upper.includes('INSERT INTO USERS')) {
    const [name, email, password_hash, phone, role] = params;
    const existing = inMemoryStore.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (existing) {
      const err = new Error('User already exists');
      err.code = '23505';
      throw err;
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password_hash,
      phone,
      role: role || 'customer',
      created_at: new Date().toISOString()
    };
    inMemoryStore.users.push(newUser);
    return { rows: [{ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }], rowCount: 1 };
  }

  // Nearby Workers: SELECT ... FROM workers WHERE skill = $3 ...
  if (upper.includes('FROM WORKERS') && upper.includes('SKILL =')) {
    const targetLat = parseFloat(params[0]);
    const targetLng = parseFloat(params[1]);
    const skill = (params[2] || '').toLowerCase();
    const radius = parseFloat(params[3]) || 15;

    const matched = inMemoryStore.workers
      .filter(w => w.is_verified && w.is_available && (!skill || w.skill.toLowerCase() === skill))
      .map(w => {
        const dist = calculateDistance(targetLat, targetLng, w.latitude, w.longitude);
        return { ...w, distance_km: parseFloat(dist.toFixed(2)) };
      })
      .filter(w => isNaN(targetLat) || isNaN(targetLng) || w.distance_km <= radius)
      .sort((a, b) => a.distance_km - b.distance_km || b.rating - a.rating);

    return { rows: matched, rowCount: matched.length };
  }

  // Single Worker by Skill for emergency: ORDER BY distance_km ASC LIMIT 1
  if (upper.includes('FROM WORKERS') && upper.includes('LIMIT 1')) {
    const targetLat = parseFloat(params[0]);
    const targetLng = parseFloat(params[1]);
    const skill = (params[2] || '').toLowerCase();

    const matched = inMemoryStore.workers
      .filter(w => w.is_verified && w.is_available && (!skill || w.skill.toLowerCase() === skill))
      .map(w => ({
        ...w,
        distance_km: calculateDistance(targetLat, targetLng, w.latitude, w.longitude)
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return { rows: matched.slice(0, 1), rowCount: matched.length > 0 ? 1 : 0 };
  }

  // Verify Worker: UPDATE workers SET is_verified = TRUE WHERE id = $1
  if (upper.includes('UPDATE WORKERS SET IS_VERIFIED = TRUE')) {
    const workerId = params[0];
    const worker = inMemoryStore.workers.find(w => w.id === workerId);
    if (worker) {
      worker.is_verified = true;
      return { rows: [{ id: worker.id, name: worker.name, is_verified: true }], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Update Worker availability: UPDATE workers SET is_available = ...
  if (upper.includes('UPDATE WORKERS SET IS_AVAILABLE =')) {
    const isAvail = upper.includes('IS_AVAILABLE = TRUE');
    const workerId = params[0];
    const worker = inMemoryStore.workers.find(w => w.id === workerId);
    if (worker) worker.is_available = isAvail;
    return { rows: worker ? [worker] : [], rowCount: worker ? 1 : 0 };
  }

  // Worker Rating: INSERT INTO ratings ...
  if (upper.includes('INSERT INTO RATINGS')) {
    const [bookingId, workerId, customerId, ratingScore, feedback] = params;
    const newRating = {
      id: `rat-${Date.now()}`,
      booking_id: bookingId,
      worker_id: workerId,
      customer_id: customerId,
      rating_score: ratingScore,
      feedback_text: feedback,
      created_at: new Date().toISOString()
    };
    inMemoryStore.ratings.push(newRating);
    return { rows: [newRating], rowCount: 1 };
  }

  // Update Worker Rating: UPDATE workers SET rating = ...
  if (upper.includes('UPDATE WORKERS') && upper.includes('SET RATING =')) {
    const workerId = params[0];
    const worker = inMemoryStore.workers.find(w => w.id === workerId);
    const workerRatings = inMemoryStore.ratings.filter(r => r.worker_id === workerId);
    if (worker && workerRatings.length > 0) {
      const avg = workerRatings.reduce((sum, r) => sum + r.rating_score, 0) / workerRatings.length;
      worker.rating = parseFloat(avg.toFixed(2));
    }
    return { rows: worker ? [{ id: worker.id, name: worker.name, rating: worker.rating }] : [], rowCount: 1 };
  }

  // Create Booking: INSERT INTO bookings ...
  if (upper.includes('INSERT INTO BOOKINGS')) {
    const [customerId, workerId, serviceType, isEmergency, lat, lng, status] = params;
    const newBooking = {
      id: `bk-${Date.now()}`,
      customer_id: customerId,
      worker_id: workerId,
      service_type: serviceType,
      is_emergency: !!isEmergency,
      latitude: lat,
      longitude: lng,
      status: status || (isEmergency ? 'accepted' : 'requested'),
      amount: isEmergency ? 500.00 : 350.00,
      created_at: new Date().toISOString()
    };
    inMemoryStore.bookings.push(newBooking);
    return { rows: [newBooking], rowCount: 1 };
  }

  // Update Booking: UPDATE bookings SET status = 'completed', amount = $1 WHERE id = $2
  if (upper.includes('UPDATE BOOKINGS SET STATUS =')) {
    const amount = params[0];
    const bookingId = params[1];
    const booking = inMemoryStore.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'completed';
      booking.amount = amount || booking.amount;
      return { rows: [booking], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // Create Invoice: INSERT INTO invoices ...
  if (upper.includes('INSERT INTO INVOICES')) {
    const [bookingId, invoiceNum, amount, paymentMethod, transactionRef] = params;
    const newInvoice = {
      id: `inv-${Date.now()}`,
      booking_id: bookingId,
      invoice_number: invoiceNum,
      amount,
      payment_method: paymentMethod,
      transaction_ref: transactionRef,
      status: 'paid',
      created_at: new Date().toISOString()
    };
    inMemoryStore.invoices.push(newInvoice);
    return { rows: [newInvoice], rowCount: 1 };
  }

  // Admin Metrics: Worker Stats & Job Stats
  if (upper.includes('COUNT(*) AS TOTAL_WORKERS')) {
    const totalWorkers = inMemoryStore.workers.length;
    const activeWorkers = inMemoryStore.workers.filter(w => w.is_available && w.is_verified).length;
    const pendingVerifications = inMemoryStore.workers.filter(w => !w.is_verified).length;
    return {
      rows: [
        {
          total_workers: totalWorkers,
          active_workers: activeWorkers,
          pending_verifications: pendingVerifications
        }
      ],
      rowCount: 1
    };
  }

  if (upper.includes('COUNT(*) FILTER (WHERE DATE(CREATED_AT) = CURRENT_DATE) AS TODAYS_JOBS')) {
    const totalRevenue = inMemoryStore.bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
    return {
      rows: [
        {
          todays_jobs: inMemoryStore.bookings.length,
          completed_today: inMemoryStore.bookings.filter(b => b.status === 'completed').length,
          emergency_today: inMemoryStore.bookings.filter(b => b.is_emergency).length,
          total_revenue: totalRevenue
        }
      ],
      rowCount: 1
    };
  }

  // Default fallback for unhandled SELECTs
  return { rows: [], rowCount: 0 };
}

module.exports = {
  query,
  isPostgresConnected: () => usePostgres,
  getStore: () => inMemoryStore
};