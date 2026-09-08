const db = require('../db');

exports.getNearbyWorkers = async (req, res) => {
    const { skill, latitude, longitude, radiusKm = 10 } = req.query;
    const lat = Number(latitude), lng = Number(longitude), radius = Number(radiusKm);
    if (!skill || !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(radius) || radius <= 0) {
        return res.status(400).json({ error: 'Missing or invalid search parameters' });
    }
    try {
        const { rows } = await db.query(`
            SELECT id, cooperative_id, name, phone, skill, rating, latitude, longitude,
              (6371 * acos(LEAST(1, GREATEST(-1,
                cos(radians($1)) * cos(radians(latitude)) *
                cos(radians(longitude) - radians($2)) +
                sin(radians($1)) * sin(radians(latitude))
              )))) AS distance_km
            FROM workers
            WHERE lower(skill) = lower($3) AND is_verified = TRUE AND is_available = TRUE
              AND latitude IS NOT NULL AND longitude IS NOT NULL
        `, [lat, lng, skill]);
        const workers = rows
            .map(w => ({ ...w, distance_km: Number(Number(w.distance_km).toFixed(2)) }))
            .filter(w => w.distance_km <= radius)
            .sort((a, b) => a.distance_km - b.distance_km || Number(b.rating) - Number(a.rating));
        res.status(200).json({ count: workers.length, workers });
    } catch (err) {
        console.error('Get Nearby Workers Error:', err);
        res.status(500).json({ error: 'Server error fetching workers.' });
    }
};

exports.verifyWorker = async (req, res) => {
    const { workerId } = req.params;
    if (!workerId) return res.status(400).json({ error: 'Worker ID is required.' });
    try {
        const result = await db.query(
            'UPDATE workers SET is_verified = TRUE WHERE id = $1 RETURNING id, name, is_verified', [workerId]
        );
        if (!result.rows.length) return res.status(404).json({ error: 'Worker not found.' });
        res.status(200).json({ message: 'Worker verified successfully.', worker: result.rows[0] });
    } catch (err) {
        console.error('Verify Worker Error:', err);
        res.status(500).json({ error: 'Failed to verify worker.' });
    }
};

exports.rateWorker = async (req, res) => {
    const { bookingId, workerId, score, feedback } = req.body || {};
    const customerId = req.user.id;
    const rating = Number(score);
    if (!bookingId || !workerId || !Number.isFinite(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Missing or invalid rating details.' });
    }
    try {
        const booking = await db.query(
            `SELECT id, worker_id, customer_id, status FROM bookings WHERE id = $1`, [bookingId]
        );
        if (!booking.rows.length) return res.status(404).json({ error: 'Booking not found.' });
        const b = booking.rows[0];
        if (String(b.customer_id) !== String(customerId) || String(b.worker_id) !== String(workerId)) {
            return res.status(403).json({ error: 'You are not allowed to rate this booking.' });
        }
        if (b.status !== 'completed') return res.status(400).json({ error: 'Only completed bookings can be rated.' });

        await db.query(
            `INSERT INTO ratings (booking_id, worker_id, customer_id, rating_score, feedback_text)
             VALUES ($1, $2, $3, $4, $5)`,
            [bookingId, workerId, customerId, rating, feedback || '']
        );
        const updateRes = await db.query(
            `UPDATE workers SET rating = (
                SELECT ROUND(AVG(rating_score)::numeric, 2) FROM ratings WHERE worker_id = $1
             ) WHERE id = $1 RETURNING id, name, rating`, [workerId]
        );
        res.status(200).json({ message: 'Rating submitted and worker profile updated.', worker: updateRes.rows[0] });
    } catch (err) {
        console.error('Rate Worker Error:', err);
        res.status(500).json({ error: 'Failed to submit rating.' });
    }
};
