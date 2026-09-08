const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authControllers');
const workerCtrl = require('../controllers/workerControllers');
const bookingCtrl = require('../controllers/bookingControllers');
const adminCtrl = require('../controllers/adminControllers');
const paymentCtrl = require('../controllers/paymentControllers');
const aiBridgeCtrl = require('../controllers/aiBridgeController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const db = require('../db');

router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SahakarGig Cooperative Platform',
    database: db.isPostgresConnected() ? 'PostgreSQL' : 'Embedded Resilient DB',
    timestamp: new Date().toISOString()
  });
});

router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

router.get('/workers/nearby', workerCtrl.getNearbyWorkers);
router.patch('/workers/:workerId/verify', verifyToken, authorizeRoles('coop_admin'), workerCtrl.verifyWorker);
router.post('/workers/rate', verifyToken, authorizeRoles('customer'), workerCtrl.rateWorker);

router.patch('/workers/location', verifyToken, authorizeRoles('worker'), async (req, res) => {
  const workerId = req.user.id;
  const { latitude, longitude } = req.body || {};
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
    return res.status(400).json({ success: false, error: 'Valid latitude and longitude are required' });
  }
  try {
    const result = await db.query(
      'UPDATE workers SET latitude = $1, longitude = $2 WHERE id = $3 OR id = (SELECT id FROM workers WHERE phone = (SELECT phone FROM users WHERE id = $3)) RETURNING *',
      [Number(latitude), Number(longitude), workerId]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Worker profile not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to update worker location' });
  }
});

router.get('/workers/:workerId/location', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, skill, latitude, longitude, rating FROM workers WHERE id = $1',
      [req.params.workerId]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Worker not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to get location' });
  }
});

const handleServicesNearby = async (req, res) => {
  const lat = req.method === 'POST' ? Number(req.body?.latitude) : Number(req.query?.latitude);
  const lng = req.method === 'POST' ? Number(req.body?.longitude) : Number(req.query?.longitude);
  const service = String(req.method === 'POST' ? req.body?.service || '' : req.query?.service || '').trim().toLowerCase();
  const radiusKm = Number(req.method === 'POST' ? req.body?.radiusKm : req.query?.radiusKm) || 15;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ success: false, error: 'Valid latitude and longitude are required' });
  }
  try {
    const workers = await db.query(`
      SELECT id, cooperative_id, name, phone, skill, rating, latitude, longitude,
        (6371 * acos(LEAST(1, GREATEST(-1,
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )))) AS distance_km
      FROM workers
      WHERE is_verified = TRUE
        AND is_available = TRUE
        AND ($3 = '' OR lower(skill) = $3)
        AND latitude IS NOT NULL AND longitude IS NOT NULL
    `, [lat, lng, service]);

    const filtered = workers.rows
      .map(w => ({ ...w, distance_km: Number(Number(w.distance_km).toFixed(2)) }))
      .filter(w => w.distance_km <= radiusKm)
      .sort((a, b) => a.distance_km - b.distance_km || Number(b.rating) - Number(a.rating));

    res.json({ success: true, data: { center: { latitude: lat, longitude: lng }, radiusKm, count: filtered.length, workers: filtered }, timestamp: new Date().toISOString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};

router.get('/services/nearby', handleServicesNearby);
router.post('/services/nearby', handleServicesNearby);

router.get('/geocode/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) return res.status(400).json({ success: false, error: 'Search query required' });
  const encoded = encodeURIComponent(query);
  try {
    const axios = require('axios');
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&q=${encoded}`, {
      headers: { 'User-Agent': 'SahakarGig/1.0 contact@sahakargig.local' },
      timeout: 8000
    });
    const data = response.data.map(p => ({ lat: Number(p.lat), lng: Number(p.lon), displayName: p.display_name }));
    res.json({ success: true, data });
  } catch (e) {
    res.status(503).json({ success: false, error: 'Geocoding service temporarily unavailable' });
  }
});

router.post('/bookings/create', verifyToken, authorizeRoles('customer'), bookingCtrl.createBooking);
router.post('/bookings/complete-payment', verifyToken, authorizeRoles('customer'), paymentCtrl.completeServicePayment);

router.get('/admin/metrics', verifyToken, authorizeRoles('coop_admin'), adminCtrl.getCooperativeMetrics);
router.post('/admin/ai/demand-forecast', verifyToken, authorizeRoles('coop_admin'), aiBridgeCtrl.getDemandForecast);

module.exports = router;
