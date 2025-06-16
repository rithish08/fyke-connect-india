
import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Common
    'common.back': 'Back',
    'common.of': 'of',
    'common.continue': 'Continue',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    
    // Home
    'home.title': 'Home',
    'home.greetingMorning': 'Good Morning',
    'home.greetingAfternoon': 'Good Afternoon',
    'home.greetingEvening': 'Good Evening',
    'home.jobseeker_subtitle': 'Ready to find work?',
    'home.employer_subtitle': 'Ready to hire?',
    
    // Language Selection
    'lang.choose': 'Choose Your Language',
    'lang.sub': 'Select your preferred language',
    'lang.selected': 'Selected',
    'lang.continue': 'Continue',
    
    // Login
    'login.title': 'Welcome to Fyke',
    'login.desc': 'Sign in with your phone number to continue',
    'login.or': 'OR',
    'login.phonePlaceholder': 'Enter your phone number',
    'login.phoneLabel': 'Phone number',
    'login.sendOtpBtn': 'Send OTP',
    'login.sending': 'Sending…',
    'login.agree': 'By continuing, you agree to our',
    'login.tos': 'Terms of Service',
    'login.and': 'and',
    'login.privacy': 'Privacy Policy',
    
    // OTP
    'otp.title': 'Verify Your Phone',
    'otp.enterCode': 'Enter the 6-digit code sent to',
    'otp.auto': 'Code will be verified automatically',
    'otp.resendIn': 'Resend in',
    'otp.resendBtn': 'Resend OTP',
    'otp.backToLogin': 'Back to Login',
    'otp.secure': 'Secure Verification',
    'otp.safe': 'This helps us keep your account safe and secure',
    
    // Role Selection
    'role.chooseTitle': 'What brings you here?',
    'role.chooseDesc': 'Choose your role to get started',
    'role.jobseeker': 'Job Seeker',
    'role.employer': 'Employer',
    'role.jobseeker.desc': 'Looking for work opportunities',
    'role.employer.desc': 'Hiring workers for jobs',
    'role.continue': 'Continue',
    'role.setFailed': 'Failed to set role. Please try again.',
    
    // Profile
    'profile.category': 'Category',
    'profile.availability': 'Availability',
    'profile.status.available': 'Available',
    'profile.status.busy': 'Busy',
    'profile.editBtn': 'Edit Full Profile',
    'profile.step': 'Step',
    'profile.salary.title': 'Set Your Rates',
    'profile.salary.subtitle': 'How much do you charge for each service?',
    'profile.error.missingInfo': 'Missing Information',
    'profile.error.fillRequired': 'Please fill in all required fields',
    'profile.error.setupFailed': 'Setup Failed',
    'profile.error.failedComplete': 'Failed to complete profile setup',
    'profile.success.complete': 'Profile Complete!',
    'profile.success.welcome': 'Welcome to Fyke! You can now start finding jobs.',
  },
  hi: {
    // Common
    'common.back': 'वापस',
    'common.of': 'का',
    'common.continue': 'जारी रखें',
    'common.loading': 'लोड हो रहा है...',
    'common.save': 'सेव करें',
    'common.cancel': 'रद्द करें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.confirm': 'पुष्टि करें',
    
    // Home
    'home.title': 'होम',
    'home.greetingMorning': 'सुप्रभात',
    'home.greetingAfternoon': 'नमस्कार',
    'home.greetingEvening': 'शुभ संध्या',
    'home.jobseeker_subtitle': 'काम खोजने के लिए तैयार?',
    'home.employer_subtitle': 'काम पर रखने के लिए तैयार?',
    
    // Language Selection
    'lang.choose': 'अपनी भाषा चुनें',
    'lang.sub': 'अपनी पसंदीदा भाषा चुनें',
    'lang.selected': 'चुना गया',
    'lang.continue': 'जारी रखें',
    
    // Login
    'login.title': 'फाइक में आपका स्वागत है',
    'login.desc': 'जारी रखने के लिए अपने फोन नंबर से साइन इन करें',
    'login.or': 'या',
    'login.phonePlaceholder': 'अपना फोन नंबर दर्ज करें',
    'login.phoneLabel': 'फोन नंबर',
    'login.sendOtpBtn': 'OTP भेजें',
    'login.sending': 'भेजा जा रहा है…',
    'login.agree': 'जारी रखकर, आप हमारी सहमति देते हैं',
    'login.tos': 'सेवा की शर्तें',
    'login.and': 'और',
    'login.privacy': 'गोपनीयता नीति',
    
    // OTP
    'otp.title': 'अपना फोन सत्यापित करें',
    'otp.enterCode': 'भेजा गया 6-अंकीय कोड दर्ज करें',
    'otp.auto': 'कोड स्वचालित रूप से सत्यापित होगा',
    'otp.resendIn': 'पुनः भेजें',
    'otp.resendBtn': 'OTP पुनः भेजें',
    'otp.backToLogin': 'लॉगिन पर वापस जाएं',
    'otp.secure': 'सुरक्षित सत्यापन',
    'otp.safe': 'यह आपके खाते को सुरक्षित रखने में मदद करता है',
    
    // Role Selection
    'role.chooseTitle': 'आप यहाँ क्यों आए हैं?',
    'role.chooseDesc': 'शुरुआत करने के लिए अपनी भूमिका चुनें',
    'role.jobseeker': 'नौकरी तलाशने वाला',
    'role.employer': 'नियोक्ता',
    'role.jobseeker.desc': 'काम के अवसर तलाश रहे हैं',
    'role.employer.desc': 'नौकरियों के लिए कामगार नियुक्त कर रहे हैं',
    'role.continue': 'जारी रखें',
    'role.setFailed': 'भूमिका सेट करने में विफल। कृपया पुनः प्रयास करें।',
    
    // Profile
    'profile.category': 'श्रेणी',
    'profile.availability': 'उपलब्धता',
    'profile.status.available': 'उपलब्ध',
    'profile.status.busy': 'व्यस्त',
    'profile.editBtn': 'पूरी प्रोफाइल संपादित करें',
    'profile.step': 'चरण',
    'profile.salary.title': 'अपनी दरें सेट करें',
    'profile.salary.subtitle': 'आप प्रत्येक सेवा के लिए कितना शुल्क लेते हैं?',
    'profile.error.missingInfo': 'जानकारी गुम',
    'profile.error.fillRequired': 'कृपया सभी आवश्यक फील्ड भरें',
    'profile.error.setupFailed': 'सेटअप विफल',
    'profile.error.failedComplete': 'प्रोफाइल सेटअप पूरा करने में विफल',
    'profile.success.complete': 'प्रोफाइल पूर्ण!',
    'profile.success.welcome': 'फाइक में आपका स्वागत है! अब आप नौकरी खोजना शुरू कर सकते हैं।',
  }
};

export interface LocalizationContextProps {
  currentLanguage: string;
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextProps | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('fyke_language', language);
  };

  const t = (key: string, fallback?: string) => {
    const lang = currentLanguage as keyof typeof translations;
    const langTranslations = translations[lang] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || fallback || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('fyke_language');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const value = {
    currentLanguage,
    language: currentLanguage,
    setLanguage,
    t,
  };

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextProps => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};
