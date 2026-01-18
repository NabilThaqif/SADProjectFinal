import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '500px' };
const UPM_CENTER = { lat: 2.9935, lng: 101.7242 };

// Helper to get full name
const getFullName = (user) => `${user.firstName} ${user.lastName}`;

const MapComponent = ({ drivers = [], passengers = [], center = UPM_CENTER }) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback((map) => setMap(null), []);

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
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Render PASSENGERS (Students) */}
      {passengers.map((p) => (
        <Marker
          key={p.uid} // Using 'uid' from your data
          position={p.location}
          onClick={() => setSelectedMarker(p)}
          // Optional: Make passenger markers distinct
          label={{ text: "P", color: "white", fontSize: "12px" }} 
        />
      ))}

      {/* Render DRIVERS (if you have similar data for them) */}
      {drivers.map((d) => (
        <Marker
          key={d.uid}
          position={d.location}
          onClick={() => setSelectedMarker(d)}
        />
      ))}

      {/* Info Window Display */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.location}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ color: "black", minWidth: "150px" }}>
            {/* Logic to show Passenger vs Driver icon */}
            <h3>{selectedMarker.accountType === 'passenger' ? '🎓 Passenger' : '🚖 Driver'}</h3>
            
            <p><strong>Name:</strong> {getFullName(selectedMarker)}</p>
            <p><strong>Rating:</strong> ⭐ {selectedMarker.rating} ({selectedMarker.totalRatings})</p>
            <p><strong>Contact:</strong> {selectedMarker.phoneNumber}</p>
          
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapComponent;