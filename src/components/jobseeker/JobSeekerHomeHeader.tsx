
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface JobSeekerHomeHeaderProps {
  userPrimaryCategory?: string;
}

const JobSeekerHomeHeader = ({ userPrimaryCategory }: JobSeekerHomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900">
        {userPrimaryCategory ? `${userPrimaryCategory} Jobs` : 'Jobs for You'}
      </h2>
      <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
        View All
      </Button>
    </div>
  );
};

export default JobSeekerHomeHeader;
