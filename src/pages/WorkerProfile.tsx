import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, ArrowLeft, MessageCircle, Phone, Shield, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BottomNavigation from '@/components/BottomNavigation';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showContact, setShowContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workerNotFound, setWorkerNotFound] = useState(false);
  const [worker, setWorker] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get worker data from navigation state or use default
  const workerFromState = location.state?.worker;
  
  // Default worker data - in real app this would come from API based on id
  const defaultWorker = {
    id: id || '1',
    name: t('workerProfile.defaultName', 'Sanjay Kumar'),
    phone: '+91 98765 43210',
    email: 'sanjay.kumar@email.com',
    location: t('workerProfile.defaultLocation', 'Mumbai, Maharashtra'),
    distance: '3.8 km',
    category: t('workerProfile.defaultCategory', 'Delivery'),
    skills: [t('workerProfile.skill1', 'Delivery Driver'), t('workerProfile.skill2', 'Heavy Vehicle'), t('workerProfile.skill3', 'Long Distance')],
    experience: t('workerProfile.defaultExperience', '5 years'),
    rating: 4.6,
    reviewCount: 156,
    availability: 'available' as const,
    profilePhoto: null,
    verified: true,
    hourlyRate: 480,
    completedJobs: 67,
    description: t('workerProfile.defaultDescription', 'Experienced delivery driver with expertise in heavy vehicle operations and long distance transport. Reliable and punctual.'),
    vehicle: t('workerProfile.defaultVehicle', 'Heavy Vehicle License'),
    languages: [t('workerProfile.langHindi', 'Hindi'), t('workerProfile.langEnglish', 'English'), t('workerProfile.langMarathi', 'Marathi')],
    responseTime: t('workerProfile.defaultResponseTime', '18 min'),
    isOnline: true,
    verificationLevel: 'verified' as const
  };

  useEffect(() => {
    if (!id) {
      setWorkerNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const fetchWorker = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        if (fetchError || !data) {
          setWorkerNotFound(true);
        } else {
          setWorker(data);
        }
      } catch (err: any) {
        setError('Failed to load worker profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  const handleContact = () => {
    setShowContact(true);
  };

  const handleHire = () => {
    toast({
      title: t('workerProfile.hireRequestSent', 'Hire Request Sent!'),
      description: t('workerProfile.hireRequestDesc', 'Your hire request has been sent to {0}. They will respond soon.', [worker.name]),
    });
  };

  const handleMessage = () => {
    navigate('/requests', { state: { workerId: worker.id, workerName: worker.name } });
  };

  const handleCall = () => {
    if (worker.phone) {
      window.open(`tel:${worker.phone}`, '_self');
    } else {
      toast({
        title: t('workerProfile.contactInfo', 'Contact Information'),
        description: t('workerProfile.phoneNotAvailable', 'Phone number not available. Please use the message feature.'),
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">{t('workerProfile.loading', 'Loading worker profile...')}</p>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (workerNotFound || !worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('workerProfile.notFoundTitle', 'Worker Not Found')}</h2>
          <p className="text-gray-500">{t('workerProfile.notFoundDesc', 'The worker you\'re looking for doesn\'t exist or could not be loaded.')}</p>
          <Button onClick={() => navigate('/search')} className="mt-4">
            {t('workerProfile.browseWorkers', 'Browse Workers')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" aria-label={t('workerProfile.screenAria', 'Worker Profile Screen')}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
            aria-label={t('common.back', 'Back')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900" aria-label={t('workerProfile.title', 'Worker Profile')}>{t('workerProfile.title', 'Worker Profile')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={worker.profilePhoto || "/placeholder.svg"} alt={worker.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {worker.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {worker.verificationLevel && worker.verificationLevel !== 'basic' && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-3 border-white">
                  <Shield className="w-4 h-4 text-white" fill="currentColor" />
                </div>
              )}
              {worker.isOnline && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{worker.name}</h1>
            <p className="text-gray-600 mb-2">{worker.category}</p>
            
            <div className="flex items-center justify-center space-x-1 mb-4" aria-label={t('workerProfile.ratingAria', 'Worker rating')}>
              <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
              <span className="font-bold text-lg text-gray-900">{worker.rating}</span>
              <span className="text-gray-500">({worker.reviewCount || worker.completedJobs} {t('workerProfile.reviews', 'reviews')})</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full" aria-label={t('workerProfile.availableDot', 'Available indicator')}></div>
              <span className="text-green-600 font-medium">{t('workerProfile.availableNow', 'Available now')}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹{worker.hourlyRate}</div>
              <div className="text-sm text-gray-500">{t('workerProfile.perHour', 'per hour')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{worker.completedJobs}</div>
              <div className="text-sm text-gray-500">{t('workerProfile.jobsCompleted', 'jobs completed')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{worker.responseTime}</div>
              <div className="text-sm text-gray-500">{t('workerProfile.responseTime', 'response time')}</div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4">{t('workerProfile.skillsTitle', 'Skills & Expertise')}</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.map((skill: string, index: number) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                aria-label={t('workerProfile.skillAria', 'Skill') + ': ' + skill}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Location & Availability */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">{worker.distance} {t('workerProfile.away', 'away')}</div>
                <div className="text-sm text-gray-500">{t('workerProfile.currentLocation', 'Current location')}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-medium">{t('workerProfile.respondsIn', 'Responds in {0}', [worker.responseTime])}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-3">{t('workerProfile.aboutTitle', 'About')}</h3>
          <p className="text-gray-700 leading-relaxed">{worker.description}</p>
        </div>

        {/* Contact Information */}
        {showContact && (
          <div className="bg-green-50 rounded-3xl p-6 border border-green-200">
            <h3 className="font-bold text-lg text-gray-900 mb-3">{t('workerProfile.contactInfo', 'Contact Information')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-900">{worker.phone}</span>
              </div>
              {worker.email && (
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📧</span>
                  <span className="text-gray-900">{worker.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-2 border-gray-200 font-medium hover:border-gray-300"
              onClick={handleMessage}
              aria-label={t('workerProfile.chat', 'Chat')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('workerProfile.chat', 'Chat')}
            </Button>
            <Button 
              variant="outline" 
              className="h-12 rounded-2xl border-2 border-gray-200 font-medium hover:border-gray-300"
              onClick={handleCall}
              aria-label={t('workerProfile.call', 'Call')}
            >
              <Phone className="w-5 h-5 mr-2" />
              {t('workerProfile.call', 'Call')}
            </Button>
          </div>
          
          <Button 
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={handleHire}
            aria-label={t('workerProfile.hireNow', 'Hire Now')}
          >
            {t('workerProfile.hireNow', 'Hire Now')}
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WorkerProfile;
