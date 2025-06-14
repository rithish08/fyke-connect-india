
import { useTranslation } from './useTranslation';

export const useLocalization = () => {
  const { currentLanguage, translateText, translateCategory } = useTranslation();

  const getLocalizedJobCategories = () => {
    const categories = [
      'Construction', 'Delivery', 'Cleaning', 'Security', 
      'Driver', 'Cooking', 'Gardening', 'Beauty'
    ];
    
    return categories.map(category => ({
      original: category,
      translated: translateCategory(category)
    }));
  };

  const getLocalizedText = (key: string, fallback: string) => {
    return translateText(key, fallback);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDistance = (distance: string | number) => {
    if (typeof distance === 'number') {
      return `${distance}km ${translateText('common.away', 'away')}`;
    }
    return distance;
  };

  return {
    currentLanguage,
    getLocalizedJobCategories,
    getLocalizedText,
    formatCurrency,
    formatDistance,
    translateCategory,
    translateText
  };
};
