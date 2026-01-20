import React, { useState, useEffect, useRef } from 'react';

const LocationAutocomplete = ({ value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const autocompleteServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  // Initialize Places Autocomplete Service and Session Token
  useEffect(() => {
    const initializeAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
          console.log('Google Places Autocomplete initialized successfully');
        } catch (error) {
          console.error('Error initializing autocomplete:', error);
        }
      } else {
        console.warn('Google Maps not yet loaded, retrying...');
        setTimeout(initializeAutocomplete, 500);
      }
    };
    
    initializeAutocomplete();
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error('Google Maps API not loaded');
      return;
    }

    if (!autocompleteServiceRef.current) {
      console.error('Autocomplete service not initialized');
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }

    if (autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input: inputValue,
          sessionToken: sessionTokenRef.current,
          componentRestrictions: { country: 'my' }, // Restrict to Malaysia
          bounds: {
            north: 6.5,
            south: 1,
            east: 104,
            west: 100,
          },
        },
        (predictions, status) => {
          console.log('Autocomplete status:', status, 'Predictions:', predictions);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setSuggestions(predictions);
            setShowSuggestions(true);
            setActiveSuggestion(-1);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            console.log('No results found for:', inputValue);
            setSuggestions([]);
            setShowSuggestions(false);
          } else {
            console.error('Places API Error:', status);
            if (status === 'REQUEST_DENIED') {
              console.error('⚠️ REQUEST_DENIED: Please enable Places API in Google Cloud Console and check API key restrictions');
            }
            setSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Generate new session token for next search
    sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestion >= 0) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full" style={{ overflow: 'visible' }}>
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto" 
          style={{ 
            zIndex: 9999,
            backgroundColor: '#ffffff',
            overflow: 'visible', 
            overflowY: 'auto',
            position: 'absolute'
          }}
        >
          {suggestions.map((suggestion, index) => {
            const mainText = suggestion.structured_formatting?.main_text || suggestion.description || 'Unknown';
            const secondaryText = suggestion.structured_formatting?.secondary_text || '';
            
            return (
              <div
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: index === activeSuggestion ? '#3b82f6' : '#ffffff',
                  borderBottom: '1px solid #e5e7eb'
                }}
                onMouseEnter={(e) => {
                  if (index !== activeSuggestion) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== activeSuggestion) {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }
                }}
              >
                <div 
                  style={{ 
                    fontWeight: '600', 
                    fontSize: '14px',
                    color: index === activeSuggestion ? '#ffffff !important' : '#111827 !important',
                    lineHeight: '1.4'
                  }}
                >
                  {mainText}
                </div>
                <div 
                  style={{ 
                    fontSize: '12px',
                    color: index === activeSuggestion ? '#bfdbfe !important' : '#6b7280 !important',
                    lineHeight: '1.4',
                    marginTop: '2px'
                  }}
                >
                  {secondaryText}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
