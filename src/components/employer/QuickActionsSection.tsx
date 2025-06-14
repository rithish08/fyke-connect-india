
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={200}>
      <div className="grid grid-cols-3 gap-2">
        <ModernCard 
          className="bg-white border shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 p-3"
          onClick={() => navigate('/post-job')}
        >
          <div className="text-center space-y-1">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-sm">📝</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-xs">Post Job</h4>
              <p className="text-xs text-gray-400">Quick hire</p>
            </div>
          </div>
        </ModernCard>
        
        <ModernCard 
          className="bg-white border shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 p-3"
          onClick={() => navigate('/my-jobs')}
        >
          <div className="text-center space-y-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-sm">📋</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-xs">My Posts</h4>
              <p className="text-xs text-gray-400">8 active</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-sm rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 p-3"
          onClick={() => navigate('/search')}
        >
          <div className="text-center space-y-1">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-sm">👥</span>
            </div>
            <div>
              <h4 className="font-medium text-white text-xs">Find Workers</h4>
              <p className="text-xs text-blue-100">Browse all</p>
            </div>
          </div>
        </ModernCard>
      </div>
    </AnimatedWrapper>
  );
};

export default QuickActionsSection;
