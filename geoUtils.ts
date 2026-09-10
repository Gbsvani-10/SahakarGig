/**
 * SahakarGig Geolocation & Distance Utilities
 * Performs accurate Haversine distance calculation, bounding box pre-filtering,
 * coordinate validation, and weighted multi-factor ranking.
 */

import { WorkerProfile, NearbyWorkerResult } from '../types';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/**
 * Validate latitude (-90 to +90) and longitude (-180 to +180)
 */
export function validateCoordinates(lat: unknown, lng: unknown): { valid: boolean; error?: string } {
  if (typeof lat !== 'number' || isNaN(lat)) {
    return { valid: false, error: 'Latitude must be a valid number' };
  }
  if (typeof lng !== 'number' || isNaN(lng)) {
    return { valid: false, error: 'Longitude must be a valid number' };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: 'Latitude must be between -90 and +90 degrees' };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: 'Longitude must be between -180 and +180 degrees' };
  }
  return { valid: true };
}

/**
 * Validate search radius in kilometers (min 0.5km, max 50km)
 */
export function validateRadius(radius: unknown, defaultRadius: number = 5): { valid: boolean; radiusKm: number; error?: string } {
  if (radius === undefined || radius === null || radius === '') {
    return { valid: true, radiusKm: defaultRadius };
  }
  const parsed = typeof radius === 'number' ? radius : parseFloat(String(radius));
  if (isNaN(parsed) || parsed <= 0) {
    return { valid: false, radiusKm: defaultRadius, error: 'Radius must be a positive number' };
  }
  if (parsed < 0.5) {
    return { valid: false, radiusKm: defaultRadius, error: 'Search radius minimum is 0.5 km' };
  }
  if (parsed > 50) {
    return { valid: false, radiusKm: defaultRadius, error: 'Search radius maximum is 50 km to ensure prompt artisan dispatch' };
  }
  return { valid: true, radiusKm: Math.round(parsed * 10) / 10 };
}

/**
 * Calculate accurate geographic distance in kilometers between two coordinates
 * using the Haversine formula (Earth mean radius = 6371.0 km).
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Round to 1 decimal place (e.g. 1.8 km)
  return Math.round(distance * 10) / 10;
}

/**
 * Compute bounding box for fast spatial pre-filtering before trigonometric distance checks
 */
export function getBoundingBox(centerLat: number, centerLng: number, radiusKm: number): BoundingBox {
  const earthRadiusKm = 6371;
  const radDist = radiusKm / earthRadiusKm;

  const radLat = (centerLat * Math.PI) / 180;
  const minLat = centerLat - (radDist * 180) / Math.PI;
  const maxLat = centerLat + (radDist * 180) / Math.PI;

  const deltaLng = Math.asin(Math.sin(radDist) / Math.cos(radLat));
  const minLng = centerLng - (deltaLng * 180) / Math.PI;
  const maxLng = centerLng + (deltaLng * 180) / Math.PI;

  return { minLat, maxLat, minLng, maxLng };
}

/**
 * Multi-factor matching score ranking engine (Section 9)
 * Priority:
 * 1. Exact service/skill match
 * 2. Availability (Available: 30pts, Busy: 10pts, Offline: 0pts)
 * 3. Verification status (Verified: 25pts, Pending: 10pts, Suspended: 0pts)
 * 4. Distance proximity (Up to 25pts inversely proportional to distance within radius)
 * 5. Rating (Up to 15pts: rating / 5 * 15)
 * 6. Experience (Up to 5pts: min(years, 10) / 10 * 5)
 */
