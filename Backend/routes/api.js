const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authControllers');
const workerCtrl = require('../controllers/workerControllers');
const bookingCtrl = require('../controllers/bookingControllers');
const adminCtrl = require('../controllers/adminControllers');
const paymentCtrl = require('../controllers/paymentControllers');
const aiBridgeCtrl = require('../controllers/aiBridgeController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// System Health Check
router.get('/health', (req, res) => {
    const db = require('../db');
    res.json({
        status: 'healthy',
        platform: 'SahakarGig Cooperative Platform',
        database: db.isPostgresConnected() ? 'PostgreSQL' : 'Embedded Resilient DB',
        timestamp: new Date().toISOString()
    });
});

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// Worker Routes
router.get('/workers/nearby', workerCtrl.getNearbyWorkers);
router.patch('/workers/:workerId/verify', verifyToken, authorizeRoles('coop_admin'), workerCtrl.verifyWorker);
router.post('/workers/rate', verifyToken, authorizeRoles('customer'), workerCtrl.rateWorker);

// Worker Location & Geocoding Routes
router.patch('/workers/location', verifyToken, async (req, res) => {
    const db = require('../db');
    const workerId = req.body?.workerId || req.user?.id || 'work-201';
    const { latitude, longitude } = req.body;
    try {
        const result = await db.query(
            'UPDATE workers SET latitude = $1, longitude = $2 WHERE id = $3 RETURNING *',
            [latitude, longitude, workerId]
        );
        res.json({ success: true, message: 'Worker location updated', worker: result.rows[0] });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Failed to update location' });
    }
});

router.get('/workers/:workerId/location', async (req, res) => {
    const db = require('../db');
    const { workerId } = req.params;
    try {
        const result = await db.query('SELECT id, name, skill, latitude, longitude, rating FROM workers WHERE id = $1', [workerId]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Worker not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Failed to get location' });
    }
});

// Services Nearby Search
const handleServicesNearby = async (req, res) => {
    const db = require('../db');
    const lat = req.method === 'POST' ? req.body?.latitude : parseFloat(req.query?.latitude);
    const lng = req.method === 'POST' ? req.body?.longitude : parseFloat(req.query?.longitude);
    const service = (req.method === 'POST' ? req.body?.service : req.query?.service || '').toLowerCase();
    const radiusKm = parseFloat(req.method === 'POST' ? req.body?.radiusKm : req.query?.radiusKm) || 15;

    try {
        const queryResult = await db.query(
            'SELECT * FROM workers WHERE skill = $3',
            [lat, lng, service, radiusKm]
        );
        res.json({
            success: true,
            data: {
                center: { latitude: lat, longitude: lng },
                radiusKm,
                count: queryResult.rows.length,
                workers: queryResult.rows
            }
        });
    } catch (e) {
        res.status(500).json({ success: false, error: 'Search failed' });
    }
};

router.get('/services/nearby', handleServicesNearby);
router.post('/services/nearby', handleServicesNearby);

// Geocode Search Preset
router.get('/geocode/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase().trim();
    const PRESET_PLACES = [
        { name: 'noida', lat: 28.5355, lng: 77.3910, displayName: 'Sector 62, Noida, Uttar Pradesh' },
        { name: 'delhi', lat: 28.6139, lng: 77.2090, displayName: 'Connaught Place, New Delhi' },
        { name: 'hyderabad', lat: 17.3850, lng: 78.4867, displayName: 'Hyderabad Cooperative Zone, Telangana' },
        { name: 'bengaluru', lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru Central, Karnataka' },
        { name: 'mumbai', lat: 19.0760, lng: 72.8777, displayName: 'Mumbai Dadar Cooperative Hub, Maharashtra' }
    ];
    const match = PRESET_PLACES.find(p => query.includes(p.name)) || PRESET_PLACES[0];
    res.json({
        success: true,
        data: [{ lat: match.lat, lng: match.lng, displayName: match.displayName }]
    });
});

// Booking & Emergency Routes
router.post('/bookings/create', verifyToken, bookingCtrl.createBooking);
router.post('/bookings/complete-payment', verifyToken, paymentCtrl.completeServicePayment);

// Admin & AI Bridge Routes
router.get('/admin/metrics', verifyToken, authorizeRoles('coop_admin'), adminCtrl.getCooperativeMetrics);
router.post('/admin/ai/demand-forecast', verifyToken, authorizeRoles('coop_admin'), aiBridgeCtrl.getDemandForecast);

module.exports = router;