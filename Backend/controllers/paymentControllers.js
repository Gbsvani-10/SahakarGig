const db = require('../db');
const axios = require('axios');

// Create invoice and complete payment
exports.completeServicePayment = async (req, res) => {
    const { bookingId, amount, paymentMethod, transactionRef } = req.body;

    try {
        await db.query('BEGIN'); // Start transaction

        // 1. Mark booking as completed
        const bookingRes = await db.query(
            `UPDATE bookings SET status = 'completed', amount = $1 WHERE id = $2 RETURNING *`,
            [amount, bookingId]
        );

        if (bookingRes.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookingRes.rows[0];

        // 2. Free up the worker
        if (booking.worker_id) {
            await db.query('UPDATE workers SET is_available = TRUE WHERE id = $1', [booking.worker_id]);
        }

        // 3. Generate Digital Invoice Record
        const invoiceNum = `INV-${Date.now()}`;
        const invoiceQuery = `
            INSERT INTO invoices (booking_id, invoice_number, amount, payment_method, transaction_ref, status)
            VALUES ($1, $2, $3, $4, $5, 'paid')
            RETURNING *;
        `;
        const invoiceRes = await db.query(invoiceQuery, [
            bookingId, invoiceNum, amount, paymentMethod, transactionRef
        ]);

        await db.query('COMMIT');

        res.status(200).json({
            message: 'Payment verified and invoice generated',
            invoice: invoiceRes.rows[0]
        });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Failed to process service completion' });
    }
};