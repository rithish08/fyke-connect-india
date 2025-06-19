
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useScreenNavigation = () => {
  const navigate = useNavigate();

  const goTo = useCallback((path: string, options?: { replace?: boolean }) => {
    navigate(path, options);
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const goHome = useCallback(() => {
    navigate('/home');
  }, [navigate]);

  const goToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const goToProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return {
    goTo,
    goBack,
    goHome,
    goToLogin,
    goToProfile
  };
};
