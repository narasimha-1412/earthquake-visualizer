import React from "react";
import { getMagnitudeCategory } from "../utils/earthquakeUtils";

const StatsDashboard = ({ earthquakes, filteredEarthquakes }) => {
  const getStrongestEarthquake = () => {
    if (earthquakes.length === 0) return null;
    return earthquakes.reduce((max, eq) =>
      eq.properties.mag > max.properties.mag ? eq : max
    );
  };

  const getRecentCount = (hours) => {
    const now = Date.now();
    const threshold = now - hours * 60 * 60 * 1000;
    return earthquakes.filter((eq) => eq.properties.time > threshold).length;
  };

  const strongest = getStrongestEarthquake();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        📊 Earthquake Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
            Total Today
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {earthquakes.length}
          </p>
          <p className="text-xs text-blue-500">All magnitudes</p>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-semibold text-green-700 uppercase tracking-wide">
            Currently Showing
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {filteredEarthquakes.length}
          </p>
          <p className="text-xs text-green-500">Filtered results</p>
        </div>

        <div className="text-center p-4 bg-red-50 rounded-lg">
          <h3 className="text-sm font-semibold text-red-700 uppercase tracking-wide">
            Strongest Today
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {strongest ? strongest.properties.mag.toFixed(1) : "N/A"}
          </p>
          <p className="text-xs text-red-500">
            {strongest
              ? getMagnitudeCategory(strongest.properties.mag)
              : "No data"}
          </p>
        </div>

        <div className="text-center p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">
            Last 6 Hours
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {getRecentCount(6)}
          </p>
          <p className="text-xs text-yellow-500">Recent activity</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
