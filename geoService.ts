/**
 * SahakarGig Client Geolocation Service
 * Interfaces with Browser Geolocation API, manages location permissions,
 * and coordinates geocoding queries.
 */

export interface GeoLocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
  source: 'browser_gps' | 'manual_picker' | 'default_profile';
  timestamp: string;
}

export interface GeolocationError {
  code: number;
  message: string;
  userFriendlyMessage: string;
}

// Default customer location: Sector 62, Noida (Cooperative hub)
export const DEFAULT_CUSTOMER_LOCATION: GeoLocationState = {
  latitude: 28.6280,
  longitude: 77.3649,
  accuracy: 10,
  address: 'B-402, Green Valley Apartments, Sector 62, Noida',
  source: 'default_profile',
  timestamp: new Date().toISOString()
};

export const clientGeoService = {
  /**
   * Get current position using Browser Geolocation API
   */
  async getCurrentPosition(options: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  }): Promise<GeoLocationState> {
    if (!navigator.geolocation) {
      throw {
        code: 0,
        message: 'Geolocation is not supported by your browser',
        userFriendlyMessage: 'Your browser does not support automatic location detection. Please enter your locality or address manually.'
      } as GeolocationError;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = Math.round(position.coords.accuracy);

          // Reverse geocode to get a readable address label if possible
          let address = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
          try {
            const resolvedAddress = await clientGeoService.reverseGeocode(lat, lng);
            if (resolvedAddress) {
              address = resolvedAddress;
            }
          } catch {
            // Keep coordinate label if reverse geocode fails
          }

          const state: GeoLocationState = {
            latitude: lat,
            longitude: lng,
            accuracy,
            address,
            source: 'browser_gps',
            timestamp: new Date().toISOString()
          };

          // Save to localStorage for convenience
          localStorage.setItem('sahakar_customer_location', JSON.stringify(state));
          resolve(state);
        },
        (error: GeolocationPositionError) => {
          let userFriendlyMessage = 'Unable to detect your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              userFriendlyMessage =
                'Location access was denied. Please allow location permissions in your browser or select your locality manually from the search box.';
              break;
            case error.POSITION_UNAVAILABLE:
              userFriendlyMessage =
                'Location information is currently unavailable. Please enter your address or landmark manually.';
              break;
            case error.TIMEOUT:
              userFriendlyMessage =
                'The location request timed out. Please try again or select your location manually.';
              break;
          }

          reject({
            code: error.code,
            message: error.message,
            userFriendlyMessage
          } as GeolocationError);
        },
        options
      );
    });
  },

  /**
   * Check browser location permission state if supported
   */
  async queryPermission(): Promise<PermissionState | 'unsupported'> {
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state;
      } catch {
        return 'unsupported';
      }
    }
    return 'unsupported';
  },

  /**
   * Reverse geocode coordinates to readable area name
   */
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      // Check for close match in well-known Delhi-NCR landmarks
      const dLat62 = Math.abs(lat - 28.6280);
      const dLng62 = Math.abs(lng - 77.3649);
      if (dLat62 < 0.02 && dLng62 < 0.02) {
        return 'Sector 62, Noida, Gautam Buddha Nagar';
      }

      const dLatSaket = Math.abs(lat - 28.5244);
      const dLngSaket = Math.abs(lng - 77.2066);
      if (dLatSaket < 0.03 && dLngSaket < 0.03) {
        return 'Saket, South Delhi';
      }

      const dLatLaxmi = Math.abs(lat - 28.6304);
      const dLngLaxmi = Math.abs(lng - 77.2773);
      if (dLatLaxmi < 0.03 && dLngLaxmi < 0.03) {
        return 'Laxmi Nagar, East Delhi';
      }

      // Public OpenStreetMap Nominatim reverse geocode (with standard timeout)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'Accept-Language': 'en'
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        return data.display_name?.split(',').slice(0, 3).join(', ') || null;
      }
    } catch {
      // Silent catch
    }
    return null;
  },

  /**
   * Search for locations matching a text query
   */
  async searchAddress(query: string): Promise<Array<{ lat: number; lng: number; displayName: string }>> {
    if (!query || query.trim().length < 2) return [];

    try {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend geocode failed, trying OSM:', err);
    }

    // Fallback to OSM Nominatim
    try {
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&q=${encodeURIComponent(query.trim())}&limit=5`
      );
      if (osmRes.ok) {
        const data = await osmRes.json();
        return data.map((item: any) => ({
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          displayName: item.display_name.split(',').slice(0, 4).join(', ')
        }));
      }
    } catch {
      // Fallback
    }

    return [];
  },

  /**
   * Retrieve cached customer location or fallback to default
   */
  getInitialCustomerLocation(): GeoLocationState {
    try {
      const saved = localStorage.getItem('sahakar_customer_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CUSTOMER_LOCATION;
  }
};
