const db = require('../db');

exports.createBooking = async (req, res) => {
    const { skill, latitude, longitude, isEmergency = false, workerId = null } = req.body || {};
    const customerId = req.user.id;

    if (!skill || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
        return res.status(400).json({ error: 'Skill, valid latitude and longitude are required' });
    }

    try {
        let assignedWorkerId = workerId;
        if (isEmergency && !assignedWorkerId) {
            const workerQuery = `
                SELECT id,
                  (6371 * acos(LEAST(1, GREATEST(-1,
                    cos(radians($1)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians($2)) +
                    sin(radians($1)) * sin(radians(latitude))
                  )))) AS distance_km
                FROM workers
                WHERE lower(skill) = lower($3) AND is_verified = TRUE AND is_available = TRUE
                  AND latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY distance_km ASC LIMIT 1;
            `;
            const workerRes = await db.query(workerQuery, [Number(latitude), Number(longitude), skill]);
            if (!workerRes.rows.length) return res.status(404).json({ error: 'No available workers found nearby' });
            assignedWorkerId = workerRes.rows[0].id;
        }

        if (assignedWorkerId) {
            const workerCheck = await db.query('SELECT id FROM workers WHERE id = $1 AND is_verified = TRUE', [assignedWorkerId]);
            if (!workerCheck.rows.length) return res.status(400).json({ error: 'Selected worker is not available' });
        }

        const initialStatus = isEmergency ? 'accepted' : 'requested';
        const bookingQuery = `
            INSERT INTO bookings (customer_id, worker_id, service_type, is_emergency, latitude, longitude, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const { rows } = await db.query(bookingQuery, [
            customerId, assignedWorkerId, String(skill).toLowerCase(), !!isEmergency,
            Number(latitude), Number(longitude), initialStatus
        ]);

        if (assignedWorkerId && isEmergency) {
            await db.query('UPDATE workers SET is_available = FALSE WHERE id = $1', [assignedWorkerId]);
        }

        res.status(201).json({ message: 'Booking created successfully', booking: rows[0] });
    } catch (err) {
        console.error('Create Booking Error:', err);
        res.status(500).json({ error: 'Server error creating booking' });
    }
};
