const db = require('../db');

exports.completeServicePayment = async (req, res) => {
    const { bookingId, amount, paymentMethod = 'UPI', transactionRef = '' } = req.body || {};
    const paymentAmount = Number(amount);
    if (!bookingId || !Number.isFinite(paymentAmount) || paymentAmount <= 0) return res.status(400).json({ error: 'Valid bookingId and amount are required.' });
    try {
        const bookingRes = await db.query('SELECT * FROM bookings WHERE id=$1 AND customer_id=$2', [bookingId, req.user.id]);
        if (!bookingRes.rows.length) return res.status(404).json({ error: 'Booking not found.' });
        const booking = bookingRes.rows[0];
        if (booking.status !== 'completed') return res.status(400).json({ error: 'Service must be completed before payment.' });
        if (booking.amount != null && Math.abs(Number(booking.amount) - paymentAmount) > 0.01) return res.status(400).json({ error: 'Payment amount does not match the booking amount.' });

        await db.query('UPDATE bookings SET amount=$1 WHERE id=$2', [paymentAmount, bookingId]);
        if (booking.worker_id) await db.query('UPDATE workers SET is_available=true WHERE id=$1', [booking.worker_id]);
        const invoiceNum = `INV-${Date.now()}`;
        const invoiceRes = await db.query(`INSERT INTO invoices (booking_id,invoice_number,amount,payment_method,transaction_ref,status) VALUES ($1,$2,$3,$4,$5,'paid') ON CONFLICT (booking_id) DO UPDATE SET amount=EXCLUDED.amount,payment_method=EXCLUDED.payment_method,transaction_ref=EXCLUDED.transaction_ref,status='paid' RETURNING *`, [bookingId, invoiceNum, paymentAmount, paymentMethod, transactionRef]);
        res.json({ message:'Payment recorded and invoice generated.', invoice:invoiceRes.rows[0] });
    } catch (err) { console.error('Payment Error:',err); res.status(500).json({error:'Failed to process service payment.'}); }
};
