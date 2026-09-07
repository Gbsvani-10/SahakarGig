const db = require('../db');

// Create emergency or regular booking
exports.createBooking = async (req, res) => {
    const { customerId, skill, latitude, longitude, isEmergency = false } = req.body;

    try {
        // Find closest available worker automatically for emergency requests
        let assignedWorkerId = null;
        if (isEmergency) {
            const workerQuery = `
                SELECT id, ( 6371 * acos( cos( radians($1) ) * cos( radians( latitude ) ) 
                * cos( radians( longitude ) - radians($2) ) + sin( radians($1) ) 
                * sin( radians( latitude ) ) ) ) AS distance_km
                FROM workers
                WHERE skill = $3 AND is_verified = TRUE AND is_available = TRUE
                ORDER BY distance_km ASC LIMIT 1;
            `;
            const workerRes = await db.query(workerQuery, [latitude, longitude, skill]);
            
            if (workerRes.rows.length === 0) {
                return res.status(404).json({ error: 'No available workers found nearby' });
            }
            assignedWorkerId = workerRes.rows[0].id;
        }

        const bookingQuery = `
            INSERT INTO bookings (customer_id, worker_id, service_type, is_emergency, latitude, longitude, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const initialStatus = isEmergency ? 'accepted' : 'requested';
        const { rows } = await db.query(bookingQuery, [
            customerId, assignedWorkerId, skill, isEmergency, latitude, longitude, initialStatus
        ]);

        // If emergency assigned, set worker as temporarily unavailable
        if (assignedWorkerId) {
            await db.query('UPDATE workers SET is_available = FALSE WHERE id = $1', [assignedWorkerId]);
        }

        res.status(201).json({ message: 'Booking created successfully', booking: rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error creating booking' });
    }
};