export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
  name_hindi?: string; // Optional for compatibility
  description?: string; // Added for compatibility
  created_at?: string; // Added for compatibility
  active?: boolean; // Added for compatibility
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
}