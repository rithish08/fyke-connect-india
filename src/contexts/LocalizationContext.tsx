import React, { createContext, useContext, useState, useCallback } from 'react';

interface LocalizationContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, fallback?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextProps>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

interface LocalizationProviderProps {
  children: React.ReactNode;
}

const translations = {
  en: {
    role: {
      jobseeker: 'Job Seeker',
      employer: 'Employer'
    },
    home: {
      title: 'Home',
      greetingMorning: 'Good Morning',
      greetingAfternoon: 'Good Afternoon', 
      greetingEvening: 'Good Evening',
      jobseeker_subtitle: 'Ready to find work?',
      employer_subtitle: 'Ready to hire?'
    },
    search: {
      title: 'Job Search',
      select_category: 'Select Category',
      placeholder_workers: 'Search workers...',
      placeholder_jobs: 'Search jobs...',
      current_location: 'Current Location',
      results: 'results'
    },
    jobs: {
      title: 'My Jobs'
    },
    profile: {
      title: 'Profile'
    },
    messages: {
      title: 'Messages'
    },
    notifications: {
      title: 'Notifications'
    },
    category: {
      types: 'types',
      selected: 'selected',
      specializations: 'Specializations',
      edit: 'Edit'
    },
    common: {
      switch: 'Switch',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      save: 'Save'
    },
    app: {
      title: 'App'
    }
  },
  hi: {
    role: {
      jobseeker: 'नौकरी चाहने वाला',
      employer: 'नियोक्ता'
    },
    home: {
      title: 'होम',
      greetingMorning: 'सुप्रभात',
      greetingAfternoon: 'नमस्कार',
      greetingEvening: 'शुभ संध्या',
      jobseeker_subtitle: 'काम खोजने के लिए तैयार?',
      employer_subtitle: 'काम पर रखने के लिए तैयार?'
    },
    search: {
      title: 'नौकरी खोज',
      select_category: 'श्रेणी चुनें',
      placeholder_workers: 'कामगार खोजें...',
      placeholder_jobs: 'नौकरी खोजें...',
      current_location: 'वर्तमान स्थान',
      results: 'परिणाम'
    },
    jobs: {
      title: 'मेरी नौकरियां'
    },
    profile: {
      title: 'प्रोफाइल'
    },
    messages: {
      title: 'संदेश'
    },
    notifications: {
      title: 'सूचनाएं'
    },
    category: {
      types: 'प्रकार',
      selected: 'चयनित',
      specializations: 'विशेषताएं',
      edit: 'संपादित करें'
    },
    common: {
      switch: 'बदलें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      back: 'वापस',
      next: 'अगला',
      save: 'सेव करें'
    },
    app: {
      title: 'ऐप'
    }
  },
  ta: {
    role: {
      jobseeker: 'வேலை தேடுபவர்',
      employer: 'வேலை வழங்குபவர்'
    },
    home: {
      title: 'முகப்பு',
      greetingMorning: 'காலை வணக்கம்',
      greetingAfternoon: 'மதிய வணக்கம்',
      greetingEvening: 'மாலை வணக்கம்',
      jobseeker_subtitle: 'வேலை தேட தயாரா?',
      employer_subtitle: 'பணியாளர்களை அமர்த்த தயாரா?'
    },
    search: {
      title: 'வேலை தேடல்',
      select_category: 'பிரிவு தேர்ந்தெடுக்கவும்',
      placeholder_workers: 'தொழிலாளர்களைத் தேடுங்கள்...',
      placeholder_jobs: 'வேலைகளைத் தேடுங்கள்...',
      current_location: 'தற்போதைய இடம்',
      results: 'முடிவுகள்'
    },
    jobs: {
      title: 'எனது வேலைகள்'
    },
    profile: {
      title: 'சுயவிவரம்'
    },
    messages: {
      title: 'செய்திகள்'
    },
    notifications: {
      title: 'அறிவிப்புகள்'
    },
    category: {
      types: 'வகைகள்',
      selected: 'தேர்ந்தெடுக்கப்பட்டது',
      specializations: 'நிபுணத்துவங்கள்',
      edit: 'திருத்து'
    },
    common: {
      switch: 'மாற்று',
      cancel: 'ரத்து செய்',
      confirm: 'உறுதிப்படுத்து',
      back: 'திரும்பு',
      next: 'அடுத்து',
      save: 'சேமி'
    },
    app: {
      title: 'ஆப்'
    }
  },
  te: {
    role: {
      jobseeker: 'ఉద్యోగం వెతుకుతున్న వ్యక్తి',
      employer: 'ఉద్యోగం ఇచ్చే వ్యక్తి'
    },
    home: {
      title: 'హోమ్',
      greetingMorning: 'శుభోదయం',
      greetingAfternoon: 'శుభ మధ్యాహ్నం',
      greetingEvening: 'శుభ సాయంత్రం',
      jobseeker_subtitle: 'పని వెతకడానికి సిద్ధంగా ఉన్నారా?',
      employer_subtitle: 'ఉద్యోగులను చేర్చుకోవడానికి సిద్ధంగా ఉన్నారా?'
    },
    search: {
      title: 'ఉద్యోగ వెతుకులాట',
      select_category: 'వర్గం ఎంచుకోండి',
      placeholder_workers: 'కార్మికులను వెతకండి...',
      placeholder_jobs: 'ఉద్యోగాలను వెతకండి...',
      current_location: 'ప్రస్తుత స్థానం',
      results: 'ఫలితాలు'
    },
    jobs: {
      title: 'నా ఉద్యోగాలు'
    },
    profile: {
      title: 'ప్రొఫైల్'
    },
    messages: {
      title: 'సందేశాలు'
    },
    notifications: {
      title: 'నోటిఫికేషన్లు'
    },
    category: {
      types: 'రకాలు',
      selected: 'ఎంచుకున్నవి',
      specializations: 'నైపుణ్యాలు',
      edit: 'సవరించు'
    },
    common: {
      switch: 'మార్చు',
      cancel: 'రద్దు చేయి',
      confirm: 'నిర్ధారించు',
      back: 'వెనుకకు',
      next: 'తరువాత',
      save: 'సేవ్ చేయి'
    },
    app: {
      title: 'యాప్'
    }
  },
  bn: {
    role: {
      jobseeker: 'চাকরিপ্রার্থী',
      employer: 'নিয়োগকর্তা'
    },
    home: {
      title: 'হোম',
      greetingMorning: 'সুপ্রভাত',
      greetingAfternoon: 'শুভ বিকাল',
      greetingEvening: 'শুভ সন্ধ্যা',
      jobseeker_subtitle: 'কাজ খোঁজার জন্য প্রস্তুত?',
      employer_subtitle: 'নিয়োগের জন্য প্রস্তুত?'
    },
    search: {
      title: 'চাকরি খোঁজ',
      select_category: 'বিভাগ নির্বাচন করুন',
      placeholder_workers: 'কর্মী খুঁজুন...',
      placeholder_jobs: 'চাকরি খুঁজুন...',
      current_location: 'বর্তমান অবস্থান',
      results: 'ফলাফল'
    },
    jobs: {
      title: 'আমার চাকরি'
    },
    profile: {
      title: 'প্রোফাইল'
    },
    messages: {
      title: 'বার্তা'
    },
    notifications: {
      title: 'বিজ্ঞপ্তি'
    },
    category: {
      types: 'ধরন',
      selected: 'নির্বাচিত',
      specializations: 'বিশেষত্ব',
      edit: 'সম্পাদনা'
    },
    common: {
      switch: 'পরিবর্তন',
      cancel: 'বাতিল',
      confirm: 'নিশ্চিত করুন',
      back: 'পিছনে',
      next: 'পরবর্তী',
      save: 'সংরক্ষণ'
    },
    app: {
      title: 'অ্যাপ'
    }
  },
  mr: {
    role: {
      jobseeker: 'नोकरी शोधणारा',
      employer: 'नोकरी देणारा'
    },
    home: {
      title: 'होम',
      greetingMorning: 'सुप्रभात',
      greetingAfternoon: 'शुभ दुपार',
      greetingEvening: 'शुभ संध्याकाळ',
      jobseeker_subtitle: 'काम शोधण्यासाठी तयार आहात?',
      employer_subtitle: 'कामगार नेमण्यासाठी तयार आहात?'
    },
    search: {
      title: 'नोकरी शोध',
      select_category: 'श्रेणी निवडा',
      placeholder_workers: 'कामगार शोधा...',
      placeholder_jobs: 'नोकऱ्या शोधा...',
      current_location: 'सध्याचे स्थान',
      results: 'परिणाम'
    },
    jobs: {
      title: 'माझ्या नोकऱ्या'
    },
    profile: {
      title: 'प्रोफाइल'
    },
    messages: {
      title: 'संदेश'
    },
    notifications: {
      title: 'सूचना'
    },
    category: {
      types: 'प्रकार',
      selected: 'निवडलेले',
      specializations: 'विशेषता',
      edit: 'संपादित करा'
    },
    common: {
      switch: 'बदला',
      cancel: 'रद्द करा',
      confirm: 'पुष्टी करा',
      back: 'मागे',
      next: 'पुढे',
      save: 'जतन करा'
    },
    app: {
      title: 'अॅप'
    }
  }
};

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(localStorage.getItem('language') || 'en');

  const setLanguageAndUpdateStorage = useCallback((lang: string) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
  
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        return fallback || key;
      }
    }
  
    return typeof value === 'string' ? value : fallback || key;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage: setLanguageAndUpdateStorage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
