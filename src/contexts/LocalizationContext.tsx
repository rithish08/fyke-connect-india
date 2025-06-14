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
    'profile.settings': 'Settings',
    'common.switchMode': 'Switch Mode',
    'common.select_role': 'Select your role to continue',
    'role.switch_hint': 'You can switch roles anytime later in the app',
    'home.greetingMorning': 'Good Morning',
    'home.greetingAfternoon': 'Good Afternoon',
    'home.greetingEvening': 'Good Evening',

    // Job Search
    'search.placeholder_workers': 'Search workers...',
    'search.placeholder_jobs': 'Search jobs...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Select Category',
    
    // Job Card
    'job.application_submitted': 'Application Submitted!',
    'job.application_description': 'Your application has been submitted.',
    'common.salary': 'salary',
    'common.more': 'more',
    'category.types': 'types',
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
    'profile.settings': 'Settings',
    'common.switchMode': 'मोड बदलें',
    'common.select_role': 'आगे बढ़ने के लिए अपनी भूमिका चुनें',
    'role.switch_hint': 'आप बाद में कभी भी भूमिका बदल सकते हैं',
    'home.greetingMorning': 'सुप्रभात',
    'home.greetingAfternoon': 'शुभ अपराह्न',
    'home.greetingEvening': 'शुभ संध्या',

    // Job Search
    'search.placeholder_workers': 'Workers search करें...',
    'search.placeholder_jobs': 'Jobs search करें...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Category चुनें',
    
    // Job Card
    'job.application_submitted': 'Application Submit हो गया!',
    'job.application_description': 'आपका application submit हो गया है।',
    'common.salary': 'salary',
    'common.more': 'और',
    'category.types': 'प्रकार',
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
    'profile.settings': 'Settings',
    'common.switchMode': 'முறையை மாற்றவும்',
    'common.select_role': 'தொடர உங்கள் பாத்திரத்தை தேர்ந்தெடுக்கவும்',
    'role.switch_hint': 'நீங்கள் எதிர்காலத்தில் வேறு பங்கு எப்போதும் மாற்றலாம்',
    'home.greetingMorning': 'காலை வணக்கம்',
    'home.greetingAfternoon': 'மதியம் வணக்கம்',
    'home.greetingEvening': 'மாலை வணக்கம்',

    // Job Search
    'search.placeholder_workers': 'Workers ஐ தேடுங்கள்...',
    'search.placeholder_jobs': 'Jobs ஐ தேடுங்கள்...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Category தேர்ந்தெடுக்கவும்',
    
    // Job Card
    'job.application_submitted': 'Application Submit ஆகிவிட்டது!',
    'job.application_description': 'உங்கள் application submit ஆகிவிட்டது।',
    'common.salary': 'salary',
    'common.more': 'மேலும்',
    'category.types': 'வகைகள்',
  },

  te: {
    // Navigation
    'nav.home': 'హోం',
    'nav.search': 'ఉద్యోగాలు వెతకండి',
    'nav.my_jobs': 'నా ఉద్యోగాలు',
    'nav.messages': 'సందేశాలు',
    'nav.profile': 'ప్రొఫైల్',
    'nav.find_workers': 'కార్మికులు వెతకండి',
    'nav.my_posts': 'నా పోస్ట్‌లు',
    
    // Common
    'common.continue': 'కొనసాగించండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.save': 'సేవ్ చేయండి',
    'common.apply': 'దరఖాస్తు చేయండి',
    'common.call': 'కాల్ చేయండి',
    'common.message': 'సందేశం పంపండి',
    'common.urgent': 'అత్యవసరం',
    'common.per_day': '/రోజు',
    'common.loading': 'లోడ్ అవుతోంది...',
    
    // Language Selection
    'lang.title': 'మీ భాషను ఎంచుకోండి',
    'lang.subtitle': 'కొనసాగించడానికి మీ ఇష్టమైన భాషను ఎంచుకోండి',
    
    // Role Selection
    'role.title': 'మీ మార్గాన్ని ఎంచుకోండి',
    'role.subtitle': 'మీరు Fyke ని ఎలా ఉపయోగించాలనుకుంటున్నారు',
    'role.jobseeker': 'ఉద్యోగార్థి',
    'role.employer': 'యజమాని',
    'role.jobseeker_desc': 'పని అవకాశాలను కనుగొనండి మరియు మీ కెరీర్‌ను నిర్మించండి',
    'role.employer_desc': 'నైపుణ్యం గల కార్మికులను నియమించండి మరియు ప్రాజెక్ట్‌లను నిర్వహించండి',
    
    // Authentication
    'auth.welcome': 'Fyke కి స్వాగతం',
    'auth.subtitle': 'భారతదేశపు ప్రధాన బ్లూ-కాలర్ జాబ్ మార్కెట్‌ప్లేస్',
    'auth.phone_placeholder': '10-అంకెల నంబర్ ఎంటర్ చేయండి',
    'auth.otp_sent': 'మీ ఫోన్‌కు పంపిన వెరిఫికేషన్ కోడ్ ఎంటర్ చేయండి',
    
    // Home
    'home.welcome': 'స్వాగతం',
    'home.jobseeker_subtitle': 'మీ తదుపరి అవకాశాన్ని కనుగొనడానికి సిద్ధంగా ఉన్నారా?',
    'home.employer_subtitle': 'అద్భుతమైన ప్రతిభను నియమించడానికి సిద్ధంగా ఉన్నారా?',
    'home.emergency_jobs': 'అత్యవసర ఉద్యోగాలు',
    'home.recommended': 'మీ కోసం సిఫార్సు చేయబడినవి',
    
    // Job Search
    'search.title': 'ఉద్యోగాలు వెతకండి',
    'search.placeholder': 'ఉద్యోగాల కోసం వెతకండి...',
    'search.location': 'స్థానం',
    'search.category': 'వర్గం',
    'search.sort_by': 'ఇలా క్రమబద్ధీకరించండి',
    'search.results': 'ఫలితాలు',
    
    // Profile
    'profile.title': 'ప్రొఫైల్',
    'profile.edit': 'సవరించండి',
    'profile.complete_profile': 'మీ ప్రొఫైల్‌ను పూర్తి చేయండి',
    'profile.personal_info': 'వ్యక్తిగత సమాచారం',
    'profile.skills': 'నైపుణ్యాలు',
    'profile.verification': 'వెరిఫికేషన్',
    'profile.settings': 'సెట్టింగులు',
    'common.switchMode': 'మోడ్ మార్చండి',
    'common.select_role': 'కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి',
    'role.switch_hint': 'మీరు తర్వాత ఎప్పుడైనా పాత్రను మార్చవచ్చు',
    'home.greetingMorning': 'శుభోదయం',
    'home.greetingAfternoon': 'శుభ మధ్యాహ్నం',
    'home.greetingEvening': 'శుభ సాయంత్రం',

    // Job Search
    'search.placeholder_workers': 'Workers ను వెతకండి...',
    'search.placeholder_jobs': 'Jobs ను వెతకండి...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Category ఎంచుకోండి',
    
    // Job Card
    'job.application_submitted': 'Application Submit అయ్యింది!',
    'job.application_description': 'మీ application submit అయ్యింది।',
    'common.salary': 'salary',
    'common.more': 'మరిన్ని',
    'category.types': 'రకాలు',
  },

  bn: {
    // Navigation
    'nav.home': 'হোম',
    'nav.search': 'জব খোঁজুন',
    'nav.my_jobs': 'আমার জব',
    'nav.messages': 'বার্তা',
    'nav.profile': 'প্রোফাইল',
    'nav.find_workers': 'কর্মী খোঁজুন',
    'nav.my_posts': 'আমার পোস্ট',
    
    // Common
    'common.continue': 'অব্যাহত রাখুন',
    'common.cancel': 'বাতিল',
    'common.save': 'সংরক্ষণ',
    'common.apply': 'আবেদন করুন',
    'common.call': 'কল করুন',
    'common.message': 'বার্তা পাঠান',
    'common.urgent': 'জরুরি',
    'common.per_day': '/দিন',
    'common.loading': 'লোড হচ্ছে...',
    
    // Language Selection
    'lang.title': 'আপনার ভাষা নির্বাচন করুন',
    'lang.subtitle': 'চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন',
    
    // Role Selection
    'role.title': 'আপনার পথ বেছে নিন',
    'role.subtitle': 'আপনি কীভাবে Fyke ব্যবহার করতে চান',
    'role.jobseeker': 'চাকরি প্রার্থী',
    'role.employer': 'নিয়োগকর্তা',
    'role.jobseeker_desc': 'কাজের সুযোগ খুঁজুন এবং আপনার ক্যারিয়ার গড়ুন',
    'role.employer_desc': 'দক্ষ কর্মী নিয়োগ দিন এবং প্রকল্প পরিচালনা করুন',
    
    // Authentication
    'auth.welcome': 'Fyke-এ স্বাগতম',
    'auth.subtitle': 'ভারতের প্রধান ব্লু-কলার জব মার্কেটপ্লেস',
    'auth.phone_placeholder': '১০-সংখ্যার নম্বর লিখুন',
    'auth.otp_sent': 'আপনার ফোনে পাঠানো যাচাইকরণ কোড লিখুন',
    
    // Home
    'home.welcome': 'স্বাগতম',
    'home.jobseeker_subtitle': 'আপনার পরবর্তী সুযোগ খুঁজে পেতে প্রস্তুত?',
    'home.employer_subtitle': 'অসাধারণ প্রতিভা নিয়োগ দিতে প্রস্তুত?',
    'home.emergency_jobs': 'জরুরি কাজ',
    'home.recommended': 'আপনার জন্য সুপারিশকৃত',
    
    // Job Search
    'search.title': 'কাজ খোঁজুন',
    'search.placeholder': 'কাজের জন্য অনুসন্ধান করুন...',
    'search.location': 'অবস্থান',
    'search.category': 'বিভাগ',
    'search.sort_by': 'সাজান',
    'search.results': 'ফলাফল',
    
    // Profile
    'profile.title': 'প্রোফাইল',
    'profile.edit': 'সম্পাদনা',
    'profile.complete_profile': 'আপনার প্রোফাইল সম্পূর্ণ করুন',
    'profile.personal_info': 'ব্যক্তিগত তথ্য',
    'profile.skills': 'দক্ষতা',
    'profile.verification': 'যাচাইকরণ',
    'profile.settings': 'সেটিংস',
    'common.switchMode': 'মোড পরিবর্তন',
    'common.select_role': 'চালিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন',
    'role.switch_hint': 'আপনি পরে যেকোনো সময় ভূমিকা পরিবর্তন করতে পারেন',
    'home.greetingMorning': 'সুপ্রভাত',
    'home.greetingAfternoon': 'শুভ অপরাহ্ন',
    'home.greetingEvening': 'শুভ সন্ধ্যা',

    // Job Search
    'search.placeholder_workers': 'Workers খুঁজুন...',
    'search.placeholder_jobs': 'Jobs খুঁজুন...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Category নির্বাচন করুন',
    
    // Job Card
    'job.application_submitted': 'Application Submit হয়েছে!',
    'job.application_description': 'আপনার application submit হয়েছে।',
    'common.salary': 'salary',
    'common.more': 'আরও',
    'category.types': 'ধরন',
  },

  mr: {
    // Navigation
    'nav.home': 'होम',
    'nav.search': 'नोकऱ्या शोधा',
    'nav.my_jobs': 'माझ्या नोकऱ्या',
    'nav.messages': 'संदेश',
    'nav.profile': 'प्रोफाइल',
    'nav.find_workers': 'कामगार शोधा',
    'nav.my_posts': 'माझ्या पोस्ट',
    
    // Common
    'common.continue': 'सुरू ठेवा',
    'common.cancel': 'रद्द करा',
    'common.save': 'सेव्ह करा',
    'common.apply': 'अर्ज करा',
    'common.call': 'कॉल करा',
    'common.message': 'संदेश पाठवा',
    'common.urgent': 'तातडीचे',
    'common.per_day': '/दिवस',
    'common.loading': 'लोड होत आहे...',
    
    // Language Selection
    'lang.title': 'तुमची भाषा निवडा',
    'lang.subtitle': 'पुढे जाण्यासाठी तुमची आवडती भाषा निवडा',
    
    // Role Selection
    'role.title': 'तुमचा मार्ग निवडा',
    'role.subtitle': 'तुम्हाला Fyke कसे वापरायचे आहे',
    'role.jobseeker': 'नोकरी शोधणारा',
    'role.employer': 'नियोक्ता',
    'role.jobseeker_desc': 'कामाच्या संधी शोधा आणि तुमचे करिअर उभारा',
    'role.employer_desc': 'कुशल कामगार नियुक्त करा आणि प्रकल्प व्यवस्थापित करा',
    
    // Authentication
    'auth.welcome': 'Fyke मध्ये स्वागत आहे',
    'auth.subtitle': 'भारताचे आघाडीचे ब्लू-कॉलर जॉब मार्केटप्लेस',
    'auth.phone_placeholder': '10-अंकी नंबर एंटर करा',
    'auth.otp_sent': 'तुमच्या फोनवर पाठवलेला व्हेरिफिकेशन कोड एंटर करा',
    
    // Home
    'home.welcome': 'स्वागत आहे',
    'home.jobseeker_subtitle': 'तुमची पुढची संधी शोधण्यासाठी तयार आहात?',
    'home.employer_subtitle': 'उत्कृष्ट प्रतिभा नियुक्त करण्यासाठी तयार आहात?',
    'home.emergency_jobs': 'आपत्कालीन नोकऱ्या',
    'home.recommended': 'तुमच्यासाठी शिफारसीत',
    
    // Job Search
    'search.title': 'नोकऱ्या शोधा',
    'search.placeholder': 'नोकऱ्यांसाठी शोधा...',
    'search.location': 'स्थान',
    'search.category': 'श्रेणी',
    'search.sort_by': 'यानुसार क्रमवारी लावा',
    'search.results': 'परिणाम',
    
    // Profile
    'profile.title': 'प्रोफाइल',
    'profile.edit': 'संपादित करा',
    'profile.complete_profile': 'तुमचे प्रोफाइल पूर्ण करा',
    'profile.personal_info': 'वैयक्तिक माहिती',
    'profile.skills': 'कौशल्ये',
    'profile.verification': 'व्हेरिफिकेशन',
    'profile.settings': 'सेटिंग्ज',
    'common.switchMode': 'मोड बदला',
    'common.select_role': 'पुढे जाण्यासाठी तुमची भूमिका निवडा',
    'role.switch_hint': 'तुम्ही नंतर कधीही भूमिका बदलू शकता',
    'home.greetingMorning': 'सुप्रभात',
    'home.greetingAfternoon': 'शुभ दुपार',
    'home.greetingEvening': 'शुभ संध्याकाळ',

    // Job Search
    'search.placeholder_workers': 'Workers शोधा...',
    'search.placeholder_jobs': 'Jobs शोधा...',
    'search.current_location': 'Current Location',
    'search.select_category': 'Category निवडा',
    
    // Job Card
    'job.application_submitted': 'Application Submit झाली!',
    'job.application_description': 'तुमची application submit झाली आहे।',
    'common.salary': 'salary',
    'common.more': 'अधिक',
    'category.types': 'प्रकार',
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
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    }
  }, []);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('fyke_language', lang);
    document.documentElement.dir = ['ar', 'ur'].includes(lang) ? 'rtl' : 'ltr';
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
