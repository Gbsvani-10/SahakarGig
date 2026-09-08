-- Apply after Database/init.sql on an existing database.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'worker', 'coop_admin'));

ALTER TABLE workers ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_workers_user_id ON workers(user_id);
CREATE INDEX IF NOT EXISTS idx_workers_geo ON workers(latitude, longitude, skill, is_available, is_verified);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON bookings(worker_id, created_at);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gateway VARCHAR(30);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(100);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS gateway_payment_id VARCHAR(100);
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_gateway_order ON invoices(gateway_order_id) WHERE gateway_order_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_gateway_payment ON invoices(gateway_payment_id) WHERE gateway_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating_score NUMERIC(2,1) CHECK (rating_score >= 1.0 AND rating_score <= 5.0),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
