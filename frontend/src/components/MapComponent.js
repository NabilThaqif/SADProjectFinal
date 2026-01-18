import React, { useState, useCallback, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Polyline,
} from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '500px' };
const UPM_CENTER = { lat: 2.9935, lng: 101.7242 };

// Helper to get full name
const getFullName = (user) => `${user.firstName} ${user.lastName}`;

const MapComponent = ({
  drivers = [],
  passengers = [],
  center = UPM_CENTER,
  driverLocation = null,
  pickupLocation = null,
  destinationLocation = null,
  showRoute = false,
  onRouteCalculated = null,
}) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['geometry', 'drawing'],
  });

  // eslint-disable-next-line no-unused-vars
  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: '', duration: '' });

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  // Calculate route when locations are provided
  useEffect(() => {
    if (isLoaded && showRoute && driverLocation && pickupLocation && destinationLocation) {
      const directionsService = new window.google.maps.DirectionsService();

      // Calculate approximate distance and time using Haversine formula
      const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
      };

      // Calculate distances
      const distToPickup = calculateDistance(
        driverLocation.lat,
        driverLocation.lng,
        pickupLocation.lat,
        pickupLocation.lng
      );
      const distToDestination = calculateDistance(
        pickupLocation.lat,
        pickupLocation.lng,
        destinationLocation.lat,
        destinationLocation.lng
      );
      const totalDistance = distToPickup + distToDestination;

      // Estimate time (assuming 60 km/h average speed)
      const avgSpeed = 60;
      const timeToPickup = Math.ceil((distToPickup / avgSpeed) * 60); // in minutes
      const timeToDestination = Math.ceil((distToDestination / avgSpeed) * 60); // in minutes
      const totalTime = timeToPickup + timeToDestination;

      // Try to get actual route from Google Directions API
      directionsService.route(
        {
          origin: driverLocation,
          waypoints: [{ location: pickupLocation, stopover: true }],
          destination: destinationLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false,
        },
        (result, status) => {
          console.log('DirectionsService Response:', { status, result });
          
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('Route found! Routes count:', result.routes.length);
            setDirectionsResponse(result);
            const route = result.routes[0];
            
            // Extract legs (driver→pickup, pickup→destination)
            const toPickupLeg = route.legs[0];
            const toDestinationLeg = route.legs[1];

            const info = {
              distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0) / 1000 + ' km',
              duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0) / 60 + ' mins',
              toPickup: {
                distance: toPickupLeg.distance.text,
                duration: toPickupLeg.duration.text,
              },
              toDestination: {
                distance: toDestinationLeg.distance.text,
                duration: toDestinationLeg.duration.text,
              },
            };

            setRouteInfo(info);
            if (onRouteCalculated) {
              onRouteCalculated(info);
            }
          } else {
            console.error('Directions API failed with status:', status);
            
            // Fallback: Calculate using Haversine
            const distToPickup = calculateDistance(
              driverLocation.lat,
              driverLocation.lng,
              pickupLocation.lat,
              pickupLocation.lng
            );
            const distToDestination = calculateDistance(
              pickupLocation.lat,
              pickupLocation.lng,
              destinationLocation.lat,
              destinationLocation.lng
            );
            const totalDistance = distToPickup + distToDestination;
            const avgSpeed = 60;
            const timeToPickup = Math.ceil((distToPickup / avgSpeed) * 60);
            const timeToDestination = Math.ceil((distToDestination / avgSpeed) * 60);
            
            const info = {
              distance: totalDistance.toFixed(1) + ' km (estimated)',
              duration: (timeToPickup + timeToDestination) + ' mins (estimated)',
              toPickup: {
                distance: distToPickup.toFixed(1) + ' km',
                duration: timeToPickup + ' mins',
              },
              toDestination: {
                distance: distToDestination.toFixed(1) + ' km',
                duration: timeToDestination + ' mins',
              },
            };

            setRouteInfo(info);
            if (onRouteCalculated) {
              onRouteCalculated(info);
            }
          }
        }
      );
    }
  }, [isLoaded, showRoute, driverLocation, pickupLocation, destinationLocation, onRouteCalculated]);

  if (!apiKey) {
    return (
      <div className="w-full h-64 bg-yellow-100 text-yellow-800 flex items-center justify-center rounded">
        Missing REACT_APP_GOOGLE_MAPS_API_KEY in .env.local
      </div>
    );
  }

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={showRoute ? 10 : 15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Render the actual Google route using DirectionsRenderer */}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            suppressMarkers: true,
            suppressPolylines: false,
            polylineOptions: {
              strokeColor: '#4F46E5',
              strokeWeight: 6,
              strokeOpacity: 1,
            },
          }}
        />
      )}

      {/* Fallback: Simple line if no directions response */}
      {!directionsResponse && (
        <Polyline
          path={[driverLocation, destinationLocation]}
          options={{
            strokeColor: '#999999',
            strokeWeight: 3,
            strokeOpacity: 0.5,
          }}
        />
      )}

      {/* Driver Location Marker (if provided) */}
      {driverLocation && (
        <Marker
          position={driverLocation}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#22C55E',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 2,
            anchor: new window.google.maps.Point(12, 22),
          }}
          title="Driver Location"
          label={{
            text: '🚗',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Pickup Location Marker (if provided) */}
      {pickupLocation && (
        <Marker
          position={pickupLocation}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 2,
            anchor: new window.google.maps.Point(12, 22),
          }}
          title="Pickup Location"
          label={{
            text: 'P',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Destination Location Marker (if provided) */}
      {destinationLocation && (
        <Marker
          position={destinationLocation}
          icon={{
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#EF4444',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 2,
            anchor: new window.google.maps.Point(12, 22),
          }}
          title="Destination"
          label={{
            text: 'D',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        />
      )}

      {/* Regular passenger markers (when not showing route) */}
      {!showRoute &&
        passengers.map((p) => (
          <Marker
            key={p.uid}
            position={p.location}
            onClick={() => setSelectedMarker(p)}
            label={{ text: 'P', color: 'white', fontSize: '12px' }}
          />
        ))}

      {/* Regular driver markers (when not showing route) */}
      {!showRoute &&
        drivers.map((d) => (
          <Marker key={d.uid} position={d.location} onClick={() => setSelectedMarker(d)} />
        ))}

      {selectedMarker && (
        <InfoWindow position={selectedMarker.location} onCloseClick={() => setSelectedMarker(null)}>
          <div style={{ color: 'black', minWidth: '150px' }}>
            <h3>{selectedMarker.accountType === 'passenger' ? '🎓 Passenger' : '🚖 Driver'}</h3>
            <p>
              <strong>Name:</strong> {getFullName(selectedMarker)}
            </p>
            <p>
              <strong>Rating:</strong> ⭐ {selectedMarker.rating} ({selectedMarker.totalRatings})
            </p>
            <p>
              <strong>Contact:</strong> {selectedMarker.phoneNumber}
            </p>
          </div>
        </InfoWindow>
      )}

      {/* Route Info Overlay */}
      {showRoute && routeInfo.distance && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>Total Distance</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                {routeInfo.distance}
              </div>
            </div>
            <div
              style={{
                width: '1px',
                height: '30px',
                backgroundColor: '#ddd',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>ETA</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                {routeInfo.duration}
              </div>
            </div>
          </div>
        </div>
      )}
    </GoogleMap>
  );
};

export default MapComponent;
