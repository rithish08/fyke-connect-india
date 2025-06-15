
import { useToast } from '@/hooks/use-toast';

export const useGlobalToast = () => {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: 'default'
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: 'destructive'
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: 'default'
    });
  };

  return {
    showSuccess,
    showError,
    showInfo
  };
};
