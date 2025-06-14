
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonJobCard = () => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-24" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

export const SkeletonWorkerCard = () => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right space-y-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-18" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-9 flex-1" />
      <Skeleton className="h-9 w-10" />
    </div>
  </div>
);

export const SkeletonProfileCard = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-16" />
    </div>
    <div className="space-y-3">
      <div>
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 3, type = 'job' }: { count?: number; type?: 'job' | 'worker' | 'profile' }) => {
  const SkeletonComponent = type === 'job' ? SkeletonJobCard : type === 'worker' ? SkeletonWorkerCard : SkeletonProfileCard;
  
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};
