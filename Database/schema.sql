CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('customer', 'worker', 'coop_admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cooperatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    cooperative_id UUID REFERENCES cooperatives(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    skill VARCHAR(50) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 5.00,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES users(id),
    worker_id UUID REFERENCES workers(id),
    service_type VARCHAR(50) NOT NULL,
    is_emergency BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) CHECK (status IN ('requested', 'accepted', 'completed', 'cancelled')) DEFAULT 'requested',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    amount NUMERIC(8,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount NUMERIC(8,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating_score NUMERIC(2,1) CHECK (rating_score >= 1.0 AND rating_score <= 5.0),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registration/onboarding fields used by the unified landing-page flow
ALTER TABLE workers ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS pincode VARCHAR(10);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_area TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS experience_years NUMERIC(5,2) DEFAULT 0;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_work_type VARCHAR(40) DEFAULT 'Flexible / Gig';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS expected_daily_wage NUMERIC(10,2) DEFAULT 0;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS availability VARCHAR(30) DEFAULT 'AVAILABLE';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '[]'::jsonb;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_type VARCHAR(30);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_number_masked VARCHAR(30);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_filename TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS identity_doc_data TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_name VARCHAR(100);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_phone VARCHAR(20);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS emergency_relation VARCHAR(50);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS preferred_radius_km NUMERIC(6,2) DEFAULT 15;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT '{}';
ALTER TABLE workers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS work_experience_summary TEXT;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS profile_completeness NUMERIC(5,2) DEFAULT 0;
ALTER TABLE workers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  contact_number VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  preferred_service_area TEXT,
  common_services_required TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
