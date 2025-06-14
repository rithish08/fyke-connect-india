
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Users, Search } from 'lucide-react';

const FindWorkersSection = () => {
  const navigate = useNavigate();

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={100}>
      <ModernCard 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200"
        onClick={() => navigate('/search')}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Find Workers</h3>
            <p className="text-blue-100 text-sm">Browse by category & skills</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-white/80 text-sm">Ready to hire?</div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </ModernCard>
    </AnimatedWrapper>
  );
};

export default FindWorkersSection;
