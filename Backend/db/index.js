require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pgPool = null;
let usePostgres = false;

/*
|--------------------------------------------------------------------------
| In-memory store
|--------------------------------------------------------------------------
| PostgreSQL DATABASE_URL lekunte development fallback kosam matrame.
| Real deployment lo PostgreSQL use avvali.
|--------------------------------------------------------------------------
*/

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
  workers: [],
  bookings: [],
  ratings: [],
  invoices: [],
  customer_profiles: []
};

/*
|--------------------------------------------------------------------------
| PostgreSQL connection
|--------------------------------------------------------------------------
*/

if (process.env.DATABASE_URL) {
  const isLocal =
    /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);

  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal
      ? false
      : {
          rejectUnauthorized: false
        }
  });

  usePostgres = true;

  pgPool.on('error', (err) => {
    console.error(
      '[Database] Unexpected PostgreSQL pool error:',
      err.message
    );
  });

  console.log('[Database] PostgreSQL configured');
} else {
  console.warn(
    '[Database] DATABASE_URL is missing; embedded mode is active for development only.'
  );
}

/*
|--------------------------------------------------------------------------
| Distance calculation
|--------------------------------------------------------------------------
*/

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

/*
|--------------------------------------------------------------------------
| Database query helper
|--------------------------------------------------------------------------
*/

async function query(text, params = []) {
  /*
   * PostgreSQL mode
   */
  if (usePostgres && pgPool) {
    return pgPool.query(text, params);
  }

  /*
   * Development-only in-memory mode
   */
  const upper = text.trim().toUpperCase();

  if (/^(BEGIN|COMMIT|ROLLBACK)/.test(upper)) {
    return {
      rows: [],
      rowCount: 0
    };
  }

  /*
   * Find user by email
   */
  if (
    upper.includes('FROM USERS') &&
    upper.includes('WHERE EMAIL =')
  ) {
    const user = inMemoryStore.users.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() ===
          String(params[0] || '').toLowerCase()
    );

    return {
      rows: user ? [user] : [],
      rowCount: user ? 1 : 0
    };
  }

  /*
   * Find user by phone
   */
  if (
    upper.includes('FROM USERS') &&
    upper.includes('WHERE PHONE =')
  ) {
    const user = inMemoryStore.users.find(
      (u) =>
        u.phone &&
        String(u.phone) === String(params[0] || '')
    );

    return {
      rows: user ? [user] : [],
      rowCount: user ? 1 : 0
    };
  }

  /*
   * Insert user
   */
  if (upper.includes('INSERT INTO USERS')) {
    const [
      name,
      email,
      password_hash,
      phone,
      role
    ] = params;

    if (
      inMemoryStore.users.some(
        (u) =>
          u.email &&
          u.email.toLowerCase() ===
            String(email).toLowerCase()
      )
    ) {
      const error = new Error(
        'User already exists'
      );

      error.code = '23505';

      throw error;
    }

    const user = {
      id: `user-${Date.now()}`,
      name,
      email,
      password_hash,
      phone,
      role,
      created_at: new Date().toISOString()
    };

    inMemoryStore.users.push(user);

    return {
      rows: [
        {
          id: user.id,
          name,
          email,
          phone,
          role
        }
      ],
      rowCount: 1
    };
  }

  /*
   * Nearby workers search
   */
  if (
    upper.includes('FROM WORKERS') &&
    upper.includes('SKILL')
  ) {
    const lat = Number(params[0]);
    const lng = Number(params[1]);

    const skill = String(
      params[2] || ''
    ).toLowerCase();

    const radius = Number(
      params[3] || 15
    );

    const rows = inMemoryStore.workers
      .filter(
        (worker) =>
          worker.is_verified &&
          worker.is_available &&
          (
            !skill ||
            String(worker.skill || '')
              .toLowerCase() === skill
          )
      )
      .map((worker) => ({
        ...worker,
        distance_km: calculateDistance(
          lat,
          lng,
          worker.latitude,
          worker.longitude
        )
      }))
      .filter(
        (worker) =>
          worker.distance_km <= radius
      )
      .sort(
        (a, b) =>
          a.distance_km -
          b.distance_km
      );

    return {
      rows,
      rowCount: rows.length
    };
  }

  return {
    rows: [],
    rowCount: 0
  };
}

