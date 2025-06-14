
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type?: 'worker' | 'job';
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'worker', 
  count = 3 
}) => {
  const skeletonItems = Array.from({ length: count }, (_, index) => (
    <div key={index} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-2xl">
      {type === 'worker' ? (
        <div className="flex items-start space-x-4">
          {/* Profile skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton className="h-20 w-20 rounded-xl" />
          </div>
          
          {/* Content skeleton */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <div className="flex space-x-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex flex-col space-y-2">
            <Skeleton className="h-11 w-28 rounded-2xl" />
            <div className="flex space-x-1">
              <Skeleton className="h-8 w-12 rounded-lg" />
              <Skeleton className="h-8 w-12 rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-18 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      )}
    </div>
  ));

  return (
    <div className="space-y-3" role="status" aria-label="Loading content">
      {skeletonItems}
    </div>
  );
};

export default LoadingSkeleton;
