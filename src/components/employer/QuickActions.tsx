
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Search, Plus, Users, MessageCircle } from 'lucide-react';

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useLocalization();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        onClick={() => navigate('/search')}
        className="h-16 bg-green-600 hover:bg-green-700 rounded-xl flex flex-col items-center justify-center space-y-1"
      >
        <Search className="w-6 h-6" />
        <span className="text-sm">{t('home.find_workers', 'Find Workers')}</span>
      </Button>
      <Button
        onClick={() => navigate('/post-job')}
        variant="outline"
        className="h-16 rounded-xl flex flex-col items-center justify-center space-y-1"
      >
        <Plus className="w-6 h-6" />
        <span className="text-sm">{t('home.post_job', 'Post Job')}</span>
      </Button>
      <Button
        onClick={() => navigate('/my-jobs')}
        variant="outline"
        className="h-16 rounded-xl flex flex-col items-center justify-center space-y-1"
      >
        <Users className="w-6 h-6" />
        <span className="text-sm">{t('home.manage_jobs', 'Manage Jobs')}</span>
      </Button>
      <Button
        onClick={() => navigate('/messages')}
        variant="outline"
        className="h-16 rounded-xl flex flex-col items-center justify-center space-y-1"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-sm">{t('home.messages', 'Messages')}</span>
      </Button>
    </div>
  );
};

export default QuickActions;
