import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const adSlides = [
  {
    title: 'Find Your Next Gig, Faster!',
    description: 'Thousands of jobs at your fingertips. Apply in just one tap.',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Hire Professionals Instantly',
    description: 'Get verified, skilled workers for any task. Post a job in seconds.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop',
  },
  {
    title: 'Safety and Trust Guaranteed',
    description: 'All users are verified. Secure payments and reliable support.',
    imageUrl: 'https://images.unsplash.com/photo-1556740772-1a741367b93e?q=80&w=2070&auto=format&fit=crop',
  },
];

export const AdCarousel = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000 })]);

  useEffect(() => {
    if (sessionStorage.getItem('adCarouselClosed') === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('adCarouselClosed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl" ref={emblaRef}>
      <div className="flex">
        {adSlides.map((slide, index) => (
          <div className="flex-0_0_100 min-w-0" key={index}>
            <Card className="border-0 rounded-xl">
              <CardContent className="relative flex items-end justify-start h-48 p-6 text-white bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.imageUrl})` }}>
                <div className="z-10">
                  <h3 className="text-xl font-bold mb-1">{slide.title}</h3>
                  <p className="text-sm max-w-xs">{slide.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full"
        onClick={handleClose}
        aria-label="Close ads"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}; 