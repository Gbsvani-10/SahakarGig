require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pgPool = null;
let usePostgres = false;

const inMemoryStore = {
  cooperatives: [{ id: 'coop-1', name: 'Hyderabad Labour Cooperative', region: 'Telangana', created_at: new Date().toISOString() }],
  users: [],
  workers: [],
  bookings: [],
  ratings: [],
  invoices: [],
  customer_profiles: []
};

if (process.env.DATABASE_URL) {
  const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
  pgPool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: isLocal ? false : { rejectUnauthorized: false } });
  usePostgres = true;
  pgPool.on('error', err => console.error('[Database] Unexpected PostgreSQL pool error:', err.message));
  console.log('[Database] PostgreSQL configured');
} else {
  console.warn('[Database] DATABASE_URL is missing; embedded mode is active for development only.');
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function query(text, params = []) {
  if (usePostgres && pgPool) return pgPool.query(text, params);

  const upper = text.trim().toUpperCase();
  if (/^(BEGIN|COMMIT|ROLLBACK)/.test(upper)) return { rows: [], rowCount: 0 };
  if (upper.includes('FROM USERS WHERE EMAIL =')) {
    const user = inMemoryStore.users.find(u => u.email.toLowerCase() === String(params[0] || '').toLowerCase());
    return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
  }
  if (upper.includes('INSERT INTO USERS')) {
    const [name, email, password_hash, phone, role] = params;
    if (inMemoryStore.users.some(u => u.email.toLowerCase() === String(email).toLowerCase())) { const e = new Error('User already exists'); e.code = '23505'; throw e; }
    const user = { id: `user-${Date.now()}`, name, email, password_hash, phone, role, created_at: new Date().toISOString() };
    inMemoryStore.users.push(user); return { rows: [{ id: user.id, name, email, phone, role }], rowCount: 1 };
  }
  if (upper.includes('FROM WORKERS') && upper.includes('SKILL')) {
    const lat = Number(params[0]), lng = Number(params[1]), skill = String(params[2] || '').toLowerCase(), radius = Number(params[3] || 15);
    const rows = inMemoryStore.workers.filter(w => w.is_verified && w.is_available && (!skill || w.skill.toLowerCase() === skill)).map(w => ({ ...w, distance_km: calculateDistance(lat,lng,w.latitude,w.longitude) })).filter(w => w.distance_km <= radius).sort((a,b) => a.distance_km-b.distance_km);
    return { rows, rowCount: rows.length };
  }
  return { rows: [], rowCount: 0 };
}


async function ensureRegistrationSchema() {
  if (!usePostgres || !pgPool) return;
  await pgPool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_area TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS experience_years NUMERIC(5,2) DEFAULT 0;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_work_type VARCHAR(40) DEFAULT 'Flexible / Gig';
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS expected_daily_wage NUMERIC(10,2) DEFAULT 0;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS availability VARCHAR(30) DEFAULT 'AVAILABLE';
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_type VARCHAR(30);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_number_masked VARCHAR(30);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_filename TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_data TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_name VARCHAR(100);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_relation VARCHAR(50);
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_radius_km NUMERIC(6,2) DEFAULT 15;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS bio TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS work_experience_summary TEXT;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS profile_completeness NUMERIC(5,2) DEFAULT 0;
    ALTER TABLE workers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    CREATE TABLE IF NOT EXISTS customer_profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      full_name VARCHAR(100) NOT NULL,
      contact_number VARCHAR(20) NOT NULL,
      email VARCHAR(150) NOT NULL,
      address TEXT NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      preferred_service_area TEXT,
      common_services_required TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

module.exports = { query, isPostgresConnected: () => usePostgres, getStore: () => inMemoryStore, ensureRegistrationSchema };

