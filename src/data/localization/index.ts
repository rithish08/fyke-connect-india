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
      secure_verification: '🛡️ Secure Verification',
      security_help: 'This helps us keep your account safe and secure'
    },
    rating: {
      title: 'Rate Your Experience',
      how_was_experience: 'How was your experience with',
      job_prefix: 'Job:',
      poor: 'Poor',
      fair: 'Fair',
      good: 'Good',
      very_good: 'Very Good',
      excellent: 'Excellent',
      share_experience: 'Share your experience (required)',
      experience_placeholder: 'Describe your experience working together. This helps other users make informed decisions.',
      professional_responsibility: 'Professional Responsibility:',
      rating_visible: 'Your rating and review will be visible to other users. Please be honest, constructive, and professional in your feedback.',
      submit_rating: 'Submit Rating',
      submitting: 'Submitting...',
      rating_required: 'Rating Required',
      select_rating: 'Please select a star rating before submitting.',
      review_required: 'Review Required',
      detailed_review: 'Please provide a detailed review (minimum 10 characters).',
      rating_submitted: 'Rating Submitted',
      thank_you: 'Thank you for your feedback!',
      submission_failed: 'Submission Failed',
      try_again: 'Failed to submit rating. Please try again.',
      unexpected_error: 'An unexpected error occurred. Please try again.'
    },
    blocking: {
      rating_required: 'Rating Required',
      must_rate: 'You must rate your recent work experience to continue using the app. This maintains trust and quality for all users.',
      pending_ratings: '{0} of {1} ratings pending'
    },
    communication: {
      share_number: 'Share Phone Number',
      about_to_share: 'You are about to share your personal phone number with',
      for_job: 'For job:',
      professional_notice: 'Professional Responsibility Notice',
      share_guidelines: [
        '• Only share if necessary for work coordination',
        '• Keep all communication professional',
        '• You can report inappropriate behavior',
        '• This action cannot be undone'
      ],
      your_number: 'Your number:',
      not_available: 'Not available',
      cancel: 'Cancel',
      share_number_btn: 'Share Number',
      sharing: 'Sharing...',
      number_shared: 'Number Shared Successfully',
      can_see_number: '{0} can now see your phone number',
      failed_share: 'Failed to Share Number',
      confirm_call: 'Confirm Phone Call',
      about_to_call: 'You are about to call',
      regarding: 'Regarding:',
      call_guidelines: 'Professional Call Guidelines',
      call_tips: [
        '• Identify yourself and mention the job',
        '• Keep conversation work-related and respectful',
        '• Confirm meeting details and requirements',
        '• End call professionally'
      ],
      opens_dialer: 'This will open your phone\'s dialer to make the call',
      call_now: 'Call Now'
    },
    jobs: {
      accept_job: 'Accept Job',
      finish_job: 'Finish Job',
      job_accepted: 'Job Accepted!',
      coordinate_directly: 'You can now coordinate directly with the other party.',
      job_completed: 'Job Completed!',
      rate_when_prompted: 'Please rate your experience when prompted.',
      share_contact: 'You can now share contact details for better coordination.',
      number_shared_by: '{0} has shared their phone number: {1}',
      both_share_to_call: 'Both parties must share numbers to enable calling'
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
      secure_verification: '🛡️ सुरक्षित सत्यापन',
      security_help: 'यह आपके खाते को सुरक्षित रखने में मदद करता है'
    },
    rating: {
      title: 'अपने अनुभव को रेट करें',
      how_was_experience: 'आपका अनुभव कैसा था',
      job_prefix: 'काम:',
      poor: 'खराब',
      fair: 'ठीक',
      good: 'अच्छा',
      very_good: 'बहुत अच्छा',
      excellent: 'उत्कृष्ट',
      share_experience: 'अपना अनुभव साझा करें (आवश्यक)',
      experience_placeholder: 'एक साथ काम करने के अपने अनुभव का वर्णन करें। यह अन्य उपयोगकर्ताओं को सूचित निर्णय लेने में मदद करता है।',
      professional_responsibility: 'पेशेवर जिम्मेदारी:',
      rating_visible: 'आपकी रेटिंग और समीक्षा अन्य उपयोगकर्ताओं को दिखाई देगी। कृपया अपनी प्रतिक्रिया में ईमानदार, रचनात्मक और पेशेवर रहें।',
      submit_rating: 'रेटिंग जमा करें',
      submitting: 'जमा कर रहे हैं...',
      rating_required: 'रेटिंग आवश्यक',
      select_rating: 'कृपया जमा करने से पहले स्टार रेटिंग चुनें।',
      review_required: 'समीक्षा आवश्यक',
      detailed_review: 'कृपया विस्तृत समीक्षा प्रदान करें (न्यूनतम 10 अक्षर)।',
      rating_submitted: 'रेटिंग जमा की गई',
      thank_you: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
      submission_failed: 'जमा करना असफल',
      try_again: 'रेटिंग जमा करने में असफल। कृपया पुनः प्रयास करें।',
      unexpected_error: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।'
    },
    blocking: {
      rating_required: 'रेटिंग आवश्यक',
      must_rate: 'आपको ऐप का उपयोग जारी रखने के लिए अपनी हाल की कार्य अनुभव को रेट करना होगा। यह सभी उपयोगकर्ताओं के लिए विश्वास और गुणवत्ता बनाए रखता है।',
      pending_ratings: '{0} में से {1} रेटिंग बाकी हैं'
    },
    communication: {
      share_number: 'फोन नंबर साझा करें',
      about_to_share: 'आप अपना व्यक्तिगत फोन नंबर साझा करने वाले हैं',
      for_job: 'काम के लिए:',
      professional_notice: 'पेशेवर जिम्मेदारी नोटिस',
      share_guidelines: [
        '• केवल काम के समन्वय के लिए आवश्यक होने पर साझा करें',
        '• सभी संचार को पेशेवर रखें',
        '• आप अनुचित व्यवहार की रिपोर्ट कर सकते हैं',
        '• यह क्रिया पूर्ववत नहीं की जा सकती'
      ],
      your_number: 'आपका नंबर:',
      not_available: 'उपलब्ध नहीं',
      cancel: 'रद्द करें',
      share_number_btn: 'नंबर साझा करें',
      sharing: 'साझा कर रहे हैं...',
      number_shared: 'नंबर सफलतापूर्वक साझा किया गया',
      can_see_number: '{0} अब आपका फोन नंबर देख सकता है',
      failed_share: 'नंबर साझा करने में विफल',
      confirm_call: 'फोन कॉल की पुष्टि करें',
      about_to_call: 'आप कॉल करने वाले हैं',
      regarding: 'संबंधित:',
      call_guidelines: 'पेशेवर कॉल दिशानिर्देश',
      call_tips: [
        '• अपनी पहचान बताएं और काम का उल्लेख करें',
        '• बातचीत को काम से संबंधित और सम्मानजनक रखें',
        '• बैठक के विवरण और आवश्यकताओं की पुष्टि करें',
        '• कॉल को पेशेवर तरीके से समाप्त करें'
      ],
      opens_dialer: 'यह आपके फोन के डायलर को खोलकर कॉल करेगा',
      call_now: 'अभी कॉल करें'
    },
    jobs: {
      accept_job: 'काम स्वीकार करें',
      finish_job: 'काम पूरा करें',
      job_accepted: 'काम स्वीकार किया गया!',
      coordinate_directly: 'अब आप सीधे दूसरे पक्ष के साथ समन्वय कर सकते हैं।',
      job_completed: 'काम पूरा हुआ!',
      rate_when_prompted: 'कृपया जब पूछा जाए तो अपना अनुभव रेट करें।',
      share_contact: 'अब आप बेहतर समन्वय के लिए संपर्क विवरण साझा कर सकते हैं।',
      number_shared_by: '{0} ने अपना फोन नंबर साझा किया है: {1}',
      both_share_to_call: 'कॉल सक्षम करने के लिए दोनों पक्षों को नंबर साझा करना होगा'
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
    auth: {
      welcome: 'ஃபைக்-க்கு வரவேற்கிறோம்',
      phone_placeholder: '9876543210',
      send_otp: 'OTP அனுப்பு',
      verify_phone: 'உங்கள் தொலைபேசியை உறுதிப்படுத்தவும்',
      enter_code: 'அனுப்பப்பட்ட 6 இலக்க குறியீட்டை உள்ளிடவும்',
      code_auto_verify: 'குறியீடு தானாகவே சரிபார்க்கப்படும்',
      resend_in: '{0} வினாடிகளில் மீண்டும் அனுப்பு',
      resend_otp: 'OTP மீண்டும் அனுப்பு',
      change_number: '← எண் மாற்றவும்',
      secure_verification: '🛡️ பாதுகாப்பான உறுதிப்படுத்தல்',
      security_help: 'இது உங்கள் கணக்கை பாதுகாப்பாக வைத்திருக்க உதவுகிறது'
    },
    rating: {
      title: 'உங்கள் அனுபவத்தை மதிப்பிடவும்',
      how_was_experience: 'உங்கள் அனுபவம் எப்படி இருந்தது',
      job_prefix: 'வேலை:',
      poor: 'தீங்கு',
      fair: 'சராசரி',
      good: 'நன்று',
      very_good: 'மிகவும் நன்று',
      excellent: 'சிறந்தது',
      share_experience: 'உங்கள் அனுபவத்தை பகிரவும் (தேவை)',
      experience_placeholder: 'ஒன்றாக வேலை செய்த உங்கள் அனுபவத்தை விவரிக்கவும். இது மற்ற பயனர்களுக்கு அறிவார்ந்த முடிவுகளை எடுக்க உதவும்.',
      professional_responsibility: 'தொழில்முறை பொறுப்பு:',
      rating_visible: 'உங்கள் மதிப்பீடு மற்றும் விமர்சனம் மற்ற பயனர்களுக்கு தெரியப்படும். தயவுசெய்து உங்கள் கருத்துக்களை நேர்மையாகவும், கட்டுமானமாகவும், தொழில்முறை முறையிலும் வழங்கவும்.',
      submit_rating: 'மதிப்பீட்டை சமர்ப்பிக்கவும்',
      submitting: 'சமர்ப்பிக்கப்படுகிறது...',
      rating_required: 'மதிப்பீடு தேவை',
      select_rating: 'சமர்ப்பிப்பதற்கு முன் நட்சத்திர மதிப்பீட்டை தேர்ந்தெடுக்கவும்.',
      review_required: 'விமர்சனம் தேவை',
      detailed_review: 'தயவுசெய்து விரிவான விமர்சனத்தை வழங்கவும் (குறைந்தது 10 எழுத்துகள்).',
      rating_submitted: 'மதிப்பீடு சமர்ப்பிக்கப்பட்டது',
      thank_you: 'உங்கள் கருத்துக்கு நன்றி!',
      submission_failed: 'சமர்ப்பிப்பு தோல்வி',
      try_again: 'மதிப்பீடு சமர்ப்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
      unexpected_error: 'ஒரு எதிர்பாராத பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
    },
    blocking: {
      rating_required: 'மதிப்பீடு தேவை',
      must_rate: 'பயன்பாட்டை தொடர உங்கள் சமீபத்திய வேலை அனுபவத்தை மதிப்பிட வேண்டும். இது அனைத்து பயனர்களுக்கும் நம்பிக்கை மற்றும் தரத்தை பராமரிக்க உதவும்.',
      pending_ratings: '{0} இல் {1} மதிப்பீடுகள் நிலுவையில் உள்ளன'
    },
    communication: {
      share_number: 'தொலைபேசி எண்ணை பகிரவும்',
      about_to_share: 'நீங்கள் உங்கள் தனிப்பட்ட தொலைபேசி எண்ணை பகிரப்போகிறீர்கள்',
      for_job: 'வேலையின் பொருட்டு:',
      professional_notice: 'தொழில்முறை பொறுப்பு அறிவிப்பு',
      share_guidelines: [
        '• வேலை ஒத்துழைப்புக்குத் தேவையானபோது மட்டுமே பகிரவும்',
        '• அனைத்து தொடர்புகளும் தொழில்முறை முறையில் இருக்க வேண்டும்',
        '• நீங்கள் தவறான நடத்தை பற்றி புகார் செய்யலாம்',
        '• இந்த நடவடிக்கை மாற்ற முடியாது'
      ],
      your_number: 'உங்கள் எண்:',
      not_available: 'கிடைக்கவில்லை',
      cancel: 'ரத்து செய்',
      share_number_btn: 'எண்ணை பகிரவும்',
      sharing: 'பகிரப்படுகிறது...',
      number_shared: 'எண் வெற்றிகரமாக பகிரப்பட்டது',
      can_see_number: '{0} இப்போது உங்கள் தொலைபேசி எண்ணை பார்க்க முடியும்',
      failed_share: 'எண் பகிர்வதில் தோல்வி',
      confirm_call: 'தொலைபேசி அழைப்பை உறுதிப்படுத்தவும்',
      about_to_call: 'நீங்கள் அழைக்கப்போகிறீர்கள்',
      regarding: 'பொருத்தமானது:',
      call_guidelines: 'தொழில்முறை அழைப்பு வழிகாட்டிகள்',
      call_tips: [
        '• உங்கள் அடையாளத்தை கூறவும் மற்றும் வேலை பற்றி குறிப்பிடவும்',
        '• உரையாடலை வேலை சார்ந்த மற்றும் மரியாதையான முறையில் வைத்திருங்கள்',
        '• சந்திப்பு விவரங்கள் மற்றும் தேவைகளை உறுதிப்படுத்தவும்',
        '• அழைப்பை தொழில்முறை முறையில் முடிக்கவும்'
      ],
      opens_dialer: 'இது உங்கள் தொலைபேசி டயலரை திறந்து அழைப்பை செய்யும்',
      call_now: 'இப்போதே அழைக்கவும்'
    },
    jobs: {
      accept_job: 'வேலை ஏற்கவும்',
      finish_job: 'வேலை முடிக்கவும்',
      job_accepted: 'வேலை ஏற்றுக்கொள்ளப்பட்டது!',
      coordinate_directly: 'இப்போது நீங்கள் நேரடியாக மற்றவருடன் ஒத்துழைக்கலாம்.',
      job_completed: 'வேலை முடிந்தது!',
      rate_when_prompted: 'கேட்கப்பட்டபோது உங்கள் அனுபவத்தை மதிப்பிடவும்.',
      share_contact: 'மேலும் ஒத்துழைப்புக்காக தொடர்பு விவரங்களை பகிரலாம்.',
      number_shared_by: '{0} தனது தொலைபேசி எண்ணை பகிர்ந்துள்ளார்: {1}',
      both_share_to_call: 'அழைப்பை இயக்க இரு தரப்பினரும் எண்ணை பகிர வேண்டும்'
    },
    language: {
      select: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
      subtitle: 'தொடர உங்கள் விருப்ப மொழியை தேர்ந்தெடுக்கவும்',
      continue: 'தொடர்',
      continuing: 'தேர்ந்தெடுக்கப்பட்ட மொழியுடன் தொடர்கிறது',
      accessibility: 'இந்த செயலி திரை வாசிப்பாளர்கள் மற்றும் அணுகல் அம்சங்களை ஆதரிக்கிறது'
    },
    profile: {
      settings: 'அமைப்புகள்'
    },
    settings: {
      job_notifications: 'வேலை அறிவிப்புகள்',
      job_notifications_desc: 'புதிய வாய்ப்புகள் பற்றி அறிவிக்கப்படுங்கள்',
      message_notifications: 'செய்தி அறிவிப்புகள்',
      message_notifications_desc: 'புதிய செய்திகள் பற்றி அறிவிக்கப்படுங்கள்',
      accessibility: 'அணுகல்',
      high_contrast: 'உயர் மாறுபாடு',
      high_contrast_desc: 'காண்பதற்கு மேம்பாடு',
      font_size: 'எழுத்து அளவு',
      font_size_desc: 'உரை அளவை சரிசெய்க',
      small: 'சிறியது',
      medium: 'நடுத்தரம்',
      large: 'பெரியது',
      language_region: 'மொழி மற்றும் பகுதி',
      privacy: 'தனியுரிமை அமைப்புகள்',
      help_support: 'உதவி மற்றும் ஆதரவு',
      logout: 'வெளியேறு'
    }
  },

  // Additional languages can be added here following the same structure
};

export const formatCurrency = (amount: number, locale: string = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number: number, locale: string = 'en-IN') => {
  return new Intl.NumberFormat(locale).format(number);
};

export const formatDate = (date: Date | string, locale: string = 'en-IN') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

export const formatTime = (date: Date | string, locale: string = 'en-IN') => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
};
