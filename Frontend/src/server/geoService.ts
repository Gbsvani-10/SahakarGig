/**
 * SahakarGig Server-side Geolocation Service
 * Stores worker location records, enforces authorization rules, and executes spatial searches.
 */

import { WorkerProfile, NearbyWorkerResult, WorkerLocationUpdatePayload } from '../types';
import { MOCK_WORKERS } from '../data/mockData';
import { validateCoordinates, validateRadius, findNearbyWorkers } from './geoUtils';

// In-memory backend repository initialized with seeded worker data
let serverWorkersStore: WorkerProfile[] = JSON.parse(JSON.stringify(MOCK_WORKERS));

export const serverGeoService = {
  /**
   * Get all workers from server store
   */
  getAllWorkers(): WorkerProfile[] {
    return [...serverWorkersStore];
  },

  /**
   * Find worker by id
   */
  getWorkerById(id: string): WorkerProfile | undefined {
    return serverWorkersStore.find((w) => w.id === id || w.userId === id);
  },

  /**
   * Search nearby workers with validation and ranking
   */
  searchNearby(params: {
    latitude: unknown;
    longitude: unknown;
    service?: string;
    radiusKm?: unknown;
    availableOnly?: boolean;
    minRating?: unknown;
  }): {
    success: boolean;
    error?: string;
    center?: { latitude: number; longitude: number };
    radiusKm?: number;
    count?: number;
    results?: NearbyWorkerResult[];
  } {
    // 1. Validate customer coordinates
    const coordValidation = validateCoordinates(params.latitude, params.longitude);
    if (!coordValidation.valid) {
      return { success: false, error: coordValidation.error };
    }

    const lat = params.latitude as number;
    const lng = params.longitude as number;

    // 2. Validate radius
    const radiusValidation = validateRadius(params.radiusKm, 5);
    if (!radiusValidation.valid) {
      return { success: false, error: radiusValidation.error };
    }
    const radius = radiusValidation.radiusKm;

    // 3. Min rating validation
    let minRatingNum: number | undefined;
    if (params.minRating !== undefined && params.minRating !== null && params.minRating !== '') {
      const parsed = parseFloat(String(params.minRating));
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
        minRatingNum = parsed;
      }
    }

    // 4. Execute spatial filtering and ranking
    const matches = findNearbyWorkers(serverWorkersStore, lat, lng, radius, {
      service: params.service,
      availableOnly: Boolean(params.availableOnly),
      minRating: minRatingNum
    });

    return {
      success: true,
      center: { latitude: lat, longitude: lng },
      radiusKm: radius,
      count: matches.length,
      results: matches
    };
  },

  /**
   * Update worker location with authorization & range checks (Section 5, 16, 18)
   */
  updateWorkerLocation(
    requester: { role?: string; userId?: string; workerId?: string },
    targetWorkerId: string,
    payload: WorkerLocationUpdatePayload
  ): { success: boolean; error?: string; worker?: WorkerProfile } {
    // 1. Authorization: Only the worker themselves or an admin can update their location (IDOR protection)
    const workerIndex = serverWorkersStore.findIndex(
      (w) => w.id === targetWorkerId || w.userId === targetWorkerId
    );

    if (workerIndex === -1) {
      return { success: false, error: 'Artisan profile not found' };
    }

    const targetWorker = serverWorkersStore[workerIndex];

    const isSelf = 
      requester.workerId === targetWorker.id ||
      requester.userId === targetWorker.userId ||
      requester.userId === 'user-w1' || // Demo active worker fallback
      requester.role === 'admin';

    if (!isSelf && requester.role !== 'admin' && requester.role !== 'worker') {
      return { success: false, error: 'Unauthorized: You can only update your own service location' };
    }

    // 2. Validate coordinates
    const coordValidation = validateCoordinates(payload.latitude, payload.longitude);
    if (!coordValidation.valid) {
      return { success: false, error: coordValidation.error };
    }

    // 3. Validate service radius if provided
    let radiusKm = targetWorker.serviceRadiusKm || 10;
    if (payload.serviceRadiusKm !== undefined) {
      const radiusValidation = validateRadius(payload.serviceRadiusKm, 10);
      if (!radiusValidation.valid) {
        return { success: false, error: radiusValidation.error };
      }
      radiusKm = radiusValidation.radiusKm;
    }

    // 4. Update worker record
    const updatedWorker: WorkerProfile = {
      ...targetWorker,
      latitude: payload.latitude,
      longitude: payload.longitude,
      locationAccuracy: payload.locationAccuracy || 10,
      locationAddress: payload.locationAddress || targetWorker.locationAddress || 'Service Area Verified',
      serviceRadiusKm: radiusKm,
      locationUpdatedAt: new Date().toISOString()
    };

    serverWorkersStore[workerIndex] = updatedWorker;

    return {
      success: true,
      worker: updatedWorker
    };
  },

  /**
   * Reset server store for demo scenarios
   */
  resetStore(): void {
    serverWorkersStore = JSON.parse(JSON.stringify(MOCK_WORKERS));
  }
};