export function calculateMatchScore(
  worker: WorkerProfile,
  distanceKm: number,
  radiusKm: number,
  requestedService?: string
): number {
  let score = 0;

  // 1. Service Match Check
  const serviceCategory = requestedService?.toLowerCase().trim();
  const workerCategory = worker.primaryCategory.toLowerCase().trim();
  const hasSkillMatch = worker.skills.some((s) => 
    s.name.toLowerCase().includes(serviceCategory || '') || 
    s.category.toLowerCase().includes(serviceCategory || '')
  );

  if (!serviceCategory || serviceCategory === 'all') {
    score += 20;
  } else if (workerCategory === serviceCategory) {
    score += 40;
  } else if (hasSkillMatch) {
    score += 25;
  }

  // 2. Availability
  if (worker.availabilityStatus === 'Available' || worker.isAvailable) {
    score += 30;
  } else if (worker.availabilityStatus === 'Busy') {
    score += 10;
  } else {
    score += 0;
  }

  // 3. Verification
  if (worker.verificationStatus === 'Verified') {
    score += 25;
  } else if (worker.verificationStatus === 'Pending') {
    score += 10;
  }

  // 4. Distance Proximity (Closer = higher score)
  const normalizedDistanceRatio = Math.max(0, 1 - distanceKm / Math.max(radiusKm, 1));
  score += Math.round(normalizedDistanceRatio * 25);

  // 5. Rating
  const ratingScore = Math.min(5, Math.max(0, worker.rating || 4.5));
  score += Math.round((ratingScore / 5) * 15);

  // 6. Experience
  const expScore = Math.min(10, Math.max(0, worker.experienceYears || 1));
  score += Math.round((expScore / 10) * 5);

  return score;
}

/**
 * Match and rank workers given customer coordinates and filters
 */
export function findNearbyWorkers(
  allWorkers: WorkerProfile[],
  customerLat: number,
  customerLng: number,
  radiusKm: number,
  options: {
    service?: string;
    availableOnly?: boolean;
    minRating?: number;
  } = {}
): NearbyWorkerResult[] {
  const { service, availableOnly = false, minRating } = options;
  const bbox = getBoundingBox(customerLat, customerLng, radiusKm);
  const results: NearbyWorkerResult[] = [];

  const targetCategory = service && service.toLowerCase() !== 'all' ? service.toLowerCase().trim() : null;

  for (const worker of allWorkers) {
    // Check if worker has coordinates
    if (typeof worker.latitude !== 'number' || typeof worker.longitude !== 'number') {
      continue;
    }

    // Fast bounding box check
    if (
      worker.latitude < bbox.minLat ||
      worker.latitude > bbox.maxLat ||
      worker.longitude < bbox.minLng ||
      worker.longitude > bbox.maxLng
    ) {
      continue;
    }

    // Service category check
    if (targetCategory) {
      const matchPrimary = worker.primaryCategory.toLowerCase() === targetCategory;
      const matchSkill = worker.skills.some((s) => 
        s.category.toLowerCase() === targetCategory || 
        s.name.toLowerCase().includes(targetCategory)
      );
      if (!matchPrimary && !matchSkill) {
        continue;
      }
    }

    // Availability filter
    if (availableOnly && worker.availabilityStatus !== 'Available' && !worker.isAvailable) {
      continue;
    }

    // Min rating filter
    if (typeof minRating === 'number' && worker.rating < minRating) {
      continue;
    }

    // Calculate actual spherical Haversine distance
    const distanceKm = calculateHaversineDistanceKm(
      customerLat,
      customerLng,
      worker.latitude,
      worker.longitude
    );

    // Filter strictly within the requested search radius
    if (distanceKm > radiusKm) {
      continue;
    }

    // Check worker's own declared service radius if specified
    if (worker.serviceRadiusKm && distanceKm > worker.serviceRadiusKm) {
      continue;
    }

    const matchScore = calculateMatchScore(worker, distanceKm, radiusKm, targetCategory || undefined);

    results.push({
      worker: {
        ...worker,
        distanceKm // Update with accurate calculated distance
      },
      distanceKm,
      matchScore
    });
  }

  // Sort by match score descending, then by distance ascending
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  return results;
}
