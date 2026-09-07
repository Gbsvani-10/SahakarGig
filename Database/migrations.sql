-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker Ratings & Reviews Table
CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    worker_id UUID REFERENCES workers(id),
    customer_id UUID REFERENCES users(id),
    rating_score NUMERIC(2,1) CHECK (rating_score >= 1.0 AND rating_score <= 5.0),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);