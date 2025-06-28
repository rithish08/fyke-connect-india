import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';

const jobSeekerSlides = [
    { title: 'New jobs added daily!', description: 'Explore fresh opportunities in your field.', imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Get hired faster', description: 'Complete your profile to attract top employers.', imageUrl: 'https://images.unsplash.com/photo-1556740772-1a741367b93e?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Showcase your skills', description: 'Verified skills lead to better job matches.', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop' },
];

const employerSlides = [
    { title: 'Find skilled workers nearby', description: 'Instantly connect with local talent.', imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop' },
    { title: 'Post a job in minutes', description: 'Our quick-post feature gets you noticed.', imageUrl: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=2071&auto=format&fit=crop' },
    { title: 'Review top candidates', description: 'Hire with confidence using our rating system.', imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e2775d2?q=80&w=2070&auto=format&fit=crop' },
];

export const HomeGreeting = () => {
    const { user } = useAuth();
    const { t } = useLocalization();
    const [view, setView] = useState<'greeting' | 'carousel'>('greeting');
    const [isVisible, setIsVisible] = useState(true);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 10000, stopOnInteraction: false })]);

    useEffect(() => {
        if (sessionStorage.getItem('homeGreetingClosed') === 'true') {
            setIsVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setView('carousel');
        }, 3000); // Changed to 3 seconds
        return () => clearTimeout(timer);
    }, []);
    
    const handleClose = () => {
        sessionStorage.setItem('homeGreetingClosed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null; // Don't render anything if closed
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('home.greetingMorning', 'Good Morning');
        if (hour < 17) return t('home.greetingAfternoon', 'Good Afternoon');
        return t('home.greetingEvening', 'Good Evening');
    };

    const slides = user?.role === 'employer' ? employerSlides : jobSeekerSlides;
    const name = user?.name?.split(' ')[0] || (user?.role === 'employer' ? 'Employer' : 'Job Seeker');
    const roleEmoji = user?.role === 'employer' ? '🏢' : '👋';

    return (
        <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-700 text-white flex items-center justify-center">
            {/* Greeting Card */}
            <div className={`absolute inset-0 transition-transform duration-700 ease-in-out ${view === 'greeting' ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                     <h1 className="text-3xl font-bold mb-2">
                        {getGreeting()}, {name}! {roleEmoji}
                    </h1>
                    <p className="text-gray-300">
                        {user?.role === 'employer'
                            ? t('home.manageHiring', 'Manage your hiring and find great talent')
                            : t('home.readyToFind', 'Ready to find your next opportunity?')
                        }
                    </p>
                </div>
            </div>

            {/* Carousel Card */}
            <div className={`absolute inset-0 transition-transform duration-700 ease-in-out ${view === 'greeting' ? 'translate-x-full' : 'translate-x-0'}`} ref={emblaRef}>
                 <div className="flex h-full">
                    {slides.map((slide, index) => (
                        <div className="flex-0_0_100 min-w-0 h-full" key={index}>
                             <Card className="border-0 rounded-none w-full h-full">
                                <CardContent className="relative flex flex-col items-center justify-center h-full p-6 text-white text-center bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${slide.imageUrl})` }}>
                                    <div className="z-10">
                                        <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                                        <p className="text-sm max-w-xs text-gray-200">{slide.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Close Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20"
                onClick={handleClose}
                aria-label="Close"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}; 