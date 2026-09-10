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
  invoices: []
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

module.exports = { query, isPostgresConnected: () => usePostgres, getStore: () => inMemoryStore };
