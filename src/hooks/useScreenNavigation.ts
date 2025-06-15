
import { useNavigate } from 'react-router-dom';

export const useScreenNavigation = () => {
  const navigate = useNavigate();

  const goTo = (path: string, options?: { replace?: boolean; state?: any }) => {
    navigate(path, options);
  };

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/home');
  };

  return {
    goTo,
    goBack,
    goHome
  };
};
