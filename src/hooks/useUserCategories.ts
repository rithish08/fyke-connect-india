import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserCategory {
  id: string;
  user_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  is_primary: boolean | null;
  created_at: string | null;
}

export const useUserCategories = (userId?: string) => {
  const { user } = useAuth();
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchUserCategories = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("user_categories")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at");

      if (fetchError) {
        throw fetchError;
      }

      setUserCategories(data || []);
    } catch (err: any) {
      console.error("Error fetching user categories:", err);
      setError("Failed to load user categories.");
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  const addUserCategory = async (categoryId: string, subcategoryId?: string, isPrimary: boolean = false) => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from("user_categories")
        .insert({
          user_id: targetUserId,
          category_id: categoryId,
          subcategory_id: subcategoryId,
          is_primary: isPrimary
        })
        .select()
        .single();

      if (error) throw error;

      setUserCategories(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error("Error adding user category:", err);
      throw err;
    }
  };

  const removeUserCategory = async (userCategoryId: string) => {
    try {
      const { error } = await supabase
        .from("user_categories")
        .delete()
        .eq("id", userCategoryId);

      if (error) throw error;

      setUserCategories(prev => prev.filter(uc => uc.id !== userCategoryId));
    } catch (err: any) {
      console.error("Error removing user category:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserCategories();
  }, [fetchUserCategories]);

  return { 
    userCategories, 
    loading, 
    error, 
    refreshUserCategories: fetchUserCategories,
    addUserCategory,
    removeUserCategory
  };
};
