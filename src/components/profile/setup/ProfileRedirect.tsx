import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';

const ProfileRedirect = () => {
    const navigate = useNavigate();
    const { t } = useLocalization();
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600">{t('profile.redirecting', 'We could not find your profile. Please log in again or go to the home page.')}</p>
                <Button onClick={() => navigate('/login')} variant="outline">
                    {t('profile.goToLogin', 'Go to Login')}
                </Button>
                <Button onClick={() => navigate('/')} variant="secondary">
                    {t('profile.goToHome', 'Go to Home')}
                </Button>
            </div>
        </div>
    );
};

export default ProfileRedirect;
