import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Budget {
  id: string;
  user_id: string;
  amount: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export function useBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const { data: budget, isLoading } = useQuery({
    queryKey: ['budget', user?.id, currentMonth, currentYear],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .maybeSingle();
      
      if (error) throw error;
      return data as Budget | null;
    },
    enabled: !!user,
  });

  const setBudget = useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('budgets')
          .update({ amount })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('budgets')
          .insert([{ 
            amount, 
            user_id: user.id,
            month: currentMonth,
            year: currentYear 
          }])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      toast({ title: 'Budget updated successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error updating budget', description: error.message, variant: 'destructive' });
    },
  });

  return {
    budget,
    isLoading,
    setBudget,
  };
}
