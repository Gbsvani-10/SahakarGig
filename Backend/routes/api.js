const express = require('express');
const router = express.Router();

const authCtrl = require('../controllers/authControllers');
const workerCtrl = require('../controllers/workerControllers');
const bookingCtrl = require('../controllers/bookingControllers');
const adminCtrl = require('../controllers/adminControllers');
const paymentCtrl = require('../controllers/paymentControllers');
const aiBridgeCtrl = require('../controllers/aiBridgeController');

const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// Worker Routes
router.get('/workers/nearby', workerCtrl.getNearbyWorkers);
router.patch('/workers/:workerId/verify', verifyToken, authorizeRoles('coop_admin'), workerCtrl.verifyWorker);
router.post('/workers/rate', verifyToken, authorizeRoles('customer'), workerCtrl.rateWorker);

// Booking & Emergency Routes
router.post('/bookings/create', verifyToken, bookingCtrl.createBooking);
router.post('/bookings/complete-payment', verifyToken, paymentCtrl.completeServicePayment);

// Admin & AI Bridge Routes
router.get('/admin/metrics', verifyToken, authorizeRoles('coop_admin'), adminCtrl.getCooperativeMetrics);
router.post('/admin/ai/demand-forecast', verifyToken, authorizeRoles('coop_admin'), aiBridgeCtrl.getDemandForecast);

module.exports = router;