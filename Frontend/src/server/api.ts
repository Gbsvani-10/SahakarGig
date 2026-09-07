/**
 * SahakarGig REST API Router
 * Endpoints for location-based artisan matching, worker service area updates, and geocoding.
 */

import { Router, Request, Response } from 'express';
import { serverGeoService } from './geoService';

export const apiRouter = Router();

// Middleware to parse auth token from headers (simulating standard Bearer tokens)
function extractRequester(req: Request) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  
  if (token.includes('worker')) {
    return { role: 'worker', userId: 'user-w1', workerId: 'work-201' };
  } else if (token.includes('admin')) {
    return { role: 'admin', userId: 'admin-001' };
  }
  return { role: 'customer', userId: 'cust-101' };
}

/**
 * Health check endpoint
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'SahakarGig Cooperative Platform',
    geolocationEnabled: true,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET or POST /api/services/nearby
 * Find nearby verified artisans matching requested trade and coordinates within specified radius
 */
const handleNearbySearch = (req: Request, res: Response) => {
  try {
    const lat = req.method === 'POST' ? req.body?.latitude : req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
    const lng = req.method === 'POST' ? req.body?.longitude : req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
    const service = req.method === 'POST' ? req.body?.service : req.query.service as string | undefined;
    const radiusKm = req.method === 'POST' ? req.body?.radiusKm : req.query.radiusKm ? parseFloat(req.query.radiusKm as string) : undefined;
    const availableOnly = req.method === 'POST' ? req.body?.availableOnly : req.query.availableOnly === 'true';
    const minRating = req.method === 'POST' ? req.body?.minRating : req.query.minRating ? parseFloat(req.query.minRating as string) : undefined;

    const searchResult = serverGeoService.searchNearby({
      latitude: lat,
      longitude: lng,
      service,
      radiusKm,
      availableOnly,
      minRating
    });

    if (!searchResult.success) {
      return res.status(400).json({
        success: false,
        error: searchResult.error || 'Invalid search parameters',
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      data: {
        center: searchResult.center,
        radiusKm: searchResult.radiusKm,
        count: searchResult.count,
        workers: searchResult.results
      },
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in /api/services/nearby:', err);
    return res.status(500).json({
      success: false,
      error: 'We could not search for nearby services right now. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
};

apiRouter.get('/services/nearby', handleNearbySearch);
apiRouter.post('/services/nearby', handleNearbySearch);

/**
 * PATCH /api/workers/location
 * Updates service location for the authenticated artisan
 */
apiRouter.patch('/workers/location', (req: Request, res: Response) => {
  try {
    const requester = extractRequester(req);
    const workerId = req.body?.workerId || requester.workerId || 'work-201';

    const result = serverGeoService.updateWorkerLocation(requester, workerId, {
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
      locationAccuracy: req.body?.locationAccuracy,
      locationAddress: req.body?.locationAddress,
      serviceRadiusKm: req.body?.serviceRadiusKm
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      data: result.worker,
      message: 'Artisan service location updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in PATCH /api/workers/location:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update service location',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * PUT /api/workers/:id/location
 * Updates service location for specific worker ID (with authorization check)
 */
apiRouter.put('/workers/:id/location', (req: Request, res: Response) => {
  try {
    const requester = extractRequester(req);
    const targetWorkerId = req.params.id;

    const result = serverGeoService.updateWorkerLocation(requester, targetWorkerId, {
      latitude: req.body?.latitude,
      longitude: req.body?.longitude,
      locationAccuracy: req.body?.locationAccuracy,
      locationAddress: req.body?.locationAddress,
      serviceRadiusKm: req.body?.serviceRadiusKm
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      data: result.worker,
      message: 'Worker service location updated',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('Error in PUT /api/workers/:id/location:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to update location',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/workers/:id/location
 * Get public service area coordinates and radius for an artisan
 */
apiRouter.get('/workers/:id/location', (req: Request, res: Response) => {
  const worker = serverGeoService.getWorkerById(req.params.id);
  if (!worker) {
    return res.status(404).json({ success: false, error: 'Worker not found' });
  }

  // Return public service coordinates and radius (masking precise private address for privacy - Section 15)
  return res.json({
    success: true,
    data: {
      workerId: worker.id,
      workerName: worker.name,
      primaryCategory: worker.primaryCategory,
      latitude: worker.latitude,
      longitude: worker.longitude,
      serviceRadiusKm: worker.serviceRadiusKm || 10,
      serviceArea: worker.serviceArea,
      locationUpdatedAt: worker.locationUpdatedAt
    },
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/geocode/search
 * Free geocoding search for manual address entry (supporting common NCR & Indian localities)
 */
apiRouter.get('/geocode/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.status(400).json({ success: false, error: 'Search query required' });
  }

  // Built-in verified coordinates for common Delhi-NCR and metropolitan centers
  const PRESET_PLACES: Record<string, { lat: number; lng: number; displayName: string }> = {
    'sector 62': { lat: 28.6280, lng: 77.3649, displayName: 'Sector 62, Noida, Gautam Buddha Nagar, Uttar Pradesh' },
    'sector 18': { lat: 28.5708, lng: 77.3260, displayName: 'Sector 18 Market, Noida, Uttar Pradesh' },
    'sector 50': { lat: 28.5750, lng: 77.3685, displayName: 'Sector 50, Noida, Uttar Pradesh' },
    'laxmi nagar': { lat: 28.6304, lng: 77.2773, displayName: 'Laxmi Nagar, Shakarpur, East Delhi' },
    'connaught place': { lat: 28.6315, lng: 77.2167, displayName: 'Connaught Place, Central Delhi' },
    'saket': { lat: 28.5244, lng: 77.2066, displayName: 'Saket District Centre, South Delhi' },
    'mayur vihar': { lat: 28.6083, lng: 77.2958, displayName: 'Mayur Vihar Phase 1, East Delhi' },
    'karol bagh': { lat: 28.6517, lng: 77.1906, displayName: 'Karol Bagh, Central Delhi' },
    'indirapuram': { lat: 28.6410, lng: 77.3710, displayName: 'Indirapuram, Ghaziabad, Uttar Pradesh' },
    'dlf cyber city': { lat: 28.4950, lng: 77.0895, displayName: 'DLF Cyber City, Gurugram, Haryana' },
    'gurugram': { lat: 28.4595, lng: 77.0266, displayName: 'Gurugram, Haryana' },
    'noida': { lat: 28.5355, lng: 77.3910, displayName: 'Noida, Gautam Buddha Nagar, Uttar Pradesh' },
    'delhi': { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi' }
  };

  const matches = Object.entries(PRESET_PLACES)
    .filter(([key]) => query.includes(key) || key.includes(query))
    .map(([_, val]) => val);

  if (matches.length > 0) {
    return res.json({ success: true, data: matches });
  }

  // Fallback match to center of Delhi if general query
  return res.json({
    success: true,
    data: [
      {
        lat: 28.6280,
        lng: 77.3649,
        displayName: `${req.query.q} (Sector 62, Noida Cooperative Hub Area)`
      }
    ]
  });
});
