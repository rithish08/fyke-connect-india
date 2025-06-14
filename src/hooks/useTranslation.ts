
import { useLocalization } from '@/contexts/LocalizationContext';
import { categoryTranslations } from '@/data/localization/categories';

export const useTranslation = () => {
  const { language, t } = useLocalization();
  
  const translateCategory = (category: string): string => {
    const translations = categoryTranslations[language as keyof typeof categoryTranslations] || categoryTranslations.en;
    return translations[category as keyof typeof translations] || category;
  };

  const translateText = (key: string, fallback?: string): string => {
    return t(key, fallback);
  };

  return {
    translateCategory,
    translateText,
    t,
    language
  };
};
