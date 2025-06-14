
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TrustIndicatorsProps {
  className?: string;
}

const TrustIndicators = ({ className }: TrustIndicatorsProps) => {
  const indicators = [
    { label: 'Verified', icon: '✅', color: 'bg-green-100 text-green-700' },
    { label: '4.8★ Rating', icon: '⭐', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Background Check', icon: '🛡️', color: 'bg-blue-100 text-blue-700' },
    { label: 'Skill Tested', icon: '🎯', color: 'bg-purple-100 text-purple-700' }
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {indicators.map((indicator, index) => (
        <Badge 
          key={index}
          className={`${indicator.color} border-0 px-2 py-1 text-xs font-medium`}
        >
          <span className="mr-1">{indicator.icon}</span>
          {indicator.label}
        </Badge>
      ))}
    </div>
  );
};

export default TrustIndicators;
