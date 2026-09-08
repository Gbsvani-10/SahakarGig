const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../db');
const authCtrl = require('../controllers/authControllers');
const workerCtrl = require('../controllers/workerControllers');
const bookingCtrl = require('../controllers/bookingControllers');
const adminCtrl = require('../controllers/adminControllers');
const paymentCtrl = require('../controllers/paymentControllers');
const aiBridgeCtrl = require('../controllers/aiBridgeController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/health', (_req, res) => res.json({ status: 'healthy', platform: 'SahakarGig Cooperative Platform', database: db.isPostgresConnected() ? 'PostgreSQL' : 'Embedded Development DB', timestamp: new Date().toISOString() }));
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

router.get('/workers', verifyToken, async (_req, res) => {
  try {
    const result = await db.query(`SELECT w.id, w.user_id, w.cooperative_id, w.name, w.phone, w.skill, w.is_verified, w.is_available, w.rating, w.latitude, w.longitude, c.name AS cooperative_name FROM workers w LEFT JOIN cooperatives c ON c.id = w.cooperative_id ORDER BY w.name`);
    res.json({ success: true, data: result.rows });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to fetch workers' }); }
});
router.get('/workers/nearby', workerCtrl.getNearbyWorkers);
router.patch('/workers/:workerId/verify', verifyToken, authorizeRoles('coop_admin'), workerCtrl.verifyWorker);
router.post('/workers/rate', verifyToken, authorizeRoles('customer'), workerCtrl.rateWorker);

router.patch('/workers/location', verifyToken, authorizeRoles('worker'), async (req, res) => {
  const { latitude, longitude } = req.body || {};
  if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return res.status(400).json({ error: 'Valid coordinates are required' });
  try {
    const result = await db.query(`UPDATE workers SET latitude=$1, longitude=$2 WHERE user_id=$3 RETURNING *`, [Number(latitude), Number(longitude), req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Worker profile not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Failed to update worker location' }); }
});

router.get('/workers/:workerId/location', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, skill, latitude, longitude, rating FROM workers WHERE id=$1', [req.params.workerId]);
    if (!result.rows.length) return res.status(404).json({ error: 'Worker not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (e) { res.status(500).json({ error: 'Failed to get location' }); }
});

const handleServicesNearby = async (req, res) => {
  const lat = Number(req.method === 'POST' ? req.body?.latitude : req.query?.latitude);
  const lng = Number(req.method === 'POST' ? req.body?.longitude : req.query?.longitude);
  const service = String(req.method === 'POST' ? req.body?.service || '' : req.query?.service || '').trim().toLowerCase();
  const radiusKm = Number(req.method === 'POST' ? req.body?.radiusKm : req.query?.radiusKm) || 15;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return res.status(400).json({ error: 'Valid latitude and longitude are required' });
  try {
    const result = await db.query(`SELECT id, user_id, cooperative_id, name, phone, skill, rating, latitude, longitude, is_verified, is_available, (6371 * acos(LEAST(1,GREATEST(-1,cos(radians($1))*cos(radians(latitude))*cos(radians(longitude)-radians($2))+sin(radians($1))*sin(radians(latitude)))))) AS distance_km FROM workers WHERE is_verified=true AND is_available=true AND ($3='' OR lower(skill)=lower($3)) AND latitude IS NOT NULL AND longitude IS NOT NULL`, [lat, lng, service]);
    const workers = result.rows.map(w => ({ ...w, distance_km: Number(Number(w.distance_km).toFixed(2)) })).filter(w => w.distance_km <= radiusKm).sort((a,b) => a.distance_km-b.distance_km || Number(b.rating)-Number(a.rating));
    res.json({ success: true, data: { center:{latitude:lat,longitude:lng}, radiusKm, count:workers.length, workers }, timestamp:new Date().toISOString() });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Search failed' }); }
};
router.get('/services/nearby', handleServicesNearby);
router.post('/services/nearby', handleServicesNearby);

router.get('/geocode/search', async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) return res.status(400).json({ error: 'Search query required' });
  try {
    const r = await axios.get(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&q=${encodeURIComponent(query)}`, { headers:{'User-Agent':'SahakarGig/1.0'}, timeout:8000 });
    res.json({ success:true, data:r.data.map(p=>({lat:Number(p.lat),lng:Number(p.lon),displayName:p.display_name})) });
  } catch { res.status(503).json({ error:'Geocoding service temporarily unavailable' }); }
});

router.post('/bookings/create', verifyToken, authorizeRoles('customer'), bookingCtrl.createBooking);
router.get('/bookings', verifyToken, async (req,res) => {
  try {
    const isWorker = req.user.role === 'worker';
    const result = await db.query(isWorker ? `SELECT b.*, w.name worker_name FROM bookings b LEFT JOIN workers w ON w.id=b.worker_id WHERE w.user_id=$1 ORDER BY b.created_at DESC` : `SELECT b.*, w.name worker_name, w.phone worker_phone FROM bookings b LEFT JOIN workers w ON w.id=b.worker_id WHERE b.customer_id=$1 ORDER BY b.created_at DESC`, [req.user.id]);
    res.json({ success:true, data:result.rows });
  } catch(e){ console.error(e); res.status(500).json({error:'Failed to fetch bookings'}); }
});
router.patch('/bookings/:bookingId/status', verifyToken, async (req,res)=>{
  const {status}=req.body||{};
  if(!['requested','accepted','completed','cancelled'].includes(status)) return res.status(400).json({error:'Invalid booking status'});
  try{
    const result=await db.query(`UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,[status,req.params.bookingId]);
    if(!result.rows.length)return res.status(404).json({error:'Booking not found'});
    res.json({success:true,data:result.rows[0]});
  }catch(e){res.status(500).json({error:'Failed to update booking'});}
});
router.post('/bookings/complete-payment', verifyToken, authorizeRoles('customer'), paymentCtrl.completeServicePayment);

router.get('/admin/metrics', verifyToken, authorizeRoles('coop_admin'), adminCtrl.getCooperativeMetrics);
router.post('/admin/ai/demand-forecast', verifyToken, authorizeRoles('coop_admin'), aiBridgeCtrl.getDemandForecast);
module.exports = router;
