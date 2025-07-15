
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

export const useGlobalToast = () => {
  const { toast } = useToast();
  const { t } = useLocalization();

  const showSuccess = (messageKey: string, params?: (string|number)[], fallback?: string) => {
    toast({
      title: t('common.success', 'Success'),
      description: t(messageKey, fallback, params),
      variant: 'default'
    });
  };

  const showError = (messageKey: string, params?: (string|number)[], fallback?: string) => {
    toast({
      title: t('common.error', 'Error'),
      description: t(messageKey, fallback, params),
      variant: 'destructive'
    });
  };

  const showInfo = (messageKey: string, params?: (string|number)[], fallback?: string) => {
    toast({
      title: t('common.info', 'Info'),
      description: t(messageKey, fallback, params),
      variant: 'default'
    });
  };

  return {
    showSuccess,
    showError,
    showInfo
  };
};
