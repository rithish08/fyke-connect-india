
import LocalizedCategorySelection from '@/components/search/LocalizedCategorySelection';

interface CategorySelectionProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  onBack?: () => void;
  title?: string;
}

const CategorySelection = (props: CategorySelectionProps) => {
  return <LocalizedCategorySelection {...props} />;
};

export default CategorySelection;
export { categories } from '@/data/categories';
