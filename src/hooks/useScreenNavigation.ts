
import { useNavigate } from "react-router-dom";

/**
 * Provides typed navigation for screens.
 * Any central route logic goes here for consistency.
 */
export const useScreenNavigation = () => {
  const navigate = useNavigate();

  // Always use this signature for future navigation
  return {
    goTo: (path: string) => navigate(path),
    goBack: () => navigate(-1),
    // Extend with push/replace/query navigation as needed in the future
  };
};
