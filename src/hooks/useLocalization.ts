
import { useState, useEffect } from 'react';
import { profileTranslations } from '@/data/localization/profile';
import { homeTranslations } from '@/data/localization/home';
import { searchTranslations } from '@/data/localization/search';
import { commonTranslations } from '@/data/localization/common';
import { navigationTranslations } from '@/data/localization/navigation';
import { categoryTranslations } from '@/data/localization/categories';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn' | 'ml';

const allTranslations = {
  profile: profileTranslations,
  home: homeTranslations,
  search: searchTranslations,
  common: commonTranslations,
  navigation: navigationTranslations,
  categories: categoryTranslations,
};

export const useLocalization = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('fyke_language') as SupportedLanguage;
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('fyke_language', language);
  };

  const getLocalizedText = (key: string, fallback?: string): string => {
    const keyParts = key.split('.');
    if (keyParts.length !== 2) return fallback || key;

    const [section, textKey] = keyParts;
    const sectionTranslations = allTranslations[section as keyof typeof allTranslations];
    
    if (!sectionTranslations) return fallback || key;
    
    const languageData = sectionTranslations[currentLanguage];
    if (!languageData) return fallback || key;
    
    return languageData[textKey as keyof typeof languageData] || fallback || key;
  };

  const translateCategory = (category: string): string => {
    const categoryData = categoryTranslations[currentLanguage];
    return categoryData[category.toLowerCase() as keyof typeof categoryData] || category;
  };

  return {
    currentLanguage,
    changeLanguage,
    getLocalizedText,
    translateCategory,
    availableLanguages: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'kn', 'ml'] as SupportedLanguage[]
  };
};
