import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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

      setCategories((data || []).map(cat => ({
        ...cat,
        name_hindi: (cat as any).name_hindi || cat.name
      })));
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
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
