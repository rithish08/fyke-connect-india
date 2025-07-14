import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Wage {
  id: string;
  user_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  amount: number;
  period: string;
  created_at: string | null;
  updated_at: string | null;
}

export const useWages = (userId?: string) => {
  const { user } = useAuth();
  const [wages, setWages] = useState<Wage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetUserId = userId || user?.id;

  const fetchWages = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("wages")
        .select("*")
        .eq("user_id", targetUserId)
        .order("created_at");

      if (fetchError) {
        throw fetchError;
      }

      setWages((data || []).map(wage => ({
        ...wage,
        updated_at: (wage as any).updated_at || wage.created_at
      })));
    } catch (err: any) {
      console.error("Error fetching wages:", err);
      setError("Failed to load wages.");
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  const addWage = async (wageData: Omit<Wage, "id" | "created_at" | "updated_at">) => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from("wages")
        .insert({
          ...wageData,
          user_id: targetUserId
        })
        .select()
        .single();

      if (error) throw error;

      setWages(prev => [...prev, { ...data, updated_at: data.created_at }]);
      return data;
    } catch (err: any) {
      console.error("Error adding wage:", err);
      throw err;
    }
  };

  const updateWage = async (wageId: string, updates: Partial<Wage>) => {
    try {
      const { data, error } = await supabase
        .from("wages")
        .update(updates)
        .eq("id", wageId)
        .select()
        .single();

      if (error) throw error;

      setWages(prev => prev.map(wage => wage.id === wageId ? { ...data, updated_at: data.created_at } : wage));
      return data;
    } catch (err: any) {
      console.error("Error updating wage:", err);
      throw err;
    }
  };

  const removeWage = async (wageId: string) => {
    try {
      const { error } = await supabase
        .from("wages")
        .delete()
        .eq("id", wageId);

      if (error) throw error;

      setWages(prev => prev.filter(wage => wage.id !== wageId));
    } catch (err: any) {
      console.error("Error removing wage:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchWages();
  }, [fetchWages]);

  return { 
    wages, 
    loading, 
    error, 
    refreshWages: fetchWages,
    addWage,
    updateWage,
    removeWage
  };
};
