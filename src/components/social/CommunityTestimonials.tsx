
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Quote, ThumbsUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Testimonial {
  id: string;
  name: string;
  role: 'worker' | 'employer';
  rating: number;
  content: string;
  jobType: string;
  location: string;
  avatar: string;
  verified: boolean;
  likes: number;
}

const CommunityTestimonials = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'worker',
      rating: 5,
      content: 'Fyke helped me find consistent work in construction. I now earn ₹25,000+ monthly and have built great relationships with reliable employers.',
      jobType: 'Construction',
      location: 'Mumbai',
      avatar: 'RK',
      verified: true,
      likes: 47
    },
    {
      id: '2',
      name: 'Priya Sharma',
      role: 'employer',
      rating: 5,
      content: 'Found the perfect team for my home renovation through Fyke. The workers were skilled, punctual, and professional. Highly recommend!',
      jobType: 'Home Services',
      location: 'Delhi',
      avatar: 'PS',
      verified: true,
      likes: 32
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      role: 'worker',
      rating: 5,
      content: 'As a delivery partner, Fyke connects me with multiple companies. The app is easy to use and payments are always on time.',
      jobType: 'Delivery',
      location: 'Bangalore',
      avatar: 'MA',
      verified: true,
      likes: 28
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What Our Community Says
        </h2>
        <p className="text-gray-600">Real stories from workers and employers across India</p>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">50K+</div>
            <div className="text-sm text-gray-500">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">4.8★</div>
            <div className="text-sm text-gray-500">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1M+</div>
            <div className="text-sm text-gray-500">Jobs Completed</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {testimonial.avatar}
                  </span>
                </div>
                {testimonial.verified && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={testimonial.role === 'worker' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {testimonial.role === 'worker' ? '👷 Worker' : '🏢 Employer'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {testimonial.jobType} • {testimonial.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>

                <div className="relative mb-4">
                  <Quote className="absolute -top-2 -left-1 w-6 h-6 text-gray-300" />
                  <p className="text-gray-700 pl-6 italic">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Verified User</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{testimonial.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-bold text-gray-900 mb-2">Join Our Growing Community</h3>
          <p className="text-gray-600 mb-4">
            Be part of India's most trusted platform for blue-collar jobs
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-green-100 text-green-800">
              ✓ Verified Opportunities
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              ✓ Safe Payments
            </Badge>
            <Badge className="bg-purple-100 text-purple-800">
              ✓ 24/7 Support
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommunityTestimonials;
