import React from "react";
import {
  formatDate,
  getMagnitudeCategory,
  getMarkerColor,
} from "../utils/earthquakeUtils";

const EarthquakeInfoPanel = ({ earthquake, onClose }) => {
  if (!earthquake) return null;

  const { properties, geometry } = earthquake;
  const [longitude, latitude, depth] = geometry.coordinates;

  return (
    <div
      className="bg-white rounded-lg shadow-xl p-6 mb-6 border-l-4"
      style={{ borderLeftColor: getMarkerColor(properties.mag) }}
    >
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🌋 Earthquake Details
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors duration-200"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Magnitude</h3>
            <div className="flex items-center space-x-2">
              <span
                className="text-3xl font-bold"
                style={{ color: getMarkerColor(properties.mag) }}
              >
                {properties.mag}
              </span>
              <span className="text-lg text-gray-600">
                ({getMagnitudeCategory(properties.mag)})
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
            <p className="text-gray-800">{properties.place}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Date & Time</h3>
            <p className="text-gray-800">{formatDate(properties.time)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Coordinates</h3>
            <p className="text-gray-800">
              <span className="font-medium">Lat:</span> {latitude.toFixed(4)}°
              <br />
              <span className="font-medium">Lng:</span> {longitude.toFixed(4)}°
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Depth</h3>
            <p className="text-gray-800">
              {depth ? `${depth.toFixed(1)} km` : "Unknown"}
            </p>
          </div>

          {properties.url && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">More Info</h3>
              <a
                href={properties.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View on USGS
              </a>
            </div>
          )}
        </div>
      </div>

      {properties.tsunami === 1 && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-800 font-semibold">
            ⚠️ Tsunami Warning Issued
          </p>
        </div>
      )}
    </div>
  );
};

export default EarthquakeInfoPanel;
