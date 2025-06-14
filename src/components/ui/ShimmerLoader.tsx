
import React from "react";

const ShimmerLoader = ({ height = 40, width = "100%", className = "" }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl ${className}`}
    style={{ height, width }}
    aria-label="Loading"
  />
);

export default ShimmerLoader;
