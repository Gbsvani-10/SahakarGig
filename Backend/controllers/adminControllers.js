const db = require('../db');

exports.getCooperativeMetrics = async (req, res) => {
    try {
        const workerStats = await db.query(`
            SELECT COUNT(*) AS total_workers,
                   COUNT(*) FILTER (WHERE is_available = TRUE AND is_verified = TRUE) AS active_workers,
                   COUNT(*) FILTER (WHERE is_verified = FALSE) AS pending_verifications
            FROM workers
        `);
        const jobStats = await db.query(`
            SELECT COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS todays_jobs,
                   COUNT(*) FILTER (WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE) AS completed_today,
                   COUNT(*) FILTER (WHERE is_emergency = TRUE AND DATE(created_at) = CURRENT_DATE) AS emergency_today,
                   COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) AS total_revenue
            FROM bookings
        `);
        const overview = {
            totalWorkers: Number(workerStats.rows[0].total_workers),
            activeWorkers: Number(workerStats.rows[0].active_workers),
            pendingVerifications: Number(workerStats.rows[0].pending_verifications),
            todaysJobs: Number(jobStats.rows[0].todays_jobs),
            completedToday: Number(jobStats.rows[0].completed_today),
            emergencyToday: Number(jobStats.rows[0].emergency_today),
            totalRevenue: Number(jobStats.rows[0].total_revenue)
        };
        res.json({ success: true, data: overview, timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Admin metrics error:', err);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
};
