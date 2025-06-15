
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface JobSeekerHomeHeaderProps {
  userPrimaryCategory?: string;
}

const JobSeekerHomeHeader = ({
  userPrimaryCategory
}: JobSeekerHomeHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back!
      </h1>
      {userPrimaryCategory && (
        <p className="text-gray-600">
          Finding jobs in {userPrimaryCategory}
        </p>
      )}
    </div>
  );
};

export default JobSeekerHomeHeader;
