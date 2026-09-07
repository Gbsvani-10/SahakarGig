const db = require('../db');

// Get nearby verified & available workers (Geo-location matching)
exports.getNearbyWorkers = async (req, res) => {
    const { skill, latitude, longitude, radiusKm = 10 } = req.query;

    if (!skill || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required parameters: skill, latitude, longitude' });
    }

    try {
        const query = `
            SELECT id, cooperative_id, name, phone, skill, rating, latitude, longitude,
            ( 6371 * acos( cos( radians($1) ) * cos( radians( latitude ) ) 
            * cos( radians( longitude ) - radians($2) ) + sin( radians($1) ) 
            * sin( radians( latitude ) ) ) ) AS distance_km
            FROM workers
            WHERE skill = $3 AND is_verified = TRUE AND is_available = TRUE
            HAVING ( 6371 * acos( cos( radians($1) ) * cos( radians( latitude ) ) 
            * cos( radians( longitude ) - radians($2) ) + sin( radians($1) ) 
            * sin( radians( latitude ) ) ) ) < $4
            ORDER BY distance_km ASC, rating DESC;
        `;

        const { rows } = await db.query(query, [latitude, longitude, skill, radiusKm]);
        res.status(200).json({ count: rows.length, workers: rows });
    } catch (err) {
        console.error('Get Nearby Workers Error:', err);
        res.status(500).json({ error: 'Server error fetching workers.' });
    }
};

// Admin: Verify worker registration
exports.verifyWorker = async (req, res) => {
    const { workerId } = req.params;

    if (!workerId) {
        return res.status(400).json({ error: 'Worker ID is required.' });
    }

    try {
        const result = await db.query(
            'UPDATE workers SET is_verified = TRUE WHERE id = $1 RETURNING id, name, is_verified', 
            [workerId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Worker not found.' });
        }

        res.status(200).json({ 
            message: 'Worker verified successfully.', 
            worker: result.rows[0] 
        });
    } catch (err) {
        console.error('Verify Worker Error:', err);
        res.status(500).json({ error: 'Failed to verify worker.' });
    }
};

// Customer: Rate worker after job completion (Atomic Transaction)
exports.rateWorker = async (req, res) => {
    const { bookingId, workerId, customerId, score, feedback } = req.body;

    if (!bookingId || !workerId || !customerId || !score) {
        return res.status(400).json({ error: 'Missing required rating details.' });
    }

    if (score < 1 || score > 5) {
        return res.status(400).json({ error: 'Rating score must be between 1 and 5.' });
    }

    try {
        await db.query('BEGIN'); // Start SQL Transaction

        // 1. Insert Rating Record
        await db.query(
            `INSERT INTO ratings (booking_id, worker_id, customer_id, rating_score, feedback_text) 
             VALUES ($1, $2, $3, $4, $5)`,
            [bookingId, workerId, customerId, score, feedback || '']
        );

        // 2. Recalculate average rating & update worker profile
        const updateRes = await db.query(
            `UPDATE workers 
             SET rating = (
                 SELECT ROUND(AVG(rating_score)::numeric, 2) 
                 FROM ratings 
                 WHERE worker_id = $1
             ) 
             WHERE id = $1 
             RETURNING id, name, rating`,
            [workerId]
        );

        await db.query('COMMIT'); // Commit Transaction

        res.status(200).json({ 
            message: 'Rating submitted and worker profile updated.', 
            worker: updateRes.rows[0] 
        });
    } catch (err) {
        await db.query('ROLLBACK'); // Rollback on error
        console.error('Rate Worker Error:', err);
        res.status(500).json({ error: 'Failed to submit rating.' });
    }
};