/*
|--------------------------------------------------------------------------
| PostgreSQL schema
|--------------------------------------------------------------------------
|
| Ee function application start ayinappudu run avutundi.
| Tables already unte preserve chestundi.
| Missing columns unte automatically create chestundi.
|--------------------------------------------------------------------------
*/

async function ensureRegistrationSchema() {
  if (!usePostgres || !pgPool) {
    console.warn(
      '[Database] PostgreSQL not configured. Schema initialization skipped.'
    );

    return;
  }

  await pgPool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    /*
    ============================================================
    USERS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

      name VARCHAR(100) NOT NULL,

      email VARCHAR(150) UNIQUE NOT NULL,

      password_hash TEXT NOT NULL,

      phone VARCHAR(20),

      role VARCHAR(30)
        NOT NULL
        DEFAULT 'worker',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    COOPERATIVES
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS cooperatives (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

      name VARCHAR(150) NOT NULL,

      region VARCHAR(100),

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    WORKERS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS workers (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      user_id UUID UNIQUE
        REFERENCES users(id)
        ON DELETE CASCADE,

      cooperative_id UUID
        REFERENCES cooperatives(id)
        ON DELETE SET NULL,

      /*
      Basic information
      */

      name VARCHAR(100) NOT NULL,

      phone VARCHAR(20),

      email VARCHAR(150),

      address TEXT,

      pincode VARCHAR(10),

      preferred_area TEXT,

      /*
      Skills
      */

      skill VARCHAR(100),

      skills TEXT[]
        DEFAULT '{}',

      /*
      Experience
      */

      experience_years NUMERIC(5,2)
        DEFAULT 0,

      preferred_work_type VARCHAR(40)
        DEFAULT 'Flexible / Gig',

      expected_daily_wage NUMERIC(10,2)
        DEFAULT 0,

      /*
      Availability
      */

      availability VARCHAR(30)
        DEFAULT 'AVAILABLE',

      preferred_radius_km NUMERIC(6,2)
        DEFAULT 15,

      is_available BOOLEAN
        DEFAULT TRUE,

      /*
      Languages
      */

      languages TEXT[]
        DEFAULT '{}',

      /*
      Certifications
      */

      certifications JSONB
        DEFAULT '[]'::jsonb,

      /*
      Identity document
      */

      identity_doc_type VARCHAR(30),

      identity_doc_number_masked VARCHAR(30),

      identity_doc_filename TEXT,

      identity_doc_data TEXT,

      /*
      Emergency contact
      */

      emergency_name VARCHAR(100),

      emergency_phone VARCHAR(20),

      emergency_relation VARCHAR(50),

      /*
      Worker profile
      */

      bio TEXT,

      work_experience_summary TEXT,

      profile_completeness NUMERIC(5,2)
        DEFAULT 0,

      /*
      Location
      */

      latitude NUMERIC(10,7),

      longitude NUMERIC(10,7),

      /*
      Worker performance
      */

      rating NUMERIC(3,2)
        DEFAULT 0,

      review_count INTEGER
        DEFAULT 0,

      completed_jobs_count INTEGER
        DEFAULT 0,

      trust_score NUMERIC(5,2)
        DEFAULT 0,

      /*
      Work schedule
      */

      schedule JSONB
        DEFAULT '[]'::jsonb,

      /*
      Emergency availability
      */

      emergency_available BOOLEAN
        DEFAULT TRUE,

      /*
      Wage / pricing
      */

      hourly_rate NUMERIC(10,2)
        DEFAULT 0,

      price_range VARCHAR(100)
        DEFAULT '',

      /*
      Insurance
      */

      insurance_active BOOLEAN
        DEFAULT FALSE,

      policy_number VARCHAR(100)
        DEFAULT '',

      insurance_valid_until DATE,

      /*
      Welfare
      */

      welfare_scheme_name VARCHAR(150)
        DEFAULT '',

      /*
      Verification
      */

      is_verified BOOLEAN
        DEFAULT FALSE,

      /*
      Timestamps
      */

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    BOOKINGS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS bookings (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      customer_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

      worker_id UUID
        REFERENCES workers(id)
        ON DELETE SET NULL,

      service_type VARCHAR(100),

      status VARCHAR(40)
        DEFAULT 'PENDING',

      amount NUMERIC(10,2)
        DEFAULT 0,

      address TEXT,

      scheduled_at TIMESTAMP,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    INVOICES
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      booking_id UUID
        REFERENCES bookings(id)
        ON DELETE CASCADE,

      amount NUMERIC(10,2)
        DEFAULT 0,

      status VARCHAR(40)
        DEFAULT 'PENDING',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    RATINGS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS ratings (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      booking_id UUID
        REFERENCES bookings(id)
        ON DELETE CASCADE,

      worker_id UUID
        REFERENCES workers(id)
        ON DELETE CASCADE,

      customer_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

      rating NUMERIC(2,1),

      review TEXT,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    CUSTOMER PROFILES
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS customer_profiles (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      user_id UUID UNIQUE NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

      full_name VARCHAR(100) NOT NULL,

      contact_number VARCHAR(20) NOT NULL,

      email VARCHAR(150) NOT NULL,

      address TEXT NOT NULL,

      pincode VARCHAR(10) NOT NULL,

      preferred_service_area TEXT,

      common_services_required TEXT[]
        DEFAULT '{}',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    EXISTING USERS TABLE MIGRATION
    ============================================================
    */

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(30)
      DEFAULT 'worker';

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP;


    /*
    ============================================================
    EXISTING WORKERS TABLE MIGRATION
    ============================================================
    */

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS user_id UUID;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS cooperative_id UUID;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS name VARCHAR(100);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS email VARCHAR(150);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS address TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS preferred_area TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS skill VARCHAR(100);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS skills TEXT[]
      DEFAULT '{}';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS experience_years NUMERIC(5,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS preferred_work_type VARCHAR(40)
      DEFAULT 'Flexible / Gig';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS expected_daily_wage NUMERIC(10,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS availability VARCHAR(30)
      DEFAULT 'AVAILABLE';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS preferred_radius_km NUMERIC(6,2)
      DEFAULT 15;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS languages TEXT[]
      DEFAULT '{}';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS certifications JSONB
      DEFAULT '[]'::jsonb;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS identity_doc_type VARCHAR(30);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS identity_doc_number_masked VARCHAR(30);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS identity_doc_filename TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS identity_doc_data TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS emergency_name VARCHAR(100);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS emergency_relation VARCHAR(50);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS bio TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS work_experience_summary TEXT;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS profile_completeness NUMERIC(5,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,7);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7);

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS review_count INTEGER
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS completed_jobs_count INTEGER
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS trust_score NUMERIC(5,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS schedule JSONB
      DEFAULT '[]'::jsonb;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS emergency_available BOOLEAN
      DEFAULT TRUE;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC(10,2)
      DEFAULT 0;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS price_range VARCHAR(100)
      DEFAULT '';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS insurance_active BOOLEAN
      DEFAULT FALSE;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS policy_number VARCHAR(100)
      DEFAULT '';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS insurance_valid_until DATE;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS welfare_scheme_name VARCHAR(150)
      DEFAULT '';

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS is_verified BOOLEAN
      DEFAULT FALSE;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS is_available BOOLEAN
      DEFAULT TRUE;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP;

    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP;


    /*
    ============================================================
    DEFAULT VALUES FOR EXISTING WORKERS
    ============================================================
    */

    UPDATE workers
    SET skills = '{}'
    WHERE skills IS NULL;

    UPDATE workers
    SET languages = '{}'
    WHERE languages IS NULL;

    UPDATE workers
    SET certifications = '[]'::jsonb
    WHERE certifications IS NULL;

    UPDATE workers
    SET schedule = '[]'::jsonb
    WHERE schedule IS NULL;

    UPDATE workers
    SET review_count = 0
    WHERE review_count IS NULL;

    UPDATE workers
    SET completed_jobs_count = 0
    WHERE completed_jobs_count IS NULL;

    UPDATE workers
    SET trust_score = 0
    WHERE trust_score IS NULL;

    UPDATE workers
    SET rating = 0
    WHERE rating IS NULL;

    UPDATE workers
    SET is_available = TRUE
    WHERE is_available IS NULL;

    UPDATE workers
    SET is_verified = FALSE
    WHERE is_verified IS NULL;


    /*
    ============================================================
    CUSTOMER PROFILE MIGRATION
    ============================================================
    */

    ALTER TABLE customer_profiles
      ADD COLUMN IF NOT EXISTS preferred_service_area TEXT;

    ALTER TABLE customer_profiles
      ADD COLUMN IF NOT EXISTS common_services_required TEXT[]
      DEFAULT '{}';

    ALTER TABLE customer_profiles
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP;
          /*
    ============================================================
    INSURANCE RECORDS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS insurance_records (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      worker_id UUID UNIQUE NOT NULL
        REFERENCES workers(id)
        ON DELETE CASCADE,

      status VARCHAR(30)
        NOT NULL
        DEFAULT 'ACTIVE',

      selected_contribution NUMERIC(10,2)
        NOT NULL
        DEFAULT 0,

      tier VARCHAR(50),

      reference VARCHAR(100)
        UNIQUE,

      policy VARCHAR(100),

      enrolled_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      consent BOOLEAN
        NOT NULL
        DEFAULT FALSE,

      coverage_details JSONB
        DEFAULT '{}'::jsonb,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    INSURANCE CONTRIBUTION HISTORY
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS insurance_contributions (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      worker_id UUID NOT NULL
        REFERENCES workers(id)
        ON DELETE CASCADE,

      insurance_record_id UUID
        REFERENCES insurance_records(id)
        ON DELETE CASCADE,

      amount NUMERIC(10,2)
        NOT NULL
        DEFAULT 0,

      status VARCHAR(30)
        NOT NULL
        DEFAULT 'PAID',

      contribution_date TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    INSURANCE CLAIMS
    ============================================================
    */

    CREATE TABLE IF NOT EXISTS insurance_claims (
      id UUID PRIMARY KEY
        DEFAULT uuid_generate_v4(),

      worker_id UUID NOT NULL
        REFERENCES workers(id)
        ON DELETE CASCADE,

      insurance_record_id UUID
        REFERENCES insurance_records(id)
        ON DELETE CASCADE,

      claim_type VARCHAR(100)
        NOT NULL,

      description TEXT
        NOT NULL,

      amount NUMERIC(10,2),

      status VARCHAR(30)
        NOT NULL
        DEFAULT 'SUBMITTED',

      created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
    );


    /*
    ============================================================
    INSURANCE INDEXES
    ============================================================
    */

    CREATE INDEX IF NOT EXISTS idx_insurance_records_worker
      ON insurance_records(worker_id);

    CREATE INDEX IF NOT EXISTS idx_insurance_contributions_worker
      ON insurance_contributions(worker_id);

    CREATE INDEX IF NOT EXISTS idx_insurance_claims_worker
      ON insurance_claims(worker_id);
  `);

  console.log(
    '[Database] Registration schema verified successfully'
  );
}

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  query,

  isPostgresConnected: () =>
    usePostgres,

  getStore: () =>
    inMemoryStore,

  ensureRegistrationSchema
};
