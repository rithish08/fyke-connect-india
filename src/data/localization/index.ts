export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', rtl: false },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', rtl: false },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', rtl: false },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', rtl: false },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', rtl: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', rtl: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', rtl: false },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', rtl: false },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳', rtl: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true }
];

export const translations = {
  en: {
    app: {
      title: 'Fyke Connect',
      tagline: 'Connect. Work. Succeed.'
    },
    common: {
      loading: 'Loading',
      save: 'Save',
      cancel: 'Cancel',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      done: 'Done',
      close: 'Close',
      ok: 'OK',
      yes: 'Yes',
      no: 'No',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },
    auth: {
      welcome: 'Welcome to Fyke',
      phone_placeholder: '9876543210',
      send_otp: 'Send OTP',
      verify_phone: 'Verify Your Phone',
      enter_code: 'Enter the 6-digit code sent to',
      code_auto_verify: 'Code will be verified automatically',
      resend_in: 'Resend in {0}s',
      resend_otp: 'Resend OTP',
      change_number: '← Change Number',
      secure_verification: 'Secure Verification',
      security_help: 'This helps us keep your account safe and secure',
      invalid_otp: 'Invalid OTP',
      enter_complete_code: 'Please enter the complete 6-digit code',
      verification_failed: 'Verification Failed',
      invalid_otp_try_again: 'Invalid OTP. Please try again.',
      phone_verified: 'Phone Verified!',
      choose_role_continue: 'Now choose your role to continue',
      otp_resent: 'OTP Resent',
      new_code_sent: 'New verification code sent to your phone'
    },
    role: {
      title: 'Choose Your Role',
      subtitle: 'How do you want to use Fyke?',
      jobseeker: 'Find Work',
      jobseeker_desc: 'Browse jobs and earn money',
      employer: '发起人',
      employer_desc: 'Find skilled people instantly',
      switch_hint: 'You can switch roles anytime in the app'
    },
    language: {
      select: 'Select Your Language',
      subtitle: 'Choose your preferred language to continue',
      continue: 'Continue',
      continuing: 'Continuing with selected language',
      accessibility: 'This app supports screen readers and accessibility features'
    },
    profile: {
      settings: 'Settings'
    },
    settings: {
      job_notifications: 'Job Notifications',
      job_notifications_desc: 'Get notified about new opportunities',
      message_notifications: 'Message Notifications', 
      message_notifications_desc: 'Get notified about new messages',
      accessibility: 'Accessibility',
      high_contrast: 'High Contrast',
      high_contrast_desc: 'Improve visibility',
      font_size: 'Font Size',
      font_size_desc: 'Adjust text size',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      language_region: 'Language & Region',
      privacy: 'Privacy Settings',
      help_support: 'Help & Support',
      logout: 'Logout'
    }
  },
  
  hi: {
    app: {
      title: 'फाइक कनेक्ट',
      tagline: 'जुड़ें। काम करें। सफल हों।'
    },
    common: {
      loading: 'लोड हो रहा है',
      save: 'सहेजें',
      cancel: 'रद्द करें',
      continue: 'जारी रखें',
      back: 'वापस',
      next: 'अगला',
      done: 'हो गया',
      close: 'बंद करें',
      ok: 'ठीक है',
      yes: 'हाँ',
      no: 'नहीं',
      error: 'त्रुटि',
      success: 'सफलता',
      warning: 'चेतावनी',
      info: 'जानकारी'
    },
    auth: {
      welcome: 'फाइक में आपका स्वागत है',
      phone_placeholder: '9876543210',
      send_otp: 'OTP भेजें',
      verify_phone: 'अपना फोन सत्यापित करें',
      enter_code: '6-अंकीय कोड दर्ज करें जो भेजा गया है',
      code_auto_verify: 'कोड स्वचालित रूप से सत्यापित होगा',
      resend_in: '{0} सेकंड में दोबारा भेजें',
      resend_otp: 'OTP दोबारा भेजें',
      change_number: '← नंबर बदलें',
      secure_verification: 'सुरक्षित सत्यापन',
      security_help: 'यह आपके खाते को सुरक्षित रखने में मदद करता है',
      invalid_otp: 'अमान्य OTP',
      enter_complete_code: 'कृपया पूरा 6-अंकीय कोड दर्ज करें',
      verification_failed: 'सत्यापन असफल',
      invalid_otp_try_again: 'अमान्य OTP। कृपया पुनः प्रयास करें।',
      phone_verified: 'फोन सत्यापित!',
      choose_role_continue: 'अब जारी रखने के लिए अपनी भूमिका चुनें',
      otp_resent: 'OTP दोबारा भेजा गया',
      new_code_sent: 'आपके फोन पर नया सत्यापन कोड भेजा गया'
    },
    role: {
      title: 'अपनी भूमिका चुनें',
      subtitle: 'आप फाइक का उपयोग कैसे करना चाहते हैं?',
      jobseeker: 'काम खोजें',
      jobseeker_desc: 'नौकरियाँ ब्राउज़ करें और पैसे कमाएं',
      employer: 'कामगार किराए पर लें',
      employer_desc: 'तुरंत कुशल लोग खोजें',
      switch_hint: 'आप ऐप में कभी भी भूमिकाएं बदल सकते हैं'
    },
    language: {
      select: 'अपनी भाषा चुनें',
      subtitle: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
      continue: 'जारी रखें',
      continuing: 'चयनित भाषा के साथ जारी',
      accessibility: 'यह ऐप स्क्रीन रीडर और पहुंच सुविधाओं का समर्थन करता है'
    },
    profile: {
      settings: 'सेटिंग्स'
    },
    settings: {
      job_notifications: 'नौकरी सूचनाएं',
      job_notifications_desc: 'नई अवसरों के बारे में सूचित रहें',
      message_notifications: 'संदेश सूचनाएं',
      message_notifications_desc: 'नए संदेशों के बारे में सूचित रहें',
      accessibility: 'पहुँच',
      high_contrast: 'उच्च कंट्रास्ट',
      high_contrast_desc: 'दृश्यता में सुधार करें',
      font_size: 'फ़ॉन्ट आकार',
      font_size_desc: 'पाठ का आकार समायोजित करें',
      small: 'छोटा',
      medium: 'मध्यम',
      large: 'बड़ा',
      language_region: 'भाषा और क्षेत्र',
      privacy: 'गोपनीयता सेटिंग्स',
      help_support: 'सहायता और समर्थन',
      logout: 'लॉग आउट'
    }
  },

  ta: {
    app: {
      title: 'ஃபைக் கனெக்ட்',
      tagline: 'இணைக்கவும். வேலை செய்யுங்கள். வெற்றி பெறுங்கள்.'
    },
    common: {
      loading: 'ஏற்றுகிறது',
      save: 'சேமி',
      cancel: 'ரத்து செய்',
      continue: 'தொடரவும்',
      back: 'பின்னால்',
      next: 'அடுத்து',
      done: 'முடிந்தது',
      close: 'மூடு',
      ok: 'சரி',
      yes: 'ஆம்',
      no: 'இல்லை',
      error: 'பிழை',
      success: 'வெற்றி',
      warning: 'எச்சரிக்கை',
      info: 'தகவல்'
    },
    auth: {
      welcome: 'ஃபைக்கிற்கு வரவேற்கிறோம்',
      phone_placeholder: '9876543210',
      send_otp: 'OTP அனுப்பு',
      verify_phone: 'உங்கள் தொலைபேசியை சரிபார்க்கவும்',
      enter_code: 'அனுப்பப்பட்ட 6 இலக்கக் குறியீட்டை உள்ளிடவும்',
      code_auto_verify: 'குறியீடு தானாகச் சரிபார்க்கப்படும்',
      resend_in: '{0} வினாடிகளில் மீண்டும் அனுப்பவும்',
      resend_otp: 'OTP மீண்டும் அனுப்பவும்',
      change_number: '← எண்ணை மாற்றவும்',
      secure_verification: 'பாதுகாப்பான சரிபார்ப்பு',
      security_help: 'இது உங்கள் கணக்கைப் பாதுகாப்பாக வைத்திருக்க உதவுகிறது',
      invalid_otp: 'தவறான OTP',
      enter_complete_code: 'முழு 6 இலக்கக் குறியீட்டை உள்ளிடவும்',
      verification_failed: 'சரிபார்ப்பு தோல்வியடைந்தது',
      invalid_otp_try_again: 'தவறான OTP. மீண்டும் முயற்சிக்கவும்.',
      phone_verified: 'தொலைபேசி சரிபார்க்கப்பட்டது!',
      choose_role_continue: 'தொடர உங்கள் பாத்திரத்தைத் தேர்வு செய்யவும்',
      otp_resent: 'OTP மீண்டும் அனுப்பப்பட்டது',
      new_code_sent: 'உங்கள் தொலைபேசிக்கு புதிய சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டது'
    },
    role: {
      title: 'உங்கள் பாத்திரத்தைத் தேர்வு செய்யவும்',
      subtitle: 'ஃபைக்கை எப்படிப் பயன்படுத்த விரும்புகிறீர்கள்?',
      jobseeker: 'வேலை தேடு',
      jobseeker_desc: 'வேலைகளை உலாவவும் மற்றும் பணம் சம்பாதிக்கவும்',
      employer: 'பணியாளர்களை நியமிக்கவும்',
      employer_desc: 'உடனடியாக திறமையான நபர்களைக் கண்டறியவும்',
      switch_hint: 'பயன்பாட்டில் எப்போது வேண்டுமானாலும் பாத்திரங்களை மாற்றலாம்'
    },
    language: {
      select: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
      subtitle: 'தொடர நீங்கள் விரும்பும் மொழியைத் தேர்ந்தெடுக்கவும்',
      continue: 'தொடரவும்',
      continuing: 'தேர்ந்தெடுக்கப்பட்ட மொழியுடன் தொடர்கிறது',
      accessibility: 'இந்த பயன்பாடு திரை வாசிப்பாளர்கள் மற்றும் அணுகல் அம்சங்களை ஆதரிக்கிறது'
    },
    profile: {
      settings: 'அமைப்புகள்'
    },
    settings: {
      job_notifications: 'வேலை அறிவிப்புகள்',
      job_notifications_desc: 'புதிய வாய்ப்புகள் பற்றி அறிவிக்கப்படவும்',
      message_notifications: 'செய்தி அறிவிப்புகள்',
      message_notifications_desc: 'புதிய செய்திகள் பற்றி அறிவிக்கப்படவும்',
      accessibility: 'அணுகல்தன்மை',
      high_contrast: 'உயர் மாறுபாடு',
      high_contrast_desc: 'காட்சித் திறனை மேம்படுத்தவும்',
      font_size: 'எழுத்து அளவு',
      font_size_desc: 'உரை அளவை சரிசெய்யவும்',
      small: 'சிறியது',
      medium: 'நடுத்தரம்',
      large: 'பெரியது',
      language_region: 'மொழி மற்றும் பிராந்தியம்',
      privacy: 'தனியுரிமை அமைப்புகள்',
      help_support: 'உதவி மற்றும் ஆதரவு',
      logout: 'வெளியேறு'
    }
  },

  te: {
    app: {
      title: 'ఫైక్ కనెక్ట్',
      tagline: 'కనెక్ట్ అవ్వండి. పని చేయండి. విజయం సాధించండి.'
    },
    common: {
      loading: 'లోడ్ అవుతోంది',
      save: 'సేవ్ చేయండి',
      cancel: 'రద్దు చేయండి',
      continue: 'కొనసాగించండి',
      back: 'వెనుకకు',
      next: 'తరువాత',
      done: 'పూర్తయింది',
      close: 'మూసివేయండి',
      ok: 'సరే',
      yes: 'అవును',
      no: 'లేదు',
      error: 'లోపం',
      success: 'విజయం',
      warning: 'హెచ్చరిక',
      info: 'సమాచారం'
    },
    auth: {
      welcome: 'ఫైక్‌కి స్వాగతం',
      phone_placeholder: '9876543210',
      send_otp: 'OTP పంపండి',
      verify_phone: 'మీ ఫోన్‌ను ధృవీకరించండి',
      enter_code: 'పంపిన 6-అంకెల కోడ్‌ను నమోదు చేయండి',
      code_auto_verify: 'కోడ్ స్వయంచాలకంగా ధృవీకరించబడుతుంది',
      resend_in: '{0} సెకన్లలో మళ్లీ పంపండి',
      resend_otp: 'OTPని మళ్లీ పంపండి',
      change_number: '← సంఖ్యను మార్చండి',
      secure_verification: 'సురక్షిత ధృవీకరణ',
      security_help: 'ఇది మీ ఖాతాను సురక్షితంగా ఉంచడంలో సహాయపడుతుంది',
      invalid_otp: 'చెల్లని OTP',
      enter_complete_code: 'పూర్తి 6-అంకెల కోడ్‌ను నమోదు చేయండి',
      verification_failed: 'ధృవీకరణ విఫలమైంది',
      invalid_otp_try_again: 'చెల్లని OTP. దయచేసి మళ్లీ ప్రయత్నించండి.',
      phone_verified: 'ఫోన్ ధృవీకరించబడింది!',
      choose_role_continue: 'కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి',
      otp_resent: 'OTP మళ్లీ పంపబడింది',
      new_code_sent: 'మీ ఫోన్‌కు కొత్త ధృవీకరణ కోడ్ పంపబడింది'
    },
    role: {
      title: 'మీ పాత్రను ఎంచుకోండి',
      subtitle: 'మీరు ఫైక్‌ను ఎలా ఉపయోగించాలనుకుంటున్నారు?',
      jobseeker: 'ఉద్యోగం కనుగొనండి',
      jobseeker_desc: 'ఉద్యోగాలను బ్రౌజ్ చేయండి మరియు డబ్బు సంపాదించండి',
      employer: 'కార్మికులను నియమించండి',
      employer_desc: 'నైపుణ్యం కలిగిన వ్యక్తులను తక్షణమే కనుగొనండి',
      switch_hint: 'మీరు యాప్‌లో ఎప్పుడైనా పాత్రలను మార్చవచ్చు'
    },
    language: {
      select: 'మీ భాషను ఎంచుకోండి',
      subtitle: 'కొనసాగించడానికి మీకు ఇష్టమైన భాషను ఎంచుకోండి',
      continue: 'కొనసాగించండి',
      continuing: 'ఎంచుకున్న భాషతో కొనసాగుతోంది',
      accessibility: 'ఈ అనువర్తనం స్క్రీన్ రీడర్‌లు మరియు ప్రాప్యత లక్షణాలకు మద్దతు ఇస్తుంది'
    },
    profile: {
      settings: 'సెట్టింగ్‌లు'
    },
    settings: {
      job_notifications: 'ఉద్యోగ ప్రకటనలు',
      job_notifications_desc: 'కొత్త అవకాశాల గురించి తెలియజేయండి',
      message_notifications: 'సందేశ ప్రకటనలు',
      message_notifications_desc: 'కొత్త సందేశాల గురించి తెలియజేయండి',
      accessibility: 'ప్రాప్యత',
      high_contrast: 'అధిక వ్యత్యాసం',
      high_contrast_desc: 'దృశ్యమానతను మెరుగుపరచండి',
      font_size: 'ఫాంట్ పరిమాణం',
      font_size_desc: 'వచన పరిమాణాన్ని సర్దుబాటు చేయండి',
      small: 'చిన్న',
      medium: 'మధ్యస్థం',
      large: 'పెద్ద',
      language_region: 'భాష మరియు ప్రాంతం',
      privacy: 'గోప్యతా సెట్టింగ్‌లు',
      help_support: 'సహాయం మరియు మద్దతు',
      logout: 'నిష్క్రమించు'
    }
  },

  bn: {
    app: {
      title: 'ফাইক কানেক্ট',
      tagline: 'সংযুক্ত হন। কাজ করুন। সফল হন।'
    },
    common: {
      loading: 'লোড হচ্ছে',
      save: 'সংরক্ষণ করুন',
      cancel: 'বাতিল করুন',
      continue: 'চালিয়ে যান',
      back: 'পেছনে',
      next: 'পরবর্তী',
      done: 'হয়ে গেছে',
      close: 'বন্ধ করুন',
      ok: 'ঠিক আছে',
      yes: 'হ্যাঁ',
      no: 'না',
      error: 'ত্রুটি',
      success: 'সাফল্য',
      warning: 'সতর্কতা',
      info: 'তথ্য'
    },
    auth: {
      welcome: 'ফাইকে স্বাগতম',
      phone_placeholder: '9876543210',
      send_otp: 'OTP পাঠান',
      verify_phone: 'আপনার ফোন যাচাই করুন',
      enter_code: 'প্রেরিত 6-সংখ্যার কোডটি প্রবেশ করান',
      code_auto_verify: 'কোড স্বয়ংক্রিয়ভাবে যাচাই করা হবে',
      resend_in: '{0} সেকেন্ডে পুনরায় পাঠান',
      resend_otp: 'OTP পুনরায় পাঠান',
      change_number: '← নম্বর পরিবর্তন করুন',
      secure_verification: 'নিরাপদ যাচাইকরণ',
      security_help: 'এটি আপনার অ্যাকাউন্ট সুরক্ষিত রাখতে সাহায্য করে',
      invalid_otp: 'অবৈধ OTP',
      enter_complete_code: 'সম্পূর্ণ 6-সংখ্যার কোডটি প্রবেশ করান',
      verification_failed: 'যাচাইকরণ ব্যর্থ হয়েছে',
      invalid_otp_try_again: 'অবৈধ OTP। আবার চেষ্টা করুন.',
      phone_verified: 'ফোন যাচাই করা হয়েছে!',
      choose_role_continue: 'চালিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন',
      otp_resent: 'OTP পুনরায় পাঠানো হয়েছে',
      new_code_sent: 'আপনার ফোনে নতুন যাচাইকরণ কোড পাঠানো হয়েছে'
    },
    role: {
      title: 'আপনার ভূমিকা নির্বাচন করুন',
      subtitle: 'আপনি কীভাবে ফাইক ব্যবহার করতে চান?',
      jobseeker: 'কাজ খুঁজুন',
      jobseeker_desc: 'কাজ ব্রাউজ করুন এবং অর্থ উপার্জন করুন',
      employer: 'কর্মী নিয়োগ করুন',
      employer_desc: 'দক্ষ কর্মীদের তাৎক্ষণিকভাবে খুঁজুন',
      switch_hint: 'আপনি অ্যাপে যে কোনও সময় ভূমিকা পরিবর্তন করতে পারেন'
    },
    language: {
      select: 'আপনার ভাষা নির্বাচন করুন',
      subtitle: 'চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন',
      continue: 'চালিয়ে যান',
      continuing: 'নির্বাচিত ভাষার সাথে চলছে',
      accessibility: 'এই অ্যাপ্লিকেশনটি স্ক্রিন রিডার এবং অ্যাক্সেসযোগ্যতা বৈশিষ্ট্য সমর্থন করে'
    },
    profile: {
      settings: 'সেটিংস'
    },
    settings: {
      job_notifications: 'চাকরির বিজ্ঞপ্তি',
      job_notifications_desc: 'নতুন সুযোগ সম্পর্কে বিজ্ঞপ্তি পান',
      message_notifications: 'বার্তা বিজ্ঞপ্তি',
      message_notifications_desc: 'নতুন বার্তা সম্পর্কে বিজ্ঞপ্তি পান',
      accessibility: 'অ্যাক্সেসযোগ্যতা',
      high_contrast: 'উচ্চ বৈসাদৃশ্য',
      high_contrast_desc: 'দৃশ্যমানতা উন্নত করুন',
      font_size: 'ফন্টের আকার',
      font_size_desc: 'লেখার আকার সামঞ্জস্য করুন',
      small: 'ছোট',
      medium: 'মাঝারি',
      large: 'বড়',
      language_region: 'ভাষা এবং অঞ্চল',
      privacy: 'গোপনীয়তা সেটিংস',
      help_support: 'সহায়তা এবং সমর্থন',
      logout: 'প্রস্থান করুন'
    }
  },

  mr: {
    app: {
      title: 'फाईक कनेक्ट',
      tagline: 'कनेक्ट व्हा. काम करा. यशस्वी व्हा.'
    },
    common: {
      loading: 'लोड होत आहे',
      save: 'सेव्ह करा',
      cancel: 'रद्द करा',
      continue: 'सुरू ठेवा',
      back: 'मागे',
      next: 'पुढे',
      done: 'झाले',
      close: 'बंद करा',
      ok: 'ठीक आहे',
      yes: 'होय',
      no: 'नाही',
      error: 'त्रुटी',
      success: 'यश',
      warning: 'चेतावणी',
      info: 'माहिती'
    },
    auth: {
      welcome: 'फाईकमध्ये आपले स्वागत आहे',
      phone_placeholder: '9876543210',
      send_otp: 'OTP पाठवा',
      verify_phone: 'आपला फोन सत्यापित करा',
      enter_code: 'पाठवलेला 6-अंकी कोड प्रविष्ट करा',
      code_auto_verify: 'कोड स्वयंचलितपणे सत्यापित केला जाईल',
      resend_in: '{0} सेकंदात पुन्हा पाठवा',
      resend_otp: 'OTP पुन्हा पाठवा',
      change_number: '← नंबर बदला',
      secure_verification: 'सुरक्षित सत्यापन',
      security_help: 'हे आपले खाते सुरक्षित ठेवण्यास मदत करते',
      invalid_otp: 'अवैध OTP',
      enter_complete_code: 'संपूर्ण 6-अंकी कोड प्रविष्ट करा',
      verification_failed: 'सत्यापन अयशस्वी',
      invalid_otp_try_again: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.',
      phone_verified: 'फोन सत्यापित झाला!',
      choose_role_continue: 'सुरू ठेवण्यासाठी आपली भूमिका निवडा',
      otp_resent: 'OTP पुन्हा पाठवला',
      new_code_sent: 'आपल्या फोनवर नवीन सत्यापन कोड पाठवला गेला आहे'
    },
    role: {
      title: 'आपली भूमिका निवडा',
      subtitle: 'आपण फाईकचा वापर कसा करू इच्छिता?',
      jobseeker: 'नोकरी शोधा',
      jobseeker_desc: 'नोकरी ब्राउझ करा आणि पैसे कमवा',
      employer: 'कर्मचारी नियुक्त करा',
      employer_desc: 'तत्काळ कुशल लोकांना शोधा',
      switch_hint: 'आपण अॅपमध्ये कधीही भूमिका बदलू शकता'
    },
    language: {
      select: 'आपली भाषा निवडा',
      subtitle: 'सुरू ठेवण्यासाठी आपली आवडती भाषा निवडा',
      continue: 'सुरू ठेवा',
      continuing: 'निवडलेल्या भाषेत सुरू',
      accessibility: 'हा अनुप्रयोग स्क्रीन रीडर आणि प्रवेशयोग्यता वैशिष्ट्यांचे समर्थन करतो'
    },
    profile: {
      settings: 'सेटिंग्ज'
    },
    settings: {
      job_notifications: 'नोकरी सूचना',
      job_notifications_desc: 'नवीन संधीं
