-- SahakarGig Cooperative Gig Services Platform
-- Migration: 001_add_geolocation_fields.sql
-- Purpose: Add geolocation, accuracy, service radius, and spatial index to workers table
-- Compatible with PostgreSQL + PostGIS (with fallback to spherical coordinates)

-- 1. Ensure PostGIS extension is available if supported
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Add geolocation columns to workers table
ALTER TABLE workers
  ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS location_accuracy DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS location_address TEXT,
  ADD COLUMN IF NOT EXISTS service_radius_km DOUBLE PRECISION DEFAULT 10.0;

-- 3. Add coordinate range validation constraints
ALTER TABLE workers
  DROP CONSTRAINT IF EXISTS chk_worker_latitude,
  ADD CONSTRAINT chk_worker_latitude CHECK (latitude IS NULL OR (latitude >= -90.0 AND latitude <= 90.0));

ALTER TABLE workers
  DROP CONSTRAINT IF EXISTS chk_worker_longitude,
  ADD CONSTRAINT chk_worker_longitude CHECK (longitude IS NULL OR (longitude >= -180.0 AND longitude <= 180.0));

ALTER TABLE workers
  DROP CONSTRAINT IF EXISTS chk_worker_service_radius,
  ADD CONSTRAINT chk_worker_service_radius CHECK (service_radius_km > 0.0 AND service_radius_km <= 100.0);

-- 4. Create PostGIS geographic point column if PostGIS is enabled
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    ALTER TABLE workers
      ADD COLUMN IF NOT EXISTS geom GEOMETRY(Point, 4326);

    -- Automatically populate geom point from lat/lng
    UPDATE workers
      SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

    -- Create spatial GiST index for fast radius searches
    CREATE INDEX IF NOT EXISTS idx_workers_geom ON workers USING GIST (geom);
  END IF;
END $$;

-- 5. Standard B-Tree compound index for latitude & longitude fallback
CREATE INDEX IF NOT EXISTS idx_workers_lat_lng ON workers (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_workers_category_available ON workers (primary_category, is_available, verification_status);
