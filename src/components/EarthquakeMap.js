import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import {
  getMarkerColor,
  getMarkerSize,
  formatDate,
} from "../utils/earthquakeUtils";
import "leaflet/dist/leaflet.css";

// Custom component to handle markers
const EarthquakeMarkers = ({ earthquakes, onEarthquakeSelect }) => {
  const map = useMap();
  const markersRef = useRef([]);

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add earthquake markers
    earthquakes.forEach((earthquake) => {
      const [lng, lat, depth] = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;

      const marker = L.circleMarker([lat, lng], {
        radius: getMarkerSize(magnitude),
        fillColor: getMarkerColor(magnitude),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      });

      const popupContent = `
        <div class="p-3 min-w-64">
          <h3 class="font-bold text-lg mb-2" style="color: ${getMarkerColor(
            magnitude
          )}">
            Magnitude ${magnitude}
          </h3>
          <p class="text-sm mb-1"><strong>Location:</strong> ${
            earthquake.properties.place
          }</p>
          <p class="text-sm mb-1"><strong>Time:</strong> ${formatDate(
            earthquake.properties.time
          )}</p>
          <p class="text-sm mb-3"><strong>Depth:</strong> ${
            depth ? `${depth.toFixed(1)} km` : "Unknown"
          }</p>
          <button 
            onclick="window.selectEarthquake('${earthquake.id}')" 
            class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("click", () => {
        onEarthquakeSelect(earthquake);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    // Fit map bounds to show all earthquakes
    if (earthquakes.length > 0) {
      const bounds = earthquakes.map((eq) => [
        eq.geometry.coordinates[1], // lat
        eq.geometry.coordinates[0], // lng
      ]);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [earthquakes, map, onEarthquakeSelect]);

  return null;
};

const EarthquakeMap = ({
  earthquakes,
  selectedEarthquake,
  onEarthquakeSelect,
}) => {
  // Set up global function for popup buttons
  useEffect(() => {
    window.selectEarthquake = (earthquakeId) => {
      const earthquake = earthquakes.find((eq) => eq.id === earthquakeId);
      if (earthquake) {
        onEarthquakeSelect(earthquake);
      }
    };

    return () => {
      delete window.selectEarthquake;
    };
  }, [earthquakes, onEarthquakeSelect]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          🗺️ Interactive Earthquake Map
        </h2>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {earthquakes.length} earthquakes
        </span>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-200">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={1}
          maxZoom={18}
          className="h-full w-full"
          scrollWheelZoom={true}
          worldCopyJump={false}
          maxBounds={[
            [-85, -180],
            [85, 180],
          ]}
          maxBoundsViscosity={1.0}
          zoomControl={true}
          attributionControl={true}
          style={{ background: "#a8d6f0" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            noWrap={true}
            bounds={[
              [-85, -180],
              [85, 180],
            ]}
            minZoom={1}
            maxZoom={18}
          />
          <EarthquakeMarkers
            earthquakes={earthquakes}
            onEarthquakeSelect={onEarthquakeSelect}
          />
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 mb-3">Magnitude Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
          {[
            { range: "< 2.0", color: "#00ff00", label: "Micro" },
            { range: "2.0 - 3.0", color: "#9aff9a", label: "Very Minor" },
            { range: "3.0 - 4.0", color: "#ffff00", label: "Minor" },
            { range: "4.0 - 5.0", color: "#ffa500", label: "Light" },
            { range: "5.0 - 6.0", color: "#ff4500", label: "Moderate" },
            { range: "6.0+", color: "#ff0000", label: "Strong+" },
          ].map((item) => (
            <div key={item.range} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2 border border-gray-400"
                style={{ backgroundColor: item.color }}
              ></div>
              <div>
                <div className="font-medium">{item.range}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarthquakeMap;
