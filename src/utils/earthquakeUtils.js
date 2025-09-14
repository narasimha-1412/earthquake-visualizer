// Get marker color based on magnitude
export const getMarkerColor = (magnitude) => {
  if (magnitude >= 7) return '#8b0000'; // dark red for major
  if (magnitude >= 6) return '#ff0000'; // red for strong
  if (magnitude >= 5) return '#ff4500'; // orange red for moderate
  if (magnitude >= 4) return '#ffa500'; // orange for light
  if (magnitude >= 3) return '#ffff00'; // yellow for minor
  if (magnitude >= 2) return '#9aff9a'; // light green for very minor
  return '#00ff00'; // green for micro
};

// Get marker size based on magnitude
export const getMarkerSize = (magnitude) => {
  return Math.max(4, Math.min(25, magnitude * 3));
};

// Format timestamp to readable date
export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get magnitude category
export const getMagnitudeCategory = (magnitude) => {
  if (magnitude >= 7) return 'Major';
  if (magnitude >= 6) return 'Strong';
  if (magnitude >= 5) return 'Moderate';
  if (magnitude >= 4) return 'Light';
  if (magnitude >= 3) return 'Minor';
  if (magnitude >= 2) return 'Very Minor';
  return 'Micro';
};

// Calculate distance between two points (rough approximation)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Filter earthquakes by various criteria
export const filterEarthquakes = (earthquakes, filters) => {
  return earthquakes.filter(earthquake => {
    const magnitude = earthquake.properties.mag;
    const time = earthquake.properties.time;
    
    // Magnitude filter
    if (filters.minMagnitude && magnitude < filters.minMagnitude) {
      return false;
    }
    
    // Time filter
    if (filters.timeRange) {
      const now = Date.now();
      const timeThreshold = now - (filters.timeRange * 24 * 60 * 60 * 1000);
      if (time < timeThreshold) {
        return false;
      }
    }
    
    return true;
  });
};