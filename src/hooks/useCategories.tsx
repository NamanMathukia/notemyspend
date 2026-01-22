import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

const DEFAULT_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Other'];

export function useCategories() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
    enabled: !!user,
  });

  const addCategory = useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category added successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error adding category', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'Category deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting category', description: error.message, variant: 'destructive' });
    },
  });

  const initializeDefaultCategories = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      if (existing && existing.length > 0) return;

      const categoriesToInsert = DEFAULT_CATEGORIES.map(name => ({
        name,
        user_id: user.id,
      }));

      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories,
    isLoading,
    addCategory,
    deleteCategory,
    initializeDefaultCategories,
  };
}
