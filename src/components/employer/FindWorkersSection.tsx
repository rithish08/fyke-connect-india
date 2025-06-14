
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Users } from 'lucide-react';

const FindWorkersSection = () => {
  const navigate = useNavigate();

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={100}>
      <ModernCard 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={() => navigate('/search')}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Find Workers</h3>
              <p className="text-blue-100 text-sm">Browse by category & skills</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/90 text-sm">Ready to hire?</div>
            <div className="text-white font-semibold">Browse Now</div>
          </div>
        </div>
      </ModernCard>
    </AnimatedWrapper>
  );
};

export default FindWorkersSection;
