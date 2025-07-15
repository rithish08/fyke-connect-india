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
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("active", true)
        .order("name");

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setCategories((data || []).map(cat => ({
          ...cat,
          name_hindi: (cat as any).name_hindi || cat.name
        })));
      } else {
        // Fallback to static categories if Supabase is empty
        setCategories(staticCategories);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
      // Fallback to static categories on error
      setCategories(staticCategories);
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
