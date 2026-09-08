const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
    if (transporter) return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    return transporter;
};

exports.sendPaymentConfirmation = async ({ to, customerName, amount, paymentId, orderId, invoiceNumber, serviceType }) => {
    if (!to) return { sent: false, reason: 'customer email is missing' };
    const mailer = getTransporter();
    if (!mailer) return { sent: false, reason: 'SMTP is not configured' };

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    await mailer.sendMail({
        from,
        to,
        subject: `SahakarGig Payment Successful - ${invoiceNumber}`,
        text: `Hello ${customerName || 'Customer'},\n\nYour SahakarGig payment was successful.\n\nService: ${serviceType || 'Service'}\nAmount: ₹${Number(amount).toFixed(2)}\nPayment ID: ${paymentId}\nOrder ID: ${orderId}\nInvoice: ${invoiceNumber}\n\nThank you for using SahakarGig.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px"><h2>SahakarGig Payment Successful</h2><p>Hello ${customerName || 'Customer'},</p><p>Your payment has been successfully verified.</p><table style="border-collapse:collapse;width:100%"><tr><td style="padding:8px 0"><b>Service</b></td><td>${serviceType || 'Service'}</td></tr><tr><td style="padding:8px 0"><b>Amount</b></td><td>₹${Number(amount).toFixed(2)}</td></tr><tr><td style="padding:8px 0"><b>Payment ID</b></td><td>${paymentId}</td></tr><tr><td style="padding:8px 0"><b>Order ID</b></td><td>${orderId}</td></tr><tr><td style="padding:8px 0"><b>Invoice</b></td><td>${invoiceNumber}</td></tr></table><p>Thank you for using SahakarGig.</p></div>`
    });
    return { sent: true };
};
