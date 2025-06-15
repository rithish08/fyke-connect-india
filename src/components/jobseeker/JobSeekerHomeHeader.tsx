
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface JobSeekerHomeHeaderProps {
  userPrimaryCategory?: string;
}

const JobSeekerHomeHeader = ({ userPrimaryCategory }: JobSeekerHomeHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-4">
      {/* Text logo for fyke in black, bold, small f */}
      <span 
        className="font-extrabold text-2xl tracking-tight text-black"
        style={{ fontFamily: "Inter, sans-serif" }}
      >fyke</span>
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
