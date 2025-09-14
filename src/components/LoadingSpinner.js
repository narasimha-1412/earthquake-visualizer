import React from "react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
        <p className="text-gray-500 text-sm mt-2">
          Fetching real-time earthquake data from USGS...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
