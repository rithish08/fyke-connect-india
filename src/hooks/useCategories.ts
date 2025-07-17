import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { categories as staticCategories } from '@/data/categories';

export interface Category {
  id: string;
  name: string;
  name_hindi: string | null;
  description: string | null;
  icon: string | null;
  active: boolean | null;
  created_at: string | null;
  subcategories?: string[]; // <-- add this
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch categories
      const { data: catData, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("name");

      if (fetchError) {
        throw fetchError;
      }

      // Fetch subcategories
      const { data: subData, error: subError } = await supabase
        .from("subcategories")
        .select("id, name, category_id, active")
        .eq("active", true);

      if (subError) {
        throw subError;
      }

      // Attach subcategories to categories
      const categoriesWithSubs = (catData || []).map(cat => ({
        ...cat,
        name_hindi: (cat as any).name_hindi || cat.name,
        subcategories: (subData || [])
          .filter(sub => sub.category_id === cat.id)
          .map(sub => sub.name)
      }));

      if (categoriesWithSubs.length > 0) {
        setCategories(categoriesWithSubs);
      } else {
        // Fallback to static categories if Supabase is empty
        setCategories(staticCategories.map(cat => ({
          ...cat,
          name_hindi: cat.name,
          description: cat.name,
          active: true,
          created_at: new Date().toISOString(),
          subcategories: cat.subcategories || []
        })));
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
      // Fallback to static categories on error
      setCategories(staticCategories.map(cat => ({
        ...cat,
        name_hindi: cat.name,
        description: cat.name,
        active: true,
        created_at: new Date().toISOString(),
        subcategories: cat.subcategories || []
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { 
    categories, 
    loading, 
    error, 
    refreshCategories: fetchCategories 
  };
};
