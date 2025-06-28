import React from 'react';
import { useWorkers } from '@/hooks/useWorkers';
import WorkerCard from '@/components/search/WorkerCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';

export const NearbyWorkersSection = () => {
  const { workers, loading, error, refreshWorkers } = useWorkers();
  const { t } = useLocalization();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('home.nearbyWorkers', 'Nearby Workers')}</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/search')}
          aria-label={t('home.viewAll', 'View All')}
        >
          {t('home.viewAll', 'View All')}
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {error && (
        <Card className="p-5 bg-red-50 border-red-200 rounded-xl flex items-center gap-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">{t('errors.failedToLoadWorkers', 'Failed to Load Workers')}</h3>
            <p className="text-sm text-red-700">{error}</p>
            <Button variant="link" size="sm" onClick={() => refreshWorkers()} className="p-0 h-auto text-red-800">
              {t('common.tryAgain', 'Try again')}
            </Button>
          </div>
        </Card>
      )}

      {!loading && !error && workers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}

      {!loading && !error && workers.length === 0 && (
        <Card className="p-8 text-center rounded-xl bg-gray-50">
          <h3 className="font-semibold text-gray-800">{t('home.noWorkersFound', 'No Workers Found')}</h3>
          <p className="text-sm text-gray-600 mt-2">{t('home.noWorkersFoundDesc', 'There are currently no workers matching your criteria. Try expanding your search.')}</p>
          <Button onClick={() => navigate('/search')} className="mt-4">{t('home.browseAllWorkers', 'Browse All Workers')}</Button>
        </Card>
      )}
    </div>
  );
};
