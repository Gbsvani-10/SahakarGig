const express = require('express');
const router = express.Router();
const axios = require('axios');

const db = require('../db');
const authCtrl = require('../controllers/authControllers');
const workerCtrl = require('../controllers/workerControllers');
const bookingCtrl = require('../controllers/bookingControllers');
const adminCtrl = require('../controllers/adminControllers');
const paymentCtrl = require('../controllers/paymentControllers');
const notificationCtrl = require('../controllers/notificationControllers');
const aiBridgeCtrl = require('../controllers/aiBridgeController');

const {
  verifyToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');


// ============================================================
// HEALTH
// ============================================================

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    platform: 'SahakarGig Cooperative Platform',
    database: db.isPostgresConnected()
      ? 'PostgreSQL'
      : 'Embedded Development DB',
    timestamp: new Date().toISOString(),
  });
});


// ============================================================
// AUTH
// ============================================================

// General registration
router.post('/auth/register', authCtrl.register);

// Worker registration
router.post('/auth/register-worker', authCtrl.registerWorker);

// Customer registration
router.post('/auth/register-customer', authCtrl.registerCustomer);

// Login
router.post('/auth/login', authCtrl.login);

// Current logged-in user
router.get('/auth/me', verifyToken, authCtrl.me);

// Logout
router.post(
  '/auth/logout',
  verifyToken,
  (_req, res) => {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
);


// ============================================================
// COOPERATIVES
// ============================================================

router.get(
  '/cooperatives',
  verifyToken,
  async (_req, res) => {
    try {
      const result = await db.query(`
        SELECT
          id,
          name,
          created_at
        FROM cooperatives
        ORDER BY name
      `);

      res.json({
        success: true,
        data: result.rows,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to fetch cooperatives:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to fetch cooperatives',
      });
    }
  }
);


// ============================================================
// WORKERS
// ============================================================

/*
  IMPORTANT:

  This endpoint returns real worker registration data from
  PostgreSQL.

  Sensitive fields such as:
    - identity_doc_data
    - raw identity document number

  are NOT returned here.
*/

router.get(
  '/workers',
  verifyToken,
  async (_req, res) => {
    try {
      const result = await db.query(`
        SELECT
          w.id,
          w.user_id,
          w.cooperative_id,

          -- Basic profile
          w.name,
          w.phone,
          w.email,

          -- Address
          w.address,
          w.pincode,
          w.preferred_area AS service_area,

          -- Skills
          w.skill,
          w.skills,

          -- Experience
          w.experience_years,
          w.work_experience_summary,

          -- Work preferences
          w.preferred_work_type,
          w.expected_daily_wage,
          w.hourly_rate,
          w.price_range,
          w.availability,
          w.preferred_radius_km,
          w.is_available,

          -- Languages
          w.languages,

          -- Certifications
          w.certifications,

          -- Schedule
          w.schedule,

          -- Verification
          w.is_verified,

          -- Performance
          w.rating,
          w.review_count,
          w.completed_jobs_count,
          w.trust_score,

          -- Location
          w.latitude,
          w.longitude,

          -- Emergency
          w.emergency_available,

          -- Insurance / welfare
          w.insurance_active,
          w.policy_number,
          w.insurance_valid_until,
          w.welfare_scheme_name,

          -- Profile
          w.bio,
          w.profile_completeness,

          -- Cooperative
          c.name AS cooperative_name,

          -- Dates
          w.created_at,
          w.updated_at

        FROM workers w

        LEFT JOIN cooperatives c
          ON c.id = w.cooperative_id

        ORDER BY w.name
      `);

      const workers = result.rows.map((worker) => ({
        ...worker,

        // PostgreSQL TEXT[]
        skills: Array.isArray(worker.skills)
          ? worker.skills
          : [],

        // PostgreSQL TEXT[]
        languages: Array.isArray(worker.languages)
          ? worker.languages
          : [],

        // PostgreSQL JSONB
        certifications: Array.isArray(worker.certifications)
          ? worker.certifications
          : [],

        // PostgreSQL JSONB
        schedule: Array.isArray(worker.schedule)
          ? worker.schedule
          : [],
      }));

      res.json({
        success: true,
        data: workers,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error('Failed to fetch workers:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to fetch workers',
      });
    }
  }
);


// Nearby workers
router.get(
  '/workers/nearby',
  workerCtrl.getNearbyWorkers
);


// Admin verifies worker
router.patch(
  '/workers/:workerId/verify',
  verifyToken,
  authorizeRoles('coop_admin'),
  workerCtrl.verifyWorker
);


// Customer rates worker
router.post(
  '/workers/rate',
  verifyToken,
  authorizeRoles('customer'),
  workerCtrl.rateWorker
);


// ============================================================
// WORKER LOCATION
// ============================================================

router.patch(
  '/workers/location',
  verifyToken,
  authorizeRoles('worker'),
  async (req, res) => {
    const {
      latitude,
      longitude,
    } = req.body || {};

    if (
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      return res.status(400).json({
        success: false,
        error: 'Valid coordinates are required',
      });
    }

    try {
      const result = await db.query(
        `
        UPDATE workers
        SET
          latitude = $1,
          longitude = $2,
          updated_at = NOW()
        WHERE user_id = $3
        RETURNING
          id,
          user_id,
          latitude,
          longitude
        `,
        [
          Number(latitude),
          Number(longitude),
          req.user.id,
        ]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          error: 'Worker profile not found',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {
      console.error('Failed to update worker location:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to update worker location',
      });
    }
  }
);


// ============================================================
// WORKER AVAILABILITY
// ============================================================

router.patch(
  '/workers/availability',
  verifyToken,
  authorizeRoles('worker'),
  async (req, res) => {
    try {
      const isAvailable = Boolean(
        req.body?.isAvailable
      );

      const result = await db.query(
        `
        UPDATE workers
        SET
          is_available = $1,
          updated_at = NOW()
        WHERE user_id = $2
        RETURNING
          id,
          user_id,
          is_available
        `,
        [
          isAvailable,
          req.user.id,
        ]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          error: 'Worker profile not found',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {
      console.error(
        'Failed to update availability:',
        error
      );

      res.status(500).json({
        success: false,
        error: 'Failed to update availability',
      });
    }
  }
);


// ============================================================
// SINGLE WORKER LOCATION
// ============================================================

router.get(
  '/workers/:workerId/location',
  async (req, res) => {
    try {
      const result = await db.query(
        `
        SELECT
          id,
          name,
          skill,
          latitude,
          longitude,
          rating,
          is_available,
          is_verified
        FROM workers
        WHERE id = $1
        `,
        [req.params.workerId]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          error: 'Worker not found',
        });
      }

      res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {
      console.error(
        'Failed to get worker location:',
        error
      );

      res.status(500).json({
        success: false,
        error: 'Failed to get location',
      });
    }
  }
);


// ============================================================
// NEARBY SERVICES / WORKERS
// ============================================================

const nearby = async (req, res) => {
  const latitude = Number(
    req.method === 'POST'
      ? req.body?.latitude
      : req.query?.latitude
  );

  const longitude = Number(
    req.method === 'POST'
      ? req.body?.longitude
      : req.query?.longitude
  );

  const service = String(
    req.method === 'POST'
      ? req.body?.service || ''
      : req.query?.service || ''
  )
    .trim()
    .toLowerCase();

  const radiusKm =
    Number(
      req.method === 'POST'
        ? req.body?.radiusKm
        : req.query?.radiusKm
    ) || 15;

  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    radiusKm <= 0
  ) {
    return res.status(400).json({
      success: false,
      error: 'Valid coordinates and radius are required',
    });
  }

  try {
    const result = await db.query(
      `
      SELECT
        id,
        user_id,
        cooperative_id,
        name,
        phone,
        skill,
        rating,
        latitude,
        longitude,
        is_verified,
        is_available,

        (
          6371 * acos(
            LEAST(
              1,
              GREATEST(
                -1,
                cos(radians($1))
                *
                cos(radians(latitude))
                *
                cos(
                  radians(longitude)
                  - radians($2)
                )
                +
                sin(radians($1))
                *
                sin(radians(latitude))
              )
            )
          )
        ) AS distance_km

      FROM workers

      WHERE
        is_verified = true
        AND is_available = true

        AND (
          $3 = ''
          OR lower(skill) = lower($3)
        )

        AND latitude IS NOT NULL
        AND longitude IS NOT NULL
      `,
      [
        latitude,
        longitude,
        service,
      ]
    );

    const workers = result.rows
      .map((worker) => ({
        ...worker,
        distance_km: Number(
          Number(worker.distance_km).toFixed(2)
        ),
      }))
      .filter(
        (worker) =>
          worker.distance_km <= radiusKm
      )
      .sort(
        (a, b) =>
          a.distance_km - b.distance_km ||
          Number(b.rating) - Number(a.rating)
      );

    res.json({
      success: true,
      data: {
        center: {
          latitude,
          longitude,
        },
        radiusKm,
        count: workers.length,
        workers,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error(
      'Nearby worker search failed:',
      error
    );

    res.status(500).json({
      success: false,
      error: 'Search failed',
    });
  }
};


router.get(
  '/services/nearby',
  nearby
);

router.post(
  '/services/nearby',
  nearby
);


// ============================================================
// GEOCODING
// ============================================================

router.get(
  '/geocode/search',
  async (req, res) => {
    const query = String(
      req.query.q || ''
    ).trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query required',
      });
    }

    try {
      const result = await axios.get(
        'https://nominatim.openstreetmap.org/search',
        {
          params: {
            format: 'jsonv2',
            limit: 5,
            countrycodes: 'in',
            q: query,
          },

          headers: {
            'User-Agent':
              'SahakarGig/1.0',
          },

          timeout: 8000,
        }
      );

      res.json({
        success: true,
        data: result.data.map((place) => ({
          lat: Number(place.lat),
          lng: Number(place.lon),
          displayName:
            place.display_name,
        })),
      });

    } catch (error) {
      console.error(
        'Geocoding failed:',
        error
      );

      res.status(503).json({
        success: false,
        error:
          'Geocoding service temporarily unavailable',
      });
    }
  }
);


// ============================================================
// BOOKINGS
// ============================================================

router.post(
  '/bookings/create',
  verifyToken,
  authorizeRoles('customer'),
  bookingCtrl.createBooking
);


// Fetch bookings
router.get(
  '/bookings',
  verifyToken,
  async (req, res) => {
    try {
      let result;

      if (req.user.role === 'worker') {
        result = await db.query(
          `
          SELECT
            b.*,
            w.name AS worker_name,
            w.phone AS worker_phone

          FROM bookings b

          LEFT JOIN workers w
            ON w.id = b.worker_id

          WHERE w.user_id = $1

          ORDER BY b.created_at DESC
          `,
          [req.user.id]
        );

      } else {
        result = await db.query(
          `
          SELECT
            b.*,
            w.name AS worker_name,
            w.phone AS worker_phone

          FROM bookings b

          LEFT JOIN workers w
            ON w.id = b.worker_id

          WHERE b.customer_id = $1

          ORDER BY b.created_at DESC
          `,
          [req.user.id]
        );
      }

      res.json({
        success: true,
        data: result.rows,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      console.error(
        'Failed to fetch bookings:',
        error
      );

      res.status(500).json({
        success: false,
        error: 'Failed to fetch bookings',
      });
    }
  }
);


// ============================================================
// BOOKING STATUS
// ============================================================

router.patch(
  '/bookings/:bookingId/status',
  verifyToken,
  async (req, res) => {

    const { status } =
      req.body || {};

    const allowedStatuses = [
      'requested',
      'accepted',
      'completed',
      'cancelled',
    ];

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid booking status',
      });
    }

    try {
      const bookingResult =
        await db.query(
          `
          SELECT
            b.*,
            w.user_id AS worker_user_id

          FROM bookings b

          LEFT JOIN workers w
            ON w.id = b.worker_id

          WHERE b.id = $1
          `,
          [req.params.bookingId]
        );

      if (!bookingResult.rows.length) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
      }

      const booking =
        bookingResult.rows[0];

      const allowed =
        (
          req.user.role === 'worker' &&
          String(
            booking.worker_user_id
          ) === String(req.user.id)
        )
        ||
        (
          req.user.role === 'customer' &&
          String(
            booking.customer_id
          ) === String(req.user.id) &&
          status === 'cancelled'
        )
        ||
        req.user.role === 'coop_admin';

      if (!allowed) {
        return res.status(403).json({
          success: false,
          error:
            'You are not allowed to update this booking',
        });
      }

      const result =
        await db.query(
          `
          UPDATE bookings
          SET status = $1
          WHERE id = $2
          RETURNING *
          `,
          [
            status,
            req.params.bookingId,
          ]
        );

      // Worker becomes unavailable
      // after accepting a job.
      if (
        status === 'accepted' &&
        booking.worker_id
      ) {
        await db.query(
          `
          UPDATE workers
          SET
            is_available = false,
            updated_at = NOW()
          WHERE id = $1
          `,
          [booking.worker_id]
        );
      }

      // Worker becomes available again
      // after completion/cancellation.
      if (
        ['completed', 'cancelled']
          .includes(status) &&
        booking.worker_id
      ) {
        await db.query(
          `
          UPDATE workers
          SET
            is_available = true,
            updated_at = NOW()
          WHERE id = $1
          `,
          [booking.worker_id]
        );
      }

      res.json({
        success: true,
        data: result.rows[0],
      });

    } catch (error) {
      console.error(
        'Failed to update booking:',
        error
      );

      res.status(500).json({
        success: false,
        error:
          'Failed to update booking',
      });
    }
  }
);


// ============================================================
// NOTIFICATIONS
// ============================================================

router.get(
  '/notifications',
  verifyToken,
  notificationCtrl.getNotifications
);

router.post(
  '/notifications',
  verifyToken,
  notificationCtrl.createNotification
);

router.patch(
  '/notifications/:notificationId/read',
  verifyToken,
  notificationCtrl.markAsRead
);

router.patch(
  '/notifications/read-all',
  verifyToken,
  notificationCtrl.markAllAsRead
);


// ============================================================
// PAYMENTS
// ============================================================

router.post(
  '/payments/create-order',
  verifyToken,
  authorizeRoles('customer'),
  paymentCtrl.createRazorpayOrder
);

router.post(
  '/payments/verify',
  verifyToken,
  authorizeRoles('customer'),
  paymentCtrl.verifyRazorpayPayment
);

router.post(
  '/bookings/complete-payment',
  verifyToken,
  authorizeRoles('customer'),
  paymentCtrl.verifyRazorpayPayment
);


// ============================================================
// TRANSACTIONS
// ============================================================

router.get(
  '/payments/transactions',
  verifyToken,
  authorizeRoles(
    'customer',
    'coop_admin'
  ),
  async (req, res) => {
    try {
      const isAdmin =
        req.user.role === 'coop_admin';

      const where = isAdmin
        ? ''
        : 'WHERE b.customer_id = $1';

      const params = isAdmin
        ? []
        : [req.user.id];

      const result =
        await db.query(
          `
          SELECT
            i.id,
            i.booking_id,
            i.amount,
            i.payment_method,
            i.transaction_ref,
            i.status,
            i.created_at,

            b.customer_id,
            b.worker_id,
            b.service_type,

            w.name AS worker_name,
            u.name AS customer_name

          FROM invoices i

          JOIN bookings b
            ON b.id = i.booking_id

          LEFT JOIN workers w
            ON w.id = b.worker_id

          LEFT JOIN users u
            ON u.id = b.customer_id

          ${where}

          ORDER BY i.created_at DESC
          `,
          params
        );

      res.json({
        success: true,
        data: result.rows,
        timestamp:
          new Date().toISOString(),
      });

    } catch (error) {
      console.error(
        'Failed to fetch transactions:',
        error
      );

      res.status(500).json({
        success: false,
        error:
          'Failed to fetch transactions',
      });
    }
  }
);


// ============================================================
// ADMIN
// ============================================================

router.get(
  '/admin/metrics',
  verifyToken,
  authorizeRoles('coop_admin'),
  adminCtrl.getCooperativeMetrics
);


// AI demand forecast
router.post(
  '/admin/ai/demand-forecast',
  verifyToken,
  authorizeRoles('coop_admin'),
  aiBridgeCtrl.getDemandForecast
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;
