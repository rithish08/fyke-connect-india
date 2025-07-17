import React from 'react';

const LoadingSkeleton = ({ width = '100%', height = '1.5rem', className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-md ${className}`}
    style={{ width, height }}
  />
);

export default LoadingSkeleton; 