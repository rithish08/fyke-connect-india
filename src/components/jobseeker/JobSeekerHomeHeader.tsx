import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
interface JobSeekerHomeHeaderProps {
  userPrimaryCategory?: string;
}
const JobSeekerHomeHeader = ({
  userPrimaryCategory
}: JobSeekerHomeHeaderProps) => {
  const navigate = useNavigate();
  return;
};
export default JobSeekerHomeHeader;