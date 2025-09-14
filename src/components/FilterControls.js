import React from "react";

const FilterControls = ({
  onMagnitudeFilter,
  magnitudeFilter,
  onTimeFilter,
  timeFilter,
  earthquakes,
}) => {
  const magnitudeOptions = [
    { value: 0, label: "All", color: "bg-gray-500" },
    { value: 1, label: "1.0+", color: "bg-green-500" },
    { value: 2, label: "2.0+", color: "bg-yellow-500" },
    { value: 3, label: "3.0+", color: "bg-orange-500" },
    { value: 4, label: "4.0+", color: "bg-red-500" },
    { value: 5, label: "5.0+", color: "bg-purple-500" },
  ];

  const timeOptions = [
    { value: null, label: "All Time" },
    { value: 0.25, label: "Last 6 Hours" },
    { value: 0.5, label: "Last 12 Hours" },
    { value: 1, label: "Last 24 Hours" },
  ];

  const getMagnitudeCounts = (minMag) => {
    return earthquakes.filter((eq) => eq.properties.mag >= minMag).length;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        🔍 Filter Earthquakes
      </h3>

      <div className="space-y-4">
        {/* Magnitude Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">
            Filter by Magnitude
          </h4>
          <div className="flex flex-wrap gap-2">
            {magnitudeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onMagnitudeFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  magnitudeFilter === option.value
                    ? `${option.color} text-white shadow-lg scale-105`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
                <span className="ml-1 text-xs opacity-75">
                  ({getMagnitudeCounts(option.value)})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Filter */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Filter by Time</h4>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
              <button
                key={option.value || "all"}
                onClick={() => onTimeFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  timeFilter === option.value
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
