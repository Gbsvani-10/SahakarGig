/**
 * Geo calculation utilities using Haversine formula
 */

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function estimateTravelTime(distanceKm: number, isEmergency: boolean = false): number {
  // Average urban city transit speed: 18-24 km/h for 2-wheelers/vans
  const speed = isEmergency ? 28 : 20; // km/h
  const timeHours = distanceKm / speed;
  const minutes = Math.round(timeHours * 60) + 3; // +3 min dispatch buffer
  return Math.max(5, minutes);
}

/**
 * Generate simulated street waypoints between two coordinates
 */
export function generateSimulatedRoute(
  start: [number, number],
  end: [number, number],
  numSteps: number = 6
): [number, number][] {
  const points: [number, number][] = [start];
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  for (let i = 1; i < numSteps; i++) {
    const fraction = i / numSteps;
    // Introduce slight natural street curvature
    const jitterFactor = Math.sin(fraction * Math.PI) * 0.0035;
    const interLat = lat1 + (lat2 - lat1) * fraction + jitterFactor * (i % 2 === 0 ? 1 : -0.7);
    const interLng = lng1 + (lng2 - lng1) * fraction - jitterFactor * 0.5;
    points.push([Number(interLat.toFixed(5)), Number(interLng.toFixed(5))]);
  }

  points.push(end);
  return points;
}

/**
 * Calculate Intelligent Match Score (0-100%)
 */
export function computeMatchScore(
  workerSkill: string,
  selectedService: string,
  distanceKm: number,
  status: string,
  rating: number,
  experienceYears: number
) {
  // Skill match
  const skillMatch = selectedService === 'All Services' || selectedService === workerSkill ? 100 : 40;

  // Location proximity match (closer = higher score up to 15km)
  const locationMatch = Math.max(30, Math.round(100 - distanceKm * 4.5));

  // Availability match
  let availabilityMatch = 70;
  if (status === 'Available') availabilityMatch = 100;
  else if (status === 'Emergency Ready') availabilityMatch = 98;
  else if (status === 'Busy') availabilityMatch = 45;
  else if (status === 'Offline') availabilityMatch = 20;

  // Rating & Verification match
  const ratingMatch = Math.min(100, Math.round((rating / 5.0) * 100));

  // Response time match
  const responseTimeMatch = Math.max(40, Math.round(100 - (distanceKm * 2.5)));

  // Weighted formula
  const finalScore = Math.round(
    skillMatch * 0.35 +
    locationMatch * 0.25 +
    availabilityMatch * 0.20 +
    ratingMatch * 0.15 +
    responseTimeMatch * 0.05
  );

  return {
    finalScore: Math.min(99, Math.max(35, finalScore)),
    breakdown: {
      skillMatch,
      locationMatch,
      availabilityMatch,
      ratingMatch,
      responseTimeMatch,
    },
  };
}
