
import React from 'react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "We're having trouble loading this content. Please try again.",
  onRetry,
  className = ""
}) => {
  return (
    <ModernCard className={`p-8 text-center border-red-200 bg-red-50 ${className}`}>
      <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-900 mb-2">{title}</h3>
      <p className="text-red-700 mb-6 max-w-sm mx-auto">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </ModernCard>
  );
};

export default ErrorState;
