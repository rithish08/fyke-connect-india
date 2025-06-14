
import { useLocalization } from './useLocalization';

export const useTranslation = () => {
  const { translateCategory, getLocalizedText } = useLocalization();
  
  return {
    translateCategory,
    translateText: getLocalizedText
  };
};
