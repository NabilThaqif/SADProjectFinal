// Free geocoding and routing utilities using OpenStreetMap services

// Geocode an address to coordinates (Free - Nominatim)
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(address)}&` +
      `format=json&` +
      `countrycodes=my&` +
      `limit=1`,
      {
        headers: {
          'User-Agent': 'UPM-Student-Cab-App'
        }
      }
    );

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Calculate distance and route (Free - OSRM)
export const calculateRoute = async (fromLat, fromLng, toLat, toLng) => {
  try {
    // Using OSRM (Open Source Routing Machine) - Free, no API key
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
      `${fromLng},${fromLat};${toLng},${toLat}?` +
      `overview=full&geometries=geojson&steps=true`
    );

    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distance: route.distance, // meters
        duration: route.duration, // seconds
        geometry: route.geometry,
        distanceKm: (route.distance / 1000).toFixed(2),
        durationMinutes: Math.round(route.duration / 60)
      };
    }
    throw new Error('Route not found');
  } catch (error) {
    console.error('Routing error:', error);
    throw error;
  }
};

// Calculate fare based on distance
export const calculateFare = (distanceKm) => {
  const baseRate = 1.0; // RM per km
  const fare = distanceKm * baseRate;
  return fare.toFixed(2);
};
