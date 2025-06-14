
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={200}>
      <div className="grid grid-cols-2 gap-4">
        <ModernCard 
          className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
          onClick={() => navigate('/post-job')}
        >
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Post Job</h4>
              <p className="text-sm text-gray-400">Quick hire</p>
            </div>
          </div>
        </ModernCard>
        
        <ModernCard 
          className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
          onClick={() => navigate('/my-jobs')}
        >
          <div className="text-center space-y-3 p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl">📋</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">My Posts</h4>
              <p className="text-sm text-gray-400">8 active</p>
            </div>
          </div>
        </ModernCard>
      </div>
    </AnimatedWrapper>
  );
};

export default QuickActionsSection;
