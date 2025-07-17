
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, MapPin, Phone, Mail, Camera, Plus, 
  Download, Eye, ThumbsUp, Calendar, Award 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  likes: number;
  views: number;
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  jobTitle: string;
}

const EnhancedProfile = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        // Fetch portfolio items
        const { data: portfolioData, error: portfolioError } = await supabase
          .from('portfolio')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (portfolioError) throw portfolioError;
        setPortfolio(portfolioData || []);
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);
      } catch (err: any) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      try {
        // In a real app, upload to cloud storage and get the URL
        const imageUrl = URL.createObjectURL(file); // Placeholder for demo
        const { error: insertError } = await supabase
          .from('portfolio')
          .insert({
            user_id: user.id,
            title: 'New Project',
            description: 'Click to edit description',
            image: imageUrl,
            category: 'General',
            date: new Date().toISOString().split('T')[0],
            likes: 0,
            views: 0
          });
        if (insertError) throw insertError;
        toast({ title: 'Portfolio item added!' });
        // Refresh portfolio
        const { data: portfolioData } = await supabase
          .from('portfolio')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        setPortfolio(portfolioData || []);
      } catch (err: any) {
        toast({ title: 'Failed to add portfolio item', variant: 'destructive' });
      }
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ProfileHeader = () => (
    <Card className="p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage src="/placeholder.svg" alt={user?.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <Button 
            size="sm" 
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Worker Name'}</h1>
              <p className="text-gray-600">{user?.primaryCategory || 'Construction Worker'}</p>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Award className="w-3 h-3" />
                <span>Verified</span>
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Bangalore, Karnataka</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email || 'worker@example.com'}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {['Cement Work', 'House Construction', 'Renovation'].map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );

  const PortfolioSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Portfolio</h3>
        <div className="flex space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="portfolio-upload"
          />
          <label htmlFor="portfolio-upload">
            <Button size="sm" className="cursor-pointer">
              <Plus className="w-4 h-4 mr-1" />
              Add Work
            </Button>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {portfolio.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 right-2 flex space-x-1">
                <Badge variant="secondary" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  {item.views}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {item.likes}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </span>
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ReviewsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
            <span className="font-bold text-lg">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-600">{reviews.length} total reviews</p>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                <AvatarFallback>
                  {review.reviewerName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-medium text-gray-900">{review.reviewerName}</h5>
                    <p className="text-xs text-gray-500">{review.jobTitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`} 
                          fill="currentColor" 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />
        
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio">
            <PortfolioSection />
          </TabsContent>
          
          <TabsContent value="reviews">
            <ReviewsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedProfile;
