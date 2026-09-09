const db = require('../db');

const createNotification = async (recipientUserId, recipientRole, title, message, type, linkTo) => {
    await db.query(`INSERT INTO notifications (recipient_user_id, recipient_role, title, message, type, link_to) VALUES ($1,$2,$3,$4,$5,$6)`, [recipientUserId || null, recipientRole || null, title, message, type, linkTo || null]);
};

exports.createBooking = async (req, res) => {
    const { skill, latitude, longitude, isEmergency = false, workerId = null } = req.body || {};
    const customerId = req.user.id;
    if (!skill || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) return res.status(400).json({ error: 'Skill, valid latitude and longitude are required' });
    try {
        let assignedWorkerId = workerId;
        if (isEmergency && !assignedWorkerId) {
            const workerQuery = `SELECT id,(6371 * acos(LEAST(1,GREATEST(-1,cos(radians($1))*cos(radians(latitude))*cos(radians(longitude)-radians($2))+sin(radians($1))*sin(radians(latitude)))))) AS distance_km FROM workers WHERE lower(skill)=lower($3) AND is_verified=TRUE AND is_available=TRUE AND latitude IS NOT NULL AND longitude IS NOT NULL ORDER BY distance_km ASC LIMIT 1`;
            const workerRes = await db.query(workerQuery, [Number(latitude), Number(longitude), skill]);
            if (!workerRes.rows.length) return res.status(404).json({ error: 'No available workers found nearby' });
            assignedWorkerId = workerRes.rows[0].id;
        }
        let workerUserId = null;
        if (assignedWorkerId) {
            const workerCheck = await db.query('SELECT id,user_id FROM workers WHERE id=$1 AND is_verified=TRUE', [assignedWorkerId]);
            if (!workerCheck.rows.length) return res.status(400).json({ error: 'Selected worker is not available' });
            workerUserId = workerCheck.rows[0].user_id;
        }
        const initialStatus = isEmergency ? 'accepted' : 'requested';
        const bookingQuery = `INSERT INTO bookings (customer_id,worker_id,service_type,is_emergency,latitude,longitude,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
        const { rows } = await db.query(bookingQuery, [customerId, assignedWorkerId, String(skill).toLowerCase(), !!isEmergency, Number(latitude), Number(longitude), initialStatus]);
        const booking = rows[0];
        if (assignedWorkerId && isEmergency) await db.query('UPDATE workers SET is_available=FALSE WHERE id=$1', [assignedWorkerId]);
        if (workerUserId) await createNotification(workerUserId, 'worker', isEmergency ? '🚨 Emergency Request Dispatched!' : 'New Service Booking Received', `You have a new ${String(skill)} service request${isEmergency ? ' marked as emergency' : ''}.`, isEmergency ? 'emergency' : 'booking', '/worker/jobs');
        await createNotification(customerId, 'customer', isEmergency ? '🚨 Emergency Request Created' : 'Booking Request Created', `Your ${String(skill)} service request has been registered successfully.`, isEmergency ? 'emergency' : 'booking', '/customer/bookings');
        await createNotification(null, 'coop_admin', isEmergency ? 'Urgent Emergency Request Logged' : 'New Platform Booking Created', `${String(skill)} booking ${booking.id} has been created.`, isEmergency ? 'emergency' : 'system', '/admin/bookings');
        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (err) {
        console.error('Create Booking Error:', err);
        res.status(500).json({ error: 'Server error creating booking' });
    }
};
