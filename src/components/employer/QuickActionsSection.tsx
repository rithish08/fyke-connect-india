
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const QuickActionsSection = () => {
  const navigate = useNavigate();

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={200}>
      <div className="grid grid-cols-3 gap-3">
        <ModernCard 
          className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
          onClick={() => navigate('/post-job')}
        >
          <div className="text-center space-y-2 p-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">📝</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Post Job</h4>
              <p className="text-xs text-gray-400">Quick hire</p>
            </div>
          </div>
        </ModernCard>
        
        <ModernCard 
          className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
          onClick={() => navigate('/my-jobs')}
        >
          <div className="text-center space-y-2 p-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">My Posts</h4>
              <p className="text-xs text-gray-400">8 active</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard 
          className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
          onClick={() => navigate('/messages')}
        >
          <div className="text-center space-y-2 p-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-lg">💬</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Messages</h4>
              <p className="text-xs text-gray-400">3 new</p>
            </div>
          </div>
        </ModernCard>
      </div>
    </AnimatedWrapper>
  );
};

export default QuickActionsSection;
