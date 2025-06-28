import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Subcategory {
  id: string;
  name: string;
  name_hindi: string | null;
  description: string | null;
  category_id: string | null;
  active: boolean | null;
  created_at: string | null;
}

export const useSubcategories = (categoryId?: string) => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("subcategories")
        .select("*")
        .eq("active", true)
        .order("name");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setSubcategories(data || []);
    } catch (err: any) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  return { 
    subcategories, 
    loading, 
    error, 
    refreshSubcategories: fetchSubcategories 
  };
};
