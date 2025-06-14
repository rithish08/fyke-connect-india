
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const { translateText } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          {translateText('home.welcome', 'Welcome to Your Blank App')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {translateText('common.startBuilding', 'Start building your amazing project here!')}
        </p>
      </div>
    </div>
  );
};

export default Index;
