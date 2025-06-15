
import { useLocalization } from './useLocalization';

const extendedTranslations = {
  en: {
    'offline.title': 'You are offline',
    'offline.message': 'Some features may be limited',
    'offline.sync': 'Will sync when connected',
    'calendar.title': 'My Schedule',
    'calendar.noEvents': 'No scheduled events',
    'calendar.addEvent': 'Add to Calendar',
    'schedule.interview': 'Interview Scheduled',
    'schedule.workStart': 'Work Starts',
    'schedule.deadline': 'Deadline',
    'notifications.jobAlert': 'New job matching your skills',
    'notifications.interview': 'Interview reminder',
    'notifications.messageReceived': 'New message received',
    'app.name': 'Fyke Connect',
    'app.tagline': 'Connect. Work. Earn.'
  },
  hi: {
    'offline.title': 'आप ऑफलाइन हैं',
    'offline.message': 'कुछ सुविधाएं सीमित हो सकती हैं',
    'offline.sync': 'कनेक्ट होने पर सिंक होगा',
    'calendar.title': 'मेरा शेड्यूल',
    'calendar.noEvents': 'कोई निर्धारित कार्यक्रम नहीं',
    'calendar.addEvent': 'कैलेंडर में जोड़ें',
    'schedule.interview': 'साक्षात्कार निर्धारित',
    'schedule.workStart': 'काम शुरू',
    'schedule.deadline': 'समय सीमा',
    'notifications.jobAlert': 'आपके कौशल से मेल खाती नई नौकरी',
    'notifications.interview': 'साक्षात्कार रिमाइंडर',
    'notifications.messageReceived': 'नया संदेश प्राप्त',
    'app.name': 'फाइक कनेक्ट',
    'app.tagline': 'जुड़ें। काम करें। कमाएं।'
  }
};

export const useEnhancedLocalization = () => {
  const { getLocalizedText, currentLanguage } = useLocalization();

  const t = (key: string, fallback?: string) => {
    const lang = currentLanguage as keyof typeof extendedTranslations;
    const translations = extendedTranslations[lang] || extendedTranslations.en;
    return translations[key as keyof typeof translations] || getLocalizedText(key, fallback || key);
  };

  return { t, currentLanguage };
};
