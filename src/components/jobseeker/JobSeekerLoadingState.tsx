
import { SkeletonJobCard } from '@/components/ui/skeleton-cards';

const JobSeekerLoadingState = () => {
  return (
    <div className="space-y-4 px-4">
      <SkeletonJobCard />
      <SkeletonJobCard />
      <SkeletonJobCard />
    </div>
  );
};

export default JobSeekerLoadingState;
