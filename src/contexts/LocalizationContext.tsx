
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocalizationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.search': 'Find Jobs',
    'nav.my_jobs': 'My Jobs',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.find_workers': 'Find Workers',
    'nav.my_posts': 'My Posts',
    
    // Common
    'common.continue': 'Continue',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.apply': 'Apply Now',
    'common.call': 'Call',
    'common.message': 'Message',
    'common.urgent': 'Urgent',
    'common.per_day': '/day',
    'common.loading': 'Loading...',
    
    // Language Selection
    'lang.title': 'Choose Your Language',
    'lang.subtitle': 'Select your preferred language to continue',
    
    // Role Selection
    'role.title': 'Choose Your Path',
    'role.subtitle': 'Select how you want to use Fyke',
    'role.jobseeker': 'Job Seeker',
    'role.employer': 'Employer',
    'role.jobseeker_desc': 'Find work opportunities and build your career',
    'role.employer_desc': 'Hire skilled workers and manage projects',
    
    // Authentication
    'auth.welcome': 'Welcome to Fyke',
    'auth.subtitle': 'India\'s Premier Blue-Collar Job Marketplace',
    'auth.phone_placeholder': 'Enter 10-digit number',
    'auth.otp_sent': 'Enter verification code sent to your phone',
    
    // Home
    'home.welcome': 'Welcome',
    'home.jobseeker_subtitle': 'Ready to find your next opportunity?',
    'home.employer_subtitle': 'Ready to hire amazing talent?',
    'home.emergency_jobs': 'Emergency Jobs',
    'home.recommended': 'Recommended for You',
    
    // Job Search
    'search.title': 'Find Jobs',
    'search.placeholder': 'Search for jobs...',
    'search.location': 'Location',
    'search.category': 'Category',
    'search.sort_by': 'Sort by',
    'search.results': 'results',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit',
    'profile.complete_profile': 'Complete Your Profile',
    'profile.personal_info': 'Personal Information',
    'profile.skills': 'Skills',
    'profile.verification': 'Verification',
    'profile.settings': 'Settings'
  },
  
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.search': 'Jobs खोजें',
    'nav.my_jobs': 'मेरी Jobs',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.find_workers': 'Workers खोजें',
    'nav.my_posts': 'मेरी Posts',
    
    // Common
    'common.continue': 'आगे बढ़ें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.apply': 'Apply करें',
    'common.call': 'Call करें',
    'common.message': 'Message करें',
    'common.urgent': 'तुरंत',
    'common.per_day': '/दिन',
    'common.loading': 'Loading...',
    
    // Language Selection
    'lang.title': 'अपनी भाषा चुनें',
    'lang.subtitle': 'आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें',
    
    // Role Selection
    'role.title': 'अपना Path चुनें',
    'role.subtitle': 'आप Fyke का उपयोग कैसे करना चाहते हैं',
    'role.jobseeker': 'Job Seeker',
    'role.employer': 'Employer',
    'role.jobseeker_desc': 'काम के अवसर खोजें और अपना career बनाएं',
    'role.employer_desc': 'skilled workers को hire करें और projects manage करें',
    
    // Authentication
    'auth.welcome': 'Fyke में आपका स्वागत है',
    'auth.subtitle': 'India का प्रमुख Blue-Collar Job Marketplace',
    'auth.phone_placeholder': '10-digit number डालें',
    'auth.otp_sent': 'आपके phone पर भेजा गया verification code डालें',
    
    // Home
    'home.welcome': 'स्वागत है',
    'home.jobseeker_subtitle': 'अपना अगला opportunity खोजने के लिए तैयार?',
    'home.employer_subtitle': 'amazing talent को hire करने के लिए तैयार?',
    'home.emergency_jobs': 'Emergency Jobs',
    'home.recommended': 'आपके लिए Recommended',
    
    // Job Search
    'search.title': 'Jobs खोजें',
    'search.placeholder': 'Jobs के लिए search करें...',
    'search.location': 'Location',
    'search.category': 'Category',
    'search.sort_by': 'Sort by',
    'search.results': 'results',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit करें',
    'profile.complete_profile': 'अपनी Profile complete करें',
    'profile.personal_info': 'Personal Information',
    'profile.skills': 'Skills',
    'profile.verification': 'Verification',
    'profile.settings': 'Settings'
  },
  
  ta: {
    // Navigation
    'nav.home': 'வீடு',
    'nav.search': 'Jobs தேடு',
    'nav.my_jobs': 'என் Jobs',
    'nav.messages': 'Messages',
    'nav.profile': 'Profile',
    'nav.find_workers': 'Workers தேடு',
    'nav.my_posts': 'என் Posts',
    
    // Common
    'common.continue': 'தொடரவும்',
    'common.cancel': 'ரத்து செய்',
    'common.save': 'சேமி',
    'common.apply': 'Apply செய்',
    'common.call': 'Call செய்',
    'common.message': 'Message செய்',
    'common.urgent': 'அவசரம்',
    'common.per_day': '/நாள்',
    'common.loading': 'Loading...',
    
    // Language Selection
    'lang.title': 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    'lang.subtitle': 'தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    
    // Role Selection
    'role.title': 'உங்கள் Path தேர்ந்தெடுக்கவும்',
    'role.subtitle': 'நீங்கள் Fyke ஐ எப்படி பயன்படுத்த விரும்புகிறீர்கள்',
    'role.jobseeker': 'Job Seeker',
    'role.employer': 'Employer',
    'role.jobseeker_desc': 'வேலை வாய்ப்புகளைக் கண்டறிந்து உங்கள் career ஐ உருவாக்குங்கள்',
    'role.employer_desc': 'skilled workers ஐ hire செய்து projects ஐ manage செய்யுங்கள்',
    
    // Authentication
    'auth.welcome': 'Fyke இல் உங்களை வரவேற்கிறோம்',
    'auth.subtitle': 'India வின் முன்னணி Blue-Collar Job Marketplace',
    'auth.phone_placeholder': '10-digit number ஐ உள்ளிடவும்',
    'auth.otp_sent': 'உங்கள் phone இல் அனுப்பப்பட்ட verification code ஐ உள்ளிடவும்',
    
    // Home
    'home.welcome': 'வரவேற்கிறோம்',
    'home.jobseeker_subtitle': 'உங்கள் அடுத்த opportunity ஐ கண்டறிய தயாரா?',
    'home.employer_subtitle': 'amazing talent ஐ hire செய்ய தயாரா?',
    'home.emergency_jobs': 'Emergency Jobs',
    'home.recommended': 'உங்களுக்காக Recommended',
    
    // Job Search
    'search.title': 'Jobs தேடு',
    'search.placeholder': 'Jobs க்காக search செய்யுங்கள்...',
    'search.location': 'Location',
    'search.category': 'Category',
    'search.sort_by': 'Sort by',
    'search.results': 'results',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit செய்',
    'profile.complete_profile': 'உங்கள் Profile ஐ complete செய்யுங்கள்',
    'profile.personal_info': 'Personal Information',
    'profile.skills': 'Skills',
    'profile.verification': 'Verification',
    'profile.settings': 'Settings'
  }
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en');
  const isRTL = ['ar', 'ur'].includes(language);

  useEffect(() => {
    const storedLang = localStorage.getItem('fyke_language');
    if (storedLang && translations[storedLang as keyof typeof translations]) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('fyke_language', lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  };

  const t = (key: string, fallback?: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || fallback || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LocalizationContext.Provider>
  );
};
