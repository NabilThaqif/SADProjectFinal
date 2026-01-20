import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FreeMapComponent = ({
  center = { lat: 2.9935, lng: 101.7242 }, // UPM center
  pickupLocation = null,
  dropoffLocation = null,
  routeGeometry = null,
  height = '400px',
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeLayerRef = useRef(null);

  useEffect(() => {
    // Initialize map only once
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [center.lat, center.lng],
        13
      );

      // Add OpenStreetMap tiles (Free)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add pickup marker
    if (pickupLocation) {
      const pickupIcon = L.divIcon({
        html: '<div style="background-color: #22c55e; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px;">📍</div>',
        className: '',
        iconSize: [30, 30],
      });

      const pickupMarker = L.marker([pickupLocation.lat, pickupLocation.lng], {
        icon: pickupIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Pickup Location</b>');

      markersRef.current.push(pickupMarker);
    }

    // Add dropoff marker
    if (dropoffLocation) {
      const dropoffIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; font-size: 16px;">🎯</div>',
        className: '',
        iconSize: [30, 30],
      });

      const dropoffMarker = L.marker([dropoffLocation.lat, dropoffLocation.lng], {
        icon: dropoffIcon,
      })
        .addTo(mapInstanceRef.current)
        .bindPopup('<b>Dropoff Location</b>');

      markersRef.current.push(dropoffMarker);
    }

    // Fit bounds if both locations exist
    if (pickupLocation && dropoffLocation) {
      const bounds = L.latLngBounds(
        [pickupLocation.lat, pickupLocation.lng],
        [dropoffLocation.lat, dropoffLocation.lng]
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    } else if (pickupLocation) {
      mapInstanceRef.current.setView([pickupLocation.lat, pickupLocation.lng], 14);
    } else if (dropoffLocation) {
      mapInstanceRef.current.setView([dropoffLocation.lat, dropoffLocation.lng], 14);
    }
  }, [pickupLocation, dropoffLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !routeGeometry) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }

    // Add route polyline
    if (routeGeometry.type === 'LineString' && routeGeometry.coordinates) {
      // Convert GeoJSON coordinates [lng, lat] to Leaflet format [lat, lng]
      const latlngs = routeGeometry.coordinates.map(coord => [coord[1], coord[0]]);

      routeLayerRef.current = L.polyline(latlngs, {
        color: '#3b82f6',
        weight: 5,
        opacity: 0.7,
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show entire route
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [50, 50],
      });
    }
  }, [routeGeometry]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: height,
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default FreeMapComponent;
