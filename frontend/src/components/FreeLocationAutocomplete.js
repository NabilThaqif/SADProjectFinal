import React, { useState, useEffect } from 'react';

const FreeLocationAutocomplete = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchLocation = async () => {
      if (value.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        // Using Nominatim (OpenStreetMap) - Free, no API key needed
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(value)}&` +
          `format=json&` +
          `countrycodes=my&` + // Restrict to Malaysia
          `limit=5&` +
          `addressdetails=1`,
          {
            headers: {
              'User-Agent': 'UPM-Student-Cab-App' // Required by Nominatim
            }
          }
        );

        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchLocation, 500);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSuggestionClick = (suggestion) => {
    const displayName = suggestion.display_name;
    onChange(displayName, {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" style={{ overflow: 'visible' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-semibold text-sm text-gray-800">
                {suggestion.name || suggestion.display_name.split(',')[0]}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {suggestion.display_name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeLocationAutocomplete;
