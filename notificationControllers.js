const db = require('../db');

const toUserNotification = (row) => ({
    id: row.id,
    recipientUserId: row.recipient_user_id || undefined,
    recipientRole: row.recipient_role === 'coop_admin' ? 'admin' : row.recipient_role,
    title: row.title,
    message: row.message,
    timestamp: new Date(row.created_at).toISOString(),
    isRead: row.is_read,
    type: row.type,
    linkTo: row.link_to || undefined
});

exports.getNotifications = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, recipient_user_id, recipient_role, title, message, type, link_to, is_read, created_at
            FROM notifications
            WHERE recipient_user_id = $1 OR (recipient_user_id IS NULL AND recipient_role = $2)
            ORDER BY created_at DESC
            LIMIT 100
        `, [req.user.id, req.user.role]);
        res.json({ success: true, data: result.rows.map(toUserNotification), timestamp: new Date().toISOString() });
    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.createNotification = async (req, res) => {
    const { recipientUserId = null, recipientRole = null, title, message, type, linkTo = null } = req.body || {};
    const normalizedRole = recipientRole === 'admin' ? 'coop_admin' : recipientRole;
    if ((!recipientUserId && !normalizedRole) || !title || !message || !type) {
        return res.status(400).json({ error: 'recipientUserId or recipientRole, title, message and type are required' });
    }
    if (recipientUserId && req.user.role !== 'coop_admin' && String(recipientUserId) !== String(req.user.id)) {
        return res.status(403).json({ error: 'You cannot create notifications for another user' });
    }
    try {
        const result = await db.query(`
            INSERT INTO notifications (recipient_user_id, recipient_role, title, message, type, link_to)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, recipient_user_id, recipient_role, title, message, type, link_to, is_read, created_at
        `, [recipientUserId, normalizedRole, title, message, type, linkTo]);
        res.status(201).json({ success: true, data: toUserNotification(result.rows[0]) });
    } catch (err) {
        console.error('Create notification error:', err);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const result = await db.query(`UPDATE notifications SET is_read = TRUE WHERE id = $1 AND (recipient_user_id = $2 OR (recipient_user_id IS NULL AND recipient_role = $3)) RETURNING id`, [req.params.notificationId, req.user.id, req.user.role]);
        if (!result.rows.length) return res.status(404).json({ error: 'Notification not found' });
        res.json({ success: true });
    } catch (err) {
        console.error('Mark notification read error:', err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await db.query(`UPDATE notifications SET is_read = TRUE WHERE recipient_user_id = $1 OR (recipient_user_id IS NULL AND recipient_role = $2)`, [req.user.id, req.user.role]);
        res.json({ success: true });
    } catch (err) {
        console.error('Mark all notifications read error:', err);
        res.status(500).json({ error: 'Failed to update notifications' });
    }
};
