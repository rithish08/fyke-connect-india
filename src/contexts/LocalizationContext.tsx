
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations, supportedLanguages, formatCurrency, formatNumber, formatDate, formatTime } from '@/data/localization';

interface LocalizationContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string, params?: (string | number)[]) => string;
  isRTL: boolean;
  formatCurrency: (amount: number) => string;
  formatNumber: (number: number) => string;
  formatDate: (date: Date | string) => string;
  formatTime: (date: Date | string) => string;
  getSupportedLanguages: () => typeof supportedLanguages;
}

const LocalizationContext = createContext<LocalizationContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  isRTL: false,
  formatCurrency: (amount: number) => `₹${amount}`,
  formatNumber: (number: number) => number.toString(),
  formatDate: (date: Date | string) => new Date(date).toLocaleDateString(),
  formatTime: (date: Date | string) => new Date(date).toLocaleTimeString(),
  getSupportedLanguages: () => supportedLanguages
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // Get language from localStorage or default to English
    return localStorage.getItem('fyke_language') || 'en';
  });

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('fyke_language', lang);
    
    // Update document direction for RTL languages
    const langConfig = supportedLanguages.find(l => l.code === lang);
    if (langConfig?.rtl) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = lang;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const isRTL = supportedLanguages.find(l => l.code === language)?.rtl || false;

  const t = useCallback((key: string, fallback?: string, params?: (string | number)[]): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // Fallback to English if translation not found
    if (value === undefined) {
      let englishValue: any = translations.en;
      for (const k of keys) {
        englishValue = englishValue?.[k];
        if (englishValue === undefined) break;
      }
      value = englishValue;
    }
    
    // Use provided fallback if still not found
    if (value === undefined) {
      value = fallback || key;
    }
    
    // Replace parameters if provided
    if (typeof value === 'string' && params) {
      params.forEach((param, index) => {
        value = value.replace(`{${index}}`, param.toString());
      });
    }
    
    return value;
  }, [language]);

  // Format functions with current locale
  const formatCurrencyLocalized = useCallback((amount: number) => {
    return formatCurrency(amount, language);
  }, [language]);

  const formatNumberLocalized = useCallback((number: number) => {
    return formatNumber(number, language);
  }, [language]);

  const formatDateLocalized = useCallback((date: Date | string) => {
    return formatDate(date, language);
  }, [language]);

  const formatTimeLocalized = useCallback((date: Date | string) => {
    return formatTime(date, language);
  }, [language]);

  const getSupportedLanguages = useCallback(() => {
    return supportedLanguages;
  }, []);

  // Set initial document direction and language
  useEffect(() => {
    const langConfig = supportedLanguages.find(l => l.code === language);
    if (langConfig?.rtl) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{
      language,
      setLanguage,
      t,
      isRTL,
      formatCurrency: formatCurrencyLocalized,
      formatNumber: formatNumberLocalized,
      formatDate: formatDateLocalized,
      formatTime: formatTimeLocalized,
      getSupportedLanguages
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
