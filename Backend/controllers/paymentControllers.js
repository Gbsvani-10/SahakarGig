const crypto = require('crypto');
const axios = require('axios');
const db = require('../db');

const getRazorpayConfig = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
        const error = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
        error.statusCode = 503;
        throw error;
    }
    return { keyId, keySecret };
};

const razorpayRequest = async (method, path, data) => {
    const { keyId, keySecret } = getRazorpayConfig();
    const response = await axios({
        method,
        url: `https://api.razorpay.com/v1${path}`,
        data,
        auth: { username: keyId, password: keySecret },
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
    });
    return response.data;
};

const getOwnedCompletedBooking = async (bookingId, customerId) => {
    const result = await db.query(
        'SELECT b.*, w.name AS worker_name FROM bookings b LEFT JOIN workers w ON w.id=b.worker_id WHERE b.id=$1 AND b.customer_id=$2',
        [bookingId, customerId]
    );
    if (!result.rows.length) return null;
    return result.rows[0];
};

exports.createRazorpayOrder = async (req, res) => {
    const { bookingId } = req.body || {};
    if (!bookingId) return res.status(400).json({ error: 'bookingId is required.' });

    try {
        const booking = await getOwnedCompletedBooking(bookingId, req.user.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found.' });
        if (booking.status !== 'completed') return res.status(400).json({ error: 'Service must be completed before payment.' });
        if (booking.amount == null || Number(booking.amount) <= 0) return res.status(400).json({ error: 'Booking has no valid payment amount.' });

        const existing = await db.query('SELECT * FROM invoices WHERE booking_id=$1', [bookingId]);
        if (existing.rows.length && existing.rows[0].status === 'paid') {
            return res.status(409).json({ error: 'This booking has already been paid.', invoice: existing.rows[0] });
        }

        const amountPaise = Math.round(Number(booking.amount) * 100);
        const order = await razorpayRequest('post', '/orders', {
            amount: amountPaise,
            currency: 'INR',
            receipt: `sg_${String(bookingId).replace(/-/g, '').slice(0, 30)}`,
            notes: { booking_id: String(bookingId), customer_id: String(req.user.id) }
        });

        res.json({
            success: true,
            data: {
                keyId: getRazorpayConfig().keyId,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                bookingId: String(bookingId),
                customerName: req.user.name || '',
                customerEmail: req.user.email || '',
                workerName: booking.worker_name || 'Cooperative Worker'
            }
        });
    } catch (err) {
        console.error('Razorpay order error:', err.response?.data || err.message);
        const status = err.statusCode || err.response?.status || 500;
        res.status(status).json({ error: status === 503 ? err.message : 'Unable to create payment order.' });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Payment verification fields are required.' });
    }

    try {
        const booking = await getOwnedCompletedBooking(bookingId, req.user.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found.' });
        if (booking.status !== 'completed') return res.status(400).json({ error: 'Service must be completed before payment.' });

        const { keySecret } = getRazorpayConfig();
        const expectedSignature = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const signaturesMatch = crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'utf8'),
            Buffer.from(String(razorpay_signature), 'utf8')
        );
        if (!signaturesMatch) return res.status(400).json({ error: 'Invalid payment signature.' });

        const order = await razorpayRequest('get', `/orders/${encodeURIComponent(razorpay_order_id)}`);
        const payment = await razorpayRequest('get', `/payments/${encodeURIComponent(razorpay_payment_id)}`);
        const expectedAmount = Math.round(Number(booking.amount) * 100);

        if (order.id !== razorpay_order_id || String(order.receipt || '').length === 0) {
            return res.status(400).json({ error: 'Payment order could not be verified.' });
        }
        if (Number(order.amount) !== expectedAmount || String(order.currency) !== 'INR') {
            return res.status(400).json({ error: 'Payment amount or currency does not match the booking.' });
        }
        if (String(payment.order_id) !== String(razorpay_order_id) || Number(payment.amount) !== expectedAmount) {
            return res.status(400).json({ error: 'Payment does not match the booking order.' });
        }
        if (payment.status !== 'captured') {
            return res.status(400).json({ error: `Payment is not captured (status: ${payment.status}).` });
        }

        const invoiceNum = `INV-${Date.now()}`;
        const invoiceRes = await db.query(
            `INSERT INTO invoices (booking_id,invoice_number,amount,payment_method,transaction_ref,status)
             VALUES ($1,$2,$3,$4,$5,'paid')
             ON CONFLICT (booking_id) DO UPDATE SET
               amount=EXCLUDED.amount,
               payment_method=EXCLUDED.payment_method,
               transaction_ref=EXCLUDED.transaction_ref,
               status='paid'
             RETURNING *`,
            [bookingId, invoiceNum, Number(booking.amount), String(payment.method || 'Razorpay').toUpperCase(), razorpay_payment_id]
        );

        if (booking.worker_id) await db.query('UPDATE workers SET is_available=true WHERE id=$1', [booking.worker_id]);
        res.json({
            success: true,
            message: 'Real payment verified and invoice generated.',
            data: {
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                invoice: invoiceRes.rows[0]
            }
        });
    } catch (err) {
        console.error('Razorpay verification error:', err.response?.data || err.message);
        const status = err.statusCode || err.response?.status || 500;
        res.status(status).json({ error: status === 503 ? err.message : 'Payment verification failed.' });
    }
};

exports.completeServicePayment = exports.verifyRazorpayPayment;
