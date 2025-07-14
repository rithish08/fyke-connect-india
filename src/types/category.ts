export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}