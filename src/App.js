import React, { useState, useEffect } from 'react';
import EarthquakeMap from './components/EarthquakeMap';
import EarthquakeInfoPanel from './components/EarthquakeInfoPanel';
import FilterControls from './components/FilterControls';
import StatsDashboard from './components/StatsDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { EarthquakeAPI } from './utils/api';
import { filterEarthquakes } from './utils/earthquakeUtils';

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState([]);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Filter states
  const [magnitudeFilter, setMagnitudeFilter] = useState(0);
  const [timeFilter, setTimeFilter] = useState(null);

  // Load earthquake data
  const loadEarthquakeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await EarthquakeAPI.getTodayEarthquakes();
      
      if (data && data.features) {
        setEarthquakes(data.features);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Error loading earthquake data:', err);
      setError('Failed to load earthquake data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadEarthquakeData();
  }, []);

  // Filter earthquakes when filters change
  useEffect(() => {
    const filters = {
      minMagnitude: magnitudeFilter,
      timeRange: timeFilter
    };
    
    const filtered = filterEarthquakes(earthquakes, filters);
    setFilteredEarthquakes(filtered);
  }, [earthquakes, magnitudeFilter, timeFilter]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadEarthquakeData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleMagnitudeFilter = (minMagnitude) => {
    setMagnitudeFilter(minMagnitude);
  };

  const handleTimeFilter = (timeRange) => {
    setTimeFilter(timeRange);
  };

  const handleEarthquakeSelect = (earthquake) => {
    setSelectedEarthquake(earthquake);
  };

  const handleCloseInfo = () => {
    setSelectedEarthquake(null);
  };

  const handleRefresh = () => {
    loadEarthquakeData();
  };

  if (loading && earthquakes.length === 0) {
    return <LoadingSpinner message="Loading earthquake data..." />;
  }

  if (error && earthquakes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRefresh}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">🌍 Earthquake Visualizer</h1>
              <p className="text-blue-100 mt-1">Real-time seismic activity monitoring</p>
            </div>
            
            <div className="text-right">
              {lastUpdated && (
                <div className="text-blue-100 text-sm">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <button 
                onClick={handleRefresh}
                disabled={loading}
                className="mt-2 bg-blue-500 hover:bg-blue-400 disabled:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>🔄 Refresh Data</>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <strong>Warning:</strong> {error}
          </div>
        )}

        {/* Statistics Dashboard */}
        <StatsDashboard 
          earthquakes={earthquakes} 
          filteredEarthquakes={filteredEarthquakes} 
        />

        {/* Filter Controls */}
        <FilterControls 
          onMagnitudeFilter={handleMagnitudeFilter}
          magnitudeFilter={magnitudeFilter}
          onTimeFilter={handleTimeFilter}
          timeFilter={timeFilter}
          earthquakes={earthquakes}
        />

        {/* Selected Earthquake Info */}
        {selectedEarthquake && (
          <EarthquakeInfoPanel 
            earthquake={selectedEarthquake}
            onClose={handleCloseInfo}
          />
        )}

        {/* Map */}
        <EarthquakeMap 
          earthquakes={filteredEarthquakes}
          selectedEarthquake={selectedEarthquake}
          onEarthquakeSelect={handleEarthquakeSelect}
        />

        {/* No Results Message */}
        {filteredEarthquakes.length === 0 && earthquakes.length > 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No earthquakes match your filters</h3>
            <p className="text-gray-500">Try adjusting your magnitude or time filters to see more results.</p>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About This Tool</h3>
              <p className="text-gray-300 text-sm">
                This earthquake visualizer helps geography students and researchers 
                understand global seismic patterns using real-time data from the 
                USGS Earthquake Hazards Program.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Source</h3>
              <p className="text-gray-300 text-sm">
                All earthquake data is provided by the 
                <a 
                  href="https://earthquake.usgs.gov/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  U.S. Geological Survey
                </a>
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Data updates every minute
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Real-time earthquake data</li>
                <li>• Interactive mapping</li>
                <li>• Magnitude-based filtering</li>
                <li>• Detailed earthquake information</li>
                <li>• Responsive design</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              Built for Casey and geography students worldwide 🌍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;